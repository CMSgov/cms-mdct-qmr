import { Measure } from "./types";
import {
  atLeastOneRateComplete,
  validateNumeratorsLessThanDenominators,
  validateEqualDenominators,
  validateNoNonZeroNumOrDenom,
} from "measures/globalValidations/validationsLib";

const AMRADValidation = (data: Measure.Form) => {
  const ageGroups = ["Ages 19 to 50", "Ages 51 to 64", "Total (Ages 19 to 64)"];

  const OPM = data["OtherPerformanceMeasure-Rates"];
  const performanceMeasureArray = [
    data["PerformanceMeasure-AgeRates-Persistent-Asthma"],
  ];

  let errorArray: any[] = [];
  errorArray = [
    ...atLeastOneRateComplete(performanceMeasureArray, OPM, ageGroups),
    ...validateNumeratorsLessThanDenominators(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...validateEqualDenominators(performanceMeasureArray, ageGroups),
    ...validateNoNonZeroNumOrDenom(performanceMeasureArray, OPM, ageGroups),
  ];

  return errorArray;
};

export const validationFunctions = [AMRADValidation];
