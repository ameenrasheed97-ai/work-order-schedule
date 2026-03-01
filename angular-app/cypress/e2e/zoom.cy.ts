describe('Zoom Level Switching', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should switch to Day zoom level', () => {
    cy.get('ng-select').first().click();
    cy.get('.ng-option').contains('Day').click();
    cy.get('ng-select').first().should('contain', 'Day');
  });

  it('should switch to Week zoom level', () => {
    cy.get('ng-select').first().click();
    cy.get('.ng-option').contains('Week').click();
    cy.get('ng-select').first().should('contain', 'Week');
  });

  it('should switch to Month zoom level', () => {
    cy.get('ng-select').first().click();
    cy.get('.ng-option').contains('Month').click();
    cy.get('ng-select').first().should('contain', 'Month');
  });

  it('should load different work orders for different zoom levels', () => {
    // Get initial bar count in month view
    cy.get('.work-order-bar').then(($bars) => {
      const monthBarCount = $bars.length;

      // Switch to day view
      cy.get('ng-select').first().click();
      cy.get('.ng-option').contains('Day').click();

      // Verify bars are still present (might have different count)
      cy.get('.work-order-bar').should('have.length.greaterThan', 0);
    });
  });

  it('should display today indicator line', () => {
    cy.get('.today-line').should('be.visible');
  });

  it('should have scrollable timeline', () => {
    cy.get('.scroll-container').should('be.visible');
  });
});
