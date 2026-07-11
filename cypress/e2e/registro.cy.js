describe('ORION - Registro', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8081');
    cy.contains('Regístrate').click();
    cy.contains('REGISTRO').should('be.visible');
  });

  // Helpers para los campos de contraseña (solo los visibles)
  const passField = () => cy.get('input[placeholder="••••••••"]').filter(':visible').first();
  const confirmField = () => cy.get('input[placeholder="••••••••"]').filter(':visible').last();

  it('TC-10: rechaza nombre de menos de 3 caracteres', () => {
    cy.get('input[placeholder="Viviana Nieto"]').type('Al');
    cy.contains('Mínimo 3 caracteres').should('be.visible');
  });

  it('TC-11: rechaza nombre con caracteres especiales', () => {
    cy.get('input[placeholder="Viviana Nieto"]').type('Ana<>');
    cy.contains('Nombre no válido').should('be.visible');
  });

  it('valida correo sin formato correcto', () => {
    cy.get('input[placeholder="usuario@email.com"]').filter(':visible').first().type('correomalo');
    cy.contains('Correo no válido').should('be.visible');
  });

  it('TC-12: muestra el checklist de requisitos de contraseña', () => {
    passField().type('abc12345');
    cy.contains('Al menos una mayúscula').should('be.visible');
    cy.contains('Al menos un carácter especial').should('be.visible');
  });

  it('valida contraseña sin mayúscula', () => {
    passField().type('abcdefg!');
    cy.contains('Debe incluir al menos una mayúscula').should('be.visible');
  });

  it('TC-13: detecta contraseñas que no coinciden', () => {
    passField().type('Abcdef1!');
    confirmField().type('Abcdef2!');
    cy.contains('Las contraseñas no coinciden').should('be.visible');
  });

  it('TC-14: muestra error si el correo ya está registrado', () => {
    cy.get('input[placeholder="Viviana Nieto"]').type('Usuario Prueba');
    cy.get('input[placeholder="usuario@email.com"]').filter(':visible').first().type('test2@orion.com');
    passField().type('Test1234!');
    confirmField().type('Test1234!');
    cy.contains('Crear cuenta').click();
    cy.contains('Este correo ya tiene una cuenta', { timeout: 15000 }).should('be.visible');
  });

  it('TC-09: registra un usuario nuevo correctamente', () => {
    const correoNuevo = `orion${Date.now()}@test.com`;
    cy.get('input[placeholder="Viviana Nieto"]').type('Usuario Nuevo');
    cy.get('input[placeholder="usuario@email.com"]').filter(':visible').first().type(correoNuevo);
    passField().type('Test1234!');
    confirmField().type('Test1234!');
    cy.contains('Crear cuenta').click();
    cy.contains('Cuenta creada', { timeout: 15000 }).should('be.visible');
  });

  it('TC-15: el enlace navega de vuelta a Login', () => {
    cy.contains('Iniciar sesión').scrollIntoView().click({ force: true });
    // Verifica que volvió al login: el campo de correo del login está visible
    cy.get('input[placeholder="usuario@email.com"]').filter(':visible').should('exist');
    cy.contains('¿Olvidaste tu contraseña?').should('be.visible');
  });
});