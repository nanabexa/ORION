describe('ORION - Recarga', () => {
  beforeEach(() => {
    cy.loginConDatos();
    cy.visit('http://localhost:8081/recarga');
    cy.contains('NUEVA RECARGA').should('be.visible');
  });

  it('TC-27: el botón está deshabilitado con monto 0', () => {
    cy.contains('Confirmar recarga').parent().should('have.attr', 'aria-disabled', 'true');
  });

  it('TC-27: muestra error al superar el límite máximo', () => {
    // El input cuenta centavos: 6000 = B/. 60.00 (supera el máximo de 50)
    cy.get('input[placeholder="0.00"]').clear().type('6000');
    cy.contains('Límite máximo').should('be.visible');
  });

  it('muestra los métodos de pago y los límites de monto', () => {
    cy.contains('Tarjeta').should('be.visible');
    cy.contains('Yappy').should('be.visible');
    cy.contains('Transferencia').should('be.visible');
    cy.contains('Mínimo B/.1.00').should('be.visible');
    cy.contains('Máximo B/.50.00').should('be.visible');
  });

  it('muestra el selector de tarjeta con el saldo correcto', () => {
    // Verifica el fix de ADE-06: el saldo ya no debe ser 0.00
    cy.contains('0987654321').should('be.visible');
    cy.contains('32182913').should('be.visible');
  });
});
