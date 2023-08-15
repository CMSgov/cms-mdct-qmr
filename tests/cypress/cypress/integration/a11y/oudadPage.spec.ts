describe("OUD-AD Page 508 Compliance Test", () => {
  it("Check a11y on OUDAD Page", () => {
    cy.login();
    cy.selectYear("2021");
    cy.goToAdultMeasures();
    cy.goToMeasure("OUD-AD");
    cy.checkA11yOfPage();
  });
});
