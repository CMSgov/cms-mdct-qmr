const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";

describe("OY2 7763 FAQ Page State View ", () => {
  beforeEach(() => {
    // Seed database with test data
    cy.visit("/");
    cy.xpath(emailForCognito).type("stateuser1@test.com");
    cy.xpath(passwordForCognito).type("p@55W0rd!");
    cy.get('[data-cy="login-with-cognito-button"]').click();
  });
  it("Verify FAQ Page Exists", () => {
    cy.get(
      "body.chakra-ui-light:nth-child(2) div.css-4ma18r:nth-child(1) div.css-1gy6ge8 div.chakra-container.css-1vsk1kk div.css-1ibkps6 > a:nth-child(4)"
    ).click();
    cy.get(".chakra-heading").should("have.text", "FAQ");
  });
});
