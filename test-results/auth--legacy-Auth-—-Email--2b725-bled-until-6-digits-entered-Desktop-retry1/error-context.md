# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> @legacy Auth — Email OTC Flow (legacy) >> verify button disabled until 6 digits entered
- Location: tests/auth.spec.ts:52:7

# Error details

```
Test timeout of 20000ms exceeded.
```

```
Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open '/private/tmp/questlearn/test-results/.playwright-artifacts-10/traces/d748ac400d08b85935ef-5287250111e2e25d6712-retry1.trace'
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "404" [level=1] [ref=e4]
    - heading "This page could not be found." [level=2] [ref=e6]
  - alert [ref=e7]
```