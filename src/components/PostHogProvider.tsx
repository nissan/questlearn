'use client'

/**
 * PostHog client-side provider.
 *
 * For Next.js 16 (15.3+), PostHog is initialised in instrumentation-client.ts
 * using the lightweight recommended approach. This component wraps children
 * with the PostHogProvider so that usePostHog() hooks work throughout the app.
 *
 * instrumentation-client.ts handles: init, pageview, session replay.
 * This file handles: React context so components can call usePostHog().
 */

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
