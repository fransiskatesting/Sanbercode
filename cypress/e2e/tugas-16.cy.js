describe('User dapat mengakses halaman Login OrangeHRM', () => {
    it('TC-LOGIN-001 - Sebagai user, saya dapat melihat halaman login OrangeHRM dengan elemen yang lengkap', () => {
        cy.intercept('GET', '**/api/v2/core/i18n/messages*').as('i18nMessages')
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('.orangehrm-login-branding').should('exist')
        cy.get('.orangehrm-login-title').should('exist')
        cy.get('.orangehrm-login-error').should('exist')
        cy.get('.orangehrm-login-logo').should('exist')
        cy.get('input[name="username"]').should('exist')
        cy.get('input[name="password"]').should('exist')
        cy.get('button[type="submit"]').should('exist')
        cy.get('.orangehrm-login-forgot').should('exist')
    })

    it('TC-LOGIN-002 - Sebagai user, saya dapat login menggunakan kredensial yang valid (Admin/admin123)', () => {
        cy.intercept('POST', '**/web/index.php/auth/validate').as('loginValid')
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('input[name="username"]').type('Admin').should('have.value', 'Admin')
        cy.get('input[name="password"]').type('admin123').should('have.value', 'admin123')
        cy.get('button[type="submit"]').should('be.enabled').click()
        cy.wait('@loginValid', { timeout: 15000 }).then((interception) => {
            expect(interception.request.body).to.include('username=Admin')
            expect(interception.response.statusCode).to.be.oneOf([200, 302])
        })
        cy.url().should('include', '/dashboard')
    })

    it('TC-LOGIN-003 - Sebagai user, saya tidak dapat login menggunakan username yang salah', () => {
        cy.intercept('POST', '**/web/index.php/auth/validate').as('loginInvalidUsername')
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('input[name="username"]').type('InvalidUser').should('have.value', 'InvalidUser')
        cy.get('input[name="password"]').type('admin123').should('have.value', 'admin123')
        cy.get('button[type="submit"]').should('be.enabled').click()
        cy.wait('@loginInvalidUsername', { timeout: 15000 }).then((interception) => {
            expect(interception.request.body).to.include('username=InvalidUser')
            expect(interception.response.statusCode).to.be.oneOf([200, 302])
        })
        cy.url().should('eq', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    })

    it('TC-LOGIN-004 - Sebagai user, saya tidak dapat login menggunakan password yang salah', () => {
        cy.intercept('POST', '**/web/index.php/auth/validate').as('loginInvalidPassword')
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('input[name="username"]').type('Admin').should('have.value', 'Admin')
        cy.get('input[name="password"]').type('wrongpassword').should('have.value', 'wrongpassword')
        cy.get('button[type="submit"]').should('be.enabled').click()
        cy.wait('@loginInvalidPassword', { timeout: 15000 }).then((interception) => {
            expect(interception.request.body).to.include('password=wrongpassword')
            expect(interception.response.statusCode).to.be.oneOf([200, 302])
        })
        cy.url().should('eq', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    })

    it('TC-LOGIN-005 - Sebagai user, saya tidak dapat login jika field Username dikosongkan', () => {
        cy.intercept('POST', '**/web/index.php/auth/validate').as('loginNoUsername')
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('input[name="username"]').should('have.value', '')
        cy.get('input[name="password"]').type('admin123').should('have.value', 'admin123')
        cy.get('button[type="submit"]').should('be.enabled').click()
        cy.get('@loginNoUsername.all').should('have.length', 0)
        cy.get('input[name="username"]').closest('.oxd-input-group').find('.oxd-input-group__message').should('contain.text', 'Required')
    })

    it('TC-LOGIN-006 - Sebagai user, saya tidak dapat login jika field Password dikosongkan', () => {
        cy.intercept('POST', '**/web/index.php/auth/validate').as('loginNoPassword')
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('input[name="username"]').type('Admin').should('have.value', 'Admin')
        cy.get('input[name="password"]').should('have.value', '')
        cy.get('button[type="submit"]').should('be.enabled').click()
        cy.get('@loginNoPassword.all').should('have.length', 0)
        cy.get('input[name="password"]').closest('.oxd-input-group').find('.oxd-input-group__message').should('contain.text', 'Required')
    })

    it('TC-LOGIN-007 - Sebagai sistem, saya dapat memastikan link OrangeHRM.com dari halaman login sudah sesuai', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('.orangehrm-copyright-wrapper').contains('OrangeHRM, Inc').should('have.attr', 'href', 'http://www.orangehrm.com')
    })

    it('TC-LOGIN-008 - Sebagai user, saya tidak dapat login jika kedua field Username dan Password dikosongkan', () => {
        cy.intercept('POST', '**/web/index.php/auth/validate').as('loginBothEmpty')
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('input[name="username"]').should('have.value', '')
        cy.get('input[name="password"]').should('have.value', '')
        cy.get('button[type="submit"]').should('be.enabled').click()
        cy.get('@loginBothEmpty.all').should('have.length', 0)
        cy.get('input[name="username"]').closest('.oxd-input-group').find('.oxd-input-group__message').should('contain.text', 'Required')
        cy.get('input[name="password"]').closest('.oxd-input-group').find('.oxd-input-group__message').should('contain.text', 'Required')
    })
})

describe('User dapat menggunakan fitur Forgot Password', () => {
    it('TC-LOGIN-009 - Sebagai user, saya dapat mengakses halaman Reset Password melalui link "Forgot your password?"', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('.orangehrm-login-forgot').click()
        cy.url().should('eq', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode')
        cy.get('.orangehrm-card-container').find('.orangehrm-forgot-password-title').should('contain.text', 'Reset Password')
        cy.get('input[name="username"]').should('exist')
        cy.get('button[class*="cancel"]').should('exist')
        cy.get('button[class*="reset"]').should('exist')
    })

    it('TC-LOGIN-010 - Sebagai user, saya dapat mengajukan reset password dengan username yang valid', () => {
        cy.intercept('POST', '**/web/index.php/auth/**').as('submitResetPassword')
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('.orangehrm-login-forgot').click()
        cy.url().should('eq', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode')
        cy.get('input[name="username"]').type('Midna').should('not.have.value', 'Admin')
        cy.get('button[type="submit"]').should('be.enabled').click()
        cy.wait('@submitResetPassword', { timeout: 15000 }).then((interception) => {
            expect(interception.request.body).to.include('username=Midna')
            expect(interception.response.statusCode).to.be.oneOf([200, 302])
        })
        cy.get('.orangehrm-card-container').should('contain.text', 'Reset Password link sent successfully')
    })

    it('TC-LOGIN-011 - Sebagai user, saya tidak dapat mengajukan reset password jika field Username dikosongkan di halaman Forgot Password', () => {
        cy.intercept('POST', '**/web/index.php/auth/requestPasswordResetCode').as('resetPasswordNoUsername')
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('.orangehrm-login-forgot').click()
        cy.url().should('eq', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode')
        cy.get('input[name="username"]').should('have.value', '')
        cy.get('button[type="submit"]').should('be.enabled').click()
        cy.get('@resetPasswordNoUsername.all').should('have.length', 0)
        cy.get('input[name="username"]').closest('.oxd-input-group').find('.oxd-input-group__message').should('contain.text', 'Required')
    })

    it('TC-LOGIN-012 - Sebagai user, saya bisa kembali ke halaman login jika tidak jadi request reset password', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/')
        cy.get('.orangehrm-login-forgot').click()
        cy.url().should('eq', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode')
        cy.get('button[type="button"]').should('be.enabled').click()
        cy.url().should('eq', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    })
})
