describe('ORION - Registro', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8081');
    cy.contains('Regístrate').click();
    cy.contains('REGISTRO').should('be.visible');
  });

  // TC-10: Nombre demasiado corto
  it('TC-10: rechaza nombre de menos de 3 caracteres', () => {
    cy.get('input[placeholder="Viviana Nieto"]').type('Al');
    cy.contains('Mínimo 3 caracteres').should('be.visible');
  });

  // TC-11: Caracteres especiales prohibidos en nombre
  it('TC-11: rechaza nombre con caracteres especiales', () => {
    cy.get('input[placeholder="Viviana Nieto"]').type('Ana<>');
    cy.contains('Nombre no válido').should('be.visible');
  });

  // Validación de correo sin formato
  it('valida correo sin formato correcto', () => {
    cy.get('input[placeholder="usuario@email.com"]').type('correomalo');
    cy.contains('Correo no válido').should('be.visible');
  });

  // TC-12: Checklist de contraseña en tiempo real
  it('TC-12: muestra checklist de requisitos de contraseña', () => {
    cy.get('input[placeholder="••••••••"]').first().type('abc12345');
    cy.contains('Al menos una mayúscula').should('be.visible');
    cy.contains('Al menos un carácter especial').should('be.visible');
  });

  // Contraseña sin mayúscula muestra error
  it('valida contraseña sin mayúscula', () => {
    cy.get('input[placeholder="••••••••"]').first().type('abcdefg!');
    cy.contains('Debe incluir al menos una mayúscula').should('be.visible');
  });

  // TC-13: Confirmación de contraseña no coincide
  it('TC-13: detecta contraseñas que no coinciden', () => {
    cy.get('input[placeholder="••••••••"]').first().type('Abcdef1!');
    cy.get('input[placeholder="••••••••"]').last().type('Abcdef2!');
    cy.contains('Las contraseñas no coinciden').should('be.visible');
  });

  // TC-14: Correo duplicado (ahora visible en pantalla)
  it('TC-14: muestra error si el correo ya está registrado', () => {
    cy.get('input[placeholder="Viviana Nieto"]').type('Usuario Prueba');
    cy.get('input[placeholder="usuario@email.com"]').type('test@orion.com'); // correo ya existente
    cy.get('input[placeholder="••••••••"]').first().type('Test1234!');
    cy.get('input[placeholder="••••••••"]').last().type('Test1234!');
    cy.contains('Crear cuenta').click();
    cy.contains('Este correo ya tiene una cuenta', { timeout: 10000 }).should('be.visible');
  });

  // TC-09: Registro exitoso (correo nuevo aleatorio para no chocar)
  it('TC-09: registra un usuario nuevo correctamente', () => {
    const correoNuevo = `test${Date.now()}@orion.com`;
    cy.get('input[placeholder="Viviana Nieto"]').type('Usuario Nuevo');
    cy.get('input[placeholder="usuario@email.com"]').type(correoNuevo);
    cy.get('input[placeholder="••••••••"]').first().type('Test1234!');
    cy.get('input[placeholder="••••••••"]').last().type('Test1234!');
    cy.contains('Crear cuenta').click();
    cy.contains('Cuenta creada', { timeout: 10000 }).should('be.visible');
  });

  // TC-15: Link para volver a login
  it('TC-15: navega de vuelta a login', () => {
    cy.contains('Iniciar sesión').click();
    cy.contains('Regístrate').should('be.visible');
  });
});
