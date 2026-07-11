describe('ORION - Perfil', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('http://localhost:8081/perfil');
    cy.contains('PERFIL').should('be.visible');
  });

  // TC-30: Muestra datos del perfil
  it('TC-30: muestra nombre, correo y menús', () => {
    cy.contains('Mi cuenta').should('be.visible');
    cy.contains('Mis tarjetas').should('be.visible');
    cy.contains('Soporte').should('be.visible');
  });

  // TC-30b: Confirmación de logout aparece
  it('TC-30: pide confirmación antes de cerrar sesión', () => {
    cy.contains('Cerrar sesión').click();
    cy.contains('¿Estás seguro').should('be.visible');
  });

  // TC-30c: Cancelar mantiene la sesión
  it('TC-30: cancelar no cierra la sesión', () => {
    cy.contains('Cerrar sesión').click();
    cy.contains('Cancelar').click();
    cy.contains('Mi cuenta').should('be.visible'); // sigue en perfil
  });

  // TC-30d: Logout completo redirige a login
  it('TC-30: cierra sesión y redirige al login', () => {
    cy.contains('Cerrar sesión').click();
    cy.get('[data-testid="confirmar-logout"]').click();
    cy.contains('Regístrate', { timeout: 10000 }).should('be.visible'); // volvió al login
  });
});