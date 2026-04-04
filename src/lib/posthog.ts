/**
 * PostHog server-side client (posthog-node)
 * Used in API routes to capture server-side events.
 *
 * Env vars (set in Vercel + .env.local):
 *   NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN  — project token (phc_...)
 *   NEXT_PUBLIC_POSTHOG_HOST           — https://us.i.posthog.com
 */

import { PostHog } from 'posthog-node'

let _client: PostHog | null = null

function getPostHogServer(): PostHog | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  if (!token || token.startsWith('phc_placeholder')) return null

  if (!_client) {
    _client = new PostHog(token, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      flushAt: 10,
      flushInterval: 5000,
    })
  }
  return _client
}

export const posthogServer = {
  capture: (params: { distinctId: string; event: string; properties?: Record<string, unknown> }) => {
    getPostHogServer()?.capture(params)
  },
}
