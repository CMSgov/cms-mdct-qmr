import * as PMD from "./data";
import * as GV from "measures/globalValidations";
import * as DC from "dataConstants";

import { FormData } from "./types";
import { OMSData } from "measures/CommonQuestions/OptionalMeasureStrat/data";

const validateOneSealantGreaterThanFourMolarsSealed = (data: FormData) => {
  if (
    !(
      data?.PerformanceMeasure?.rates?.singleCategory?.[0] ||
      data?.PerformanceMeasure?.rates?.singleCategory?.[1]
    )
  ) {
    return [];
  }
  const oneSealant = data["PerformanceMeasure"]["rates"]["singleCategory"][0];
  const fourMolarsSealed =
    data["PerformanceMeasure"]["rates"]["singleCategory"][1];
  let error;
  const errorArray: any[] = [];

  if (oneSealant && fourMolarsSealed) {
    if (
      parseFloat(oneSealant?.rate ?? "") <
      parseFloat(fourMolarsSealed?.rate ?? "")
    ) {
      error = {
        errorLocation: "Performance Measure",
        errorMessage:
          "Rate 2 (All Four Molars Sealed) should not be higher than Rate 1 (At Least One Sealant).",
      };

      errorArray.push(error);
    }
  }
  return error ? errorArray : [];
};

const SFMCHValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const whyNotReporting = data["WhyAreYouNotReporting"];
  const OPM = data["OtherPerformanceMeasure-Rates"];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  let errorArray: any[] = [];
  const dateRange = data["DateRange"];
  const deviationArray = GV.getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations,
    true
  );
  const didCalculationsDeviate = data["DidCalculationsDeviate"] === DC.YES;
  if (data["DidReport"] === "no") {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }
  let unfilteredSameDenominatorErrors: any[] = [];
  for (let i = 0; i < performanceMeasureArray.length; i += 2) {
    unfilteredSameDenominatorErrors = [
      ...unfilteredSameDenominatorErrors,
      ...GV.validateEqualQualifierDenominatorsPM(
        [performanceMeasureArray[i], performanceMeasureArray[i + 1]],
        ageGroups
      ),
    ];
  }

  let filteredSameDenominatorErrors: any = [];
  let errorList: string[] = [];
  unfilteredSameDenominatorErrors.forEach((error) => {
    if (!(errorList.indexOf(error.errorMessage) > -1)) {
      errorList.push(error.errorMessage);
      filteredSameDenominatorErrors.push(error);
    }
  });

  errorArray = [
    ...errorArray,
    ...GV.validateAtLeastOneRateComplete(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...validateOneSealantGreaterThanFourMolarsSealed(data),
    ...GV.validateNoNonZeroNumOrDenomPM(
      performanceMeasureArray,
      OPM,
      ageGroups,
      data
    ),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateBothDatesInRange(dateRange),
    ...GV.validateAtLeastOneDataSource(data),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      performanceMeasureArray,
      ageGroups,
      deviationArray,
      didCalculationsDeviate
    ),
    ...GV.validateNumeratorsLessThanDenominatorsPM(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...filteredSameDenominatorErrors,
    ...GV.omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary: GV.omsLocationDictionary(
        OMSData(true),
        PMD.qualifiers,
        PMD.categories
      ),
      validationCallbacks: [
        GV.validateOneCatRateHigherThanOtherCatOMS(),
        GV.validateNumeratorLessThanDenominatorOMS,
        GV.validateRateZeroOMS,
        GV.validateRateNotZeroOMS,
        GV.validateOneSealantGreaterThanFourMolarsSealedOMS,
      ],
    }),
  ];

  return errorArray;
};

export const validationFunctions = [SFMCHValidation];
