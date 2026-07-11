describe('ORION - Saldo', () => {

  it('TC-16: redirige a Login si no hay sesión activa', () => {
    // Acceso directo a /saldo sin haber iniciado sesión
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('http://localhost:8081/saldo');
    // Debe expulsar al login (aparece el enlace de registro)
    cy.contains('Regístrate', { timeout: 10000 }).should('be.visible');
  });

  describe('con usuario que tiene tarjetas', () => {
    beforeEach(() => {
      cy.loginConDatos();
    });

    it('TC-17: muestra el saldo de la tarjeta y las últimas recargas', () => {
      cy.contains('Saldo disponible').should('be.visible');
      cy.contains('B/.').should('be.visible');
      cy.contains('Últimas recargas').should('be.visible');
    });

    it('TC-18: permite cambiar entre tarjetas con el selector', () => {
      // El usuario tiene 2 tarjetas -> aparece el selector
      cy.contains('0987654321').should('be.visible');
      cy.contains('32182913').should('be.visible');
      // Cambia a la segunda tarjeta
      cy.contains('32182913').click();
      cy.contains('Tarjeta 32182913').should('be.visible');
    });

    it('TC-20: navega a Recarga desde el botón', () => {
      // Espera a que el botón esté habilitado (no tenga aria-disabled)
      cy.contains('Recargar tarjeta')
        .parent()
        .should('not.have.attr', 'aria-disabled', 'true');
      
      cy.contains('Recargar tarjeta').click({ force: true });
      cy.url({ timeout: 15000 }).should('include', '/recarga');
    });
  });

  describe('con usuario sin tarjetas', () => {
    beforeEach(() => {
      cy.loginVacio();
    });

    it('TC-19: muestra estado vacío y botón para vincular', () => {
      cy.contains('Sin tarjeta').should('be.visible');
      cy.contains('Vincular tarjeta').should('be.visible');
    });
  });
});