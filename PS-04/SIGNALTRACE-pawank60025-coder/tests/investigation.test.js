import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeMessage } from '../src/lib/analyzer.js'
import { SAMPLES } from '../src/lib/demoData.js'
import { inspectUrl, reconstruction } from '../src/lib/investigation.js'
import { makeReport } from '../src/lib/storage.js'

test('high-risk sample reconstruction uses analyzer evidence and scores', () => {
  const sample = SAMPLES[0]
  const result = analyzeMessage(sample)
  const stages = reconstruction(result, sample.sender)
  assert.equal(result.level, 'HIGH')
  assert.equal(stages.length, 4)
  for (const stage of stages) for (const finding of stage.findings) {
    assert.equal(finding.stage, stage.id)
    assert.ok(`${sample.sender}\n${sample.content}`.toLowerCase().includes(finding.evidence.toLowerCase()))
  }
  assert.equal(result.rawScore, result.findings.reduce((sum, f) => sum + f.score, 0))
  assert.equal(result.score, Math.min(100, result.rawScore))
})

test('URL anatomy identifies an embedded listed domain without guessing ownership', () => {
  const url = inspectUrl('https://login.bank.example.com.attacker.test/verify')
  assert.equal(url.hostname, 'login.bank.example.com.attacker.test')
  assert.equal(url.comparison.domain, 'bank.example.com')
  assert.equal(url.approved, false)
  assert.equal(url.subdomain, null)
  assert.equal(url.path, '/verify')
  assert.equal(url.embeddedAt, 6)
  assert.equal(inspectUrl('javascript:alert(1)').valid, false)
})

test('URL-only input does not invent message stages', () => {
  const stages = reconstruction(analyzeMessage({ mode: 'url', content: 'https://example.test/' }), '')
  assert.deepEqual(stages.map(s => s.state), ['inapplicable', 'inapplicable', 'detected', 'inapplicable'])
})

test('all four input modes retain analysis and a local case stores only findings metadata', () => {
  const content = SAMPLES[0].content
  for (const mode of ['email', 'sms', 'url', 'screenshot']) {
    const result = analyzeMessage({ mode, content })
    assert.equal(result.mode, mode)
    assert.ok(result.findings.length > 0)
  }
  const analysis = analyzeMessage(SAMPLES[0])
  const report = makeReport({ analysis, category: 'Phishing message', description: 'Fictional test case' })
  assert.equal(report.score, analysis.score)
  assert.deepEqual(report.indicatorIds, analysis.indicatorIds)
  assert.equal(report.status, 'Submitted Locally')
  assert.equal(report.evidence, '')
  assert.equal(JSON.stringify(report).includes(content), false)
})
