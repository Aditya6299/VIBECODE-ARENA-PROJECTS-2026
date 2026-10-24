import React, { useState } from 'react'
import { ArrowRight, AlertTriangle, Link2, ScanSearch, ShieldCheck } from 'lucide-react'
import { inspectUrl, reconstruction } from './lib/investigation.js'

function EvidenceText({ text, terms, selectedRange }) {
  const ranges = selectedRange ? [selectedRange] : []
  for (const term of selectedRange ? [] : terms.filter(Boolean)) {
    const lower = text.toLowerCase(), needle = term.toLowerCase()
    let from = 0, at
    while ((at = lower.indexOf(needle, from)) !== -1) {
      ranges.push({ start: at, end: at + term.length })
      from = at + term.length
    }
  }
  ranges.sort((a, b) => a.start - b.start || b.end - a.end)
  const accepted = ranges.filter((r, i) => !ranges.slice(0, i).some(p => r.start < p.end && r.end > p.start))
  const parts = []; let pos = 0
  accepted.forEach((r, i) => { if (r.start > pos) parts.push(text.slice(pos, r.start)); parts.push(<mark key={i}>{text.slice(r.start, r.end)}</mark>); pos = r.end })
  parts.push(text.slice(pos))
  return <div className="source-text">{parts}</div>
}

function UrlInspector({ urls, findings }) {
  const [selected, setSelected] = useState(0)
  if (!urls.length) return null
  const url = inspectUrl(urls[Math.min(selected, urls.length - 1)])
  const urlFindings = findings.filter(f => (f.stage === 'destination' || f.id.startsWith('mismatch-')) &&
    (url.raw.toLowerCase().includes(f.evidence.toLowerCase()) || (url.valid && f.evidence.toLowerCase().includes(url.hostname))))
  return <section className="url-inspector" aria-label="URL anatomy inspector">
    <div className="forensic-heading"><div><span className="technical-label">02 / ADDRESS EXAMINATION</span><h2>URL anatomy</h2></div><span className="privacy-note"><Link2 size={14} /> Parsed as text · never opened</span></div>
    {urls.length > 1 && <div className="url-choices" aria-label="Choose a URL">{urls.map((raw, i) => <button type="button" className={selected === i ? 'active' : ''} key={`${raw}-${i}`} onClick={() => setSelected(i)}>Address {i + 1}</button>)}</div>}
    {!url.valid ? <div className="url-unparsed">This address could not be parsed as an HTTP or HTTPS URL. Check its exact text before acting.</div> : <div className="anatomy-body">
      <div className="url-map"><span className="url-scheme">{url.scheme.toLowerCase()}://</span>{url.embeddedAt >= 0 ? <><span className="url-decoy">{url.hostname.slice(0, url.embeddedAt + url.comparison.domain.length)}</span><span className="url-host-remainder">{url.hostname.slice(url.embeddedAt + url.comparison.domain.length)}</span></> : <span className="url-host">{url.hostname}</span>}<span className="url-path">{url.path}{url.queryKeys.length ? '?…' : ''}</span></div>
      <div className="anatomy-grid"><div><span>SCHEME</span><strong>{url.scheme}</strong><small>Encryption does not verify ownership.</small></div><div><span>ACTUAL HOSTNAME</span><strong>{url.hostname}</strong><small>The full host controls the destination.</small></div><div><span>SUBDOMAIN</span><strong>{url.subdomain || 'Not determined'}</strong><small>{url.subdomain ? 'Relative to a locally listed domain.' : 'No reliable domain boundary inferred.'}</small></div><div><span>PATH / QUERY</span><strong>{url.path || '/'}{url.queryKeys.length ? ` · ${url.queryKeys.length} query field${url.queryKeys.length === 1 ? '' : 's'}` : ''}</strong><small>{url.queryKeys.length ? `Query keys: ${url.queryKeys.join(', ')}. ` : ''}{urlFindings.some(f => url.path && f.evidence.includes(url.path)) ? 'Flagged by a local rule.' : 'Shown for inspection; no path rule triggered.'}</small></div></div>
      {url.comparison && <div className={`domain-comparison ${url.approved ? 'approved' : 'mismatch'}`}><span>{url.approved ? 'LOCALLY LISTED MATCH' : 'DOMAIN MISMATCH'}</span><p>{url.approved ? `${url.hostname} matches the locally listed ${url.comparison.brand} domain ${url.comparison.domain}. This does not prove the link is safe.` : `${url.comparison.domain} appears inside the address, but the actual hostname is ${url.hostname}. It is outside the locally listed ${url.comparison.brand} domain.`}</p></div>}
      {urlFindings.length > 0 && <div className="url-signals">{urlFindings.map(f => <div key={f.id}><span>{f.title}</span><small>{f.explanation}</small></div>)}</div>}
      {url.userinfo && <p className="url-warning">The address includes user information before @. The actual host follows @.</p>}
    </div>}
  </section>
}

export default function Investigation({ result, content, sender, onReport, onLearn }) {
  const stages = reconstruction(result, sender)
  const [selected, setSelected] = useState('identity')
  const [activeRule, setActiveRule] = useState(null)
  const stage = stages.find(s => s.id === selected) || stages[0]
  const finding = stage.findings.find(f => f.id === activeRule) || stage.findings[0]
  const source = `${sender ? `Sender: ${sender}\n` : ''}${content}`
  const terms = finding ? [finding.evidence] : stage.provided ? [sender] : stage.id === 'destination' ? result.urls : []
  const selectedRange = finding?.evidenceStart == null ? null : {
    start: finding.evidenceStart + (sender ? `Sender: ${sender}\n`.length : 0),
    end: finding.evidenceStart + (sender ? `Sender: ${sender}\n`.length : 0) + finding.evidence.length,
  }
  const learnable = stage.findings.some(f => ['urgency', 'threat-pressure'].includes(f.id)) ? 'urgency' : stage.id === 'destination' ? 'links' : stage.findings.some(f => f.id === 'otp-request') ? 'mfa' : stage.findings.some(f => f.id === 'password-request') ? 'passwords' : null
  return <div className="investigation-result">
    <section className={`risk-instrument risk-${result.level.toLowerCase()}`} aria-label="Risk assessment"><div><span className="technical-label">ANALYSIS COMPLETE / LOCAL RULES</span><div className="risk-line"><strong>{result.score}<small>/100</small></strong><div><span>{result.level} RISK</span><h2>{result.level === 'HIGH' ? 'Strong warning signals' : result.level === 'REVIEW' ? 'Needs closer review' : 'No strong signals found'}</h2><p>{result.findings.length} detected indicator{result.findings.length === 1 ? '' : 's'} · {result.rawScore > 100 ? `raw total ${result.rawScore}, capped at 100` : 'additive rule score'}</p></div></div></div><button className="primary-button" onClick={onReport}>Create local case <ArrowRight size={17} /></button></section>
    <section className="reconstruction" aria-label="Attack reconstruction"><div className="forensic-heading"><div><span className="technical-label">01 / EVIDENCE CHAIN</span><h2>Attack reconstruction</h2><p>Select a stage to inspect the exact source and rule behind it.</p></div><span className="technical-label">FOUR STAGES / OBSERVED ONLY</span></div>
      <div className="stage-track">{stages.map((s, i) => <React.Fragment key={s.id}><button type="button" className={`stage-node ${s.state} ${selected === s.id ? 'active' : ''}`} aria-pressed={selected === s.id} onClick={() => { setSelected(s.id); setActiveRule(null) }}><span className="stage-top"><span>{s.number} / {s.label.toUpperCase()}</span><span className="stage-state">{s.state}</span></span><strong>{s.value || (s.state === 'inapplicable' ? 'Input is a URL only' : 'Not established')}</strong><small>{s.findings.length ? `${s.findings.length} rule${s.findings.length === 1 ? '' : 's'} triggered` : s.provided ? 'Provided sender · no rule triggered' : 'No supporting rule'}</small></button>{i < 3 && <span className="stage-connector" aria-hidden="true">→</span>}</React.Fragment>)}</div>
      <div className="examination"><div className="source-pane"><div className="pane-label"><ScanSearch size={16} /> ORIGINAL SUBMISSION <span>SELECTED EVIDENCE HIGHLIGHTED</span></div><EvidenceText text={source} terms={terms} selectedRange={selectedRange} /></div><div className="rule-pane"><span className="technical-label">SELECTED STAGE / {stage.label.toUpperCase()}</span>{stage.findings.length ? <><div className="rule-picker">{stage.findings.map(f => <button type="button" className={finding?.id === f.id ? 'active' : ''} key={f.id} onClick={() => setActiveRule(f.id)}>{f.title}<span>+{f.score}</span></button>)}</div><div className="rule-detail"><span>RULE {finding.id} · {finding.severity.toUpperCase()}</span><h3>{finding.title}</h3><p>{finding.explanation}</p><div>EXACT EVIDENCE <code>{finding.evidence}</code></div></div></> : <div className="rule-empty"><h3>{stage.provided ? 'Sender supplied with the message' : stage.state === 'inapplicable' ? 'Not applicable to this input' : 'No rule established this stage'}</h3><p>{stage.provided ? 'The sender name is user supplied. No identity rule was triggered by this stage alone.' : stage.state === 'inapplicable' ? 'A URL by itself contains no message claim or requested action.' : 'The local rules did not find evidence for this stage. Its absence does not prove safety.'}</p></div>}{learnable && <button type="button" className="learn-link" onClick={() => onLearn(learnable)}>Open related field guide <ArrowRight size={15} /></button>}</div></div>
    </section>
    <UrlInspector urls={result.urls} findings={result.findings} />
    <section className="scoring-section"><div className="forensic-heading"><div><span className="technical-label">03 / SCORING RECORD</span><h2>Why this score?</h2></div><span className="technical-label">SUM OF UNIQUE RULE WEIGHTS · CAP 100</span></div>{result.findings.length ? <div className="score-ledger">{result.findings.map(f => <div key={f.id}><span>{f.id}</span><strong>{f.title}</strong><code>{f.evidence}</code><b>+{f.score}</b></div>)}</div> : <p className="no-indicators">No matching rules in this submission. The result does not verify the message as safe.</p>}<div className="ledger-total"><span>RAW TOTAL {result.rawScore} {result.rawScore > 100 && '→ CAPPED AT 100'}</span><strong>{result.score} / 100 · {result.level}</strong></div></section>
    <section className="safety-actions"><div className="forensic-heading"><div><span className="technical-label">04 / RESPONSE</span><h2>Safest next moves</h2></div><ShieldCheck size={22} /></div><ol>{result.recommendations.map((r, i) => <li key={i}><span>0{i + 1}</span>{r}</li>)}</ol></section>
    <p className="limitations"><AlertTriangle size={16} />{result.limitations}</p>
  </div>
}
