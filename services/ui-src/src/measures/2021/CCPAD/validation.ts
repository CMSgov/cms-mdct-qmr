import { FormData } from "./types";
import * as PMD from "./data";
import * as DC from "dataConstants";
import {
  getPerfMeasureRateArray,
  omsLocationDictionary,
  getDeviationNDRArray,
  validateAtLeastOneNDRInDeviationOfMeasureSpec,
  ensureBothDatesCompletedInRange,
  validateRequiredRadioButtonForCombinedRates,
  validateReasonForNotReporting,
  atLeastOneRateComplete,
  validateNumeratorsLessThanDenominators,
  validateNoNonZeroNumOrDenom,
  validateOneRateHigherThanOther,
} from "../../globalValidations";
import {
  omsValidations,
  validateDenominatorGreaterThanNumerator,
  validateOneRateLessThanOther,
  validateCrossQualifierRateCorrect,
  validateRateZero,
  validateRateNotZero,
  validateAllDenomsAreTheSame,
} from "measures/globalValidations/omsValidationsLib";
import { OMSData } from "measures/CommonQuestions/OptionalMeasureStrat/data";

const validate3daysLessOrEqualTo30days = (data: FormData) => {
  const perfMeasure = getPerfMeasureRateArray(data, PMD.data);
  const sevenDays = perfMeasure[1];
  const thirtyDays = perfMeasure[0];

  const errorArray: any[] = [];

  if (sevenDays?.length === 2) {
    if (
      parseFloat(sevenDays[0]?.rate ?? "") >
      parseFloat(sevenDays[1]?.rate ?? "")
    ) {
      errorArray.push({
        errorLocation: "Performance Measure",
        errorMessage: `The rate value of the ${PMD.qualifiers[0]} must be less than or equal to the ${PMD.qualifiers[1]} within ${PMD.categories[1]}.`,
      });
    }
  }
  if (thirtyDays?.length === 2) {
    if (
      parseFloat(thirtyDays[0]?.rate ?? "") >
      parseFloat(thirtyDays[1]?.rate ?? "")
    ) {
      errorArray.push({
        errorLocation: "Performance Measure",
        errorMessage: `The rate value of the ${PMD.qualifiers[0]} must be less than or equal to the ${PMD.qualifiers[1]} within ${PMD.categories[0]}.`,
      });
    }
  }

  return errorArray;
};

const allDenomsTheSame = (data: FormData) => {
  const cleanString = (s: string) => s.replace(/[^\w]/g, "");
  const denomArray: string[] = [];

  for (const cat of PMD.categories.map((category) => cleanString(category))) {
    for (const ndr of data.PerformanceMeasure?.rates?.[cat] ?? []) {
      if (ndr.denominator) {
        denomArray.push(ndr.denominator);
      }
    }
  }

  const areTheSame = denomArray.every((denom) => denom === denomArray[0]);

  return !areTheSame
    ? [
        {
          errorLocation: "Performance Measure",
          errorMessage: `${PMD.categories[1]} rate must have the same denominator as ${PMD.categories[0]} rate`,
        },
      ]
    : [];
};

const CCPADValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const whyNotReporting = data["WhyAreYouNotReporting"];
  const OPM = data["OtherPerformanceMeasure-Rates"];
  const deviationArray = getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations,
    true
  );

  const performanceMeasureArray = getPerfMeasureRateArray(data, PMD.data);

  let errorArray: any[] = [];
  if (data["DidReport"] === "no") {
    errorArray = [...validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }
  const didCalculationsDeviate = data["DidCalculationsDeviate"] === DC.YES;

  const dateRange = data["DateRange"];
  errorArray = [
    ...errorArray,
    ...allDenomsTheSame(data),
    ...validateAtLeastOneNDRInDeviationOfMeasureSpec(
      performanceMeasureArray,
      ageGroups,
      deviationArray,
      didCalculationsDeviate
    ),
    ...atLeastOneRateComplete(performanceMeasureArray, OPM, ageGroups),
    ...validateNumeratorsLessThanDenominators(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...validateNoNonZeroNumOrDenom(performanceMeasureArray, OPM, ageGroups),
    ...ensureBothDatesCompletedInRange(dateRange),
    ...validateOneRateHigherThanOther(data, PMD.data),
  ];

  return errorArray;
};

const validateOMS = (data: FormData) => {
  const errorArray: FormError[] = [];

  errorArray.push(
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
        // validateDenominatorsAreTheSame,
        validateOneRateLessThanOther,
        validateCrossQualifierRateCorrect,
        validateRateZero,
        validateRateNotZero,
        validateAllDenomsAreTheSame,
      ],
    })
  );

  return errorArray;
};

export const validationFunctions = [
  CCPADValidation,
  validateRequiredRadioButtonForCombinedRates,
  validateOMS,
  validate3daysLessOrEqualTo30days,
];
