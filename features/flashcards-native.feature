# Feature: Native Flashcards (Student-Facing)
# BDD spec for QuestLearn native flashcards.

Feature: Native Flashcards learning flow

  As a student
  I want to practice retrieval with flashcards
  So that I can build confidence and identify weak spots

  Background:
    Given I open "/mini/flashcards?topic=Photosynthesis"

  Scenario: Flashcard loads and can be flipped
    Then I see a flashcard question
    And I see hint text "Tap to reveal answer"
    When I flip the card
    Then I see the answer side
    And confidence rating options are visible

  Scenario: AI feedback requires explanation text
    Given the card answer side is visible
    Then "Get AI Feedback" is disabled when explanation is empty
    When I enter an explanation and submit
    Then AI feedback is shown

  Scenario: Completing cards shows completion state
    Given I have completed all cards with confidence ratings
    Then I see "Session Complete!"
    And I can restart the session
