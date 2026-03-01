describe('Work Order CRUD Operations', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display work order bars with actions menu', () => {
    cy.get('.work-order-bar').should('have.length.greaterThan', 0);
    
    // Hover to show menu
    cy.get('.work-order-bar').first().trigger('mouseenter');
    cy.get('.actions-menu').first().should('be.visible');
  });

  it('should open dropdown menu when clicking actions button', () => {
    // Hover to show menu
    cy.get('.work-order-bar').first().trigger('mouseenter');
    
    // Click the three-dot button
    cy.get('.actions-btn').first().click();
    
    // Dropdown should be open
    cy.get('.dropdown-menu.open').first().should('be.visible');
  });

  it('should display Edit and Delete options in dropdown', () => {
    // Hover to show menu
    cy.get('.work-order-bar').first().trigger('mouseenter');
    
    // Click the three-dot button
    cy.get('.actions-btn').first().click();
    
    // Check dropdown items exist
    cy.get('.dropdown-item').should('have.length.at.least', 2);
  });

  it('should display work order panel component', () => {
    // The panel component exists
    cy.get('app-work-order-panel').should('exist');
  });

  it('should have multiple work center rows', () => {
    cy.get('.left-row').should('have.length.greaterThan', 5);
  });
});
