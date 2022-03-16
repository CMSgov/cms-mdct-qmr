import { testConfig } from "../../test-config.js";
const usernameInput = "input#okta-signin-username";
const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";
const loginWithCognitoButtn =
  "(//button[@class='chakra-button css-9n6wlp'])[2]";
const passwordInput = "input#okta-signin-password"; //pragma: allowlist secret
const agreeTermCondition = "input#tandc";
const signInBttn = "input#okta-signin-submit";
const goToStateHomeBTN = "//button[contains(text(),'Go To State Home')]";
export class LoginPage {
  enterUserName() {
    //cy.get(usernameInput).type("State_QMR2");
    cy.get(usernameInput).type(testConfig.TEST_USER_1);
  }

  enterEmailwithCognitoLogin() {
    cy.xpath(emailForCognito).type(testConfig.TEST_USER_1);
  }

  enterPasswordwithCognitoLogin() {
    cy.xpath(passwordForCognito).type(testConfig.TEST_PASSWORD_1);
  }

  clickLoginWithCognitoButtn() {
    cy.xpath(loginWithCognitoButtn).click();
  }

  enterEmailwithCognitoLogin() {
    cy.xpath(emailForCognito).type(testConfig.TEST_USER_2);
  }

  enterPasswordwithCognitoLogin() {
    cy.xpath(passwordForCognito).type(testConfig.TEST_PASSWORD_1);
  }

  clickLoginWithCognitoButtn() {
    cy.xpath(loginWithCognitoButtn).click();
  }

  enterPassword() {
    cy.get(passwordInput).type(testConfig.TEST_PASSWORD_1);
  }

  //old credentials
  //State_QMR  Passw0rd!

  clickAgreeTermAndConditions() {
    //cy.wait(2000);
    cy.get(agreeTermCondition).click();
  }

  clickSignIn() {
    cy.get(signInBttn).click();
  }

  loginasAStateUser() {
    cy.get(usernameInput).type(testConfig.TEST_USER_2);
    cy.get(passwordInput).type(testConfig.TEST_PASSWORD_1);
    cy.get(agreeTermCondition).click();
    cy.get(signInBttn).click();
  }

  loginasAStateUserWithCognito() {
    cy.xpath(emailForCognito).type(testConfig.TEST_USER_1);
    cy.xpath(passwordForCognito).type(testConfig.TEST_PASSWORD_1);
    cy.xpath(loginWithCognitoButtn).click();
  }

  loginasAStateUserTwoWithCognito() {
    cy.xpath(emailForCognito).type(testConfig.TEST_USER_2);
    cy.xpath(passwordForCognito).type(testConfig.TEST_PASSWORD_1);
    cy.xpath(loginWithCognitoButtn).click();
  }

  loginasApproverCognito() {
    cy.xpath(emailForCognito).type("adminuser@test.com");
    cy.xpath(passwordForCognito).type(testConfig.TEST_PASSWORD_1);
    cy.xpath(loginWithCognitoButtn).click();
  }
  clickGoToStateHome() {
    cy.xpath(goToStateHomeBTN).click();
  }
}
export default LoginPage;
