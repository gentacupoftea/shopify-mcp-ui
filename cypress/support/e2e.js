// ***********************************************************
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

// Import cypress-axe for accessibility testing
import 'cypress-axe';

// Add custom commands for accessibility testing
// Note: This has been moved to commands.js for better organization and error handling
// Use cy.checkA11y() there instead

// Command to wait for animations to complete
Cypress.Commands.add('waitForAnimations', () => {
  cy.wait(300); // Adjust timeout as needed
});

// Command for keyboard navigation testing
Cypress.Commands.add('pressKey', (key) => {
  cy.focused().type(`{${key}}`);
});

// Import commands.js using ES2015 syntax:
import './commands';