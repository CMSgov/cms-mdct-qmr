import { testingYear } from "../../../../support/constants";

describe("Measure: CDF-HH", () => {
  beforeEach(() => {
    cy.loginHealthHome();
    cy.selectYear(testingYear);
    cy.goToHealthHomeSetMeasures();
    cy.goToMeasure("CDF-HH");
  });

  it("Ensure correct sections display if user is/not reporting", () => {
    cy.displaysSectionsWhenUserNotReporting();
    cy.displaysSectionsWhenUserIsReporting();
  });

  it(
    "If not reporting and not why not -> show error",
    cy.showErrorIfNotReportingAndNotWhy
  );

  it("should show correct data source options", () => {
    cy.get("#MeasurementSpecification-CMS").should(
      "have.text",
      "Centers for Medicare & Medicaid Services (CMS)"
    );
    cy.get("#MeasurementSpecification-Other").should("have.text", "Other");
  });

  it("should include correct Definition of Population options", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get(
      '[data-cy="Definition of Population Included in the Measure"]'
    ).should("be.visible");
    cy.get('[data-cy="DefinitionOfDenominator0"]').should(
      "include.text",
      "Denominator includes Medicaid population"
    );
    cy.get('[data-cy="DefinitionOfDenominator2"]').should(
      "include.text",
      "Denominator includes Medicare and Medicaid Dually-Eligible population"
    );
    cy.get('[data-cy="DefinitionOfDenominator3"]').should(
      "include.text",
      "Other"
    );
    cy.get('[data-cy="DefinitionOfDenominator1"]').should("not.exist");
  });

  it("should include 'Are all Health Home Providers represented in the denominator?' question", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get(
      '[data-cy="Are all Health Home Providers represented in the denominator?"]'
    ).should("be.visible");
    cy.get("#DenominatorDefineHealthHome-yes").should("be.visible");
    cy.get("#DenominatorDefineHealthHome-no").should("be.visible");
  });

  it("if primary measurement spec is selected -> show performance measures", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[data-cy="Performance Measure"]').should("be.visible");
  });

  it("if other measurement spec is selected -> show other performance measures", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification1"]').click();
    cy.get(
      '[data-cy="MeasurementSpecification-OtherMeasurementSpecificationDescription"]'
    ).should("be.visible");
    cy.get('[data-cy="Other Performance Measure"]').should("be.visible");
  });

  it(
    "at least one ndr set if reporting and measurement spec or error.",
    cy.showErrorIfReportingAndNoNdrSet
  );

  it(
    "if yes for combined rates → and no additional selection → show warning",
    cy.showErrorIfCombinedRatesAndNoAdditionalSelection
  );

  it("displays validation warnings when a user selects Yes for Deviation and/or Combined Rates without making any sub-selections", () => {
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[data-cy="DidCalculationsDeviate0"]').click();
    cy.get('[data-cy="CombinedRates0"]').click();
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get('[data-testid="measure-wrapper-form"]').should(
      "include.text",
      "Combined Rate(s) ErrorYou must select at least one option for Combined Rate(s) Details if Yes is selected."
    );
    cy.get('[data-testid="measure-wrapper-form"]').should(
      "include.text",
      "Performance Measure/Other Performance Measure ErrorAt least one Performance Measure Numerator, Denominator, and Rate must be completed"
    );
  });

  it("should calculate totals correctly", () => {
    cy.get("#MeasurementSpecification-CMS").click();

    // PM
    cy.get('[data-cy="PerformanceMeasure.rates.yhQjRm.0.numerator"]').type("1");
    cy.get('[data-cy="PerformanceMeasure.rates.yhQjRm.1.numerator"]').type("1");
    cy.get('[data-cy="PerformanceMeasure.rates.yhQjRm.0.denominator"]').type(
      "1"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.yhQjRm.1.denominator"]').type(
      "1"
    );

    cy.get('[data-cy="PerformanceMeasure.rates.yhQjRm.3.numerator"]').should(
      "have.value",
      "2"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.yhQjRm.3.denominator"]').should(
      "have.value",
      "2"
    );

    // OMS
    cy.get('[data-cy="OptionalMeasureStratification.options0"]').click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Race.options0"]'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Race.selections.AmericanIndianorAlaskaNative.rateData.rates.yhQjRm.Total.0.numerator"]'
    ).type("1");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Race.selections.AmericanIndianorAlaskaNative.rateData.rates.yhQjRm.Total.0.numerator"]'
    ).type("1");
  });
});
