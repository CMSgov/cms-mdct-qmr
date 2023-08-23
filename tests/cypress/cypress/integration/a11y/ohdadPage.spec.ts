describe("OHD-AD Page 508 Compliance Test", () => {
  it("Check a11y on OHDAD Page", () => {
    cy.login();
    cy.selectYear("2021");
    cy.goToAdultMeasures();
    cy.goToMeasure("OHD-AD");
    cy.checkA11yOfPage();
  });
});