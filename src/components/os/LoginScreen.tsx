'use client'
import { useState } from 'react'

interface LoginScreenProps {
  onLogin: (user: { name: string; role: string }) => void
}

type DemoAccount = {
  name: string
  role: 'student' | 'teacher'
  year_level?: string
  teacher_id?: string
  subject?: string
  school_name?: string
  school_location?: string
}

type LoginPayload = {
  name: string
  role: 'student' | 'teacher'
  year_level?: string
  teacher_id?: string
  subject?: string
  school_name?: string
  school_location?: string
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Zara Osei',
    role: 'student',
    year_level: 'Year 10',
    school_name: 'Parramatta High School',
    school_location: 'Parramatta',
  },
  {
    name: 'Kai Nguyen',
    role: 'student',
    year_level: 'Year 9',
    school_name: 'Epping Boys High School',
    school_location: 'Epping',
  },
  {
    name: 'Priya Sharma',
    role: 'student',
    year_level: 'Year 8',
    school_name: 'Cheltenham Girls High School',
    school_location: 'Cheltenham',
  },
  {
    name: 'Ms Rachel Chen',
    role: 'teacher',
    teacher_id: 'T-1024',
    subject: 'Science',
    school_name: 'Parramatta High School',
    school_location: 'Parramatta',
  },
  {
    name: 'Mr David Okafor',
    role: 'teacher',
    teacher_id: 'T-2048',
    subject: 'Mathematics',
    school_name: 'Parramatta High School',
    school_location: 'Parramatta',
  },
]

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Student fields
  const [studentName, setStudentName] = useState('')
  const [yearLevel, setYearLevel] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [schoolLocation, setSchoolLocation] = useState('')

  // Teacher fields
  const [teacherName, setTeacherName] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [subject, setSubject] = useState('')
  const [teacherSchoolName, setTeacherSchoolName] = useState('')
  const [teacherSchoolLocation, setTeacherSchoolLocation] = useState('')

  const registerAndLogin = async (payload: LoginPayload) => {
    const sanitizedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => typeof value === 'string' && value.length > 0)
    )

    const res = await fetch('/api/auth/lumina-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedPayload),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Something went wrong. Please try again.')
    }
    localStorage.setItem('lumina_user', JSON.stringify({ name: data.name, role: data.role }))
    onLogin({ name: data.name, role: data.role })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload =
        role === 'student'
          ? {
              name: studentName,
              role,
              year_level: yearLevel,
              school_name: schoolName,
              school_location: schoolLocation,
            }
          : {
              name: teacherName,
              role,
              teacher_id: teacherId,
              subject,
              school_name: teacherSchoolName,
              school_location: teacherSchoolLocation,
            }

      await registerAndLogin(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (account: DemoAccount) => {
    setLoading(true)
    setError('')
    try {
      await registerAndLogin(account)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg text-sm text-white outline-none placeholder-white/30'
  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[10000]"
      style={{
        background: 'radial-gradient(ellipse at center, #1e2d45 0%, #0f172a 100%)',
      }}
    >
      <div
        className="w-[960px] max-w-[95vw] grid grid-cols-1 lg:grid-cols-[1fr_320px] overflow-hidden"
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '20px',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-10"
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-1 mb-2">
            <span className="text-4xl">🌟</span>
            <h1 className="text-amber-400 font-semibold text-xl">QuestLearn</h1>
            <span className="text-white/40 text-xs">QuestLearn Edition</span>
          </div>

          <h2 className="text-white font-medium text-center">{"Let's get started"}</h2>

          {/* Role tabs */}
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {(['student', 'teacher'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex-1 py-2 text-sm transition-colors capitalize"
                style={{
                  background: role === r ? '#f59e0b' : 'transparent',
                  color: role === r ? '#0f172a' : 'rgba(255,255,255,0.6)',
                  fontWeight: role === r ? 600 : 400,
                }}
              >
                {r === 'student' ? '🎓 Student' : '📊 Teacher'}
              </button>
            ))}
          </div>

          {/* Student fields */}
          {role === 'student' && (
            <>
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="Your name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
              <select
                className={inputClass}
                style={inputStyle}
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
              >
                <option value="">Year level</option>
                <option value="Year 8">Year 8</option>
                <option value="Year 9">Year 9</option>
                <option value="Year 10">Year 10</option>
              </select>
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="School name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="School suburb or city"
                value={schoolLocation}
                onChange={(e) => setSchoolLocation(e.target.value)}
              />
            </>
          )}

          {/* Teacher fields */}
          {role === 'teacher' && (
            <>
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="Your name"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                required
              />
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="Teacher ID"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              />
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="Subject (e.g. Mathematics)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="School name"
                value={teacherSchoolName}
                onChange={(e) => setTeacherSchoolName(e.target.value)}
              />
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="School suburb or city"
                value={teacherSchoolLocation}
                onChange={(e) => setTeacherSchoolLocation(e.target.value)}
              />
            </>
          )}

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity"
            style={{
              background: '#f59e0b',
              color: '#0f172a',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Setting up...' : 'Enter QuestLearn →'}
          </button>

          <p className="text-white/30 text-center text-xs">
            © QuestLearn 2026 · Year 8–10 · Australian Curriculum v9
          </p>
        </form>

        <aside
          className="border-t lg:border-t-0 lg:border-l p-6"
          style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(2, 6, 23, 0.65)' }}
        >
          <p className="text-amber-300 text-xs font-semibold tracking-wide uppercase mb-2">Demo Accounts</p>
          <p className="text-white/50 text-xs mb-4">Click any account to sign in instantly.</p>

          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={`${account.role}-${account.name}`}
                type="button"
                onClick={() => handleQuickLogin(account)}
                disabled={loading}
                className="w-full text-left rounded-lg px-3 py-2 transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  opacity: loading ? 0.65 : 1,
                }}
              >
                <p className="text-sm text-white font-medium">{account.name}</p>
                <p className="text-xs text-white/55">
                  {account.role === 'student' ? '🎓 Student' : '📊 Teacher'}
                  {account.year_level ? ` · ${account.year_level}` : ''}
                  {account.subject ? ` · ${account.subject}` : ''}
                </p>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
