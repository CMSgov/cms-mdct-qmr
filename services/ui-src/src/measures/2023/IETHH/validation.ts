import * as DC from "dataConstants";
import * as GV from "../shared/globalValidations";
import * as PMD from "./data";
import { FormData } from "./types";
import { OMSData } from "../shared/CommonQuestions/OptionalMeasureStrat/data";

const IETValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const age65PlusIndex = 2;
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];
  const OPM = data[DC.OPM_RATES];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const dateRange = data[DC.DATE_RANGE];
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;
  const deviationReason = data[DC.DEVIATION_REASON];
  const DefinitionOfDenominator = data[DC.DEFINITION_OF_DENOMINATOR];

  const locationDictionary = GV.omsLocationDictionary(
    OMSData(true),
    PMD.qualifiers,
    PMD.categories
  );

  let errorArray: any[] = [];
  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }

  let unfilteredSameDenominatorErrors: any[] = [];
  for (let i = 0; i < performanceMeasureArray.length; i += 2) {
    unfilteredSameDenominatorErrors = [
      ...unfilteredSameDenominatorErrors,
      ...GV.validateEqualQualifierDenominatorsPM(
        [performanceMeasureArray[i], performanceMeasureArray[i + 1]],
        ageGroups,
        undefined,
        (qual) =>
          `Denominators must be the same for ${locationDictionary([
            qual,
          ])} for ${PMD.categories[i].label} and ${
            PMD.categories[i + 1].label
          }.`
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
    ...GV.validateOneCatRateHigherThanOtherCatPM(data, PMD.data, 0, 1, 2),
    ...GV.validateAtLeastOneRateComplete(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...GV.validateTotalNDR(performanceMeasureArray, undefined, undefined),
    ...GV.validateDualPopInformationPM(
      performanceMeasureArray,
      OPM,
      age65PlusIndex,
      DefinitionOfDenominator
    ),
    ...GV.validateNumeratorsLessThanDenominatorsPM(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...filteredSameDenominatorErrors,
    ...GV.validateRateZeroPM(performanceMeasureArray, OPM, ageGroups, data),
    ...GV.validateRateNotZeroPM(performanceMeasureArray, OPM, ageGroups),

    // OMS Validations
    ...GV.omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary,
      validationCallbacks: [
        GV.validateNumeratorLessThanDenominatorOMS(),
        GV.validateRateZeroOMS(),
        GV.validateRateNotZeroOMS(),
        GV.validateOMSTotalNDR(),
        GV.validateSameDenominatorSets(),
        GV.validateOneCatRateHigherThanOtherCatOMS(0, 1, 2),
      ],
    }),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateDateRangeRadioButtonCompletion(data),
    ...GV.validateBothDatesCompleted(dateRange),
    ...GV.validateYearFormat(dateRange),
    ...GV.validateHedisYear(data),
    ...GV.validateOPMRates(OPM),
    ...GV.validateAtLeastOneDataSource(data),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      didCalculationsDeviate,
      deviationReason
    ),
  ];

  return errorArray;
};

export const validationFunctions = [IETValidation];
