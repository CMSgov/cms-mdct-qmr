import { testingYear } from "../../../support/constants";

describe("CHL-CH Page 508 Compliance Test", () => {
  it("Check a11y on CHL-CH Page", () => {
    cy.login();
    cy.selectYear(testingYear);
    cy.goToChildCoreSetMeasures();
    cy.goToMeasure("CHL-CH");
    cy.checkA11yOfPage();
  });
});
