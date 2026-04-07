import posthog from 'posthog-js'
import * as Sentry from "@sentry/nextjs";

// PostHog — Next.js 15.3+ instrumentation-client pattern
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  defaults: '2026-01-30',
  // Mask all student inputs (answers) in session replay
  session_recording: {
    maskAllInputs: true,
  },
})

const enableSentryReplay = process.env.NEXT_PUBLIC_SENTRY_ENABLE_REPLAY === "true";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",

  sendDefaultPii: true,

  // 100% in dev, 10% in prod
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Session Replay disabled by default to avoid quota-triggered 429 noise.
  // Opt in by setting NEXT_PUBLIC_SENTRY_ENABLE_REPLAY=true.
  replaysSessionSampleRate: enableSentryReplay ? 0.1 : 0,
  replaysOnErrorSampleRate: enableSentryReplay ? 1.0 : 0,

  enableLogs: true,

  integrations: [
    ...(enableSentryReplay ? [Sentry.replayIntegration()] : []),
  ],
});

// Hook into App Router navigation transitions
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
