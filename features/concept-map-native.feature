# Feature: Native Concept Map (Student-Facing)
# BDD spec for the in-app native Concept Map experience used in QuestLearn demo flows.
# Author: Loki — 2026-04-07

Feature: Native Concept Map learning flow

  As a student
  I want to build and evaluate a concept map step by step
  So that I can make relationships explicit and improve my understanding

  Background:
    Given I open the standalone concept map route for topic "Photosynthesis"
    And starter concept nodes are visible on the canvas

  Scenario: Connect and Evaluate are gated before meaningful input
    Then the "Connect" button is disabled until I select a concept node
    And the "Evaluate Map" button is disabled until at least one connection is added

  Scenario: Selecting a node enables connect mode
    When I select a concept node on the canvas
    Then the "Connect" button becomes enabled
    And the toolbar shows which node is currently selected

  Scenario: Student can connect two nodes and add a relationship label
    Given I selected a source concept node
    When I click "Connect"
    And I click a target concept node
    Then a relationship input appears
    And the relationship field is prefilled with "related to"
    When I confirm the connection
    Then the map shows at least 1 connection
    And "Evaluate Map" becomes enabled

  Scenario: Evaluate map returns feedback after at least one connection
    Given the map has at least one saved connection
    When I click "Evaluate Map"
    Then I see a "Map Evaluation" feedback panel

  Scenario: Selection is stable during connect flow
    Given I selected a concept node
    When I click empty canvas space
    Then the selected node remains selected until I clear selection explicitly
