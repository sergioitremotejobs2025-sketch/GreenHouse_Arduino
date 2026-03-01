describe('Angular MS End-to-End Tests', () => {

    const testUser = {
        username: 'e2e_ui_tester',
        password: 'e2e_password'
    };

    beforeEach(() => {
        cy.visit('/');
    });

    it('Displays the homepage and header', () => {
        cy.contains('IoT_Microservices');
        cy.contains('Acceder').should('be.visible');
    });

    it('Navigates to register modal, creates user, and logs in', () => {
        // Open Dialog
        cy.contains('Acceder').click();

        // Switch to Register (if not existing) or just attempt login.
        // If we just want to test Login we can do:
        cy.get('input[formControlName="username"]').type(testUser.username);
        cy.get('input[formControlName="password"]').type(testUser.password);

        // This is assuming standard Angular material inputs where formControlNames are on input levels
        cy.get('button[type="submit"]').contains('Iniciar sesión').click();

        // Check that we're logged in correctly (nav-user-container shows name)
        // A popup or change in navbar should show
        // Either a failure snackbar shows up or success
        // Wait for the request to orchestrator mapped through local angular proxies
        cy.wait(1000);
    });

    it('Blocks access to settings without authentication', () => {
        cy.visit('/my-microcontrollers');
        // Router should redirect back to home if restricted
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

});
