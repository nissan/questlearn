import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: 'redditech',
  project: 'questlearn',
  silent: true,
  widenClientFileUpload: true,
  sourcemaps: { disable: false },
  webpack: { treeshake: { removeDebugLogging: true } },
});
