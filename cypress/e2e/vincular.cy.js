describe('ORION - Vincular Tarjeta', () => {
  beforeEach(() => {
    cy.loginVacio(); // usuario sin tarjetas, para poder vincular
    cy.visit('http://localhost:8081/vincular');
    cy.contains('Tipo de tarjeta').should('be.visible');
  });

  it('TC-24: el botón está deshabilitado sin datos completos', () => {
    // Sin tipo ni número: no debe poder vincular
    cy.contains('Vincular tarjeta').parent().should('have.attr', 'aria-disabled', 'true');
  });

  it('TC-24: el preview se actualiza al escribir y cambia según el tipo', () => {
    cy.contains('Metro + MetroBus').click();
    cy.contains('Ciudad de Panamá').should('be.visible');
    cy.get('input[placeholder="0000 0000"]').type('0987');
    // El preview muestra los dígitos escritos
    cy.contains('0987').should('be.visible');
  });

  it('TC-25: muestra error con un número no registrado', () => {
    cy.contains('RapiPass').click();
    cy.get('input[placeholder="0000 0000"]').type('99999999');
    cy.contains('Vincular tarjeta').click();
    cy.contains('no está registrado', { timeout: 15000 }).should('be.visible');
    cy.url().should('include', '/vincular'); // no redirige
  });

  it('TC-23: vincula correctamente una tarjeta válida', () => {
    // 12345678 es rapipass y no está vinculada al usuario vacío
    cy.contains('RapiPass').click();
    cy.get('input[placeholder="0000 0000"]').type('12345678');
    cy.contains('Vincular tarjeta').click();
    cy.contains('vinculada correctamente', { timeout: 15000 }).should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/tarjetas');
  });
});