# Feature: Native Debate (Student-Facing)
# BDD spec for QuestLearn native debate mode.

Feature: Native Debate learning flow

  As a student
  I want to debate an AI opponent in rounds
  So that I can strengthen reasoning under challenge

  Background:
    Given I open "/mini/debate?topic=Photosynthesis"

  Scenario: Motion appears and student can pick a side
    Then I see "Debate Challenge"
    And I see a debate motion
    When I choose FOR or AGAINST
    Then the debate starts

  Scenario: Submitting an argument advances rounds
    Given a debate is in progress
    When I submit my round argument
    Then I receive an AI counter argument
    And the round indicator advances until final verdict

  Scenario: Start failure shows graceful error
    Given debate start API fails
    When I choose FOR or AGAINST
    Then I see a friendly start error message
