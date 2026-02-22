# Kong-take-home-assignment
Take home assignment for Kong

## Cypress Tests for Kong Gateway UI

This project includes Cypress end-to-end tests for Kong Gateway administration UI.

### Prerequisites

1. Docker and Docker Compose installed
2. Node.js and npm installed
3. Kong Gateway running locally via Docker Compose

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start Kong Gateway:
   ```bash
   docker-compose up -d
   ```

3. Wait for Kong to be ready (check http://localhost:8002)

### Running Tests

1. Open Cypress Test Runner (interactive mode):
   ```bash
   npx cypress open
   ```

2. Run tests in headless mode:
   ```bash
   npx cypress run --browser chrome
   ```

### Test Cases
#### Create Service

- `create-service.cy.js`: Tests the flow to create a new Service.

- `create-service.cy.js`: Create a route for the service created above
