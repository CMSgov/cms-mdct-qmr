import { FormData } from "./types";
import { omsLocationDictionary } from "measures/globalValidations/dataDrivenTools";
import * as PMD from "./data";
import * as DC from "dataConstants";
import * as GV from "measures/globalValidations";
import { OMSData } from "measures/CommonQuestions/OptionalMeasureStrat/data";

const DEVCHValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];
  const OPM = data[DC.OPM_RATES];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const dateRange = data[DC.DATE_RANGE];
  const deviationArray = GV.getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations,
    true
  );
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;
  const includesHybridDataSource = data[DC.DATA_SOURCE]?.includes(
    DC.HYBRID_ADMINSTRATIVE_AND_MEDICAL_RECORDS_DATA
  );

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
      locationDictionary: omsLocationDictionary(
        OMSData(true),
        PMD.qualifiers,
        PMD.categories
      ),
      validationCallbacks: [
        GV.validateDenominatorGreaterThanNumerator,
        GV.validateDenominatorsAreTheSame,
        GV.validateOneRateLessThanOther,
        GV.validateOMSTotalNDR,
        ...(includesHybridDataSource ? [] : [GV.validateRateZero]),
        GV.validateRateNotZero,
      ],
    }),
    ...GV.atLeastOneRateComplete(performanceMeasureArray, OPM, ageGroups),
    ...GV.ensureBothDatesCompletedInRange(dateRange),
    ...GV.validateAtLeastOneNDRInDeviationOfMeasureSpec(
      performanceMeasureArray,
      ageGroups,
      deviationArray,
      didCalculationsDeviate
    ),
    ...GV.validateNoNonZeroNumOrDenom(
      performanceMeasureArray,
      OPM,
      ageGroups,
      includesHybridDataSource
    ),
    ...GV.validateNumeratorsLessThanDenominators(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
  ];

  return errorArray;
};

export const validationFunctions = [DEVCHValidation];
