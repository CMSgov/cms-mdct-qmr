import * as DC from "dataConstants";
import * as GV from "measures/2022/globalValidations";
import * as PMD from "./data";
import { FormData } from "./types";
import { OMSData } from "measures/2022/CommonQuestions/OptionalMeasureStrat/data";

const PQI08Validation = (data: FormData) => {
  const OPM = data[DC.OPM_RATES];
  const age65PlusIndex = 0;
  const dateRange = data[DC.DATE_RANGE];
  const definitionOfDenominator = data[DC.DEFINITION_OF_DENOMINATOR];
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;

  const deviationArray = GV.getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations
  );

  const validateDualPopInformationArray = [
    performanceMeasureArray?.[0].filter((pm) => {
      return pm?.mathematicaCategory === "Age 65 and older";
    }),
  ];
  let errorArray: any[] = [];
  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }
  errorArray = [
    ...errorArray,
    ...GV.validateAtLeastOneRateComplete(
      performanceMeasureArray,
      OPM,
      PMD.qualifiers,
      PMD.categories
    ),
    ...GV.validateBothDatesCompleted(dateRange),
    ...GV.validateAtLeastOneDataSource(data),
    ...GV.validateDualPopInformationPM(
      validateDualPopInformationArray,
      OPM,
      age65PlusIndex,
      definitionOfDenominator
    ),
    ...GV.validateRateNotZeroPM(performanceMeasureArray, OPM, PMD.qualifiers),
    ...GV.validateRateZeroPM(
      performanceMeasureArray,
      OPM,
      PMD.qualifiers,
      data
    ),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      performanceMeasureArray,
      PMD.qualifiers,
      deviationArray,
      didCalculationsDeviate
    ),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
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
        GV.validateRateZeroOMS(),
        GV.validateRateNotZeroOMS(),
      ],
    }),
  ];

  return errorArray;
};

export const validationFunctions = [PQI08Validation];
