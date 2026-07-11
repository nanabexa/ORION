describe('ORION - Mis Tarjetas', () => {

  it('TC-21: lista las tarjetas con número, tipo y saldo', () => {
    cy.loginConDatos();
    cy.visit('http://localhost:8081/tarjetas');
    cy.contains('MIS TARJETAS').should('be.visible');
    cy.contains('0987654321').should('be.visible');
    cy.contains('32182913').should('be.visible');
    cy.contains('Metro + MetroBus').should('be.visible');
    cy.contains('RapiPass').should('be.visible');
    cy.contains('Saldo: B/.').should('be.visible');
    cy.contains('+ Agregar otra tarjeta').should('be.visible');
  });

  it('TC-22: muestra estado vacío y navega a vincular', () => {
    cy.loginVacio();
    cy.visit('http://localhost:8081/tarjetas');
    cy.contains('Sin tarjetas vinculadas').should('be.visible');
    cy.contains('Vincular tarjeta').click();
    cy.url({ timeout: 10000 }).should('include', '/vincular');
  });
});