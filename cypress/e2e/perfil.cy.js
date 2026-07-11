describe('ORION - Historial y Perfil', () => {

  it('TC-29: muestra el historial con resumen y badges', () => {
    cy.loginConDatos();
    cy.visit('http://localhost:8081/historial');
    cy.contains('HISTORIAL').should('be.visible');
    cy.contains('Recargas').should('be.visible');
    cy.contains('Total recargado').should('be.visible');
    cy.contains('Este mes').should('be.visible');
  });

  it('TC-30: muestra los datos del perfil y los menús', () => {
    cy.loginConDatos();
    cy.visit('http://localhost:8081/perfil');
    cy.contains('PERFIL').should('be.visible');
    cy.contains('test2@orion.com').should('be.visible');
    cy.contains('Mi cuenta').should('be.visible');
    cy.contains('Mis tarjetas').should('be.visible');
    cy.contains('Soporte').should('be.visible');
  });

  it('TC-30: pide confirmación antes de cerrar sesión', () => {
    cy.loginConDatos();
    cy.visit('http://localhost:8081/perfil');
    cy.contains('Cerrar sesión').click();
    cy.contains('¿Estás seguro').should('be.visible');
  });

  it('TC-30: cancelar mantiene la sesión activa', () => {
    cy.loginConDatos();
    cy.visit('http://localhost:8081/perfil');
    cy.contains('Cerrar sesión').click();
    cy.contains('Cancelar').click();
    cy.contains('Mi cuenta').should('be.visible');
  });

  it('TC-30: cierra sesión y redirige a Login', () => {
    cy.loginConDatos();
    cy.visit('http://localhost:8081/perfil');
    cy.contains('Cerrar sesión').click();
    cy.get('[data-testid="confirmar-logout"]').click();
    cy.contains('Regístrate', { timeout: 15000 }).should('be.visible');
  });
});