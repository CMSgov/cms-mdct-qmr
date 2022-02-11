before(() => {
  cy.visit("/", { timeout: 60000 * 5 });
});
import "cypress-file-upload";

const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";

// the default stateuser1 is used to login but can also be changed
// by passing in a user (not including the @test.com) ex. cy.login('bouser')
Cypress.Commands.add("login", (user = "stateuser1") => {
  cy.xpath(emailForCognito).type(`${user}@test.com`);
  cy.xpath(passwordForCognito).type("p@55W0rd!");
  cy.get('[data-cy="login-with-cognito-button"]').click();
});

// Visit Adult Core Set Measures
Cypress.Commands.add("goToAdultMeasures", () => {
  cy.get('[data-cy="ACS"]').click();
});

// Visit Measures based on abbr
Cypress.Commands.add("goToMeasure", (measure) => {
  cy.get(`[data-cy="${measure}"]`).click();
});

// Correct sections visible when user is reporting data on measure
Cypress.Commands.add("displaysSectionsWhenUserIsReporting", () => {
  cy.wait(1000);
  cy.get('[data-cy="DidReport0"]').click({ force: true });

  // these sections should not exist when a user selects they are reporting
  cy.get('[data-cy="Why are you not reporting on this measure?"]').should(
    "not.exist"
  );
  // these sections should be visible when a user selects they are reporting

  cy.get('[data-cy="Status of Data Reported"]').should("be.visible");
  cy.get('[data-cy="Measurement Specification"]').should("be.visible");
  cy.get('[data-cy="Data Source"]').should("be.visible");
  cy.get('[data-cy="Date Range"]').should("be.visible");
  cy.get('[data-cy="Definition of Population Included in the Measure"]').should(
    "be.visible"
  );
  cy.get('[data-cy="Combined Rate(s) from Multiple Reporting Units"]').should(
    "be.visible"
  );
  cy.get(
    '[data-cy="Additional Notes/Comments on the measure (optional)"]'
  ).should("be.visible");
});

// Correct sections visible when user is not reporting data on measure
Cypress.Commands.add("displaysSectionsWhenUserNotReporting", () => {
  cy.wait(1000);
  cy.get('[data-cy="DidReport1"]').click();

  // these sections should not exist when a user selects they are not reporting
  cy.get('[data-cy="Status of Data Reported"]').should("not.exist");
  cy.get('[data-cy="Measurement Specification"]').should("not.exist");
  cy.get('[data-cy="Data Source"]').should("not.exist");
  cy.get('[data-cy="Date Range"]').should("not.exist");
  cy.get('[data-cy="Definition of Population Included in the Measure"]').should(
    "not.exist"
  );
  cy.get('[data-cy="Combined Rate(s) from Multiple Reporting Units"]').should(
    "not.exist"
  );

  // these sections should be visible when a user selects they are not reporting
  cy.get('[data-cy="Why are you not reporting on this measure?"]').should(
    "be.visible"
  );
  cy.get(
    '[data-cy="Additional Notes/Comments on the measure (optional)"]'
  ).should("be.visible");
});
