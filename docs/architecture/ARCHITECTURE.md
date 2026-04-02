# QuestLearn — Architecture

_Cambridge EduX Hackathon 2026 · Challenge 2: AI-Incorporated Active Learning_

---

## System Overview

```mermaid
graph TB
    subgraph Student["👨‍🎓 Student Experience"]
        S1[Pick Topic] --> S2[Choose Format]
        S2 --> S3[View Generated Content]
        S3 --> S4[Answer / Respond]
        S4 --> S5[Socratic Follow-up]
        S5 --> S4
    end

    subgraph Teacher["👩‍🏫 Teacher Dashboard"]
        T1[Class Heatmap]
        T2[Topic Engagement]
        T3[Format Preferences]
    end

    subgraph App["⚡ QuestLearn App (Next.js 14)"]
        A1[Format Selector UI]
        A2[Content Display]
        A3[Chat / Socratic UI]
        A4[Session Store]
        A5[Teacher API]
    end

    subgraph AI["🤖 AI Layer (CurricuLLM-AU)"]
        C1[Content Generation]
        C2[Socratic Loop]
        C3[Answer Evaluation]
        C4[Teacher Insight]
    end

    subgraph Curriculum["📚 Curriculum"]
        CU1[Australian Curriculum v9]
        CU2[Subject Alignment]
        CU3[Year Level Context]
    end

    S1 --> A1
    S2 --> A1
    A1 --> C1
    C1 --> CU1
    CU1 --> C1
    C1 --> A2
    A2 --> S3
    S4 --> A3
    A3 --> C2
    C2 --> C3
    C3 --> A3
    A3 --> S5
    A4 --> A5
    A5 --> T1
    A5 --> T2
    A5 --> T3
    C4 --> A5
```

---

## Content Generation Flow

```mermaid
sequenceDiagram
    participant Student
    participant App as QuestLearn App
    participant CLLM as CurricuLLM-AU API
    participant Session as Session Store

    Student->>App: "Photosynthesis" + Meme format
    App->>CLLM: POST /v1/chat/completions<br/>(system: meme tutor prompt + AC v9 tokens)<br/>(user: topic + year level)
    CLLM-->>App: Meme content (image description + caption + explanation)
    App->>Student: Display meme content
    App->>Session: Store topic + format + timestamp

    Student->>App: Student responds / answers
    App->>CLLM: POST /v1/chat/completions<br/>(system: Socratic loop prompt)<br/>(messages: conversation history)
    CLLM-->>App: Socratic follow-up question
    App->>Student: Display question (never give answer directly)
    App->>Session: Update engagement data
```

---

## Teacher Dashboard Data Flow

```mermaid
flowchart LR
    subgraph Sessions["In-Memory Session Store"]
        SE1[Student A: Photosynthesis / Meme / 3 turns]
        SE2[Student B: Quadratics / Game / 5 turns]
        SE3[Student C: Photosynthesis / Story / 2 turns]
    end

    subgraph Aggregation["Aggregation Layer"]
        AG1[Topic frequency map]
        AG2[Format preference map]
        AG3[Engagement depth per topic]
    end

    subgraph Dashboard["Teacher Dashboard"]
        D1[🗺️ Class Heatmap<br/>Topic × Engagement]
        D2[📊 Format Distribution<br/>Which formats are used most]
        D3[⚠️ Flagged Topics<br/>Low engagement areas]
    end

    Sessions --> Aggregation
    Aggregation --> Dashboard
```

---

## Format → Laurillard Learning Type Mapping

```mermaid
graph LR
    subgraph Formats["QuestLearn Formats"]
        F1[🎮 Game]
        F2[📖 Story]
        F3[😂 Meme]
        F4[🧩 Puzzle]
        F5[🎬 Short Film]
    end

    subgraph Laurillard["Laurillard's Conversational Framework"]
        L1[Practice — apply knowledge in context]
        L2[Acquisition — absorb new concepts]
        L3[Production — create to demonstrate understanding]
        L4[Investigation — explore and discover]
        L5[Discussion — reflect and dialogue]
    end

    F1 --> L1
    F2 --> L2
    F3 --> L3
    F4 --> L4
    F5 --> L5
```

---

## Equity Architecture

```mermaid
graph TB
    subgraph Urban["🏙️ Urban Student (Sydney)"]
        U1[Device ✅]
        U2[Internet ✅]
        U3[Engaged teacher ✅]
        U4[Peer network ✅]
    end

    subgraph Remote["🌾 Remote Student (Bourke / Community)"]
        R1[Device ✅ if available]
        R2[Internet ⚠️ limited]
        R3[High teacher turnover ❌]
        R4[Small peer network ❌]
    end

    subgraph QuestLearn["QuestLearn equalises"]
        Q1[Same AI quality — no teacher dependency]
        Q2[Same curriculum alignment — CurricuLLM-AU]
        Q3[Same format choice — student agency]
        Q4[Cross-community Quest Rooms — Phase 2]
        Q5[Offline mode — Phase 2]
    end

    U1 --> Q1
    R1 --> Q1
    R3 --> Q1
    R4 --> Q4
    R2 --> Q5
```

---

## Tech Stack

```mermaid
graph LR
    subgraph Frontend["Frontend"]
        FE1[Next.js 14]
        FE2[Tailwind CSS]
        FE3[React components]
    end

    subgraph Backend["Backend / API"]
        BE1[Next.js API Routes]
        BE2[In-memory session store]
        BE3[Aggregation engine]
    end

    subgraph AI["AI"]
        AI1[CurricuLLM-AU<br/>OpenAI-compatible API]
        AI2[Australian Curriculum v9<br/>auto-injected tokens]
    end

    subgraph Deploy["Deploy"]
        D1[Vercel]
    end

    Frontend --> Backend
    Backend --> AI
    Frontend --> Deploy
    Backend --> Deploy
```
