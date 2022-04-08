import * as DC from "dataConstants";
import * as HELP from "./_helper";
import { atLeastOneRateComplete } from "measures/globalValidations";
import { DefaultFormData } from "measures/CommonQuestions/types";
import { testFormData } from "./_testFormData";

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

  // Check that the provided Form Data returns a certain number of validation errors.
  const check_errors = (data: DefaultFormData, numErrors: number) => {
    let errorArray: FormError[] = [];
    const { ageGroups, performanceMeasureArray, OPM } = HELP.test_setup(data);
    errorArray = [
      ...atLeastOneRateComplete(performanceMeasureArray, OPM, ageGroups),
    ];
    expect(errorArray.length).toBe(numErrors);
  };

  beforeEach(() => {
    formData = { ...testFormData }; // reset data
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
});
