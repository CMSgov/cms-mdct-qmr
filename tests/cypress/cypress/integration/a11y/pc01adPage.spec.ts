import { testingYear } from "../../../support/constants";

describe("PC01-AD Page 508 Compliance Test", () => {
  it("Check a11y on PC01AD Page", () => {
    cy.login();
    cy.selectYear(testingYear);
    cy.goToAdultMeasures();
    cy.goToMeasure("PC01-AD");
    cy.checkA11yOfPage();
  });
});
