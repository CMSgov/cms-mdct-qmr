import * as PMD from "./data";
import { FormData } from "./types";
import {
  atLeastOneRateComplete,
  validateDualPopInformation,
  validateNumeratorsLessThanDenominators,
  validateEqualDenominators,
  validateNoNonZeroNumOrDenom,
  validateReasonForNotReporting,
  validateAtLeastOneNDRInDeviationOfMeasureSpec,
} from "../../globalValidations/validationsLib";
import {
  ensureBothDatesCompletedInRange,
  validateRequiredRadioButtonForCombinedRates,
} from "../../globalValidations/validationsLib";
import {
  getDeviationNDRArray,
  getPerfMeasureRateArray,
  omsLocationDictionary,
} from "measures/globalValidations";
import {
  omsValidations,
  validateDenominatorGreaterThanNumerator,
  validateDenominatorsAreTheSame,
  validateOneRateLessThanOther,
} from "measures/globalValidations/omsValidationsLib";
import { OMSData } from "measures/CommonQuestions/OptionalMeasureStrat/data";

const FUAADValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const sixtyDaysIndex = 1;
  const whyNotReporting = data["WhyAreYouNotReporting"];
  const OPM = data["OtherPerformanceMeasure-Rates"];
  const performanceMeasureArray = getPerfMeasureRateArray(data, PMD.data);
  const validateDualPopInformationArray = [performanceMeasureArray?.[1]];

  const DefinitionOfDenominator = data["DefinitionOfDenominator"];

  let errorArray: any[] = [];
  if (data["DidReport"] === "no") {
    errorArray = [...validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }

  let sameDenominatorError = [
    ...validateEqualDenominators(performanceMeasureArray, ageGroups),
  ];
  sameDenominatorError =
    sameDenominatorError.length > 0 ? [...sameDenominatorError] : [];
  errorArray = [
    ...errorArray,
    ...atLeastOneRateComplete(performanceMeasureArray, OPM, ageGroups),
    ...validateDualPopInformation(
      validateDualPopInformationArray,
      OPM,
      sixtyDaysIndex,
      DefinitionOfDenominator
    ),
    ...validateNumeratorsLessThanDenominators(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...sameDenominatorError,
    ...validateNoNonZeroNumOrDenom(performanceMeasureArray, OPM, ageGroups),
  ];

  return errorArray;
};

const validateAtLeastOneDeviationNDR = (data: FormData) => {
  const performanceMeasureArray = getPerfMeasureRateArray(data, PMD.data);
  const deviationArray = getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations,
    true
  );

  return validateAtLeastOneNDRInDeviationOfMeasureSpec(
    performanceMeasureArray,
    PMD.qualifiers,
    deviationArray
  );
};
const validateBothDatesCompletedInRange = (data: FormData) => {
  const dateRange = data["DateRange"];
  return [...ensureBothDatesCompletedInRange(dateRange)];
};

const validateOMS = (data: FormData) => {
  return [
    ...omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary: omsLocationDictionary(OMSData(true)),
      validationCallbacks: [
        validateDenominatorGreaterThanNumerator,
        validateDenominatorsAreTheSame,
        validateOneRateLessThanOther,
      ],
    }),
  ];
};

export const validationFunctions = [
  FUAADValidation,
  validateRequiredRadioButtonForCombinedRates,
  validateBothDatesCompletedInRange,
  validateOMS,
  validateAtLeastOneDeviationNDR,
];
