describe('ORION - Vincular Tarjeta', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('http://localhost:8081/vincular');
    cy.contains('Tipo de tarjeta').should('be.visible');
  });

  // TC-24: Botón deshabilitado sin datos completos
  it('TC-24: botón deshabilitado hasta completar los datos', () => {
    cy.contains('Vincular tarjeta').should('have.attr', 'aria-disabled', 'true')
      .or('be.disabled');
  });

  // TC-24b: El preview cambia al seleccionar tipo
  it('TC-24: muestra el tipo seleccionado en el preview', () => {
    cy.contains('Metro + MetroBus').click();
    cy.contains('Ciudad de Panamá').should('be.visible');
  });

  // TC-25: Tarjeta no registrada muestra error
  it('TC-25: muestra error con número no registrado', () => {
    cy.contains('Metro + MetroBus').click();
    cy.get('input[placeholder="0000 0000"]').type('9999999999');
    cy.contains('Vincular tarjeta').click();
    cy.contains('no está registrado', { timeout: 10000 }).should('be.visible');
  });
});