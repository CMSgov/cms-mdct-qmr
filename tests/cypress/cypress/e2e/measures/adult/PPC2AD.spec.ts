import { testingYear } from "../../../../support/constants";

describe("Measure: PPC2-AD", () => {
  beforeEach(() => {
    cy.login();
    cy.selectYear(testingYear);
    cy.goToAdultMeasures();
    cy.goToMeasure("PPC2-AD");
  });

  it("Ensure correct sections display if user is/not reporting", () => {
    cy.displaysSectionsWhenUserNotReporting();
    cy.displaysSectionsWhenUserIsReporting();
  });

  it("Ensure Data Source question includes Administrative Data, Hybrid and Other Data Source selections. No warning displayed when N=0, D>0, R>0", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[data-cy="MeasurementSpecification-HEDISVersion"]').select(
      "HEDIS MY 2022"
    );
    cy.get('[data-cy="DataSource1"]').click();
    cy.get(
      '[data-cy="DataSourceSelections.HybridAdministrativeandMedicalRecordsData0.selected0"]'
    ).click();
    cy.get(
      '[data-cy="DataSourceSelections.HybridAdministrativeandMedicalRecordsData1.selected0"]'
    ).click();
    cy.get('[data-cy="DefinitionOfDenominator0"]').click();
    cy.get('[data-cy="DenominatorDefineTotalTechSpec0"]').click();

    cy.enterValidDateRange();

    cy.get('[data-cy="HybridMeasurePopulationIncluded"]').type("0");

    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.numerator"]').type("0");
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.denominator"]').type(
      "5"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "have.value",
      "0.0"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').type("5");

    cy.get('[data-cy="DeliverySysRepresentationDenominator0"]').click();
    cy.get('[data-cy="DeliverySys-FeeForService0"]').click();

    cy.get('[data-cy="Validate Measure"]').click();

    cy.get(
      '[data-cy="The measure has been validated successfully"] > .chakra-text'
    ).should("have.text", "The measure has been validated successfully");
  });

  it("Rate calculation should be correct", () => {
    // select is reporting
    cy.get('[data-cy="DidReport0"]').click();

    // select AHRQ for measurement specification
    cy.get('[data-cy="MeasurementSpecification0"]').click();

    cy.get('[data-cy="DataSource0"]').click();

    // Rate calculation should be = (N/D*100)
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.numerator"]').type("5");
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.denominator"]').type(
      "10"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "have.value",
      "50.0"
    );

    // Ensure that auto calculate rate displays 1 decimal (even if the value is zero)
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.numerator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.numerator"]').type("8");
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "have.value",
      "80.0"
    );

    // Ensure that numerical value after decimal is rounded up/down for auto calculated rate (up)
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.denominator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.denominator"]').type(
      "9"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "have.value",
      "88.9"
    );

    // Ensure that numerical value after decimal is rounded up/down for auto calculated rate (down)
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.denominator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.denominator"]').type(
      "18"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "have.value",
      "44.4"
    );

    // Ensure that user cannot manually enter rates if admin data is selected - (already selected)
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "have.attr",
      "readonly"
    );
  });

  it("User can manually adjust rate if other data source is selected", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="DataSource1"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.numerator"]').type(
      "10"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.denominator"]').type(
      "20"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "have.value",
      "50.0"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "not.have.attr",
      "readonly"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').type("48.1");
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "have.value",
      "48.1"
    );
  });

  it("Ensure that warning appears if N=0, D>0, then R should be = 0 for user entered rates.", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[data-cy="DataSource2"]').click();
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.numerator"]').type("0");
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.denominator"]').type(
      "5"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "have.value",
      "0.0"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').type("5");
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get(
      '[data-cy="Manually entered rate should be 0 if numerator is 0"]'
    ).should(
      "have.text",
      "Manually entered rate should be 0 if numerator is 0"
    );
    cy.get(
      '[data-cy="Performance Measure/Other Performance Measure Error"]'
    ).should(
      "have.text",
      "Performance Measure/Other Performance Measure Error"
    );
  });

  it("Ensure that warning appears if N>0, D>0, then R should be >0 for user entered rates.", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[data-cy="DataSource1"]').click();
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.numerator"]').type("5");
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.denominator"]').type(
      "5"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').should(
      "have.value",
      "100.0"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.SyrrI1.0.rate"]').type("0");
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get(
      '[data-cy="Rate should not be 0 if numerator and denominator are not 0. If the calculated rate is less than 0.5, disregard this validation."]'
    ).should(
      "have.text",
      "Rate should not be 0 if numerator and denominator are not 0. If the calculated rate is less than 0.5, disregard this validation."
    );
    cy.get(
      '[data-cy="Performance Measure/Other Performance Measure Error"]'
    ).should(
      "have.text",
      "Performance Measure/Other Performance Measure Error"
    );
  });

  // if Other measure spec is selected each age range/ custom description for which there are n/d/r
  // values entered in other performance measure are presented in:
  //  - Optional Measure specification
  it("Age ranges are represented in OMS when other measure spec", () => {
    cy.get('[data-cy="MeasurementSpecification1"]').click();
    cy.get('[data-cy="DataSource0"]').click();
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.description"]').type(
      "example 1"
    );
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.numerator"]').type(
      "5"
    );
    cy.get(
      '[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.denominator"]'
    ).type("10");
    cy.get('[data-cy="OtherPerformanceMeasure-Rates.0.rate.0.rate"]').should(
      "have.value",
      "50.0"
    );
    cy.get('[data-cy="OptionalMeasureStratification.options0"]').click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.options0"]'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.options0"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "example 1");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.options0"]'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.OPM.OPM_example1.0.numerator"]'
    ).type("3");
  });
});
