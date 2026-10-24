// All analysis is local and deterministic. URL values are parsed as inert strings only.
const BRANDS = [
  { name: 'Example Bank', domains: ['bank.example.com'], tokens: ['bank', 'examplebank'] },
  { name: 'Parcel Example', domains: ['parcel.example.com'], tokens: ['parcel'] },
  { name: 'Example Mail', domains: ['mail.example.com'], tokens: ['examplemail'] },
]
const SHORTENERS = new Set(['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'ow.ly'])
const LIMITATIONS = 'Automated risk assessments are guidance, not proof that a message is safe or fraudulent. This local rules engine does not verify senders, visit destinations, inspect redirects, or use live threat intelligence. Its small fictional brand allowlist cannot cover every legitimate domain; review findings in context.'
const SEVERITY = { critical: 29, high: 21, medium: 12, low: 6 }

function isApproved(host, domains) {
  return domains.some(domain => host === domain || host.endsWith(`.${domain}`))
}
function urlsFrom(text) {
  return [...text.matchAll(/\bhttps?:\/\/[^\s<>"'“”]+|\bwww\.[^\s<>"'“”]+/gi)]
    .map(m => m[0].replace(/[),.;!?]+$/, ''))
}
function safeParse(value) {
  try { return new URL(/^www\./i.test(value) ? `https://${value}` : value) } catch { return null }
}
function unique(items) { return [...new Set(items)] }
function firstMatch(text, regex) { return text.match(regex)?.[0] || null }
function isRequested(text, term) {
  for (const match of text.matchAll(term)) {
    const at = match.index
    const before = text.slice(Math.max(0, at - 55), at)
    const after = text.slice(at + match[0].length, at + match[0].length + 24)
    if (/^\s*(?:reset|recovery|policy|manager|hint|instructions?)\b/i.test(after)) continue
    const clause = before.split(/[.!?;\n]|\bbut\b|\bhowever\b/i).at(-1)
    const commands = [...clause.matchAll(/\b(?:send|share|enter|provide|reply(?: with)?|submit|confirm|verify|update|give|pay)\b/gi)]
    const command = commands.at(-1)
    const precedingCommand = command ? clause.slice(0, command.index) : clause
    if (/\b(?:never|do\s+not|don't|will\s+not|won't)\b/i.test(precedingCommand)) continue
    if ((command && clause.length - command.index - command[0].length <= 45)
      || /^\s*(?:to|here|in (?:the )?(?:form|reply))\b/i.test(after)) {
      return { evidence: match[0], evidenceStart: at }
    }
  }
  return null
}

export function analyzeMessage(input = {}) {
  const mode = ['email', 'sms', 'url', 'screenshot'].includes(input.mode) ? input.mode : 'email'
  const content = String(input.content ?? '').slice(0, 30000)
  const sender = String(input.sender ?? '').slice(0, 300)
  const text = mode === 'url' ? content.trim() : content
  const combined = `${sender}\n${text}`
  const findings = []
  const add = (id, severity, title, explanation, evidence, stage, evidenceStart) => {
    if (!evidence || findings.some(f => f.id === id)) return
    findings.push({ id, severity, score: SEVERITY[severity], title, explanation, evidence, stage, ...(evidenceStart == null ? {} : { evidenceStart }) })
  }

  const urls = unique(mode === 'url' ? [text].filter(Boolean) : urlsFrom(text))
  const parsedUrls = urls.map(raw => ({ raw, parsed: safeParse(raw) }))
  const brandClaims = BRANDS.filter(b => {
    const claimPattern = new RegExp(`\\b${b.name.replace(/ /g, '\\s*')}\\b`, 'i')
    return claimPattern.test(combined) || b.tokens.some(token => new RegExp(`\\b${token}\\b`, 'i').test(sender))
  })

  for (const { raw, parsed } of parsedUrls) {
    if (!parsed || !['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) {
      add('malformed-url', 'medium', 'URL cannot be parsed', 'The entered address is malformed or uses an unsupported scheme. Check its exact characters before acting.', raw, 'destination')
      continue
    }
    const host = parsed.hostname.toLowerCase().replace(/\.$/, '')
    if (parsed.username || parsed.password || /\/\/[^/\s]*@/.test(raw)) {
      add('url-userinfo', 'critical', '@ symbol can hide the actual host', 'In a URL, the real destination host comes after the @ symbol; text before it can be a decoy.', raw, 'destination')
    }
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host) || /^\[[0-9a-f:]+\]$/i.test(host)) {
      add('ip-host', 'medium', 'Direct IP address', 'This link uses a numeric network address rather than a recognizable domain.', host, 'destination')
    }
    if (parsed.port && !['80', '443'].includes(parsed.port)) {
      add('unusual-port', 'medium', 'Unusual connection port', 'The address specifies a nonstandard port. Confirm why it is needed.', `:${parsed.port}`, 'destination')
    }
    if (/xn--/i.test(host) || /[^\x00-\x7F]/.test(raw)) {
      add('unicode-host', 'medium', 'Internationalized or encoded hostname', 'Unicode or punycode characters can create confusing lookalike addresses. Inspect the exact host.', host, 'destination')
    }
    if (SHORTENERS.has(host)) {
      add('short-link', 'low', 'Shortened link', 'A short link obscures the destination. This alone is not proof of fraud.', host, 'destination')
    }
    for (const brand of BRANDS) {
      const approved = isApproved(host, brand.domains)
      const embeddedDomain = brand.domains.find(d => host.includes(d) && !approved)
      if (embeddedDomain) {
        add(`embedded-${brand.domains[0]}`, 'critical', 'Trusted domain embedded in another host', `The address contains ${embeddedDomain}, but its actual host is ${host}. It is not an approved ${brand.name} hostname.`, host, 'destination')
      } else if (!approved && brandClaims.includes(brand)) {
        add(`mismatch-${brand.domains[0]}`, 'high', 'Claimed identity and link do not match', `The message claims ${brand.name}, but ${host} is outside its locally listed domains.`, host, 'identity')
      } else if (!approved && brand.tokens.some(token => host.includes(token))) {
        add(`lookalike-${brand.domains[0]}`, 'medium', 'Brand-like text in an unlisted host', `The host resembles ${brand.name} but is not one of its locally listed hostnames. This needs independent checking.`, host, 'destination')
      }
    }
    if (parsed.protocol === 'http:') {
      add('unencrypted-url', 'low', 'Unencrypted HTTP link', 'This address uses HTTP. Encryption alone never establishes whether a site is legitimate.', raw, 'destination')
    }
  }
  if (mode === 'url' && text && parsedUrls.length === 0) {
    add('malformed-url', 'medium', 'URL cannot be parsed', 'Enter a complete http:// or https:// address to inspect its host.', text, 'destination')
  }
  const password = isRequested(text, /\b(?:password|passcode|login credentials?)\b/gi)
  const pin = isRequested(text, /\b(?:PIN|personal identification number)\b/gi)
  const otp = isRequested(text, /\b(?:OTP|one[- ]time (?:password|code)|verification code)\b/gi)
  const payment = isRequested(text, /\b(?:card number|CVV|credit card|debit card|bank details?|UPI PIN)\b/gi)
  if (password) add('password-request', 'critical', 'Password requested', 'The message asks for a password or login credential. Enter credentials only after independently opening the service you trust.', password.evidence, 'action', password.evidenceStart)
  if (pin) add('pin-request', 'critical', 'PIN requested', 'A request for a PIN is a strong sensitive-data warning.', pin.evidence, 'action', pin.evidenceStart)
  if (otp) add('otp-request', 'critical', 'One-time code requested', 'One-time codes can authorize account access or payments. Never disclose them through a message.', otp.evidence, 'action', otp.evidenceStart)
  if (payment) add('payment-data-request', 'critical', 'Payment details requested', 'The message asks for payment credentials or bank details.', payment.evidence, 'action', payment.evidenceStart)
  const threat = firstMatch(text, /\b(?:account (?:will be )?(?:locked|suspended|closed)|legal action|arrest|penalty|service (?:will be )?terminated)\b/i)
  const urgency = firstMatch(text, /\b(?:immediately|urgent(?:ly)?|within \d+ (?:minutes?|hours?)|act now|right now|final warning|today only)\b/i)
  if (threat) add('threat-pressure', 'high', 'Threat or consequence pressure', 'The message uses a negative consequence to push a quick decision.', threat, 'manipulation')
  if (urgency) add('urgency', 'medium', 'Urgency language', 'Time pressure can discourage verification. Consider the surrounding context.', urgency, 'manipulation')
  const impersonation = firstMatch(combined, /\b(?:security team|support team|fraud department|official notice|account team)\b/i)
  if (impersonation && (findings.some(f => f.id.startsWith('mismatch-')) || findings.some(f => f.id.startsWith('embedded-')))) {
    add('authority-claim', 'medium', 'Authority claim with conflicting destination', 'The message invokes an organization or team while its link conflicts with the claimed identity.', impersonation, 'identity')
  }

  // Capped additive model. Ordinary context words cannot create a high score by themselves.
  const rawScore = findings.reduce((sum, f) => sum + f.score, 0)
  const score = Math.min(100, rawScore)
  const level = score >= 60 ? 'HIGH' : score >= 20 ? 'REVIEW' : 'LOW'
  const recommendations = level === 'HIGH'
    ? ['Do not use the link or share codes, passwords, or payment details.', 'Open the organization’s app or type its known address yourself.', 'If you already acted, use the response guide and secure your accounts.']
    : level === 'REVIEW'
      ? ['Pause and verify the sender through an independent channel.', 'Inspect the full hostname before opening any link.', 'Avoid sharing sensitive information through a message.']
      : ['No strong warning signs were found by these local rules.', 'Still verify unexpected requests through a trusted channel.', 'Never share passwords, PINs, or one-time codes in a reply.']
  const requested = findings.filter(f => f.stage === 'action').map(f => f.title)
  const manipulation = findings.filter(f => f.stage === 'manipulation').map(f => f.title)
  const destination = parsedUrls.find(u => u.parsed)?.parsed?.hostname || (urls[0] || null)
  const dna = {
    identity: sender || (brandClaims[0]?.name ? `Claims ${brandClaims[0].name}` : null),
    manipulation: manipulation.length ? manipulation.join(' · ') : null,
    destination,
    action: requested.length ? requested.join(' · ') : null,
    evidence: findings.map(f => f.id),
    response: recommendations,
  }
  return { mode, score, rawScore, level, findings, indicatorIds: findings.map(f => f.id), recommendations, dna, urls, limitations: LIMITATIONS }
}

export { LIMITATIONS, BRANDS, isApproved }
