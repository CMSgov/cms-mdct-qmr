import * as DC from "dataConstants";
import * as GV from "measures/2024/shared/globalValidations";
import * as PMD from "./data";
import { FormData } from "./types";
import { OMSData } from "measures/2024/shared/CommonQuestions/OptionalMeasureStrat/data";

const PQI05Validation = (data: FormData) => {
  const OPM = data[DC.OPM_RATES];
  const ageGroups = PMD.qualifiers;
  const dateRange = data[DC.DATE_RANGE];
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;
  const deviationReason = data[DC.DEVIATION_REASON];

  const age65PlusIndex = 0;
  const validateDualPopInformationArray = [
    performanceMeasureArray?.[0].filter((pm) => {
      return pm?.label === "Age 65 and older";
    }),
  ];
  const definitionOfDenominator = data[DC.DEFINITION_OF_DENOMINATOR];

  let errorArray: any[] = [];
  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }
  errorArray = [
    ...errorArray,
    ...GV.validateDateRangeRadioButtonCompletion(data),
    ...GV.validateBothDatesCompleted(dateRange),
    ...GV.validateYearFormat(dateRange),
    ...GV.validateOPMRates(OPM),
    ...GV.validateRateNotZeroPM(performanceMeasureArray, OPM, PMD.qualifiers),
    ...GV.validateRateZeroPM(
      performanceMeasureArray,
      OPM,
      PMD.qualifiers,
      data
    ),
    ...GV.validateDualPopInformationPM(
      validateDualPopInformationArray,
      OPM,
      1,
      ageGroups.map((item) => item.label)
    ),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      didCalculationsDeviate,
      deviationReason
    ),
    ...GV.validateDualPopInformationPM(
      validateDualPopInformationArray,
      OPM,
      age65PlusIndex,
      definitionOfDenominator
    ),
    ...GV.validateAtLeastOneRateComplete(
      performanceMeasureArray,
      OPM,
      ageGroups,
      PMD.categories
    ),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateAtLeastOneDataSource(data),
    ...GV.validateAtLeastOneDefinitionOfPopulation(data),
    ...GV.validateAtLeastOneDataSourceType(data),
    ...GV.validateAtLeastOneDeliverySystem(data),
    ...GV.validateFfsRadioButtonCompletion(data),
    ...GV.omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary: GV.omsLocationDictionary(
        OMSData(),
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

export const validationFunctions = [PQI05Validation];
