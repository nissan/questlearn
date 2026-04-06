/**
 * AppLauncher Role-Based Filtering — Unit Tests
 * Tests the filtering logic, not DOM/localStorage directly
 */
import { describe, it, expect } from 'vitest'

type AppId = string
type AppStatus = 'live' | 'v2' | 'v3'
interface App { id: AppId; status: AppStatus }

const LAUNCHER_APPS: App[] = [
  { id: 'questlearn', status: 'live' },
  { id: 'teacher', status: 'live' },
  { id: 'student-dashboard', status: 'live' },
  { id: 'pitch', status: 'live' },
  { id: 'student-help', status: 'live' },
  { id: 'teacher-help', status: 'live' },
  { id: 'mini-apps', status: 'live' },
  { id: 'study-rooms', status: 'v2' },
  { id: 'quiz-rooms', status: 'v2' },
  { id: 'open-threads', status: 'v2' },
  { id: 'syllabus', status: 'v2' },
  { id: 'cross-school', status: 'v3' },
  { id: 'regional', status: 'v3' },
]

function filterAppsByRole(role: 'student' | 'teacher' | null): App[] {
  return LAUNCHER_APPS.filter((app) => {
    if (app.status !== 'live') return true
    if (role === 'student') {
      return ['questlearn', 'student-dashboard', 'student-help', 'mini-apps', 'pitch'].includes(app.id)
    }
    if (role === 'teacher') {
      return ['teacher', 'teacher-help', 'pitch'].includes(app.id)
    }
    return true
  })
}

describe('AppLauncher Role Filtering Logic', () => {
  describe('Student role', () => {
    const apps = filterAppsByRole('student')
    const liveIds = apps.filter(a => a.status === 'live').map(a => a.id)

    it('shows QuestLearn', () => expect(liveIds).toContain('questlearn'))
    it('shows student dashboard', () => expect(liveIds).toContain('student-dashboard'))
    it('shows student guide', () => expect(liveIds).toContain('student-help'))
    it('shows mini apps', () => expect(liveIds).toContain('mini-apps'))
    it('shows pitch deck', () => expect(liveIds).toContain('pitch'))
    it('hides teacher hub', () => expect(liveIds).not.toContain('teacher'))
    it('hides teacher guide', () => expect(liveIds).not.toContain('teacher-help'))
    it('still shows v2/v3 apps (coming soon)', () => {
      const v2 = apps.filter(a => a.status === 'v2')
      expect(v2.length).toBeGreaterThan(0)
    })
  })

  describe('Teacher role', () => {
    const apps = filterAppsByRole('teacher')
    const liveIds = apps.filter(a => a.status === 'live').map(a => a.id)

    it('shows teacher hub', () => expect(liveIds).toContain('teacher'))
    it('shows teacher guide', () => expect(liveIds).toContain('teacher-help'))
    it('shows pitch deck', () => expect(liveIds).toContain('pitch'))
    it('hides QuestLearn', () => expect(liveIds).not.toContain('questlearn'))
    it('hides student dashboard', () => expect(liveIds).not.toContain('student-dashboard'))
    it('hides student guide', () => expect(liveIds).not.toContain('student-help'))
    it('hides mini apps', () => expect(liveIds).not.toContain('mini-apps'))
    it('still shows v2/v3 apps (coming soon)', () => {
      const v2 = apps.filter(a => a.status === 'v2')
      expect(v2.length).toBeGreaterThan(0)
    })
  })

  describe('No role (unauthenticated)', () => {
    const apps = filterAppsByRole(null)
    const liveIds = apps.filter(a => a.status === 'live').map(a => a.id)

    it('shows all live apps as fallback', () => {
      expect(liveIds).toContain('questlearn')
      expect(liveIds).toContain('teacher')
      expect(liveIds).toContain('student-dashboard')
    })
  })

  describe('Contracts', () => {
    it('pitch deck is visible to all roles', () => {
      const roles: Array<'student' | 'teacher' | null> = ['student', 'teacher', null]
      for (const role of roles) {
        const ids = filterAppsByRole(role).filter(a => a.status === 'live').map(a => a.id)
        expect(ids).toContain('pitch')
      }
    })
  })
})
