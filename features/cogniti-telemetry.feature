# Feature: Cogniti Telemetry in Teacher Heatmap
# BDD spec for surfacing Cogniti flashcard engagement data on the teacher dashboard.
# Author: Firefly — 2026-04-04

Feature: Cogniti Engagement Panel on Teacher Dashboard

  As a teacher on QuestLearn
  I want to see Cogniti flashcard engagement data below the existing heatmap
  So that I can identify which topics students are struggling with or excelling at

  Background:
    Given I am a logged-in teacher
    And I am on the teacher dashboard page (/teacher)
    And the Cogniti telemetry API is reachable

  # ─────────────────────────────────────────────
  # Scenario group 1: Panel visibility
  # ─────────────────────────────────────────────

  Scenario: Cogniti Engagement section appears below the activity heatmap
    When the teacher dashboard finishes loading
    Then I see the heading "Cogniti Engagement"
    And it appears below the existing "Activity Heatmap" section
    And it contains three sub-panels:
      | panel                  |
      | Top Topics             |
      | Avg Confidence Rating  |
      | Answer Accuracy Signal |

  Scenario: Data loads automatically on page load — no manual refresh needed
    When I navigate to /teacher
    Then the Cogniti Engagement section displays data within 3 seconds
    And no "Refresh" button is required

  # ─────────────────────────────────────────────
  # Scenario group 2: /api/cogniti/telemetry route
  # ─────────────────────────────────────────────

  Scenario: GET /api/cogniti/telemetry returns aggregated data
    When a GET request is made to /api/cogniti/telemetry
    Then the response status is 200
    And the response body contains:
      | field              | type    | description                                    |
      | topTopics          | array   | [{topic, cardFlips, sessions}] sorted by flips |
      | avgConfidence      | array   | [{topic, avgRating}]                           |
      | answerAccuracy     | array   | [{topic, correctCount, totalCount, pct}]       |
    And the response includes a "fetchedAt" ISO 8601 timestamp

  Scenario: API route fetches data from Cogniti telemetry endpoint
    Given the Cogniti API token is present in environment variables
    When /api/cogniti/telemetry is called
    Then it calls GET https://app.cogniti.ai/api/v1/interactives/{miniAppId}/telemetry/
    And it uses the Authorization header with the Cogniti API token
    And it aggregates the raw telemetry events into the summary shape

  Scenario: API route returns 503 when Cogniti is unreachable
    Given the Cogniti API is unavailable
    When a GET request is made to /api/cogniti/telemetry
    Then the response status is 503
    And the response body contains the field "error" with value "Cogniti API unavailable"

  Scenario: API route is authenticated — rejects unauthenticated requests
    Given I am not logged in
    When a GET request is made to /api/cogniti/telemetry
    Then the response status is 401

  # ─────────────────────────────────────────────
  # Scenario group 3: Top Topics panel
  # ─────────────────────────────────────────────

  Scenario: Top Topics panel shows topics ranked by card flips
    Given the telemetry API returns data with topics: Photosynthesis (42 flips), Gravity (18 flips), DNA (35 flips)
    When I view the "Top Topics" panel
    Then topics are listed in descending order: Photosynthesis, DNA, Gravity
    And each row shows the topic name and its card flip count

  Scenario: Top Topics panel shows at most 10 topics
    Given the telemetry API returns data with 25 topics
    When I view the "Top Topics" panel
    Then at most 10 topics are displayed
    And there is no pagination (static snapshot is fine)

  Scenario: Top Topics panel shows empty state when no data
    Given the telemetry API returns an empty topTopics array
    When I view the "Top Topics" panel
    Then I see the message "No flashcard activity yet"

  # ─────────────────────────────────────────────
  # Scenario group 4: Avg Confidence Rating panel
  # ─────────────────────────────────────────────

  Scenario: Avg Confidence panel shows per-topic confidence averages
    Given the telemetry API returns avgConfidence data
    When I view the "Avg Confidence Rating" panel
    Then each topic row shows:
      | field     | example |
      | topic     | Gravity |
      | avgRating | 2.3     |
    And confidence values are displayed to one decimal place

  Scenario: Avg Confidence panel uses a colour scale for visual cue
    When I view the "Avg Confidence Rating" panel
    Then topics with avgRating < 1.7 have a red indicator
    And topics with avgRating between 1.7 and 2.4 have a yellow indicator
    And topics with avgRating >= 2.4 have a green indicator

  # ─────────────────────────────────────────────
  # Scenario group 5: Answer Accuracy Signal panel
  # ─────────────────────────────────────────────

  Scenario: Answer Accuracy panel shows correct-answer percentage per topic
    Given the telemetry API returns answerAccuracy data
    When I view the "Answer Accuracy Signal" panel
    Then each row shows topic name, number of submissions, and accuracy percentage
    And rows are sorted by accuracy ascending (lowest accuracy first — needs most attention)

  Scenario: Answer Accuracy panel shows a warning for topics below 50% accuracy
    Given a topic has an accuracy of 38%
    When I view the "Answer Accuracy Signal" panel
    Then that topic row has a ⚠️ warning icon

  # ─────────────────────────────────────────────
  # Scenario group 6: Playwright smoke tests
  # ─────────────────────────────────────────────

  Scenario: [Smoke] Student navigates to learn page, selects topic, switches to Flashcards tab
    Given Playwright mocks the Cogniti mini app iframe (stub URL)
    And Playwright mocks GET /api/cogniti/telemetry with fixture data
    When the student navigates to /learn?topic=Photosynthesis&format=story
    And the student clicks the "Flashcards" tab
    Then the iframe element with title "Cogniti Flashcards" is visible in the DOM
    And the iframe src contains "topic=Photosynthesis"
    And no console errors related to Cogniti are emitted

  Scenario: [Smoke] Teacher views heatmap page with Cogniti Engagement section
    Given Playwright mocks GET /api/cogniti/telemetry with fixture:
      """json
      {
        "topTopics": [{"topic": "Photosynthesis", "cardFlips": 42, "sessions": 10}],
        "avgConfidence": [{"topic": "Photosynthesis", "avgRating": 2.1}],
        "answerAccuracy": [{"topic": "Photosynthesis", "correctCount": 8, "totalCount": 10, "pct": 80}],
        "fetchedAt": "2026-04-04T00:00:00.000Z"
      }
      """
    When the teacher navigates to /teacher
    Then the page contains the heading "Cogniti Engagement"
    And the text "Photosynthesis" appears in the Cogniti Engagement section
    And no real Cogniti API calls are made during the test

  Scenario: [Smoke] Cogniti telemetry mock does not pollute other teacher dashboard tests
    Given the Playwright mock for /api/cogniti/telemetry is scoped to the Cogniti Engagement test
    When a separate teacher dashboard test runs without that mock
    Then the test still passes (existing heatmap tests are unaffected)
