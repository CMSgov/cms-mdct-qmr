import * as DC from "dataConstants";
import * as GV from "measures/2024/shared/globalValidations";
import * as PMD from "./data";
import { FormData } from "./types";
import { OMSData } from "measures/2024/shared/CommonQuestions/OptionalMeasureStrat/data";

const DEVCHValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];
  const OPM = data[DC.OPM_RATES];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const dateRange = data[DC.DATE_RANGE];
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;
  const deviationReason = data[DC.DEVIATION_REASON];

  let errorArray: any[] = [];
  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }

  errorArray = [
    ...GV.omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      dataSource: data[DC.DATA_SOURCE],
      locationDictionary: GV.omsLocationDictionary(
        OMSData(),
        PMD.qualifiers,
        PMD.categories
      ),
      validationCallbacks: [
        GV.validateNumeratorLessThanDenominatorOMS(),
        GV.validateEqualQualifierDenominatorsOMS(),
        GV.validateOneCatRateHigherThanOtherCatOMS(),
        GV.validateRateZeroOMS(),
        GV.validateRateNotZeroOMS(),
        GV.validateEqualCategoryDenominatorsOMS(),
      ],
    }),
    ...GV.validateAtLeastOneRateComplete(
      performanceMeasureArray,
      OPM,
      ageGroups,
      PMD.categories
    ),
    ...GV.validateDateRangeRadioButtonCompletion(data),
    ...GV.validateBothDatesCompleted(dateRange),
    ...GV.validateYearFormat(dateRange),
    ...GV.validateHedisYear(data),
    ...GV.validateOPMRates(OPM),
    ...GV.validateAtLeastOneDataSource(data),
    ...GV.validateAtLeastOneDataSourceType(data),
    ...GV.validateAtLeastOneDefinitionOfPopulation(data),
    ...GV.validateHybridMeasurePopulation(data),
    ...GV.validateAtLeastOneDeliverySystem(data),
    ...GV.validateFfsRadioButtonCompletion(data),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      didCalculationsDeviate,
      deviationReason
    ),
    ...GV.validateRateNotZeroPM(performanceMeasureArray, OPM, ageGroups),
    ...GV.validateRateZeroPM(performanceMeasureArray, OPM, ageGroups, data),
    ...GV.validateNumeratorsLessThanDenominatorsPM(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateEqualCategoryDenominatorsPM(data, PMD.categories, ageGroups),
  ];

  return errorArray;
};

export const validationFunctions = [DEVCHValidation];