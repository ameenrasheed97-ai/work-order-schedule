// Cypress component test support file
import '@cypress/angular';
import '../../src/styles.scss';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
