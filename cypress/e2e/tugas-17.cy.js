import LoginPage from '../pages/LoginPage'
import loginData from '../fixtures/loginData.json'

const { validUser, invalidUser, invalidPassword, forgotPasswordUser, urls, expectedTexts } = loginData

describe('User dapat mengakses halaman Login OrangeHRM', () => {
  beforeEach(() => {
    LoginPage.visit()
  })

  it('TC-LOGIN-001 - Sebagai user, saya dapat melihat halaman login OrangeHRM dengan elemen yang lengkap', () => {
    LoginPage.verifyLoginPageElements()
  })

  it('TC-LOGIN-002 - Sebagai user, saya dapat login menggunakan kredensial yang valid (Admin/admin123)', () => {
    LoginPage.login(validUser.username, validUser.password)
    LoginPage.verifyUrlContains(urls.dashboard)
  })

  it('TC-LOGIN-003 - Sebagai user, saya tidak dapat login menggunakan username yang salah', () => {
    LoginPage.login(invalidUser.username, invalidUser.password)
    LoginPage.verifyUrlEquals(urls.loginPage)
  })

  it('TC-LOGIN-004 - Sebagai user, saya tidak dapat login menggunakan password yang salah', () => {
    LoginPage.login(invalidPassword.username, invalidPassword.password)
    LoginPage.verifyUrlEquals(urls.loginPage)
  })

  it('TC-LOGIN-005 - Sebagai user, saya tidak dapat login jika field Username dikosongkan', () => {
    LoginPage.usernameInput.should('have.value', '')
    LoginPage.typePassword(validUser.password)
    LoginPage.clickSubmit()
    LoginPage.verifyUsernameRequiredError(expectedTexts.requiredMessage)
  })

  it('TC-LOGIN-006 - Sebagai user, saya tidak dapat login jika field Password dikosongkan', () => {
    LoginPage.typeUsername(validUser.username)
    LoginPage.passwordInput.should('have.value', '')
    LoginPage.clickSubmit()
    LoginPage.verifyPasswordRequiredError(expectedTexts.requiredMessage)
  })

  it('TC-LOGIN-007 - Sebagai sistem, saya dapat memastikan link OrangeHRM.com dari halaman login sudah sesuai', () => {
    LoginPage.verifyCopyrightLink(expectedTexts.orangehrmLink)
  })

  it('TC-LOGIN-008 - Sebagai user, saya tidak dapat login jika kedua field Username dan Password dikosongkan', () => {
    LoginPage.usernameInput.should('have.value', '')
    LoginPage.passwordInput.should('have.value', '')
    LoginPage.clickSubmit()
    LoginPage.verifyUsernameRequiredError(expectedTexts.requiredMessage)
    LoginPage.verifyPasswordRequiredError(expectedTexts.requiredMessage)
  })
})

describe('User dapat menggunakan fitur Forgot Password', () => {

  beforeEach(() => {
    LoginPage.visit()
    LoginPage.clickForgotPassword()
  })

  it('TC-LOGIN-009 - Sebagai user, saya dapat mengakses halaman Reset Password melalui link "Forgot your password?"', () => {
    LoginPage.verifyForgotPasswordPageElements(
      urls.forgotPassword,
      expectedTexts.resetPasswordTitle
    )
  })

  it('TC-LOGIN-010 - Sebagai user, saya dapat mengajukan reset password dengan username yang valid', () => {
    LoginPage.verifyUrlEquals(urls.forgotPassword)
    LoginPage.submitForgotPassword(forgotPasswordUser.username)
    LoginPage.verifyResetPasswordSuccess(expectedTexts.resetPasswordSuccess)
  })

  it('TC-LOGIN-011 - Sebagai user, saya tidak dapat mengajukan reset password jika field Username dikosongkan', () => {
    LoginPage.verifyUrlEquals(urls.forgotPassword)
    LoginPage.usernameInput.should('have.value', '')
    LoginPage.clickSubmit()
    LoginPage.verifyUsernameRequiredError(expectedTexts.requiredMessage)
  })

  it('TC-LOGIN-012 - Sebagai user, saya bisa kembali ke halaman login jika tidak jadi request reset password', () => {
    LoginPage.verifyUrlEquals(urls.forgotPassword)
    LoginPage.clickCancel()
    LoginPage.verifyUrlEquals(urls.loginPage)
  })
})
