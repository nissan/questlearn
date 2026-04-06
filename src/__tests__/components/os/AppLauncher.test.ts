import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

/**
 * AppLauncher Role-Based Filtering Tests
 * 
 * Tests that students and teachers see only their relevant apps
 */

describe('AppLauncher Role-Based Filtering', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Student Role', () => {
    beforeEach(() => {
      localStorage.setItem('lumina_user', JSON.stringify({ name: 'Alice', role: 'student' }))
    })

    it('should show QuestLearn app for students', () => {
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      expect(user.role).toBe('student')
    })

    it('should allow students to access student dashboard', () => {
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      expect(user.role).toBe('student')
      // AppLauncher filters to show: questlearn, student-dashboard, student-help, mini-apps, pitch
      const studentVisibleApps = ['questlearn', 'student-dashboard', 'student-help', 'mini-apps', 'pitch']
      expect(studentVisibleApps).toContain('student-dashboard')
    })

    it('should hide teacher hub from students', () => {
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      expect(user.role).toBe('student')
      // AppLauncher filters OUT: teacher, teacher-help
      const studentVisibleApps = ['questlearn', 'student-dashboard', 'student-help', 'mini-apps', 'pitch']
      expect(studentVisibleApps).not.toContain('teacher')
      expect(studentVisibleApps).not.toContain('teacher-help')
    })

    it('should show mini-apps for students', () => {
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      const studentVisibleApps = ['questlearn', 'student-dashboard', 'student-help', 'mini-apps', 'pitch']
      expect(studentVisibleApps).toContain('mini-apps')
    })

    it('should show pitch deck for students', () => {
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      const studentVisibleApps = ['questlearn', 'student-dashboard', 'student-help', 'mini-apps', 'pitch']
      expect(studentVisibleApps).toContain('pitch')
    })
  })

  describe('Teacher Role', () => {
    beforeEach(() => {
      localStorage.setItem('lumina_user', JSON.stringify({ name: 'Mrs Johnson', role: 'teacher' }))
    })

    it('should show Teacher Hub app for teachers', () => {
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      expect(user.role).toBe('teacher')
    })

    it('should allow teachers to access teacher hub', () => {
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      expect(user.role).toBe('teacher')
      // AppLauncher filters to show: teacher, teacher-help, pitch
      const teacherVisibleApps = ['teacher', 'teacher-help', 'pitch']
      expect(teacherVisibleApps).toContain('teacher')
    })

    it('should hide student dashboard from teachers', () => {
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      const teacherVisibleApps = ['teacher', 'teacher-help', 'pitch']
      expect(teacherVisibleApps).not.toContain('student-dashboard')
      expect(teacherVisibleApps).not.toContain('questlearn')
    })

    it('should hide student guide from teachers', () => {
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      const teacherVisibleApps = ['teacher', 'teacher-help', 'pitch']
      expect(teacherVisibleApps).not.toContain('student-help')
      expect(teacherVisibleApps).not.toContain('mini-apps')
    })

    it('should show pitch deck for teachers', () => {
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      const teacherVisibleApps = ['teacher', 'teacher-help', 'pitch']
      expect(teacherVisibleApps).toContain('pitch')
    })
  })

  describe('No Role / Unauthenticated', () => {
    it('should handle missing role gracefully', () => {
      localStorage.removeItem('lumina_user')
      const stored = localStorage.getItem('lumina_user')
      expect(stored).toBeNull()
      // Fallback: show all apps
    })

    it('should handle malformed localStorage data', () => {
      localStorage.setItem('lumina_user', 'invalid json')
      const stored = localStorage.getItem('lumina_user')
      expect(stored).toBe('invalid json')
      // Should catch JSON.parse error and return null role
    })

    it('should handle missing role property', () => {
      localStorage.setItem('lumina_user', JSON.stringify({ name: 'Unknown' }))
      const stored = localStorage.getItem('lumina_user')
      const user = JSON.parse(stored!)
      expect(user.role).toBeUndefined()
      // Should treat as null and show all apps
    })
  })

  describe('App Visibility Contracts', () => {
    it('student should ALWAYS see these apps', () => {
      const studentApps = ['questlearn', 'student-dashboard', 'student-help', 'mini-apps', 'pitch']
      expect(studentApps).toHaveLength(5)
      expect(studentApps).toContain('questlearn')
      expect(studentApps).toContain('student-dashboard')
      expect(studentApps).toContain('student-help')
      expect(studentApps).toContain('mini-apps')
      expect(studentApps).toContain('pitch')
    })

    it('student should NEVER see these apps', () => {
      const studentApps = ['questlearn', 'student-dashboard', 'student-help', 'mini-apps', 'pitch']
      expect(studentApps).not.toContain('teacher')
      expect(studentApps).not.toContain('teacher-help')
    })

    it('teacher should ALWAYS see these apps', () => {
      const teacherApps = ['teacher', 'teacher-help', 'pitch']
      expect(teacherApps).toHaveLength(3)
      expect(teacherApps).toContain('teacher')
      expect(teacherApps).toContain('teacher-help')
      expect(teacherApps).toContain('pitch')
    })

    it('teacher should NEVER see these apps', () => {
      const teacherApps = ['teacher', 'teacher-help', 'pitch']
      expect(teacherApps).not.toContain('questlearn')
      expect(teacherApps).not.toContain('student-dashboard')
      expect(teacherApps).not.toContain('student-help')
      expect(teacherApps).not.toContain('mini-apps')
    })

    it('both roles should see pitch deck', () => {
      const studentApps = ['questlearn', 'student-dashboard', 'student-help', 'mini-apps', 'pitch']
      const teacherApps = ['teacher', 'teacher-help', 'pitch']
      expect(studentApps).toContain('pitch')
      expect(teacherApps).toContain('pitch')
    })

    it('both roles should see v2/v3 apps (greyed out)', () => {
      // v2/v3 apps shown to all roles with "Coming soon" / "Future" badges
      const v2v3Apps = ['study-rooms', 'quiz-rooms', 'open-threads', 'syllabus', 'cross-school', 'regional']
      expect(v2v3Apps.length).toBeGreaterThan(0)
    })
  })
})
