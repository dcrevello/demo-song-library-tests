Song Library UI Test Suite

This repository contains an automated end-to-end UI test suite for the [Song Library web application](https://shuxincolorado.github.io/song-list2/dist/song-list2/), using [Cypress](https://www.cypress.io/) as the testing framework and [Mochawesome](https://github.com/adamgruber/mochawesome) for generating detailed test reports.
Most of the current relevant work is in e23/song-library-ui.cy.js and e2e/songs-crud.cy.js, though there are many supporting functions in support/utils.js.

---

## Project Structure

cypress/
├── e2e/ # Main test specs
│ ├── filter-sort.cy.js
│ ├── song-library-ui.cy.js
│ └── songs-crud.cy.js
├── support/
│ ├── commands.js # Custom Cypress commands
│ ├── utils.js # Reusable helper functions - Several functions used by song-library-ui.cy.js and songs-crud.cy.js
│ ├── viewports.js # Preset viewport definitions
│ └── e2e.js # Support file auto-loaded before test files
├── fixtures/ # (Optional) Test data

---

## Getting Started

### Install Dependencies

```bash
npm install
```

Run the Tests
```bash
npm run test
```
This runs all Cypress specs in headless mode.

View the Report
After tests run, generate and open the report:
```bash
npm run report
```
This merges individual test results and opens the full HTML report via Mochawesome.

Tech Stack
Cypress: UI Testing Framework
Mocha: Test runner used by Cypress
Mochawesome: Rich HTML reports
Node.js: Project runtime

About the Tests
Tests include:
UI layout validations (desktop, tablet, mobile)
Table sorting and filtering (not started)
CRUD operations (Add, Edit, Delete songs)
Field-level validation and alert messaging

Each test case is modeled after a corresponding manual test to ensure full coverage.

Author
Damian Crevello

Repository
Feel free to browse or clone this repo:
https://github.com/dcrevello/demo-song-library-tests

Notes
The app resets between runs (no real backend), so CRUD tests are safe to rerun.
Test code is modularized with helper functions and custom commands.
Mochawesome reports are generated in /cypress/reports.
