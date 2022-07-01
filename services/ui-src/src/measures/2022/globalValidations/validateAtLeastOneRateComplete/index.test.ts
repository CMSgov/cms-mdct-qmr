import * as DC from "dataConstants";
import * as HELP from "../testHelpers/_helper";
import { validateAtLeastOneRateComplete } from "./index";
import { DefaultFormData } from "measures/2022/CommonQuestions/types";
import { testFormData } from "../testHelpers/_testFormData";

/* Ensure that at least 1 NDR in a set is complete for either the Performance Measure or Other Performance Measure

  Test Cases:
    ┌─────────────────────┬────────────┐
    │ Performance Measure │    OPM     │
    ├─────────────────────┼────────────┤
  1 │ Partial             │ Partial    │
  2 │ Undefined           │ Undefined  │
  3 │ Partial             │ Undefined  │
  4 │ Undefined           │ Partial    │
  5 │ Incomplete          │ Incomplete │
  6 │ Incomplete          │ Undefined  │
  7 │ Undefined           │ Incomplete │
    └─────────────────────┴────────────┘
*/
describe("atLeastOneRateComplete", () => {
  let formData: DefaultFormData;

  const _run_validation = (
    data: DefaultFormData,
    errorMessage?: string
  ): FormError[] => {
    const { ageGroups, performanceMeasureArray, OPM } = HELP.test_setup(data);
    return [
      ...validateAtLeastOneRateComplete(
        performanceMeasureArray,
        OPM,
        ageGroups,
        undefined,
        errorMessage
      ),
    ];
  };

  // Check that the provided Form Data returns a certain number of validation errors.
  const check_errors = (data: DefaultFormData, numErrors: number) => {
    const errorArray = _run_validation(data);
    expect(errorArray.length).toBe(numErrors);
  };

  beforeEach(() => {
    formData = JSON.parse(JSON.stringify(testFormData)); // reset data
  });

  test("when Peformance Measure is partially complete and OPM is partially complete", () => {
    check_errors(formData, 0);
  });

  test("when Performance Measure is undefined and OPM is undefined", () => {
    formData[DC.PERFORMANCE_MEASURE] = {};
    formData[DC.OPM_RATES] = [];
    check_errors(formData, 1);
  });

  test("when Peformance Measure is partially complete and OPM is undefined", () => {
    formData[DC.OPM_RATES] = [];
    check_errors(formData, 0);
  });

  test("when Performance Measure is undefined and OPM is partially complete", () => {
    delete formData[DC.PERFORMANCE_MEASURE];
    check_errors(formData, 0);
  });

  test("when Performance Measure is incomplete and OPM is incomplete", () => {
    HELP.zero_PM(formData);
    HELP.zero_OPM(formData);
    check_errors(formData, 1);
  });

  test("when Performance Measure is incomplete and OPM is undefined", () => {
    HELP.zero_PM(formData);
    formData[DC.OPM_RATES] = [];
    check_errors(formData, 1);
  });

  test("when Performance Measure is undefined and OPM is incomplete", () => {
    formData[DC.PERFORMANCE_MEASURE] = {};
    HELP.zero_OPM(formData);

    check_errors(formData, 1);
  });

  // custom errorMessage
  test("Error message text should match default errorMessage", () => {
    formData[DC.PERFORMANCE_MEASURE] = {};
    HELP.zero_OPM(formData);
    const errorArray = _run_validation(formData);
    expect(errorArray.length).toBe(1);
    expect(errorArray[0].errorMessage).toBe(
      "At least one Performance Measure Numerator, Denominator, and Rate must be completed"
    );
  });

  test("Error message text should match provided errorMessage", () => {
    formData[DC.PERFORMANCE_MEASURE] = {};
    HELP.zero_OPM(formData);
    const errorMessage = "Another one bites the dust.";
    const errorArray = _run_validation(formData, errorMessage);
    expect(errorArray.length).toBe(1);
    expect(errorArray[0].errorMessage).toBe(errorMessage);
  });
});
