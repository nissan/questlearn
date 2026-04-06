'use client'
import { create } from 'zustand'

export type WindowId = 'questlearn' | 'teacher' | 'showcase' | 'student-dashboard' | 'pitch' | 'student-help' | 'teacher-help' | 'mini-apps' | 'demo-assets' | 'judge-cheatsheet' | 'demo-script' | 'value-prop' | 'student-journey' | 'judge-faq' | 'backup-demo'

export interface WindowState {
  id: WindowId
  title: string
  src: string
  open: boolean
  minimised: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface OSState {
  windows: WindowState[]
  activeWindow: WindowId | null
  launcherOpen: boolean
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimiseWindow: (id: WindowId) => void
  restoreWindow: (id: WindowId) => void
  focusWindow: (id: WindowId) => void
  setPosition: (id: WindowId, pos: { x: number; y: number }) => void
  setLauncher: (open: boolean) => void
  openWindowWithSrc: (id: WindowId, src: string) => void
}

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: 'questlearn',
    title: 'QuestLearn',
    src: '/learn',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 120, y: 40 },
    size: { width: 1000, height: 720 },
  },
  {
    id: 'teacher',
    title: 'Teacher Hub',
    src: '/teacher',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 160, y: 80 },
    size: { width: 1000, height: 650 },
  },
  {
    id: 'showcase',
    title: 'Showcase',
    src: '',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 180, y: 50 },
    size: { width: 900, height: 600 },
  },
  {
    id: 'student-dashboard',
    title: 'My Dashboard',
    src: '/student-dashboard',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 80, y: 50 },
    size: { width: 1100, height: 700 },
  },
  {
    id: 'pitch',
    title: 'Pitch Deck',
    src: '/pitch',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 200, y: 60 },
    size: { width: 900, height: 650 },
  },
  {
    id: 'student-help',
    title: 'Student Guide',
    src: '/help/student',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 140, y: 80 },
    size: { width: 860, height: 640 },
  },
  {
    id: 'teacher-help',
    title: 'Teacher Guide',
    src: '/help/teacher',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 160, y: 90 },
    size: { width: 860, height: 640 },
  },
  {
    id: 'mini-apps',
    title: 'Mini Apps',
    src: '',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 100, y: 40 },
    size: { width: 900, height: 640 },
  },
  {
    id: 'demo-assets',
    title: 'Demo Assets',
    src: '/demo-assets',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 120, y: 256 },
    size: { width: 900, height: 640 },
  },
  {
    id: 'judge-cheatsheet',
    title: 'The QuestLearn Story',
    src: '/judge-cheatsheet',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 200, y: 120 },
    size: { width: 920, height: 680 },
  },
  {
    id: 'demo-script',
    title: 'Demo Guide',
    src: '/demo-script',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 180, y: 100 },
    size: { width: 1000, height: 700 },
  },
  {
    id: 'value-prop',
    title: 'Why QuestLearn',
    src: '/value-prop',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 160, y: 140 },
    size: { width: 920, height: 680 },
  },
  {
    id: 'student-journey',
    title: 'Student Journey',
    src: '/student-journey',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 140, y: 160 },
    size: { width: 1000, height: 700 },
  },
  {
    id: 'judge-faq',
    title: 'Judge FAQ',
    src: '/judge-faq',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 220, y: 110 },
    size: { width: 920, height: 720 },
  },
  {
    id: 'backup-demo',
    title: 'Backup Demo',
    src: '/backup-demo',
    open: false,
    minimised: false,
    zIndex: 10,
    position: { x: 210, y: 130 },
    size: { width: 900, height: 650 },
  },
]

export const useWindowManager = create<OSState>((set) => ({
  windows: INITIAL_WINDOWS,
  activeWindow: null,
  launcherOpen: false,

  openWindow: (id) =>
    set((state) => {
      const maxZ = Math.max(...state.windows.map((w) => w.zIndex), 10)
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, open: true, minimised: false, zIndex: maxZ + 1 } : w
        ),
        activeWindow: id,
        launcherOpen: false,
      }
    }),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, open: false } : w)),
      activeWindow: state.activeWindow === id ? null : state.activeWindow,
    })),

  minimiseWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, minimised: true } : w)),
      activeWindow: state.activeWindow === id ? null : state.activeWindow,
    })),

  restoreWindow: (id) =>
    set((state) => {
      const maxZ = Math.max(...state.windows.map((w) => w.zIndex), 10)
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, minimised: false, open: true, zIndex: maxZ + 1 } : w
        ),
        activeWindow: id,
      }
    }),

  focusWindow: (id) =>
    set((state) => {
      const maxZ = Math.max(...state.windows.map((w) => w.zIndex), 10)
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: maxZ + 1 } : w
        ),
        activeWindow: id,
      }
    }),

  setPosition: (id, pos) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position: pos } : w)),
    })),

  setLauncher: (open) => set({ launcherOpen: open }),

  openWindowWithSrc: (id, src) =>
    set((state) => {
      const maxZ = Math.max(...state.windows.map((w) => w.zIndex), 10)
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, src, open: true, minimised: false, zIndex: maxZ + 1 } : w
        ),
        activeWindow: id,
        launcherOpen: false,
      }
    }),
}))
