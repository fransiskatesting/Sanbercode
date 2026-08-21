class LoginPage {
  get loginBranding()       { return cy.get('.orangehrm-login-branding') }
  get loginTitle()          { return cy.get('.orangehrm-login-title') }
  get loginError()          { return cy.get('.orangehrm-login-error') }
  get loginLogo()           { return cy.get('.orangehrm-login-logo') }
  get usernameInput()       { return cy.get('input[name="username"]') }
  get passwordInput()       { return cy.get('input[name="password"]') }
  get submitButton()        { return cy.get('button[type="submit"]') }
  get forgotPasswordLink()  { return cy.get('.orangehrm-login-forgot') }
  get copyrightWrapper()    { return cy.get('.orangehrm-copyright-wrapper') }
  get forgotPasswordCard()    { return cy.get('.orangehrm-card-container') }
  get forgotPasswordTitle()   { return cy.get('.orangehrm-forgot-password-title') }
  get cancelButton()          { return cy.get('button[class*="cancel"]') }
  get resetButton()           { return cy.get('button[class*="reset"]') }
  get cancelButtonByType()    { return cy.get('button[type="button"]') }

  getUsernameErrorMessage() {
    return this.usernameInput
      .closest('.oxd-input-group')
      .find('.oxd-input-group__message')
  }

  getPasswordErrorMessage() {
    return this.passwordInput
      .closest('.oxd-input-group')
      .find('.oxd-input-group__message')
  }

  visit() {
    cy.visit('https://opensource-demo.orangehrmlive.com/')
  }

  typeUsername(username) {
    this.usernameInput.clear().type(username)
  }

  typePassword(password) {
    this.passwordInput.clear().type(password)
  }

  clickSubmit() {
    this.submitButton.should('be.enabled').click()
  }

  clickForgotPassword() {
    this.forgotPasswordLink.click()
  }

  clickCancel() {
    this.cancelButtonByType.should('be.enabled').click()
  }

  login(username, password) {
    this.typeUsername(username)
    this.typePassword(password)
    this.clickSubmit()
  }

  submitForgotPassword(username) {
    this.typeUsername(username)
    this.clickSubmit()
  }

  verifyLoginPageElements() {
    this.loginBranding.should('exist')
    this.loginTitle.should('exist')
    this.loginError.should('exist')
    this.loginLogo.should('exist')
    this.usernameInput.should('exist')
    this.passwordInput.should('exist')
    this.submitButton.should('exist')
    this.forgotPasswordLink.should('exist')
  }

  verifyUrlContains(path) {
    cy.url().should('include', path)
  }

  verifyUrlEquals(url) {
    cy.url().should('eq', url)
  }

  verifyUsernameRequiredError(message) {
    this.getUsernameErrorMessage().should('contain.text', message)
  }

  verifyPasswordRequiredError(message) {
    this.getPasswordErrorMessage().should('contain.text', message)
  }

  verifyCopyrightLink(expectedHref) {
    this.copyrightWrapper
      .contains('OrangeHRM, Inc')
      .should('have.attr', 'href', expectedHref)
  }

  verifyForgotPasswordPageElements(expectedUrl, expectedTitle) {
    this.verifyUrlEquals(expectedUrl)
    this.forgotPasswordCard
      .find('.orangehrm-forgot-password-title')
      .should('contain.text', expectedTitle)
    this.usernameInput.should('exist')
    this.cancelButton.should('exist')
    this.resetButton.should('exist')
  }
  
  verifyResetPasswordSuccess(message) {
    this.forgotPasswordCard.should('contain.text', message)
  }
}

export default new LoginPage()
