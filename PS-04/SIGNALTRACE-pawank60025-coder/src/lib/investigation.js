import { BRANDS, isApproved } from './analyzer.js'

// Presentation data only. Analysis and scoring remain in analyzeMessage.
export const STAGES = [
  { id: 'identity', label: 'Identity', number: '01' },
  { id: 'manipulation', label: 'Manipulation', number: '02' },
  { id: 'destination', label: 'Destination', number: '03' },
  { id: 'action', label: 'Requested action', number: '04' },
]

export function reconstruction(result, sender) {
  return STAGES.map(stage => {
    const findings = result.findings.filter(f => f.stage === stage.id)
    const value = stage.id === 'destination' && result.urls.length && !result.urls.some(raw => inspectUrl(raw).valid)
      ? null : result.dna[stage.id]
    const inapplicable = result.mode === 'url' && ['identity', 'manipulation', 'action'].includes(stage.id)
    const provided = stage.id === 'identity' && !!sender && !findings.length
    return { ...stage, findings, value: inapplicable ? null : value,
      state: inapplicable ? 'inapplicable' : stage.id === 'destination' && !value ? 'unknown' : value || findings.length ? 'detected' : 'unknown', provided }
  })
}

export function inspectUrl(raw) {
  let parsed
  try { parsed = new URL(/^www\./i.test(raw) ? `https://${raw}` : raw) } catch { return { raw, valid: false } }
  if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) return { raw, valid: false }
  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '')
  const comparison = BRANDS.flatMap(brand => brand.domains.map(domain => ({ brand: brand.name, domain })))
    .find(item => hostname.includes(item.domain))
  const approved = comparison ? isApproved(hostname, [comparison.domain]) : false
  const embeddedAt = comparison && !approved ? hostname.indexOf(comparison.domain) : -1
  const labels = hostname.split('.')
  // Only interpret labels to the left of an exact, locally known domain.
  const subdomain = comparison && approved && hostname !== comparison.domain
    ? hostname.slice(0, -(comparison.domain.length + 1)) : null
  return {
    raw, valid: true, scheme: parsed.protocol.slice(0, -1).toUpperCase(), hostname,
    subdomain, comparison, approved, embeddedAt,
    path: parsed.pathname === '/' ? '' : parsed.pathname,
    queryKeys: [...parsed.searchParams.keys()],
    userinfo: !!(parsed.username || parsed.password), port: parsed.port,
  }
}
