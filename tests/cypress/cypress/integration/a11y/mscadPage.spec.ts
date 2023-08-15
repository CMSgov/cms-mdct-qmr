describe("MSC-AD Page 508 Compliance Test", () => {
  it("Check a11y on MSCAD Page", () => {
    cy.login();
    cy.selectYear("2021");
    cy.goToAdultMeasures();
    cy.goToMeasure("MSC-AD");
    cy.checkA11yOfPage();
  });
});
