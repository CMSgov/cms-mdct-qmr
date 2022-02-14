const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";

describe("OY2 8943 Measure 10: FUH-AD", () => {
  beforeEach(() => {
    // Seed database with test data
    cy.visit("/");
    cy.login();
    cy.goToAdultMeasures();
    cy.goToMeasure("FUH-AD");
  });
  it("Ensure correct sections display if user is/not reporting", () => {
    cy.wait(1000);
    cy.get('[data-cy="DidReport1"]').click();

    // these sections should not exist when a user selects they are not reporting
    cy.get('[data-cy="Status of Data Reported"]').should("not.exist");
    cy.get('[data-cy="Measurement Specification"]').should("not.exist");
    cy.get('[data-cy="Data Source"]').should("not.exist");
    cy.get('[data-cy="Date Range"]').should("not.exist");
    cy.get(
      '[data-cy="Definition of Population Included in the Measure"]'
    ).should("not.exist");
    cy.get('[data-cy="Combined Rate(s) from Multiple Reporting Units"]').should(
      "not.exist"
    );

    // these sections should be visible when a user selects they are not reporting
    cy.get('[data-cy="Why are you not reporting on this measure?"]').should(
      "be.visible"
    );
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
    cy.get(
      '[data-cy="Definition of Population Included in the Measure"]'
    ).should("be.visible");
    cy.get('[data-cy="Combined Rate(s) from Multiple Reporting Units"]').should(
      "be.visible"
    );
    cy.get(
      '[data-cy="Additional Notes/Comments on the measure (optional)"]'
    ).should("be.visible");
  });

  it("Ensure Data Source question includes Administrative Data, and Other Data Source selections.", () => {
    // admin data
    cy.get(
      '[data-cy="DataSource0"] > .chakra-checkbox__label > .chakra-text'
    ).should("be.visible");

    // other data source
    cy.get(
      '[data-cy="DataSource1"] > .chakra-checkbox__label > .chakra-text'
    ).should("be.visible");
  });

  it("Rate calculation should be correct", () => {
    // select is reporting
    cy.get('[data-cy="DidReport0"]').click({ force: true });

    // select AHRQ for measurement specification
    cy.get('[data-cy="MeasurementSpecification0"]').click();

    cy.get('[id="DataSource0-checkbox"]').check({ force: true });
    cy.get('[id="DataSource1-checkbox"]').uncheck({ force: true });

    // Rate calculation should be = (N/D*100,000)
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]').type(
      "5"
    );
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]').type(
      "10"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').should(
      "have.value",
      "50.0"
    );

    // Ensure that auto calculate rate displays 1 decimal (even if the value is zero)
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]').type(
      "8"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').should(
      "have.value",
      "80.0"
    );

    // Ensure that numerical value after decimal is rounded up/down for auto calculated rate (up)
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]').type(
      "9"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').should(
      "have.value",
      "88.9"
    );

    // Ensure that numerical value after decimal is rounded up/down for auto calculated rate (down)
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]').type(
      "18"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').should(
      "have.value",
      "44.4"
    );

    // Ensure that user cannot manually enter rates if admin data is selected - (already selected)
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').should(
      "have.attr",
      "readonly"
    );
  });

  it("User can manually adjust rate if other data source is selected", () => {
    cy.get('[data-cy="DidReport0"]').click({ force: true });
    cy.get('[data-cy="DataSource1"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]').type(
      "10"
    );
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]').type(
      "20"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').should(
      "have.value",
      "50.0"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').should(
      "not.have.attr",
      "readonly"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').type(
      "4869568.1"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').should(
      "have.value",
      "48.1"
    );
  });

  it("Ensure that warning appears if N=0, D>0, then R should be = 0 for user entered rates.", () => {
    cy.wait(1000);
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[id="DataSource0-checkbox"]').uncheck({ force: true });
    cy.get('[id="DataSource1-checkbox"]').check({ force: true });
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]').type(
      "0"
    );
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]').type(
      "5"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').should(
      "have.value",
      "0.0"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').type("5");
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get(
      '[data-cy="Manually entered rate should be 0 if numerator is 0"]'
    ).should(
      "have.text",
      "Manually entered rate should be 0 if numerator is 0"
    );
    cy.get('[data-cy="Performance Measure Error"]').should(
      "have.text",
      "Performance Measure Error"
    );
  });

  it("Ensure that warning appears if N>0, D>0, then R should be >0 for user entered rates.", () => {
    cy.get('[data-cy="DidReport0"]').click({ force: true });
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[id="DataSource0-checkbox"]').uncheck({ force: true });
    cy.get('[id="DataSource1-checkbox"]').check({ force: true });
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]').clear({
      force: true,
    });
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]').type(
      "5"
    );
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]').type(
      "5"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').should(
      "have.value",
      "100.0"
    );
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.rate"]').type("0");
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get(
      '[data-cy="Manually entered rate should not be 0 if numerator and denominator are not 0"]'
    ).should(
      "have.text",
      "Manually entered rate should not be 0 if numerator and denominator are not 0"
    );
    cy.get('[data-cy="Performance Measure Error"]').should(
      "have.text",
      "Performance Measure Error"
    );
  });

  //   If AHRQ is selected (measure specification) each age range for which there are n/d/r values entered are represented in:
  //   - Deviations for measure specifications
  //   - Optional Measure specification
  it("Age ranges are represented in DMS and OMS", () => {
    cy.wait(1000);
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[id="DataSource0-checkbox"]').check({ force: true });
    cy.get('[id="DataSource1-checkbox"]').uncheck({ force: true });
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.numerator"]').type(
      "5"
    );
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.0.denominator"]').type(
      "10"
    );
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.1.numerator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.1.numerator"]').type(
      "20"
    );
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.1.denominator"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure-AgeRates-30Days.1.denominator"]').type(
      "40"
    );
    cy.get('[data-cy="DidCalculationsDeviate0"]').click();
    cy.get(
      "body.chakra-ui-light:nth-child(2) div:nth-child(1) main:nth-child(2) div.chakra-container.css-4hb9ch div.chakra-skeleton.css-cdkrf0 > form:nth-child(1)"
    ).should("be.visible");

    cy.get(
      '[data-cy="CategoriesReported0"] > .chakra-checkbox__control'
    ).click();
    cy.get("#CategoriesReported0-checkbox").check();
    cy.get(
      '[data-cy="NonHispanicRacialCategories0"] > .chakra-checkbox__control'
    ).click();
    cy.get("#NonHispanicRacialCategories0-checkbox").check();
    cy.get(
      '[data-cy="NHRC-WhiteRates.ageData0"] > .chakra-checkbox__label > .chakra-text'
    ).should("be.visible");
    cy.get(
      '[data-cy="NHRC-WhiteRates.ageData1"] > .chakra-checkbox__label > .chakra-text'
    ).should("be.visible");
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.1.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure-AgeRates-30Days.1.numerator"]'
    ).clear();
  });

  // if Other measure spec is selected each age range/ custom description for which there are n/d/r
  // values entered in other performance measure are presented in:
  //  - Optional Measure specification
  it("Age ranges are represented in OMS when other measure spec", () => {
    cy.wait(2000);
    // cy.get('[data-cy="DidReport0"]').click({ force: true });
    cy.get('[data-cy="MeasurementSpecification1"]').click();
    cy.get('[id="DataSource0-checkbox"]').check({ force: true });
    cy.get('[id="DataSource1-checkbox"]').uncheck({ force: true });
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.description"]').clear();
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.description"]').type(
      "example 1"
    );
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.numerator"]'
    ).clear();
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.numerator"]').type(
      "5"
    );
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.denominator"]'
    ).type("10");
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.rate"]').should(
      "have.value",
      "50.0"
    );
    cy.get(
      '[data-cy="CategoriesReported1"] > .chakra-checkbox__control'
    ).click();
    cy.get("#CategoriesReported1-checkbox").check({ force: true });
    cy.get(
      '[data-cy="EthnicityCategories0"] > .chakra-checkbox__control'
    ).click();
    cy.get("#EthnicityCategories0-checkbox").check({ force: true });
    cy.get(
      '[data-cy="NonHispanicEthnicityRates.ageData0"] > .chakra-checkbox__label > .chakra-text'
    ).should("be.visible");
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.numerator"]'
    ).clear();
  });
});
