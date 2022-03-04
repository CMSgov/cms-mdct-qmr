const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";

describe("Measure: PQI15-AD", () => {
  before(() => {
    cy.visit("/");
    cy.login("stateuser2");
    cy.goToAdultMeasures();
    cy.goToMeasure("PQI15-AD");
  });

  it("Ensure correct sections display if user is/not reporting", () => {
    cy.displaysSectionsWhenUserNotReporting();
    cy.displaysSectionsWhenUserIsReporting();
  });

  it("User click on No option for the first question and fill out the form with No option", () => {
    cy.get(".css-itvw0n").should(
      "have.text",
      "For technical questions regarding use of this application, please reach out to MDCT_Help@cms.hhs.gov. For content-related questions about measure specifications, or what information to enter in each field, please reach out to MACQualityTA@cms.hhs.gov."
    );
    cy.get("[data-cy=DidReport1]").click({ force: true });
    cy.get(
      "[data-cy=WhyAreYouNotReporting0] > .chakra-checkbox__control"
    ).click({ force: true });

    cy.get(
      "[data-cy=WhyAreYouNotReporting1] > .chakra-checkbox__control"
    ).click();
  });

  /* ==== Test Created with Cypress Studio ==== */
  it("File upload and button verification", function () {
    const filePath = "/files/";
    cy.xpath("//u[contains(text(),'browse')]").scrollIntoView();
    const browseBTN = "//u[contains(text(),'browse')]";
    cy.xpath(browseBTN).attachFile(filePath + "test3.docx", {
      subjectType: "drag-n-drop",
    });
    cy.get(".css-9uu7yb > .chakra-text").should("be.visible");
    cy.get('[data-cy="Validate Measure"]').should("be.visible");
    cy.get('[data-cy="Complete Measure"]').should("be.visible");
    cy.get("[data-cy=Save]").should("be.visible");
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
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).type("5");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).type("10");
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "have.value",
      "50000.0"
    );

    // Ensure that auto calculate rate displays 1 decimal (even if the value is zero)
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).type("8");
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "have.value",
      "80000.0"
    );

    // Ensure that numerical value after decimal is rounded up/down for auto calculated rate (up)
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).type("9");
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "have.value",
      "88888.9"
    );

    // Ensure that numerical value after decimal is rounded up/down for auto calculated rate (down)
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).type("18");
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "have.value",
      "44444.4"
    );

    // Ensure that user cannot manually enter rates if admin data is selected - (already selected)
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "have.attr",
      "readonly"
    );
  });

  it("User can manually adjust rate if other data source is selected", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="DataSource1"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).type("10");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).type("20");
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "have.value",
      "50000.0"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "not.have.attr",
      "readonly"
    );
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').type(
      "4869568.1"
    );
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "have.value",
      "4869568.1"
    );
  });

  it("Ensure that warning appears if N=0, D>0, then R should be = 0 for user entered rates.", () => {
    cy.wait(1000);
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[id="DataSource0-checkbox"]').uncheck({ force: true });
    cy.get('[id="DataSource1-checkbox"]').check({ force: true });
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).type("0");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).type("5");
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "have.value",
      "0.0"
    );
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').type(
      "5"
    );
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
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[id="DataSource0-checkbox"]').uncheck({ force: true });
    cy.get('[id="DataSource1-checkbox"]').check({ force: true });
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).clear({
      force: true,
    });
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).type("5");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).type("5");
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').should(
      "have.value",
      "100000.0"
    );
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]'
    ).clear();
    cy.get('[data-cy="PerformanceMeasure.rates.singleCategory.0.rate"]').type(
      "0"
    );
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

  // If AHRQ is selected (measure specification) each age range for which there are n/d/r values entered are represented in:
  // - Deviations for measure specifications
  // - Optional Measure specification
  it("Age ranges are represented in DMS and OMS", () => {
    cy.wait(1000);
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[id="DataSource0-checkbox"]').check({ force: true });
    cy.get('[id="DataSource1-checkbox"]').uncheck({ force: true });
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.numerator"]'
    ).type("5");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.singleCategory.0.denominator"]'
    ).type("10");
    cy.get('[data-cy="DidCalculationsDeviate0"]').click();
  });

  // if Other measure spec is selected each age range/ custom description for which there are n/d/r
  // values entered in other performance measure are presented in:
  //  - Optional Measure specification
  it("Age ranges are represented in OMS when other measure spec", () => {
    cy.wait(2000);
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
      "50000.0"
    );
    /* ==== Generated with Cypress Studio ==== */
    cy.get(
      '[data-cy="OptionalMeasureStratification.options1"] > .chakra-checkbox__control'
    ).click();
    cy.get("#OptionalMeasureStratification\\.options1-checkbox").check();
    cy.get("[data-cy=CombinedRates0]").click();
    cy.get("[data-cy=CombinedRates-CombinedRates0]").click();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Ethnicity.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#OptionalMeasureStratification\\.selections\\.Ethnicity\\.options0-checkbox"
    ).check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Ethnicity.selections.NotofHispanicLatinoaorSpanishorigin.ageRangeRates.options0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#OptionalMeasureStratification\\.selections\\.Ethnicity\\.selections\\.NotofHispanicLatinoaorSpanishorigin\\.ageRangeRates\\.options0-checkbox"
    ).check();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Ethnicity.selections.NotofHispanicLatinoaorSpanishorigin.ageRangeRates.options0"] > .chakra-checkbox__label > .chakra-text'
    ).should("be.visible");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Ethnicity.selections.NotofHispanicLatinoaorSpanishorigin.ageRangeRates.rates.example1.0.numerator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Ethnicity.selections.NotofHispanicLatinoaorSpanishorigin.ageRangeRates.rates.example1.0.numerator"]'
    ).type("5");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Ethnicity.selections.NotofHispanicLatinoaorSpanishorigin.ageRangeRates.rates.example1.0.denominator"]'
    ).clear();
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Ethnicity.selections.NotofHispanicLatinoaorSpanishorigin.ageRangeRates.rates.example1.0.denominator"]'
    ).type("10");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Ethnicity.selections.NotofHispanicLatinoaorSpanishorigin.ageRangeRates.rates.example1.0.rate"]'
    ).should("be.visible");
    cy.get(
      '[data-cy="OptionalMeasureStratification.selections.Ethnicity.selections.NotofHispanicLatinoaorSpanishorigin.ageRangeRates.rates.example1.0.rate"]'
    ).should("have.value", "50000.0");
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it("Delivery system are represented in denominator", function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.get("[data-cy=DidReport0]").click();
    cy.get("[data-cy=DataStatus0]").click();
    cy.get("[data-cy=DataStatus-ProvisionalExplanation]").click();
    cy.get("[data-cy=MeasurementSpecification0]").click();
    cy.get("[data-cy=DataSource0] > .chakra-checkbox__control").click();
    cy.get(
      "[data-cy=DefinitionOfDenominator0] > .chakra-checkbox__control"
    ).click();
    cy.get("[data-cy=DenominatorDefineTotalTechSpec0]").click();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator0] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator0-checkbox").check();
    cy.get("[data-cy=DeliverySys-FeeForService0]").click();
    cy.get("[data-cy=DeliverySys-FeeForService1]").click();
    cy.get(
      '[data-cy="What percent of your measure-eligible Fee-for-Service (FFS) population are included in the measure?"]'
    ).should("be.visible");
    cy.get(
      '[data-cy="What number of your measure-eligible Fee-for-Service (FFS) population are included in the measure? (optional)"]'
    ).should("be.visible");
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator1] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator1-checkbox").check();
    cy.get("[data-cy=DeliverySys-PrimaryCareManagement0]").click();
    cy.get("[data-cy=DeliverySys-PrimaryCareManagement1]").click();
    cy.get(".css-1f2vcwt > .chakra-text").should("be.visible");
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator2] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator2-checkbox").check();
    cy.get(
      '[data-cy="What percent of your measure-eligible Managed Care Organization/Pre-paid Inpatient Health Plan (MCO/PIHP) population are included in the measure?"]'
    ).should("be.visible");
    cy.get(
      '[data-cy="What is the number of Managed Care Organization/Pre-paid Inpatient Health Plan (MCO/PIHP) plans that are included in the reported data?"]'
    ).should("be.visible");
    cy.get("[data-cy=DeliverySys-MCO_PIHP0]").click();
    cy.get("[data-cy=DeliverySys-MCO_PIHP1]").click();
    cy.get(".css-98urqk > .chakra-text").should("be.visible");
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator3] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator3-checkbox").check();
    cy.get("[data-cy=DeliverySys-IntegratedCareModel0]").click();
    cy.get("[data-cy=DeliverySys-IntegratedCareModel1]").click();
    cy.get("[data-cy=DeliverySysRepresentationDenominator4]").click();
    cy.get(
      ":nth-child(5) > .chakra-collapse > .css-zhlq69 > :nth-child(3) > .chakra-text"
    ).should("be.visible");
    cy.get(
      "[data-cy=DefinitionOfDenominator0] > .chakra-checkbox__control"
    ).click();
    cy.get("[data-cy=DenominatorDefineTotalTechSpec0]").click();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator0] > .chakra-checkbox__control"
    ).click();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator1] > .chakra-checkbox__control"
    ).click();
    cy.get(".css-1f2vcwt > .chakra-text").should("be.visible");
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator2] > .chakra-checkbox__control"
    ).click();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator3] > .chakra-checkbox__control"
    ).click();
    cy.get("[data-cy=DeliverySysRepresentationDenominator4]").click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it("Combined rates from multiple reporting", function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.get("[data-cy=DidReport0]").click();
    cy.get("[data-cy=DataStatus0]").click();
    cy.get("[data-cy=MeasurementSpecification0]").click();
    cy.get("[data-cy=DataSource0] > .chakra-checkbox__control").click();
    cy.get("#DataSource0-checkbox").check();
    cy.get(
      '[data-cy="DataSourceSelections.AdministrativeData.selected0"] > .chakra-checkbox__control'
    ).click();
    cy.get(
      "#DataSourceSelections\\.AdministrativeData\\.selected0-checkbox"
    ).check();
    cy.get(
      "[data-cy=DefinitionOfDenominator0] > .chakra-checkbox__control"
    ).click();
    cy.get("#DefinitionOfDenominator0-checkbox").check();
    cy.get("[data-cy=DenominatorDefineTotalTechSpec0]").click();
    cy.get("[data-cy=CombinedRates0]").click();
    cy.get("[data-cy=DidCalculationsDeviate0]").click();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator0] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator0-checkbox").check();
    cy.get(
      "#DeliverySys-FeeForService_radiogroup > .chakra-stack > :nth-child(1) > .chakra-radio"
    ).click();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator1] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator1-checkbox").check();
    cy.get("[data-cy=DeliverySys-PrimaryCareManagement0]").click();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator2] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator2-checkbox").check();
    cy.get("[data-cy=DeliverySys-MCO_PIHP0]").click();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator3] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator3-checkbox").check();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator3] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator3-checkbox").uncheck();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator3] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator3-checkbox").check();
    cy.get("[data-cy=DeliverySys-IntegratedCareModel0]").click();
    cy.get(
      "[data-cy=DeliverySysRepresentationDenominator4] > .chakra-checkbox__control"
    ).click();
    cy.get("#DeliverySysRepresentationDenominator4-checkbox").check();
    cy.get("[data-cy=CombinedRates-CombinedRates0]").click();
    cy.get(".css-bxak8j").should("be.visible");
    /* ==== End Cypress Studio ==== */
  });
});
