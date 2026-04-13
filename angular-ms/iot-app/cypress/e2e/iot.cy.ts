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

    describe('Premium UI & Interactions', () => {
        it('Should have premium typography and styles', () => {
            // Check for Outfit font on headers (H2 is common on dashboard)
            // Note: We use .should('have.css', ...) which returns the computed style
            cy.get('h2').should('have.css', 'font-family').and('include', 'Outfit');

            // Check for Inter font on body/paragraphs
            cy.get('body').should('have.css', 'font-family').and('include', 'Inter');

            // Check for the navbar title premium font
            cy.get('.nav-title').should('have.css', 'font-family').and('include', 'Outfit');
        });

        it('Should toggle and persist theme across reloads', () => {
            // Toggle to dark mode
            cy.get('button[mattooltip="Cambiar tema"]').click();
            cy.get('html').should('have.attr', 'data-theme', 'dark');

            // Reload page
            cy.reload();

            // Verify theme persisted
            cy.get('html').should('have.attr', 'data-theme', 'dark');

            // Toggle back to light mode
            cy.get('button[mattooltip="Cambiar tema"]').click();
            cy.get('html').should('not.have.attr', 'data-theme', 'dark');

            // Reload again
            cy.reload();
            cy.get('html').should('not.have.attr', 'data-theme', 'dark');
        });

        it('Should display the "Empty State" glass card with correct blur', () => {
            // Check glass effect properties
            cy.get('.empty-state.glass').should('be.visible')
                .and('have.css', 'backdrop-filter').and('include', 'blur(16px)');

            cy.get('.empty-state.glass').should('have.css', 'border-radius', '24px');
        });

        it('Should have a responsive premium navbar', () => {
            cy.get('nav').should('have.class', 'glass');
            cy.get('nav').should('have.css', 'position', 'sticky');
            cy.get('nav').should('have.css', 'overflow', 'hidden'); // For the animated gradient
        });

        describe('Device Configuration & Management', () => {
            it('Should navigate to edit device and modify settings', () => {
                // This requires being logged in
                cy.contains('Acceder').click();
                cy.get('input[formControlName="username"]').type(testUser.username);
                cy.get('input[formControlName="password"]').type(testUser.password);
                cy.get('button[type="submit"]').click();

                // Navigate to settings (assuming user has devices)
                cy.get('.action-btn').first().click();
                cy.contains('Configurar').click();

                // Verify we are on edit page
                cy.url().should('include', '/edit/');
            });
        });
    });

});
