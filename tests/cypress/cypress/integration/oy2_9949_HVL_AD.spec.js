const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";

describe("OY2 9949 HVL_AD", () => {
  beforeEach(() => {
    // Seed database with test data
    cy.visit("/");
    cy.xpath(emailForCognito).type("stateuser1@test.com");
    cy.xpath(passwordForCognito).type("p@55W0rd!");
    cy.get('[data-cy="login-with-cognito-button"]').click();
  });
  it("Click on Validate Measure button without filling out the form", () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="ACS"]').click();
    cy.get('[data-cy="HVL-AD"]').click();
    cy.wait(2000);
    cy.get('[data-cy="Clear Data"]').click();
    cy.get('[data-cy="HVL-AD"]').click();
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get('[data-cy="Date Range Error"]').should(
      "have.text",
      "Date Range Error"
    );
    cy.get('[data-cy="Date Range must be completed"] > .chakra-text').should(
      "have.text",
      "Date Range must be completed"
    );
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
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it("Fill out form HVL-AD", function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="ACS"]').click();
    cy.get('[data-cy="HVL-AD"]').click();
    cy.get('[data-cy="DidReport0"]').click({ force: true });
    cy.get('[data-cy="DataStatus0"]').click();
    cy.get('[data-cy="DataStatus-ProvisionalExplanation"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[data-cy="DataSource0"] > .chakra-checkbox__control').click();
    cy.xpath("(//label[@data-cy='DataSource0']/span)[1]").click();
    cy.get('[data-cy="DataSource1"] > .chakra-checkbox__control').click();
    cy.get('[data-cy="DataSource2"] > .chakra-checkbox__control').click();
    cy.get("#DataSource2-checkbox").check();
    cy.get(
      '[data-cy="DataSourceSelections.OtherDataSource.description"]'
    ).click();
    cy.get('[data-cy="DataSourceDescription"]').click();
    cy.get('[data-cy="DateRange.startDate-month"]').clear();
    cy.get('[data-cy="DateRange.startDate-month"]').type("10");
    cy.get('[data-cy="DateRange.startDate-year"]').clear();
    cy.get('[data-cy="DateRange.startDate-year"]').type("2020");
    cy.get('[data-cy="DateRange.endDate-month"]').clear();
    cy.get('[data-cy="DateRange.endDate-month"]').type("10");
    cy.get('[data-cy="DateRange.endDate-year"]').clear();
    cy.get('[data-cy="DateRange.endDate-year"]').type("2021");
    cy.get(".css-14tgbft > :nth-child(1)").should(
      "have.text",
      "Denominator includes Medicaid population"
    );
    cy.get(".css-14tgbft > :nth-child(2)").should(
      "have.text",
      "Denominator includes Medicare and Medicaid Dually-Eligible population"
    );
    cy.get(
      '[data-cy="DefinitionOfDenominator0"] > .chakra-checkbox__control'
    ).click();
    cy.get("#DefinitionOfDenominator0-checkbox").check();
    cy.get(
      '[data-cy="DefinitionOfDenominator1"] > .chakra-checkbox__control'
    ).click();
    cy.get("#DefinitionOfDenominator1-checkbox").check();
    cy.get(
      '[data-cy="DefinitionOfDenominator2"] > .chakra-checkbox__control'
    ).click();
    cy.get("#DefinitionOfDenominator2-checkbox").check();
    cy.get(
      '[data-cy="DefinitionOfDenominator3"] > .chakra-checkbox__control'
    ).click();
    cy.get("#DefinitionOfDenominator3-checkbox").check();
    cy.get('[data-cy="DefinitionOfDenominator-Other"]').click();
    cy.get('[data-cy="ChangeInPopulationExplanation"]').click();
    cy.get(
      "#DenominatorDefineTotalTechSpec_radiogroup > .chakra-stack > :nth-child(1) > .chakra-radio"
    ).click();
    cy.get("#radio-194").check();
    cy.get(
      '[data-cy="DeliverySysRepresentationDenominator0"] > .chakra-checkbox__control'
    ).click();
    cy.get("#DeliverySysRepresentationDenominator0-checkbox").check();
    cy.get('[data-cy="DeliverySys-FeeForService1"]').click();
    cy.get('[data-cy="DeliverySysRepresentationDenominator1"]').click();
    cy.get("#DeliverySysRepresentationDenominator1-checkbox").check();
    cy.get('[data-cy="DeliverySys-PrimaryCareManagement1"]').click();
    cy.get(
      '[data-cy="What percent of your measure-eligible Primary Care Case Management (PCCM) population are included in the measure?"]'
    ).should(
      "have.text",
      "What percent of your measure-eligible Primary Care Case Management (PCCM) population are included in the measure?"
    );

    cy.get(".css-1f2vcwt > .chakra-text").should(
      "have.text",
      "The percentage provided here should represent the percentage of the denominator population(s) included in the measure (i.e., Medicaid, CHIP, etc.) that receives items/services through the selected delivery system. For example, if the population included in the reported data represents all managed care enrollees and half of your state’s fee-for-service enrollees, select managed care, and select fee-for-service and enter 50."
    );

    cy.get(
      '[data-cy="What number of your measure-eligible Primary Care Case Management (PCCM) population are included in the measure? (optional)"]'
    ).should(
      "have.text",
      "What number of your measure-eligible Primary Care Case Management (PCCM) population are included in the measure? (optional)"
    );
    cy.get(
      '[data-cy="DeliverySysRepresentationDenominator2"] > .chakra-checkbox__control'
    ).click();
    cy.get("#DeliverySysRepresentationDenominator2-checkbox").check();
    cy.get('[data-cy="DeliverySys-MCO_PIHP1"]').click();
    cy.get(".css-98urqk").should(
      "have.text",
      "What percent of your measure-eligible Managed Care Organization/Pre-paid Inpatient Health Plan (MCO/PIHP) population are included in the measure?"
    );
    cy.get(
      "#DeliverySys-MCO_PIHP_radiogroup > .chakra-stack > :nth-child(2) > .chakra-collapse > .css-zhlq69 > .css-1u9gfme"
    ).should(
      "have.text",
      " How many of your measure-eligible Managed Care Organization/Pre-paid Inpatient Health Plan (MCO/PIHP) plans are excluded from the measure? If none are excluded, please enter zero."
    );
    cy.get(
      '[data-cy="DeliverySysRepresentationDenominator3"] > .chakra-checkbox__control'
    ).click();
    cy.get("#DeliverySysRepresentationDenominator3-checkbox").check();
    cy.get('[data-cy="DeliverySys-IntegratedCareModel1"]').click();
    cy.get(
      '[data-cy="How many of your measure-eligible Integrated Care Models (ICM) plans are excluded from the measure? If none are excluded, please enter zero."]'
    ).should(
      "have.text",
      "How many of your measure-eligible Integrated Care Models (ICM) plans are excluded from the measure? If none are excluded, please enter zero."
    );
    cy.get(
      '[data-cy="DeliverySysRepresentationDenominator4"] > .chakra-checkbox__control'
    ).click();
    cy.get("#DeliverySysRepresentationDenominator4-checkbox").check();
    cy.get(
      '[data-cy="Number of measure-eligible state population represented in data reported:"]'
    ).should(
      "have.text",
      "Number of measure-eligible state population represented in data reported:"
    );
    cy.get('[data-cy="PerformanceMeasure.explanation"]').click();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).type("3");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).type("30");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.1.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.1.numerator"]'
    ).type("2");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.1.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.1.denominator"]'
    ).type("30");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).type("0");
    cy.get('[data-cy="Ages 18 to 64"]').click();
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "have.value",
      "0.0"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.1.rate"]').should(
      "have.value",
      "6.7"
    );
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.1.rate"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.1.rate"]').type(
      "97.9"
    );
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.1.denominator"]'
    ).click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="DidCalculationsDeviate0"]').click();
    cy.get("#radio-212").check();
    cy.get('[data-cy="DeviationOptions0"]').click();
    cy.get("#DeviationOptions0-checkbox").check();
    cy.get(
      '[data-cy="Deviations.Ages18to64.RateDeviationsSelected0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#Deviations\\.Ages18to64\\.RateDeviationsSelected0-checkbox"
    ).check();
    cy.get('[data-cy="Deviations.Ages18to64.numerator"]').click();
    cy.get(
      '[data-cy="Deviations.Ages18to64.RateDeviationsSelected1"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#Deviations\\.Ages18to64\\.RateDeviationsSelected1-checkbox"
    ).check();
    cy.get('[data-cy="Deviations.Ages18to64.denominator"]').click();
    cy.get(
      '[data-cy="Deviations.Ages18to64.RateDeviationsSelected2"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#Deviations\\.Ages18to64\\.RateDeviationsSelected2-checkbox"
    ).check();
    cy.get('[data-cy="Deviations.Ages18to64.other"]').click();
    cy.get('[data-cy="DeviationOptions1"] > .chakra-checkbox__control').click();
    cy.get("#DeviationOptions1-checkbox").check();
    cy.get(
      '[data-cy="Deviations.Age65andolder.RateDeviationsSelected0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#Deviations\\.Age65andolder\\.RateDeviationsSelected0-checkbox"
    ).check();
    cy.get('[data-cy="Deviations.Age65andolder.numerator"]').click();
    cy.get(
      '[data-cy="Deviations.Age65andolder.RateDeviationsSelected1"]'
    ).click();
    cy.get(
      "#Deviations\\.Age65andolder\\.RateDeviationsSelected1-checkbox"
    ).check();
    cy.get('[data-cy="Deviations.Age65andolder.denominator"]').click();
    cy.get(
      '[data-cy="Deviations.Age65andolder.RateDeviationsSelected2"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#Deviations\\.Age65andolder\\.RateDeviationsSelected2-checkbox"
    ).check();
    cy.get('[data-cy="Deviations.Age65andolder.other"]').click();
    cy.get('[data-cy="CombinedRates0"]').click();
    cy.get("#radio-199").check();
    cy.get('[data-cy="CombinedRates-CombinedRates0"]').click();
    cy.get('[data-cy="CombinedRates-CombinedRates1"]').click();
    cy.get('[data-cy="CombinedRates-CombinedRates2"]').click();
    cy.get('[data-cy="CombinedRates-CombinedRates-Other-Explanation"]').click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get("#OptionalMeasureStratification\\.options0-checkbox").check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#OptionalMeasureStratification\\.selections\\.RaceNonHispanic\\.options0-checkbox"
    ).check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.options0"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Ages 18 to 64");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.options1"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Age 65 and older");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#OptionalMeasureStratification\\.selections\\.RaceNonHispanic\\.selections\\.White\\.rateData\\.options0-checkbox"
    ).check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Ages18to64.singleCategory.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Ages18to64.singleCategory.0.numerator"]'
    ).type("2");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Ages18to64.singleCategory.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Ages18to64.singleCategory.0.denominator"]'
    ).type("20");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.options1"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#OptionalMeasureStratification\\.selections\\.RaceNonHispanic\\.selections\\.White\\.rateData\\.options1-checkbox"
    ).check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Age65andolder.singleCategory.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Age65andolder.singleCategory.0.numerator"]'
    ).type("1");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Age65andolder.singleCategory.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Age65andolder.singleCategory.0.denominator"]'
    ).type("20");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Ages18to64.singleCategory.0.rate"]'
    ).should("have.value", "10.0");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Ages18to64.singleCategory.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Ages18to64.singleCategory.0.numerator"]'
    ).type("0");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Ages18to64.singleCategory.0.rate"]'
    ).should("have.value", "0.0");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Age65andolder.singleCategory.0.rate"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Age65andolder.singleCategory.0.rate"]'
    ).type("12.3");
    cy.get(
      ".css-1h4ws66 > :nth-child(1) > .css-n21gh5 > :nth-child(2) > .chakra-collapse > .css-zhlq69"
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.White.rateData.rates.Age65andolder.singleCategory.0.rate"]'
    ).should("have.value", "12.3");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.options1"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#OptionalMeasureStratification\\.selections\\.RaceNonHispanic\\.options1-checkbox"
    ).check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.options2"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#OptionalMeasureStratification\\.selections\\.RaceNonHispanic\\.options2-checkbox"
    ).check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.options3"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#OptionalMeasureStratification\\.selections\\.RaceNonHispanic\\.options3-checkbox"
    ).check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.Asian.aggregate1"]'
    ).click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.Asian.options0"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Asian Indian");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.Asian.options1"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Chinese");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.Asian.options2"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Filipino");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.Asian.options3"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Japanese");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.Asian.options4"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Korean");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.Asian.options5"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Vietnamese");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.RaceNonHispanic.selections.Asian.options6"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Other Asian");
    cy.get(
      '[data-cy="OptionalMeasureStratification.options1"] > .chakra-checkbox__control'
    ).click();
    cy.get("#OptionalMeasureStratification\\.options1-checkbox").check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.options2"] > .chakra-checkbox__control'
    ).click();
    cy.get("#OptionalMeasureStratification\\.options2-checkbox").check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.options3"] > .chakra-checkbox__control'
    ).click();
    cy.get("#OptionalMeasureStratification\\.options3-checkbox").check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.options3"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Primary Language (including sign language)");
    cy.get('[data-cy="OptionalMeasureStratification.options4"]').click();
    cy.get("#OptionalMeasureStratification\\.options4-checkbox").check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.options5"] > .chakra-checkbox__control'
    ).click();
    cy.get("#OptionalMeasureStratification\\.options5-checkbox").check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.options5"] > .chakra-checkbox__control > div'
    ).click();
    cy.get("#OptionalMeasureStratification\\.options5-checkbox").uncheck();
    cy.get(
      '[data-cy="OptionalMeasureStratification.options5"] > .chakra-checkbox__control'
    ).click();
    cy.get("#OptionalMeasureStratification\\.options5-checkbox").check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.options6"] > .chakra-checkbox__control'
    ).click();
    cy.get("#OptionalMeasureStratification\\.options6-checkbox").check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.options6"] > .chakra-checkbox__label > .chakra-text'
    ).should("have.text", "Adult Eligibility Group (ACA Expansion Group)");
    cy.get('[data-cy="AdditionalNotes-AdditionalNotes"]').click();
    cy.get('[data-cy="Validate Measure"]').click();
    cy.wait(2000);
    cy.get(
      '[data-cy="Optional Measure Stratification: Adult Eligibility Group (ACA Expansion Group) Error"]'
    ).should(
      "have.text",
      "Optional Measure Stratification: Adult Eligibility Group (ACA Expansion Group) Error"
    );
    cy.get(
      '[data-cy="Optional Measure Stratification: Disability Status Error"]'
    ).should(
      "have.text",
      "Optional Measure Stratification: Disability Status Error"
    );
    cy.get(
      ':nth-child(3) > div.css-0 > [data-cy="Must fill out at least one NDR set."] > .chakra-text'
    ).should("have.text", "Must fill out at least one NDR set.");
    cy.get(
      '[data-cy="Optional Measure Stratification: Ethnicity Error"]'
    ).should("have.text", "Optional Measure Stratification: Ethnicity Error");
    cy.get(
      ':nth-child(4) > div.css-0 > [data-cy="Must fill out at least one NDR set."] > .chakra-text'
    ).should("have.text", "Must fill out at least one NDR set.");
    cy.get(
      '[data-cy="Optional Measure Stratification: Geography Error"]'
    ).should("have.text", "Optional Measure Stratification: Geography Error");
    cy.get(
      ':nth-child(5) > div.css-0 > [data-cy="Must fill out at least one NDR set."] > .chakra-text'
    ).should("have.text", "Must fill out at least one NDR set.");
    cy.get(
      '[data-cy="Optional Measure Stratification: Primary Language (including sign language) Error"]'
    ).should(
      "have.text",
      "Optional Measure Stratification: Primary Language (including sign language) Error"
    );
    cy.get(
      ':nth-child(6) > div.css-0 > [data-cy="Must fill out at least one NDR set."] > .chakra-text'
    ).should("have.text", "Must fill out at least one NDR set.");
    cy.get('[data-cy="Optional Measure Stratification: Sex Error"]').should(
      "have.text",
      "Optional Measure Stratification: Sex Error"
    );
    cy.get(
      ':nth-child(7) > div.css-0 > [data-cy="Must fill out at least one NDR set."] > .chakra-text'
    ).should("have.text", "Must fill out at least one NDR set.");
    /* ==== End Cypress Studio ==== */
  });
});
