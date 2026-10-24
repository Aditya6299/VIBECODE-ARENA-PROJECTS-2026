import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeMessage, isApproved } from '../src/lib/analyzer.js'
import { SAMPLES } from '../src/lib/demoData.js'

test('deceptive trusted-domain substring is not approved', () => {
  assert.equal(isApproved('bank.example.com.attacker.test', ['bank.example.com']), false)
  assert.equal(isApproved('secure.bank.example.com', ['bank.example.com']), true)
  const result = analyzeMessage({ mode: 'url', content: 'https://login.bank.example.com.attacker.test/verify' })
  assert.ok(result.indicatorIds.includes('embedded-bank.example.com'))
  assert.notEqual(result.level, 'LOW')
})
test('urgency plus confidential-data request is high risk', () => {
  const result = analyzeMessage({ mode: 'sms', sender: 'Example Bank Security Team', content: 'URGENT: account will be locked within 2 hours. Share your password and OTP immediately at https://login.bank.example.com.attacker.test/verify' })
  assert.equal(result.level, 'HIGH')
  assert.ok(result.indicatorIds.includes('password-request'))
  assert.ok(result.indicatorIds.includes('otp-request'))
  assert.equal(new Set(result.indicatorIds).size, result.indicatorIds.length)
  assert.ok(result.score <= 100)
})
test('ordinary communication stays low', () => {
  const result = analyzeMessage({ mode: 'sms', sender: 'Asha', content: 'Hi! The team lunch is at 1 pm tomorrow. See you at the café.' })
  assert.equal(result.level, 'LOW')
  assert.equal(result.score, 0)
})
test('password reset instructions are not treated as a credential request', () => {
  const result = analyzeMessage({ mode: 'sms', content: 'Please send me the password reset instructions tomorrow.' })
  assert.equal(result.level, 'LOW')
  assert.ok(!result.indicatorIds.includes('password-request'))
})

test('disclaimer alone does not become a credential request', () => {
  const content = 'Notice: We will never ask for your password. Never share your password or OTP here.'
  const result = analyzeMessage({ mode: 'email', content })
  assert.ok(!result.indicatorIds.includes('password-request'))
  assert.ok(!result.indicatorIds.includes('otp-request'))
  assert.equal(result.score, 0)
})

test('a later actionable password request survives a disclaimer prefix', () => {
  const content = 'Notice: We will never ask for your password. Please verify and send your password here: https://attacker.test/'
  const result = analyzeMessage({ mode: 'email', content })
  const finding = result.findings.find(f => f.id === 'password-request')
  assert.ok(finding)
  assert.equal(finding.evidenceStart, content.lastIndexOf('password'))
  assert.equal(content.slice(finding.evidenceStart, finding.evidenceStart + finding.evidence.length), finding.evidence)
  assert.equal(result.findings.filter(f => f.id === 'password-request').length, 1)
})

test('multiple sensitive-term mentions contribute only one actionable finding', () => {
  const content = 'Our password policy says never share your password. Please send your passcode here. We will never ask for your password by text.'
  const result = analyzeMessage({ mode: 'sms', content })
  const finding = result.findings.find(f => f.id === 'password-request')
  assert.equal(finding.evidence, 'passcode')
  assert.equal(finding.evidenceStart, content.indexOf('passcode'))
  assert.equal(result.findings.filter(f => f.id === 'password-request').length, 1)
  assert.equal(result.rawScore, finding.score)
  assert.equal(result.score, Math.min(100, result.rawScore))
})

test('fictional high-risk and benign samples retain their classification', () => {
  const high = analyzeMessage(SAMPLES[0])
  const benign = analyzeMessage(SAMPLES[2])
  assert.equal(high.level, 'HIGH')
  assert.ok(high.indicatorIds.includes('password-request'))
  assert.ok(high.indicatorIds.includes('otp-request'))
  assert.equal(benign.level, 'LOW')
  assert.equal(benign.score, 0)
})
test('URL parsing is resilient and detects URL tricks', () => {
  for (const content of ['', 'not a url', 'https://', 'https://bank.example.com@attacker.test/']) {
    const result = analyzeMessage({ mode: 'url', content })
    assert.ok(result.score >= 0 && result.score <= 100)
  }
  assert.ok(analyzeMessage({ mode: 'url', content: 'https://bank.example.com@attacker.test/' }).indicatorIds.includes('url-userinfo'))
})
test('shorteners alone are only review signals, not high risk', () => {
  const result = analyzeMessage({ mode: 'url', content: 'https://bit.ly/example' })
  assert.notEqual(result.level, 'HIGH')
})
test('analysis is deterministic for the same input', () => {
  const input = { mode: 'email', sender: 'Asha', content: 'Meeting at 4 tomorrow.' }
  assert.deepEqual(analyzeMessage(input), analyzeMessage(input))
})
