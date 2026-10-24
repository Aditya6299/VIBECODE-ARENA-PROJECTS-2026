import test from 'node:test'
import assert from 'node:assert/strict'
import { getReports, saveReports, makeReport, seedReports } from '../src/lib/storage.js'

test('reports persist, accept local status changes, and delete', () => {
  const memory = new Map()
  globalThis.localStorage = { getItem: k => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v) }
  const report = makeReport({ analysis: { level: 'HIGH', score: 80, indicatorIds: ['urgency'] }, category: 'Phishing message', description: 'Fictional case' })
  assert.equal(report.evidence, '')
  assert.ok(saveReports([report]))
  assert.equal(getReports()[0].status, 'Submitted Locally')
  assert.ok(saveReports([{ ...report, status: 'Under Review' }]))
  assert.equal(getReports()[0].status, 'Under Review')
  assert.ok(saveReports([]))
  assert.equal(getReports().length, 0)
})
test('fictional seed cases do not duplicate', () => {
  const once = seedReports([])
  assert.equal(once.length, 4)
  assert.equal(seedReports(once).length, 4)
  assert.ok(once.every(r => r.seeded && !r.evidence))
})
