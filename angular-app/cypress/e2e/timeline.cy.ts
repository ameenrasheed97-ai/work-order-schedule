describe('Timeline Component - E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the application with timeline visible', () => {
    cy.get('app-timeline').should('be.visible');
    cy.get('.wc-name').should('have.length.greaterThan', 0);
  });

  it('should display all work centers', () => {
    cy.get('.wc-name').should('contain', 'Extrusion Line A');
    cy.get('.wc-name').should('contain', 'CNC Machine 1');
    cy.get('.wc-name').should('contain', 'Assembly Station');
  });

  it('should display work order bars on timeline', () => {
    cy.get('.work-order-bar').should('have.length.greaterThan', 0);
  });

  it('should show three-dot menu on bar hover', () => {
    cy.get('.work-order-bar').first().trigger('mouseenter');
    cy.get('.actions-menu').first().should('be.visible');
  });

  it('should have visible actions menu on bar', () => {
    cy.get('.work-order-bar').first().trigger('mouseenter');
    cy.get('.actions-btn').first().should('be.visible');
  });
});
