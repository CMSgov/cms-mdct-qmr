import * as DC from "dataConstants";
import * as GV from "measures/globalValidations";
import * as PMD from "./data";
import { FormData } from "./types";
import { OMSData } from "measures/CommonQuestions/OptionalMeasureStrat/data";

const PQI01Validation = (data: FormData) => {
  const OPM = data[DC.OPM_RATES];
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];
  const dateRange = data[DC.DATE_RANGE];
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;

  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const deviationArray = GV.getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations
  );
  const age65PlusIndex = 0;
  const definitionOfDenominator = data[DC.DEFINITION_OF_DENOMINATOR];

  let errorArray: any[] = [];
  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }

  const validateDualPopInformationArray = [
    performanceMeasureArray?.[0].filter((pm) => {
      return pm?.label === "Age 65 and older";
    }),
  ];

  errorArray = [
    ...errorArray,
    ...GV.atLeastOneRateComplete(performanceMeasureArray, OPM, PMD.qualifiers),
    ...GV.ensureBothDatesCompletedInRange(dateRange),
    ...GV.validateNoNonZeroNumOrDenom(
      performanceMeasureArray,
      OPM,
      PMD.qualifiers,
      data
    ),
    ...GV.validateDualPopInformation(
      validateDualPopInformationArray,
      OPM,
      age65PlusIndex,
      definitionOfDenominator
    ),
    ...GV.validateAtLeastOneNDRInDeviationOfMeasureSpec(
      performanceMeasureArray,
      PMD.qualifiers,
      deviationArray,
      didCalculationsDeviate
    ),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateOneDataSource(data),
    ...GV.omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary: GV.omsLocationDictionary(
        OMSData(true),
        PMD.qualifiers,
        PMD.categories
      ),
      validationCallbacks: [GV.validateRateZero, GV.validateRateNotZero],
    }),
  ];

  return errorArray;
};

export const validationFunctions = [PQI01Validation];
