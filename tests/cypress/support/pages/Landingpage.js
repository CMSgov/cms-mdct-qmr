const logoAtTopLeft = 'img[alt="QMR Logo"]';
const myAccountButton = '//a[@class="dropdown-toggle nav-link"]';
const yourAPSSubmissionsTxt = "//h1";
const sentence = '(//div[@class="footer-fed-gov-text"])[1]';
const medicaidLogo = "img[alt='Medicaid.gov logo']";
const emailBottomLeft = ".footer-email";
const federalLogo = "img[alt='Department of Health and Human Services logo']";
const addressBottomRight = '(//div[@class="footer-wrapper"]/div)[2]';
// element is xpath, please use cy.xapth() instead of cy.get();
const coreSetMeasureText = "//a[contains(text(),'Core Set Measures')]";
// element is xpath, please use cy.xapth() instead of cy.get();
const AdultCoreSetMeasures = "//tbody/tr[1]/td[1]/a[1]/p[1]";
// element is xpath, please use cy.xapth() instead of cy.get();
const addChildCoreSet =
  "//body/div[@id='root']/div[@id='app-wrapper']/main[@id='main-wrapper']/div[2]/div[2]/aside[1]/div[1]/a[1]/div[1]/button[1]";
// element is xpath, please use cy.xapth() instead of cy.get();
const addHealthHomesCoreSet =
  "//body/div[@id='root']/div[@id='app-wrapper']/main[@id='main-wrapper']/div[2]/div[2]/aside[2]/div[1]/a[1]/div[1]/button[1]";

export class Landingpage {
  launch() {
    cy.visit("/");
  }

  validateCoreSetReportingIcon() {
    cy.get(logoAtTopLeft).should("be.visible");
  }

  validatePageBanner() {
    cy.xpath(yourAPSSubmissionsTxt).should("be.visible");
  }

  validateMyAccountButton() {
    cy.xpath(myAccountButton).should("be.visible");
  }

  validateSupportSenence() {
    cy.xpath(sentence).should("be.visible");
  }

  validateMedicaidLogo() {
    cy.get(medicaidLogo).should("be.visible");
  }

  validateEmail() {
    cy.get(emailBottomLeft).contains("MDCT_Help@cms.hhs.gov");
  }

  validateFederalLogo() {
    cy.get(federalLogo).should("be.visible");
  }

  validateAddress() {
    cy.xpath(addressBottomRight).contains(
      "7500 Security Boulevard Baltimore, MD 21244"
    );
  }

  validatecoreSetMeasureText() {
    cy.xpath(coreSetMeasureText).should("be.visible");
  }

  clickAdultCoreSetMeasures() {
    cy.xpath(AdultCoreSetMeasures).click();
  }

  verifyaddChildCoreSetisDisabled() {
    cy.xpath(addChildCoreSet).should("be.disabled");
  }

  verifyaddHealthHomesCoreSetisDisabled() {
    cy.xpath(addHealthHomesCoreSet).should("be.disabled");
  }
}
export default Landingpage;
