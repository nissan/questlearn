# Feature: Cogniti Flashcard Mini App (Student-Facing)
# BDD spec for embedding the Cogniti interactive flashcard mini app within the QuestLearn learn page.
# Author: Firefly — 2026-04-04

Feature: Cogniti Flashcard Mini App

  As a student on QuestLearn
  I want to use an interactive AI-powered flashcard mode for any topic
  So that I can test my recall, rate my confidence, and get instant AI critique

  Background:
    Given I am a logged-in student
    And the Cogniti mini app is published and has a valid embed URL
    And I am on the learn page for the topic "Photosynthesis"

  # ─────────────────────────────────────────────
  # Scenario group 1: Format tab selection
  # ─────────────────────────────────────────────

  Scenario: Flashcards appears alongside the 5 existing activity formats
    When I view the activity format selector on the learn page
    Then I see format tabs: "Game", "Story", "Meme", "Puzzle", "Short Film", "Flashcards"
    And the "Flashcards" tab has a 🃏 icon

  Scenario: Selecting Flashcards loads the Cogniti iframe panel
    When I click the "Flashcards" tab
    Then the right-panel content area displays an iframe
    And the iframe src matches the Cogniti mini app embed URL
    And the iframe has the attribute title="Cogniti Flashcards"
    And a loading skeleton is shown until the iframe fires its onLoad event

  Scenario: Switching away from Flashcards hides the iframe
    Given I am viewing the Flashcards panel
    When I click the "Story" tab
    Then the Cogniti iframe is no longer visible
    And the standard LearnContent panel for "Story" is shown

  # ─────────────────────────────────────────────
  # Scenario group 2: Topic handoff to the mini app
  # ─────────────────────────────────────────────

  Scenario: Topic is passed to the mini app via URL parameter
    When I click the "Flashcards" tab for topic "Photosynthesis"
    Then the iframe src contains the query parameter "topic=Photosynthesis"

  Scenario: Topic is confirmed via postMessage handshake (fallback)
    Given the iframe has loaded
    When the mini app sends a postMessage with type "cogniti:ready"
    Then QuestLearn responds with a postMessage containing:
      | key   | value           |
      | type  | cogniti:context |
      | topic | Photosynthesis  |

  # ─────────────────────────────────────────────
  # Scenario group 3: In-app flashcard interactions (mini app behaviour)
  # ─────────────────────────────────────────────

  Scenario: Student flips a flashcard
    Given the mini app has loaded with topic "Photosynthesis"
    And a flashcard is showing the question side
    When the student clicks "Flip"
    Then the card animates to reveal the answer side
    And the mini app emits a telemetry event with type "card_flipped"
    And the event payload includes the field "topic" with value "Photosynthesis"
    And the event payload includes the field "card_id"

  Scenario: Student submits a written answer and receives AI critique
    Given the mini app has loaded with topic "Photosynthesis"
    And a flashcard is showing the question side
    When the student types "Plants use sunlight to convert CO2 and water into glucose" in the answer field
    And the student clicks "Check my answer"
    Then the mini app calls the Cogniti AI critique function
    And the AI critique response is displayed below the answer field
    And the mini app emits a telemetry event with type "answer_submitted"
    And the event payload includes the field "is_correct" with a boolean value

  Scenario: Student rates their confidence after seeing the answer
    Given the flashcard answer side is visible
    When the student clicks the confidence rating "2" (out of 3)
    Then the card is marked with confidence level 2
    And the mini app emits a telemetry event with type "confidence_rated"
    And the event payload includes the field "rating" with value 2
    And the event payload includes the field "card_id"
    And the mini app advances to the next flashcard

  Scenario: Confidence rating options are labelled clearly
    Given the flashcard answer side is visible
    Then I see confidence buttons labelled:
      | rating | label            |
      | 1      | Didn't know it   |
      | 2      | Almost got it    |
      | 3      | Nailed it        |

  # ─────────────────────────────────────────────
  # Scenario group 4: Telemetry emission
  # ─────────────────────────────────────────────

  Scenario: All telemetry events include a session identifier
    Given the student is actively using the flashcard mini app
    When any telemetry event is emitted (card_flipped, answer_submitted, confidence_rated)
    Then the event payload always includes the field "session_id"
    And the event payload always includes the field "timestamp" in ISO 8601 format
    And the event payload always includes the field "topic"

  Scenario: Telemetry is batched and flushed on session end
    Given the student has flipped 5 cards and rated confidence on each
    When the student navigates away from the Flashcards panel
    Then any unflushed telemetry events are flushed to the Cogniti telemetry endpoint
    And no events are lost

  # ─────────────────────────────────────────────
  # Scenario group 5: Error & edge cases
  # ─────────────────────────────────────────────

  Scenario: Mini app embed URL is missing — graceful degradation
    Given the environment variable NEXT_PUBLIC_COGNITI_MINIAPP_URL is not set
    When I click the "Flashcards" tab
    Then I see an inline message: "Flashcards are not available right now."
    And no broken iframe is rendered

  Scenario: Iframe fails to load — error state shown
    Given the Cogniti mini app iframe src returns a network error
    When the iframe fires its onError event
    Then the loading skeleton is replaced with: "Could not load flashcards. Please try again."
    And a "Retry" button is shown that reloads the iframe
