/// <reference types="cypress" />

describe('Kong Gateway - Create Service Flow', () => {
  const KONG_ADMIN_URL = 'http://localhost:8002';
  const SERVICE_URL = '/default/services';
  const SERVICE_NAME = `test-service-${Date.now()}`;

  beforeEach(() => {
    // Visit Kong Admin UI and navigate to Services section
    cy.visit(KONG_ADMIN_URL + SERVICE_URL);
    cy.url().should('include', '/services');
  });

  it('should create a new service from scratch using the UI', () => {
    // Click new gateway service button and assert url
    cy.contains('New gateway service').click();
    cy.url().should('include', '/create');

    // Set service URL
    cy.get('input[placeholder*="https://api.kong-air.com"]')
      .clear()
      .type('https://ipinfo.io');
    
    // Set service name
    cy.contains('label', 'Name')
      .parent()
      .find('input')
      .clear()
      .type(SERVICE_NAME);

    // Save the service
    cy.contains('button', 'Save').click();
    // assert service is created and visible in the list
    cy.contains(SERVICE_NAME, { timeout : 5000 }).should('be.visible');
  });

  after(() => {
  // Cleanup: Delete the created service via API call
  //   cy.request({
  //     method: 'DELETE',
  //     url: `http://localhost:8001/services/${SERVICE_NAME}`,
  //     failOnStatusCode: false
  // });
  });
});