import * as PMD from "./data";
import * as DC from "dataConstants";
import {
  atLeastOneRateComplete,
  ensureBothDatesCompletedInRange,
  validateDualPopInformation,
  validateNumeratorsLessThanDenominators,
  validateNoNonZeroNumOrDenom,
  validateReasonForNotReporting,
  validateRequiredRadioButtonForCombinedRates,
  validateAtLeastOneNDRInDeviationOfMeasureSpec,
} from "../../globalValidations/validationsLib";
import {
  getDeviationNDRArray,
  getPerfMeasureRateArray,
  omsLocationDictionary,
} from "../../globalValidations";
import { FormData } from "./types";
import {
  omsValidations,
  validateDenominatorGreaterThanNumerator,
  validateRateNotZero,
  validateRateZero,
} from "measures/globalValidations/omsValidationsLib";
import { OMSData } from "measures/CommonQuestions/OptionalMeasureStrat/data";

const CBPValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const age65PlusIndex = 1;
  const whyNotReporting = data["WhyAreYouNotReporting"];
  const OPM = data["OtherPerformanceMeasure-Rates"];
  const performanceMeasureArray = getPerfMeasureRateArray(data, PMD.data);
  const dateRange = data["DateRange"];
  const DefinitionOfDenominator = data["DefinitionOfDenominator"];

  let errorArray: any[] = [];
  if (data["DidReport"] === "no") {
    errorArray = [...validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }
  const deviationArray = getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations,
    true
  );
  const didCalculationsDeviate = data["DidCalculationsDeviate"] === DC.YES;

  errorArray = [
    ...atLeastOneRateComplete(performanceMeasureArray, OPM, ageGroups),
    ...validateDualPopInformation(
      performanceMeasureArray,
      OPM,
      age65PlusIndex,
      DefinitionOfDenominator
    ),
    ...validateNumeratorsLessThanDenominators(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...validateNoNonZeroNumOrDenom(performanceMeasureArray, OPM, ageGroups),
    ...validateRequiredRadioButtonForCombinedRates(data),
    ...ensureBothDatesCompletedInRange(dateRange),
    ...omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary: omsLocationDictionary(
        OMSData(true),
        PMD.qualifiers,
        PMD.categories
      ),
      validationCallbacks: [
        validateDenominatorGreaterThanNumerator,
        validateRateZero,
        validateRateNotZero,
      ],
    }),
    ...validateAtLeastOneNDRInDeviationOfMeasureSpec(
      performanceMeasureArray,
      ageGroups,
      deviationArray,
      didCalculationsDeviate
    ),
  ];

  return errorArray;
};

export const validationFunctions = [CBPValidation];
