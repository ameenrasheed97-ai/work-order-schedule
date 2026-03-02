// Custom Cypress commands for the application

// Command to get all work order bars
Cypress.Commands.add('getWorkOrderBars', () => {
  return cy.get('.work-order-bar');
});

// Command to select a zoom level
Cypress.Commands.add('selectZoomLevel', (level: string) => {
  cy.get('ng-select').contains(level).click();
});

// Command to click a timeline area to create work order
Cypress.Commands.add('clickTimelineArea', (workCenterId: string, offsetDays: number) => {
  cy.get(`[data-work-center-id="${workCenterId}"]`).click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      getWorkOrderBars(): Chainable<JQuery<HTMLElement>>;
      selectZoomLevel(level: string): Chainable<void>;
      clickTimelineArea(workCenterId: string, offsetDays: number): Chainable<void>;
    }
  }
}
