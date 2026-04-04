import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: "redditech",
  project: "questlearn-nextjs",

  authToken: process.env.SENTRY_AUTH_TOKEN,

  widenClientFileUpload: true,

  // Proxy Sentry requests to bypass ad-blockers
  tunnelRoute: "/monitoring",

  // Suppress non-CI build output
  silent: !process.env.CI,
});
