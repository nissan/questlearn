# teacher-dashboard.feature
# QuestLearn — Teacher Dashboard BDD Scenarios
# Author: Firefly | Date: 2026-04-02
# Coverage: heatmap display, aggregated data only, no persistent student identity

Feature: Teacher heatmap dashboard

  Background:
    Given a teacher has opened the QuestLearn teacher dashboard
    And aggregated session data is available (in-memory or session-scoped store)

  # ─────────────────────────────────────────────
  # HAPPY PATH
  # ─────────────────────────────────────────────

  Scenario: Teacher views topic-format engagement heatmap
    When the teacher views the heatmap
    Then they see a grid of topics (rows) × formats (columns)
    And each cell shows an engagement count for that topic-format combination
    And the cells are colour-coded by intensity (low = pale, high = saturated)
    And no individual student names or IDs are visible anywhere on the page
    And the dashboard shows a total of "X sessions today" as an aggregate counter

  Scenario: Teacher filters heatmap by subject area
    Given the heatmap shows data across all subjects
    When the teacher selects "Mathematics" from the subject filter
    Then the heatmap updates to show only Mathematics topics
    And the engagement counts recalculate for the filtered view
    And the filter state is preserved if the teacher refreshes within the same session

  Scenario: Teacher sees a "top formats" summary card
    When the teacher scrolls below the heatmap
    Then they see a summary card showing the top 3 most-used formats today
    And each format entry shows a usage count and a percentage
    And the summary uses the same aggregated session data as the heatmap

  # ─────────────────────────────────────────────
  # EDGE CASES / ERROR STATES
  # ─────────────────────────────────────────────

  Scenario: Dashboard loads with zero session data (fresh demo start)
    Given no student sessions have been recorded yet
    When the teacher opens the dashboard
    Then the heatmap shows empty cells with a "No sessions yet — share the student link to begin" message
    And no error or broken layout is shown

  Scenario: Dashboard access requires no login for hackathon demo
    Given the teacher navigates directly to "/teacher" or "/dashboard"
    When the page loads
    Then the teacher dashboard is immediately visible without authentication
    And a note reads "Demo mode — aggregated data only, no student identities stored"
