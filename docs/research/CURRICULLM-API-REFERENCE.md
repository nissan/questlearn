# CurricuLLM API Reference
_Crawled: 2026-04-02 | Sources: curricullm.com/developers, console.curricullm.com, web search_

---

## Overview

CurricuLLM is an AI platform purpose-built for K-12 education, providing curriculum-aligned AI responses for Australian and New Zealand curricula. It powers lesson planning, assessment creation, differentiated resources, and personalised student tutoring.

The **CurricuLLM API** is a developer-facing product that exposes the same curriculum intelligence as a **fully OpenAI-compliant API**. It is designed to be a drop-in replacement for OpenAI — just swap the base URL and API key.

> **Key differentiator:** "Curriculum Tokens" — proprietary tokens encoding deep understanding of educational standards (AC v9, NZC, VIC, WA). These are automatically consumed when the model references curriculum knowledge.

---

## ⚠️ Access Status

| Resource | Status |
|---|---|
| `https://curricullm.com/developers` | ✅ Public — full pricing + overview |
| `https://console.curricullm.com/` | ✅ Public landing — playground entry point |
| `https://console.curricullm.com/documentation` | 🔒 **401 — requires login** |
| `https://docs.curricullm.com` | ❌ Domain does not exist |
| `https://curricullm.com/api` or `/docs` | ❌ 404 / redirects to homepage |

**The in-console API docs require an authenticated session.** Everything below is sourced from the public developer page + API playground landing + search results. To get the full docs (including specific AC9 code format, streaming behaviour, error codes), log into `https://console.curricullm.com` with a registered account.

---

## Base URL

```
https://api.curricullm.com/v1
```

---

## Authentication

API key obtained from the [CurricuLLM Developer Playground](https://console.curricullm.com/).

**Header format (OpenAI-compatible):**
```
Authorization: Bearer <your-curricullm-api-key>
```

**OpenAI SDK usage:**
```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.CURRICULLM_API_KEY,
  baseURL: "https://api.curricullm.com/v1",
});
```

---

## Models Available

| Model ID | Curriculum | Region |
|---|---|---|
| `CurricuLLM-AU` | Australian Curriculum v9 | Australia |
| `CurricuLLM-NZ` | New Zealand Curriculum | New Zealand |
| `CurricuLLM-AU-VIC` | Victorian Curriculum F-10 | Victoria, AU |
| `CurricuLLM-AU-WA` | Western Australian Curriculum | Western Australia, AU |

> For QuestLearn (targeting AC v9): use **`CurricuLLM-AU`**

---

## Endpoints

### POST /v1/chat/completions

Standard OpenAI-format chat completions endpoint. Works with any OpenAI-compatible client.

**Request:**
```json
{
  "model": "CurricuLLM-AU",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant specialised in the Australian Curriculum v9."
    },
    {
      "role": "user",
      "content": "What are the key learning outcomes for Year 5 Science regarding Living World?"
    }
  ],
  "max_tokens": 500,
  "temperature": 0.7
}
```

**Response (OpenAI-compatible):**
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "CurricuLLM-AU",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 150,
    "total_tokens": 192
  }
}
```

> **Note:** Curriculum Tokens are a separate billing line-item but are NOT visible as a distinct field in the usage response per public docs — they appear to be billed server-side automatically.

---

## Curriculum Alignment

### How it works
CurricuLLM uses proprietary **Curriculum Tokens** that encode deep knowledge of the curriculum standards. These are automatically applied when the model references curriculum-specific knowledge — no special prompt engineering required beyond selecting the right model.

### Specifying curriculum context
The model itself (`CurricuLLM-AU`) encodes the curriculum. Provide curriculum context naturally in your system prompt or user messages:

```
"Aligned to Australian Curriculum v9, Year 8 Science, AC9S8U01"
```

### AC v9 Code format
Australian Curriculum v9 content descriptor codes follow this pattern:
```
AC9[Subject][Year][Strand][Number]
e.g. AC9S8U01 = Australian Curriculum v9, Science, Year 8, Understanding, descriptor 01
     AC9M7N01 = Maths, Year 7, Number
     AC9E6LY01 = English, Year 6, Language
```

> ⚠️ Whether the API accepts a structured `curriculum_context` field or only processes AC codes embedded in message text is **not confirmed** from public docs — requires testing via the playground or reading the authenticated docs.

---

## Pricing

All prices in **USD per million tokens**.

| Token Type | Price |
|---|---|
| Input Tokens | $2 / M |
| Output Tokens | $8 / M |
| Curriculum Tokens | $2 / M |

- **Pre-paid credits** model — no monthly commitments, no surprise bills
- Curriculum Tokens are automatically consumed when the model references curriculum knowledge
- No free tier mentioned publicly

> **For QuestLearn hackathon:** Check if hackathon credits have been provided. The EduX Oceania Hackathon 2026 involved CurricuLLM's founder running a pre-hackathon workshop — credits may be available via the hackathon organisers.

---

## Rate Limits

Not publicly documented. Check inside the console playground after logging in.

---

## Integration Notes for QuestLearn

### Drop-in replacement for OpenAI stub

In `lib/curricullm-client.ts`, replace the stub with:

```typescript
import OpenAI from "openai";

const curricullm = new OpenAI({
  apiKey: process.env.CURRICULLM_API_KEY!,
  baseURL: "https://api.curricullm.com/v1",
});

export async function getCurriculumAlignedResponse(
  userMessage: string,
  yearLevel: number,
  subject: string,
  acCodes?: string[]
): Promise<string> {
  const systemPrompt = [
    `You are a curriculum-aligned AI assistant for Australian K-12 education.`,
    `Subject: ${subject}`,
    `Year Level: Year ${yearLevel}`,
    acCodes?.length ? `Relevant AC v9 codes: ${acCodes.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await curricullm.chat.completions.create({
    model: "CurricuLLM-AU",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0]?.message?.content ?? "";
}
```

### Environment variables needed
```bash
CURRICULLM_API_KEY=your_key_here
# CURRICULLM_BASE_URL=https://api.curricullm.com/v1  # optional if hardcoded
```

### SDK compatibility
CurricuLLM is tested compatible with:
- `openai` npm package (any version supporting `baseURL` option)
- Python `openai` library
- Any OpenAI-compatible HTTP client

---

## Console & Tooling

| Tool | URL | Purpose |
|---|---|---|
| Developer Playground | https://console.curricullm.com/ | Interactive API testing, key management |
| API Key Management | https://console.curricullm.com/ (login) | Generate, rotate keys |
| Billing / Usage | https://console.curricullm.com/ (login) | Token usage analytics, invoice history |
| Public docs | https://curricullm.com/developers | Pricing, model list, overview |

---

## Quick Reference Card

```
Base URL:    https://api.curricullm.com/v1
Auth:        Authorization: Bearer <key>
Endpoint:    POST /v1/chat/completions
Model (AU):  CurricuLLM-AU
Model (VIC): CurricuLLM-AU-VIC
Model (WA):  CurricuLLM-AU-WA
Model (NZ):  CurricuLLM-NZ
Format:      OpenAI-compatible (drop-in replacement)
```

---

## Unknowns / To Investigate in Console

1. **Structured AC code field** — does the API support a `curriculum_context` or similar field, or is it prompt-only?
2. **Streaming** — does `/v1/chat/completions` support `stream: true`?
3. **Error codes** — what 4xx/5xx responses look like
4. **Rate limits** — TPM/RPM limits for the account tier
5. **Function calling / tools** — supported or not?
6. **Embeddings endpoint** — is `/v1/embeddings` available?
7. **Hackathon credits** — confirm whether EduX Oceania credits apply to this account

_To resolve: log into console.curricullm.com → Documentation section_
