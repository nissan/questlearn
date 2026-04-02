# content-generation.feature
# QuestLearn — CurricuLLM Content Generation BDD Scenarios
# Author: Firefly | Date: 2026-04-02
# Coverage: all 5 formats, Socratic loop, error/timeout states

Feature: CurricuLLM-powered content generation

  Background:
    Given the backend has a valid CurricuLLM API key configured
    And the model "CurricuLLM-AU" is used for all calls

  # ─────────────────────────────────────────────
  # HAPPY PATH — ALL 5 FORMATS
  # ─────────────────────────────────────────────

  Scenario Outline: Content is generated in the correct format for a given topic
    Given a student has provided topic "<topic>" and year level "<year>"
    When the student selects the "<format>" learning format
    Then the backend calls CurricuLLM with the system prompt for "<format>"
    And the response is tagged with the format identifier
    And the content references at least one AC v9 outcome descriptor
    And the content is returned to the frontend within 15 seconds

    Examples:
      | topic             | year    | format     |
      | photosynthesis    | Year 9  | Game       |
      | Newton's laws     | Year 8  | Story      |
      | fractions         | Year 8  | Meme       |
      | ecosystems        | Year 10 | Puzzle     |
      | plate tectonics   | Year 10 | Short Film |

  Scenario: Socratic follow-up is generated after student response
    Given a content card has been displayed to the student
    And the student has submitted a response "I think the plant makes food using sunlight"
    When the Socratic follow-up endpoint is called
    Then CurricuLLM receives the conversation history (system prompt + content + student reply)
    And the response contains a follow-up question that probes understanding
    And the response does NOT contain a direct answer or the phrase "The answer is"
    And the response includes an encouragement prefix

  # ─────────────────────────────────────────────
  # ERROR STATES
  # ─────────────────────────────────────────────

  Scenario: CurricuLLM API returns an error (5xx or timeout)
    Given the CurricuLLM API is unavailable or returns a 500 error
    When a content generation request is made
    Then the frontend shows a friendly error: "Couldn't generate content right now — tap to try again"
    And the error is logged server-side with the topic and format
    And the student is NOT shown a raw error message or stack trace

  Scenario: CurricuLLM credits are exhausted mid-demo
    Given the CurricuLLM API returns a 429 or quota-exceeded error
    When a content generation request is made
    Then the backend falls back to a pre-generated static content card for that topic-format pair
    And the fallback card is marked "[Demo content]" in the UI in small print
    And the Socratic loop continues normally using the fallback content

  Scenario: Student submits an off-topic or inappropriate message in the Socratic loop
    Given the Socratic loop is active for topic "photosynthesis"
    When the student sends a message unrelated to the topic (e.g. "what is 2+2")
    Then CurricuLLM's K-12 content filter handles the response safely
    And the app gently redirects: "Let's keep exploring photosynthesis — what did you think of the last question?"
    And no inappropriate content is returned
