import * as DC from "dataConstants";
import * as GV from "measures/2021/globalValidations";
import * as PMD from "./data";
import { OMSData } from "measures/2021/CommonQuestions/OptionalMeasureStrat/data";
//form type
import { DefaultFormData as FormData } from "measures/2021/CommonQuestions/types";

const FUAADValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const sixtyDaysIndex = 1;
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];
  const OPM = data[DC.OPM_RATES];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const dateRange = data[DC.DATE_RANGE];
  const DefinitionOfDenominator = data[DC.DEFINITION_OF_DENOMINATOR];

  let errorArray: any[] = [];
  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }

  const deviationArray = GV.getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations,
    true
  );
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;

  errorArray = [
    ...errorArray,
    ...GV.validateEqualQualifierDenominatorsPM(
      performanceMeasureArray,
      ageGroups
    ),
    ...GV.validateAtLeastOneRateComplete(
      performanceMeasureArray,
      OPM,
      ageGroups,
      PMD.categories
    ),
    ...GV.validateAtLeastOneDataSource(data),
    ...GV.validateDualPopInformationPM(
      performanceMeasureArray,
      OPM,
      sixtyDaysIndex,
      DefinitionOfDenominator
    ),
    ...GV.validateNumeratorsLessThanDenominatorsPM(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...GV.validateRateNotZeroPM(performanceMeasureArray, OPM, ageGroups),
    ...GV.validateRateZeroPM(performanceMeasureArray, OPM, ageGroups, data),
    ...GV.validateOneCatRateHigherThanOtherCatPM(data, PMD.data),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateBothDatesCompleted(dateRange),
    ...GV.validateYearFormat(dateRange),
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
        GV.validateNumeratorLessThanDenominatorOMS(),
        GV.validateEqualQualifierDenominatorsOMS(),
        GV.validateOneCatRateHigherThanOtherCatOMS(),
        GV.validateRateZeroOMS(),
        GV.validateRateNotZeroOMS(),
      ],
    }),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      performanceMeasureArray,
      PMD.qualifiers,
      deviationArray,
      didCalculationsDeviate
    ),
  ];

  return errorArray;
};

export const validationFunctions = [FUAADValidation];
