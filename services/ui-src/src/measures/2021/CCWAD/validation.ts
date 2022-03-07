import { FormData } from "./types";
import {
  atLeastOneRateComplete,
  ensureBothDatesCompletedInRange,
  validateNoNonZeroNumOrDenom,
  validateAtLeastOneNDRInDeviationOfMeasureSpec,
  validateRequiredRadioButtonForCombinedRates,
} from "../../globalValidations/validationsLib";
import * as PMD from "./data";
import {
  omsValidations,
  validateDenominatorsAreTheSame as validateDenomsAreTheSame,
  validateDenominatorGreaterThanNumerator,
  validateOneRateLessThanOther,
} from "measures/globalValidations/omsValidationsLib";
import { omsLocationDictionary } from "measures/globalValidations";
import { OMSData } from "measures/CommonQuestions/OptionalMeasureStrat/data";

const validateReversibleNumeratorLessThanDenominator = (data: FormData) => {
  const reversibleRates =
    data.PerformanceMeasure?.rates?.[
      `${PMD.categories[1].replace(/[^\w]/g, "")}`
    ];
  let error;
  const errorArray: any[] = [];

  if (reversibleRates) {
    reversibleRates.forEach((reversibleRate, _index) => {
      if (
        reversibleRate &&
        reversibleRate?.numerator &&
        reversibleRate?.denominator &&
        parseFloat(reversibleRate?.numerator) >
          parseFloat(reversibleRate?.denominator)
      ) {
        error = {
          errorLocation: "Performance Measure",
          errorMessage: `Reversible Method of Contraception Rate: Numerator must be less than or equal to Denominator for Age`,
        };

        errorArray.push(error);
      }
    });
  }

  return error ? errorArray : error;
};
const validateModeratelyNumeratorLessThanDenominator = (data: FormData) => {
  const moderatelyRates =
    data.PerformanceMeasure?.rates?.[
      `${PMD.categories[0].replace(/[^\w]/g, "")}`
    ];
  let error;
  const errorArray: any[] = [];

  if (moderatelyRates) {
    moderatelyRates.forEach((moderatelyRate, _index) => {
      if (
        moderatelyRate &&
        moderatelyRate.numerator &&
        moderatelyRate.denominator &&
        parseFloat(moderatelyRate?.numerator) >
          parseFloat(moderatelyRate?.denominator)
      ) {
        error = {
          errorLocation: "Performance Measure",
          errorMessage: `Moderately Effective Method of Contraception Rate: Numerator must be less than or equal to Denominator for Age`,
        };

        errorArray.push(error);
      }
    });
  }

  return error ? errorArray : error;
};

const validateLarcRateGreater = (data: FormData) => {
  let error;
  const memeRates =
    data.PerformanceMeasure?.rates?.[
      `${PMD.categories[0].replace(/[^\w]/g, "")}`
    ] ?? [];
  const larcRates =
    data.PerformanceMeasure?.rates?.[
      `${PMD.categories[1].replace(/[^\w]/g, "")}`
    ] ?? [];

  if (memeRates && larcRates && memeRates[0]?.rate && larcRates[0]?.rate) {
    if (parseFloat(larcRates[0].rate) > parseFloat(memeRates[0].rate)) {
      error = {
        errorLocation: "Performance Measure",
        errorMessage:
          "Long-acting reversible method of contraception (LARC) rate must be less than or equal to Most effective or moderately effective method of contraception rate",
      };
    }
  }

  return error;
};

const validateDenominatorsAreTheSame = (data: FormData) => {
  let error;
  const memeRates =
    data.PerformanceMeasure?.rates?.[
      `${PMD.categories[0].replace(/[^\w]/g, "")}`
    ] ?? [];
  const larcRates =
    data.PerformanceMeasure?.rates?.[
      `${PMD.categories[1].replace(/[^\w]/g, "")}`
    ] ?? [];

  if (
    memeRates &&
    larcRates &&
    memeRates[0]?.denominator &&
    larcRates[0]?.denominator
  ) {
    if (
      parseFloat(memeRates[0].denominator) !==
      parseFloat(larcRates[0].denominator)
    ) {
      error = {
        errorLocation: "Performance Measure",
        errorMessage:
          "Long-acting reversible method of contraception (LARC) rate must have the same denominator as Most effective or moderately effective method of contraception rate",
      };
    }
  }

  return error;
};

const validateNonZeroDenom = (data: FormData) => {
  const memeRates =
    data.PerformanceMeasure?.rates?.[
      `${PMD.categories[0].replace(/[^\w]/g, "")}`
    ] ?? [];
  const larcRates =
    data.PerformanceMeasure?.rates?.[
      `${PMD.categories[1].replace(/[^\w]/g, "")}`
    ] ?? [];

  return validateNoNonZeroNumOrDenom(
    [memeRates, larcRates],
    data["OtherPerformanceMeasure-Rates"],
    [""]
  );
};

const validateAtLeastOneNPR = (data: FormData) => {
  const memeRates =
    data.PerformanceMeasure?.rates?.[
      `${PMD.categories[0].replace(/[^\w]/g, "")}`
    ] ?? [];
  const larcRates =
    data.PerformanceMeasure?.rates?.[
      `${PMD.categories[1].replace(/[^\w]/g, "")}`
    ] ?? [];

  return atLeastOneRateComplete(
    [memeRates, larcRates],
    data["OtherPerformanceMeasure-Rates"],
    [""]
  );
};

const validateAtLeastOneDeviationNDR = (data: FormData) => {
  const performanceMeasureArray: any = [
    // data["PerformanceMeasure-ModeratelyEffectiveMethodOfContraceptionRate"],
    // data["PerformanceMeasure-ReversibleMethodOfContraceptionRate"],
  ];
  console.log(data);
  // Array of deviation NDRs with empty/undefined values removed
  const deviationArray = [
    // data["moderate-method-deviation"],
    // data["reversible-method-deviation"],
  ].filter((data) => data);

  return validateAtLeastOneNDRInDeviationOfMeasureSpec(
    performanceMeasureArray,
    [""],
    deviationArray
  );
};

const validateBothDatesCompletedInRange = (data: FormData) => {
  const dateRange = data["DateRange"];
  return [...ensureBothDatesCompletedInRange(dateRange)];
};

const validateOMS = (data: FormData) => {
  const errorArray: FormError[] = [];
  console.log("hello world");

  errorArray.push(
    ...omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary: omsLocationDictionary(OMSData(true)),
      validationCallbacks: [
        validateDenominatorGreaterThanNumerator,
        validateDenomsAreTheSame,
        validateOneRateLessThanOther,
      ],
    })
  );

  return errorArray;
};

export const validationFunctions = [
  validateBothDatesCompletedInRange,
  validateReversibleNumeratorLessThanDenominator,
  validateModeratelyNumeratorLessThanDenominator,
  validateLarcRateGreater,
  validateDenominatorsAreTheSame,
  validateNonZeroDenom,
  validateAtLeastOneNPR,
  validateAtLeastOneDeviationNDR,
  validateRequiredRadioButtonForCombinedRates,
  validateOMS,
];
