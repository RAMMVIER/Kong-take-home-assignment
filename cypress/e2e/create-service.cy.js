/// <reference types="cypress" />

describe("Kong Gateway - Create Service Flow", () => {
  const KONG_ADMIN_URL = "http://localhost:8002";
  const SERVICE_URL = "/default/services";
  const SERVICE_NAME = "test-service-ipinfo";
  const ROUTE_URL = "/default/routes";
  const ROUTE_NAME = "test-route-ip";

  beforeEach(() => {
    // Visit Kong Admin UI and navigate to Services section
    cy.visit(KONG_ADMIN_URL + SERVICE_URL);
    cy.url().should("include", "/services");
  });

  it("should create a new service from scratch using the UI", () => {
    // Click new gateway service button and assert url
    cy.contains("New gateway service").click();
    cy.url().should("include", "/create");

    // Set service URL
    cy.get('input[placeholder*="https://api.kong-air.com"]')
      .clear()
      .type("https://ipinfo.io", { delay: 100 });

    // Set service name
    cy.contains("label", "Name")
      .parent()
      .find("input")
      .clear()
      .type(SERVICE_NAME, { delay: 100 });

    // Save the service
    cy.contains("button", "Save").click();
    // assert service is created and visible in the list
    cy.contains(SERVICE_NAME, { timeout: 5000 }).should("be.visible");
  });

  describe("Create route for the created service", () => {
    before(() => {
      if (!SERVICE_NAME) {
        throw new Error(
          "Please run the create-service.cy.js test first to create a service.",
        );
      }
    });

    beforeEach(() => {
      // Visit Kong Admin UI and navigate to Routes section
      cy.visit(KONG_ADMIN_URL + ROUTE_URL);
      cy.url().should("include", "/routes");
    });

    it("should create a new route for existing service", () => {
      // Click new route button and assert url
      cy.contains("New route").click({ timeout: 2000 });
      cy.url().should("include", "/create");

      // Set route name
      cy.contains("label", "Name")
        .parent()
        .find("input")
        .scrollIntoView()
        .should("be.visible")
        .clear()
        .type(ROUTE_NAME, { delay: 100 });

      // Select associated service
      cy.contains("label", "Service")
        .parent()
        .get("input[placeholder*='Select a service']")
        .click();
      cy.get('span.select-item-label')
        .contains(SERVICE_NAME)
        .should("be.visible")
        .click();

      // Set route path
      cy.contains("label", "Path")
        .parent()
        .find("input")
        .scrollIntoView()
        .should("be.visible")
        .clear()
        .type("/ip", { delay: 100 });

      // Set method
      cy.contains("label", "Methods")
        .parent()
        .find("div.expanded-selection-empty")
        .click();
      cy.get("span.multiselect-item-label")
        .contains("GET")
        .should("be.visible")
        .click();
      cy.get("body").click(0, 0); // click outside to close dropdown

      // Set host
      cy.contains("label", "Host")
        .parent()
        .find("input")
        .scrollIntoView()
        .should("be.visible")
        .clear()
        .type("localhost", { delay: 100 });

      // Click Save
      cy.contains("button", "Save").click();

      // Assert route is created and visible
      cy.contains(ROUTE_NAME, { timeout: 2000 }).should("be.visible");
    });
  });

  after(() => {
    // Cleanup: Delete the created service via API call
    cy.request({
      method: 'DELETE',
      url: `http://localhost:8001/services/${SERVICE_NAME}`,
      failOnStatusCode: false,
    });
    cy.request({
      method: 'DELETE',
      url: `http://localhost:8001/routes/${ROUTE_NAME}`,
      failOnStatusCode: false,
    });
  });
});
