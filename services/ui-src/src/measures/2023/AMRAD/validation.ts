import * as DC from "dataConstants";
import * as GV from "measures/2023/shared/globalValidations";
import * as PMD from "./data";
import { FormData } from "./types";
import { OMSData } from "measures/2023/shared/CommonQuestions/OptionalMeasureStrat/data";

const AMRADValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const OPM = data[DC.OPM_RATES];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const dateRange = data[DC.DATE_RANGE];
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;
  const deviationReason = data[DC.DEVIATION_REASON];
  const measureSpecifications = data[DC.MEASUREMENT_SPECIFICATION_HEDIS];

  let errorArray: any[] = [];
  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }

  errorArray = [
    ...GV.validateAtLeastOneRateComplete(
      performanceMeasureArray,
      OPM,
      ageGroups,
      PMD.categories
    ),
    ...GV.validateBothDatesCompleted(dateRange),
    ...GV.validateYearFormat(dateRange),
    ...GV.validateHedisYear(measureSpecifications),
    ...GV.validateOPMRates(OPM),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      didCalculationsDeviate,
      deviationReason
    ),
    ...GV.validateRateNotZeroPM(performanceMeasureArray, OPM, ageGroups),
    ...GV.validateRateZeroPM(performanceMeasureArray, OPM, ageGroups, data),
    ...GV.validateAtLeastOneDataSource(data),
    ...GV.validateNumeratorsLessThanDenominatorsPM(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateTotalNDR(performanceMeasureArray),
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
        GV.validateOMSTotalNDR(),
        GV.validateRateNotZeroOMS(),
        GV.validateRateZeroOMS(),
      ],
    }),
  ];

  return errorArray;
};

export const validationFunctions = [AMRADValidation];
