/**
 * Langfuse LLM observability client
 * Wraps CurricuLLM API calls with trace + generation spans.
 *
 * Usage (in curricullm-client.ts or API routes):
 *   import { langfuse, withLangfuseTrace } from '@/lib/langfuse'
 *
 *   const result = await withLangfuseTrace({
 *     name: 'content-generation',
 *     userId: session.userId,
 *     input: { topic, format, yearLevel },
 *     fn: async (trace) => {
 *       const generation = trace.generation({ name: 'curricullm', input: messages, model })
 *       const output = await curricullm.chat.completions.create(...)
 *       generation.end({ output })
 *       return output
 *     }
 *   })
 */

import Langfuse from 'langfuse'

let _client: Langfuse | null = null

function getLangfuse(): Langfuse | null {
  const secretKey = process.env.LANGFUSE_SECRET_KEY
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY
  if (!secretKey || !publicKey || secretKey === 'lf_sk_placeholder') return null

  if (!_client) {
    _client = new Langfuse({
      secretKey,
      publicKey,
      baseUrl: process.env.LANGFUSE_BASE_URL ?? 'https://us.cloud.langfuse.com',
      flushAt: 5,
      flushInterval: 3000,
    })
  }
  return _client
}

export type LangfuseTrace = ReturnType<NonNullable<ReturnType<typeof getLangfuse>>['trace']>

/**
 * Wrap an async function with a Langfuse trace.
 * If Langfuse is not configured, runs the function without tracing.
 */
export async function withLangfuseTrace<T>({
  name,
  userId,
  sessionId,
  input,
  metadata,
  fn,
}: {
  name: string
  userId?: string
  sessionId?: string
  input?: unknown
  metadata?: Record<string, unknown>
  fn: (trace: LangfuseTrace | null) => Promise<T>
}): Promise<T> {
  const client = getLangfuse()
  if (!client) return fn(null)

  const trace = client.trace({
    name,
    userId,
    sessionId,
    input,
    metadata,
  })

  try {
    const result = await fn(trace)
    trace.update({ output: result as unknown })
    return result
  } catch (err) {
    trace.update({ metadata: { ...metadata, error: String(err) } })
    throw err
  } finally {
    await client.flushAsync()
  }
}

export { getLangfuse }
