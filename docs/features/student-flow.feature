# student-flow.feature
# QuestLearn — Student Journey BDD Scenarios
# Author: Firefly | Date: 2026-04-02
# Coverage: topic selection → format selection → content display → Socratic loop

Feature: Student learning journey through QuestLearn

  Background:
    Given a student is on the QuestLearn home screen
    And the CurricuLLM API is available

  # ─────────────────────────────────────────────
  # HAPPY PATH
  # ─────────────────────────────────────────────

  Scenario: Student completes a full learning session using the Story format
    Given the student types "photosynthesis" in the topic input field
    And the student selects year level "Year 9"
    When the student taps "Let's Go"
    Then the student sees the format selector screen with 5 format tiles
      | Format     |
      | Game       |
      | Story      |
      | Meme       |
      | Puzzle     |
      | Short Film |
    When the student taps "Story"
    Then the app shows a loading state with message "Crafting your story…"
    And within 10 seconds a story-format response appears in the content pane
    And the content references Australian Curriculum v9 Science outcomes
    And a Socratic prompt appears below the story asking "What do you think happens when a plant gets no sunlight?"
    When the student types a response and submits
    Then the AI responds with a follow-up question without revealing the direct answer
    And the response includes an encouragement phrase

  Scenario: Student picks Meme format and receives an image-based learning response
    Given the student types "Newton's first law" in the topic input
    And the student selects year level "Year 8"
    When the student selects the "Meme" format
    Then the app renders a meme-style card with a relatable caption and an explanation panel
    And a Socratic follow-up prompt asks the student to relate the law to a real-life example
    And there is no score, grade, or fail indicator anywhere on the screen

  Scenario: Student selects Puzzle format and interacts with a fill-in-the-blank challenge
    Given the student types "fractions" in the topic input
    And the student selects year level "Year 8"
    When the student selects the "Puzzle" format
    Then the content pane shows a fill-in-the-blank or matching puzzle
    And the puzzle elements map to AC v9 Mathematics outcomes
    When the student submits an incorrect answer
    Then the app shows an encouragement message and a hint
    And the app does NOT show a red "Wrong!" indicator or deduct points
    And the Socratic loop asks "What operation do you think links these two fractions?"

  # ─────────────────────────────────────────────
  # EDGE CASES
  # ─────────────────────────────────────────────

  Scenario: Student enters a topic that is ambiguous or multi-subject
    Given the student types "electricity" in the topic input
    And the student selects year level "Year 10"
    When the student taps "Let's Go"
    Then the app presents an optional subject-area clarifier
      | Subject Area    |
      | Science         |
      | Mathematics     |
      | Technology      |
    When the student selects "Science"
    Then format selection proceeds normally using the Science context

  Scenario: Student submits a blank topic and attempts to continue
    Given the student leaves the topic input empty
    When the student taps "Let's Go"
    Then the app shows an inline validation message "What are you stuck on? Type a topic to begin."
    And the student is NOT navigated away from the home screen
    And no API call is made
