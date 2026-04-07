# Feature: Meme format learning flow (Student-Facing)
# BDD spec for meme format in QuestLearn learn experience.

Feature: Meme learning format

  As a student
  I want curriculum concepts rendered as meme-style content
  So that learning feels memorable and engaging

  Background:
    Given I open "/mini/meme?topic=Photosynthesis"

  Scenario: Meme content renders from generated meme response
    Then I see meme top and bottom text
    And the share meme action is available

  Scenario: Meme generation fallback still renders readable meme text
    Given meme-text API fails
    Then fallback top/bottom meme text is shown from generated content body

  Scenario: Malformed meme API response still degrades gracefully
    Given meme-text API returns success but missing top/bottom text
    Then fallback top/bottom meme text is shown from generated content body
    And share action remains usable
