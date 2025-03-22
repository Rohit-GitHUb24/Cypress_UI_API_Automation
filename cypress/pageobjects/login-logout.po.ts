import { buttons } from '../fixtures/testdata';

// Login page UI elements locator
class LoginLogoutPage {
  get userName() {
    return cy.get('[formcontrolname="userName"]');
  }

  get password() {
    return cy.get('[formcontrolname="password"]');
  }

  get logoutAvatar() {
    return cy.get('#loggedUserId');
  }

  getLoginError() {
    return cy.get('.error-with-login');
  }

  enterUsername(userName: string) {
    this.userName.type(userName);
  }

  enterPassword(password: string) {
    this.password.type(password, { log: false });
  }

  // Logout page UI elements locator
  clickLogoutAvatar() {
    this.logoutAvatar.click();
  }

  clickLogoutButton() {
    cy.xpath("//div[.='Log out']").click();
  }

  clickFooterLogout() {
    cy.contains('a', buttons.logout).click();
  }
}

const loginPage = new LoginLogoutPage();
export default loginPage;
