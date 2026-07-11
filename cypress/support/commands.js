// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// Usuario CON datos: 2 tarjetas vinculadas + recargas
Cypress.Commands.add('loginConDatos', () => {
  cy.visit('http://localhost:8081');
  cy.get('input[placeholder="usuario@email.com"]').type('test2@orion.com');
  cy.get('input[placeholder="••••••••"]').type('Test1234!');
  cy.contains('Iniciar sesión').click();
  cy.url({ timeout: 15000 }).should('include', '/saldo');
});

// Usuario VACÍO: sin tarjetas ni recargas
Cypress.Commands.add('loginVacio', () => {
  cy.visit('http://localhost:8081');
  cy.get('input[placeholder="usuario@email.com"]').type('test@orion.com');
  cy.get('input[placeholder="••••••••"]').type('Test1234!');
  cy.contains('Iniciar sesión').click();
  cy.url({ timeout: 15000 }).should('include', '/saldo');
});