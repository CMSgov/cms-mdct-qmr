import { testingYear } from "../../../../support/constants";

describe("Measure: WCC-CH", () => {
  beforeEach(() => {
    cy.login();
    cy.selectYear(testingYear);
    cy.goToChildCoreSetMeasures();
    cy.goToMeasure("WCC-CH");
  });

  it("Ensure correct sections display if user is/not reporting", () => {
    cy.displaysSectionsWhenUserNotReporting();
    cy.displaysSectionsWhenUserIsReporting();
  });

  it("Ensure error message when not enter any data in the form and verify Data Source", () => {
    cy.get(
      '[data-cy="DataSource0"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Administrative Data");
    cy.get(
      '[data-cy="DataSource1"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Hybrid (Administrative and Medical Records Data)");
    cy.get(
      '[data-cy="DataSource2"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Electronic Health Records");
    cy.get(
      '[data-cy="DataSource3"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Other Data Source");
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get('[data-cy="Date Range Error"]').should(
      "have.text",
      "Date Range Error"
    );
    cy.get(
      '[data-cy="Date Range answer must be selected"] > .chakra-text'
    ).should("have.text", "Date Range answer must be selected");
    cy.get(
      '[data-cy="Performance Measure/Other Performance Measure Error"]'
    ).should(
      "have.text",
      "Performance Measure/Other Performance Measure Error"
    );
    cy.get(
      '[data-cy="At least one Performance Measure Numerator, Denominator, and Rate must be completed"] > .chakra-text'
    ).should(
      "have.text",
      "At least one Performance Measure Numerator, Denominator, and Rate must be completed"
    );
  });

  it("Validate Equal Qualifier Denominators", () => {
    cy.get("#MeasurementSpecification-NCQAHEDIS").click();
    cy.get('[data-cy="DataSource3"]').click();

    // PM
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.0.numerator"]').type("1");
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.0.denominator"]').type(
      "2"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.1.numerator"]').type("1");
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.1.denominator"]').type(
      "3"
    );

    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.0.numerator"]').type("1");
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.0.denominator"]').type(
      "1"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.1.numerator"]').type("1");
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.1.denominator"]').type(
      "3"
    );

    // PM Validations
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get(
      '[data-cy="The Ages 3 to 11 denominator must be the same for each indicator."] > .chakra-text'
    ).should("be.visible");
    cy.get(
      '[data-cy="Total (Ages 3 to 17) denominator must be the same for each indicator."] > .chakra-text'
    ).should("be.visible");

    // Clear PM Validations
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.0.denominator"]')
      .clear()
      .type("2");
    cy.get('[data-cy="Validate Measure"]').click();

    // OMS
    // TODO: test OMS validations

    // OMS Validations
  });

  it("Fill out the WCC-CH form and verify NDR section in PM OMS", function () {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="DataStatus0"]').click();
    cy.get('[data-cy="DataStatus-ProvisionalExplanation"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[data-cy="MeasurementSpecification-HEDISVersion"]').select(
      "HEDIS MY 2020"
    );
    cy.get('[data-cy="DataSource0"]').click();
    cy.get(
      '[data-cy="DataSourceSelections.AdministrativeData0.selected1"] > .chakra-checkbox__control'
    ).click();
    cy.get('[data-cy="DataSource1"] > .chakra-checkbox__control').click();
    cy.get(
      '[data-cy="DataSourceSelections.HybridAdministrativeandMedicalRecordsData0.selected0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      '[data-cy="DataSourceSelections.HybridAdministrativeandMedicalRecordsData1.selected0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      '[data-cy="DataSourceSelections.HybridAdministrativeandMedicalRecordsData1.selected1"] > .chakra-checkbox__control'
    ).click();
    cy.get('[data-cy="DataSource2"] > .chakra-checkbox__control').click();
    cy.get('[data-cy="DataSource3"] > .chakra-checkbox__control').click();
    cy.get('[data-cy="DataSourceDescription"]').click();
    cy.get(
      '[data-cy="MeasurementPeriodAdhereToCoreSetSpecification1"]'
    ).click();
    cy.get('[data-cy="DateRange.startDate-month"]').clear();
    cy.get('[data-cy="DateRange.startDate-month"]').type("10");
    cy.get('[data-cy="DateRange.startDate-year"]').clear();
    cy.get('[data-cy="DateRange.startDate-year"]').type("2021");
    cy.get('[data-cy="DateRange.endDate-month"]').clear();
    cy.get('[data-cy="DateRange.endDate-month"]').type("10");
    cy.get('[data-cy="DateRange.endDate-year"]').clear();
    cy.get('[data-cy="DateRange.endDate-year"]').type("2022");

    cy.get('[data-cy="DefinitionOfDenominator0"]').click();
    cy.get('[data-cy="DefinitionOfDenominator1"]').click();
    cy.get('[data-cy="DefinitionOfDenominator2"]').click();
    cy.get('[data-cy="ChangeInPopulationExplanation"]').click();
    cy.get('[data-cy="DenominatorDefineTotalTechSpec0"]').click();
    cy.get(
      "#DenominatorDefineTotalTechSpec_radiogroup > .chakra-stack > :nth-child(2) > .chakra-radio"
    ).click();
    cy.get('[data-cy="DenominatorDefineTotalTechSpec-No-Explanation"]').click();
    cy.get('[data-cy="DenominatorDefineTotalTechSpec-No-Size"]').clear();
    cy.get('[data-cy="DenominatorDefineTotalTechSpec-No-Size"]').type("12");
    cy.get('[data-cy="HybridMeasurePopulationIncluded"]').clear();
    cy.get('[data-cy="HybridMeasurePopulationIncluded"]').type("12");
    cy.get('[data-cy="HybridMeasureSampleSize"]').clear();
    cy.get('[data-cy="HybridMeasureSampleSize"]').type("11");
    /* ==== Fill out the question Which delivery systems are represented in the denominator ==== */
    cy.get(
      '[data-cy="DeliverySysRepresentationDenominator0"] > .chakra-checkbox__control'
    ).click();
    cy.get('[data-cy="DeliverySys-FeeForService1"]').click();
    cy.get('[data-cy="DeliverySys-FeeForService-No-Percent"]').clear();
    cy.get('[data-cy="DeliverySys-FeeForService-No-Percent"]').type("12");
    cy.get(
      '[data-cy="DeliverySysRepresentationDenominator1"] > .chakra-checkbox__control'
    ).click();
    cy.get('[data-cy="DeliverySys-PrimaryCareManagement1"]').click();
    cy.get('[data-cy="DeliverySys-PrimaryCareManagement-No-Percent"]').clear();
    cy.get('[data-cy="DeliverySys-PrimaryCareManagement-No-Percent"]').type(
      "12"
    );
    cy.get(
      '[data-cy="DeliverySysRepresentationDenominator2"] > .chakra-checkbox__control'
    ).click();
    cy.get('[data-cy="DeliverySys-MCO_PIHP-NumberOfPlans"]').clear();
    cy.get('[data-cy="DeliverySys-MCO_PIHP-NumberOfPlans"]').type("12");
    cy.get('[data-cy="DeliverySys-MCO_PIHP1"]').click();
    cy.get('[data-cy="DeliverySys-MCO_PIHP-No-Included"]').clear();
    cy.get('[data-cy="DeliverySys-MCO_PIHP-No-Included"]').type("12");
    cy.get('[data-cy="DeliverySys-MCO_PIHP-No-Excluded"]').clear();
    cy.get('[data-cy="DeliverySys-MCO_PIHP-No-Excluded"]').type("11");
    cy.get(
      '[data-cy="DeliverySysRepresentationDenominator3"] > .chakra-checkbox__control'
    ).click();
    cy.get('[data-cy="DeliverySys-IntegratedCareModel1"]').click();
    cy.get('[data-cy="DeliverySys-IntegratedCareModel-No-Percent"]').clear();
    cy.get('[data-cy="DeliverySys-IntegratedCareModel-No-Percent"]').type("12");
    cy.get('[data-cy="DeliverySys-IntegratedCareModel-No-Population"]').clear();
    cy.get('[data-cy="DeliverySys-IntegratedCareModel-No-Population"]').type(
      "11"
    );
    cy.get(
      '[data-cy="DeliverySysRepresentationDenominator4"] > .chakra-checkbox__control'
    ).click();
    cy.get('[data-cy="DeliverySys-Other"]').click();
    cy.get('[data-cy="DeliverySys-Other-Percent"]').clear();
    cy.get('[data-cy="DeliverySys-Other-Percent"]').type("12");
    cy.get('[data-cy="DeliverySys-Other-NumberOfHealthPlans"]').clear();
    cy.get('[data-cy="DeliverySys-Other-NumberOfHealthPlans"]').type("11");
    /* ==== End Cypress Studio ==== */
    /* ==== Fill out Performance Measure section ==== */
    cy.get(".css-xiz5n3 > :nth-child(1)").should(
      "have.text",
      "Body mass index (BMI) percentile documentation"
    );
    cy.get(".css-xiz5n3 > :nth-child(2)").should(
      "have.text",
      "Counseling for Nutrition"
    );
    cy.get(".css-xiz5n3 > :nth-child(3)").should(
      "have.text",
      "Counseling for Physical Activity"
    );
    cy.get('[data-cy="PerformanceMeasure.explanation"]').click();
    cy.get('[data-cy="PerformanceMeasure.hybridExplanation"]').click();
    cy.get(
      '[data-cy="Enter a number for the numerator and the denominator"]'
    ).should(
      "have.text",
      "Enter a number for the numerator and the denominator. Rate will\n          auto-calculate:"
    );
    cy.get("li:nth-child(1)").should(
      "have.text",
      "Body mass index (BMI) percentile documentation"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.0.numerator"]').click();
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.0.numerator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.0.numerator"]').type(
      "12"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.0.denominator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.0.denominator"]').type(
      "33"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.0.rate"]').should(
      "have.value",
      "36.4"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.1.numerator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.1.numerator"]').type(
      "13"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.1.denominator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.1.denominator"]').type(
      "22"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.1.rate"]').should(
      "have.value",
      "59.1"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.2.numerator"]').should(
      "have.value",
      "25"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.2.denominator"]').should(
      "have.value",
      "55"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.4TXd3h.2.rate"]').should(
      "have.value",
      "45.5"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.0.numerator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.0.numerator"]').type(
      "12"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.0.denominator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.0.denominator"]').type(
      "22"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.1.numerator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.1.numerator"]').type(
      "11"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.1.denominator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.1.denominator"]').type(
      "22"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.2.numerator"]').should(
      "have.value",
      "23"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.2.denominator"]').should(
      "have.value",
      "44"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.0.rate"]').should(
      "have.value",
      "54.5"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.1.rate"]').should(
      "have.value",
      "50.0"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.cKH5gj.2.rate"]').should(
      "have.value",
      "52.3"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.0.numerator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.0.numerator"]').type(
      "222"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.0.denominator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.0.denominator"]').type(
      "3333"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.1.numerator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.1.numerator"]').type(
      "12"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.1.denominator"]').click();
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.1.denominator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.1.denominator"]').type(
      "333"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.2.numerator"]').should(
      "have.value",
      "234"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.2.denominator"]').should(
      "have.value",
      "3666"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.0.rate"]').should(
      "have.value",
      "6.7"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.1.rate"]').should(
      "have.value",
      "3.6"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.2.rate"]').should(
      "have.value",
      "6.4"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.0.numerator"]').click();
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.0.numerator"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.0.numerator"]').type("0");
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.0.rate"]').should(
      "have.value",
      "0.0"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.1.rate"]').clear();
    cy.get('[data-cy="PerformanceMeasure.rates.1POxYx.1.rate"]').type("12.3");
    cy.get('[data-cy="DidCalculationsDeviate0"]').click();
    cy.get('[data-cy="DeviationReason"]').click();
    cy.get('[data-cy="CombinedRates0"]').click();
    cy.get('[data-cy="CombinedRates-CombinedRates0"]').click();
    cy.get(
      "#CombinedRates-CombinedRates_radiogroup > .chakra-stack > :nth-child(2) > .chakra-radio"
    ).click();
    cy.get('[data-cy="CombinedRates-CombinedRates2"]').click();
    cy.get('[data-cy="CombinedRates-CombinedRates-Other-Explanation"]').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(
      '[data-cy="OptionalMeasureStratification.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.4TXd3h.Total.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.4TXd3h.Total.0.numerator"]'
    ).type("12");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.4TXd3h.Total.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.4TXd3h.Total.0.denominator"]'
    ).type("33");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.4TXd3h.Total.0.rate"]'
    ).should("have.value", "36.4");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.cKH5gj.Total.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.cKH5gj.Total.0.numerator"]'
    ).type("11");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.cKH5gj.Total.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.cKH5gj.Total.0.denominator"]'
    ).type("20");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.cKH5gj.Total.0.rate"]'
    ).should("have.value", "55.0");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.1POxYx.Total.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.1POxYx.Total.0.numerator"]'
    ).type("5");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.1POxYx.Total.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.1POxYx.Total.0.denominator"]'
    ).type("9");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.ll9YP8.rateData.rates.1POxYx.Total.0.rate"]'
    ).should("have.value", "55.6");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.options3"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.3dpUZu.selections.NativeHawaiianorOtherPacificIslander.aggregate1"]'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.options1"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Ethnicity");
    cy.get(
      '[data-cy="OptionalMeasureStratification.options2"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Sex");
    cy.get(
      '[data-cy="OptionalMeasureStratification.options3"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Geography");
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get(
      '[data-cy="Denominators must be the same for each category."]'
    ).should("have.text", "Denominators must be the same for each category.");
    cy.get(
      '[data-cy="The Ages 3 to 11 denominator must be the same for each indicator."] > .chakra-text'
    ).should(
      "have.text",
      "The Ages 3 to 11 denominator must be the same for each indicator."
    );
    /* ==== End Cypress Studio ==== */
  });
});
