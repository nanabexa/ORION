describe('ORION - Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8081');
  });

  it('TC-01: inicia sesión con credenciales válidas', () => {
    cy.get('input[placeholder="usuario@email.com"]').type('test2@orion.com');
    cy.get('input[placeholder="••••••••"]').type('Test1234!');
    cy.contains('Iniciar sesión').click();
    cy.url({ timeout: 15000 }).should('include', '/saldo');
    cy.contains('Saldo disponible').should('be.visible');
  });

  it('TC-02: muestra error con correo sin formato válido', () => {
    cy.get('input[placeholder="usuario@email.com"]').type('usuariotest');
    cy.get('input[placeholder="••••••••"]').type('Test1234!');
    cy.contains('Iniciar sesión').click();
    cy.contains('Correo no válido').should('be.visible');
    cy.url().should('not.include', '/saldo');
  });

  it('TC-03: rechaza contraseña demasiado corta', () => {
    cy.get('input[placeholder="usuario@email.com"]').type('test2@orion.com');
    cy.get('input[placeholder="••••••••"]').type('Ab1');
    cy.contains('Iniciar sesión').click();
    cy.contains('Contraseña muy corta').should('be.visible');
    cy.url().should('not.include', '/saldo');
  });

  it('TC-05: muestra errores con campos vacíos', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('El correo es requerido').should('be.visible');
    cy.contains('La contraseña es requerida').should('be.visible');
  });

  it('TC-07: rechaza credenciales incorrectas', () => {
    cy.get('input[placeholder="usuario@email.com"]').type('test2@orion.com');
    cy.get('input[placeholder="••••••••"]').type('PasswordMalo1!');
    cy.contains('Iniciar sesión').click();
    cy.contains('Correo o contraseña incorrectos', { timeout: 15000 }).should('be.visible');
    cy.url().should('not.include', '/saldo');
  });
});