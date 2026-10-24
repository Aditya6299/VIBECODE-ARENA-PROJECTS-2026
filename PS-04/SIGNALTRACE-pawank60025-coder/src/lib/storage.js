import { SEEDED_REPORTS } from './demoData.js'

const KEY = 'signaltrace-reports-v1'
export const STATUSES = ['Submitted Locally', 'Under Review', 'Resolved']

export function getReports() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(value) ? value.filter(r => r && typeof r.id === 'string') : []
  } catch { return [] }
}
export function saveReports(reports) {
  try { localStorage.setItem(KEY, JSON.stringify(reports)); return true }
  catch { return false }
}
export function makeReport({ analysis, category, description, evidence = '' }) {
  const suffix = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8).toUpperCase() : Math.random().toString(36).slice(2, 10).toUpperCase()
  return {
    id: `ST-${suffix}`, createdAt: new Date().toISOString(), status: STATUSES[0], category,
    description: description.trim().slice(0, 500), evidence: evidence.trim().slice(0, 600),
    level: analysis.level, score: analysis.score, indicatorIds: [...analysis.indicatorIds], seeded: false,
  }
}
export function seedReports(existing) {
  const ids = new Set(existing.map(r => r.id))
  return [...existing, ...SEEDED_REPORTS.filter(r => !ids.has(r.id))]
}
