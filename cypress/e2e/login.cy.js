describe('ORION - Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8081');
  });

  // TC-01: Login exitoso
  it('TC-01: inicia sesión con credenciales válidas', () => {
    cy.get('input[type="email"], input[placeholder*="orreo"]')
      .first().type('test@orion.com');
    cy.get('input[type="password"], input[placeholder*="ontraseña"]')
      .first().type('Test1234!');
    cy.contains('Iniciar sesión').click();

    // Verifica que llegó a saldo
    cy.url({ timeout: 10000 }).should('include', '/saldo');
  });

  // TC-02: Correo inválido
  it('TC-02: muestra error con correo sin formato', () => {
    cy.get('input[type="email"], input[placeholder*="orreo"]')
      .first().type('usuariotest');
    cy.contains('Iniciar sesión').click();
    cy.contains(/correo.*válid|inválid/i).should('be.visible');
  });

  // TC-07: Credenciales incorrectas
  it('TC-07: rechaza contraseña incorrecta', () => {
    cy.get('input[type="email"], input[placeholder*="orreo"]')
      .first().type('test@orion.com');
    cy.get('input[type="password"], input[placeholder*="ontraseña"]')
      .first().type('WrongPass1!');
    cy.contains('Iniciar sesión').click();
    cy.contains(/incorrecto|inválid/i).should('be.visible');
  });
});