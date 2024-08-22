import * as DC from "dataConstants";
import * as GV from "measures/2023/shared/globalValidations";
import * as PMD from "./data";
import { OMSData } from "shared/commonQuestions/OptionalMeasureStrat/data";
//form type
import { DefaultFormData as FormData } from "measures/2023/shared/CommonQuestions/types";

// Rate structure by index in row
const ndrForumlas = [
  // Discharges per 1,000 Enrollee Months
  {
    numerator: 1,
    denominator: 0,
    rateIndex: 2,
  },
  // Days per 1,000 Enrollee Months
  {
    numerator: 3,
    denominator: 0,
    rateIndex: 4,
  },
  // Average Length of Stay
  {
    numerator: 3,
    denominator: 1,
    rateIndex: 5,
  },
];

let OPM: any;

const IUHHValidation = (data: FormData) => {
  let errorArray: any[] = [];
  const dateRange = data[DC.DATE_RANGE];
  const definitionOfDenominator = data[DC.DEFINITION_OF_DENOMINATOR];
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;
  const deviationReason = data[DC.DEVIATION_REASON];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  OPM = data[DC.OPM_RATES];
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];

  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }

  // Quick reference list of all rate indices
  errorArray = [
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateAtLeastOneDataSource(data),
    ...GV.validateAtLeastOneDefinitionOfPopulation(data),
    ...GV.validateAtLeastOneDataSourceType(data),
    ...GV.validateAtLeastOneDeliverySystem(data),
    ...GV.validateFfsRadioButtonCompletion(data),
    ...GV.validateDateRangeRadioButtonCompletion(data),
    ...GV.validateBothDatesCompleted(dateRange),
    ...GV.validateYearFormat(dateRange),
    ...GV.validateOPMRates(OPM),
    ...GV.ComplexValidateDualPopInformation(
      performanceMeasureArray,
      OPM,
      definitionOfDenominator
    ),

    // Performance Measure Validations
    ...GV.ComplexAtLeastOneRateComplete(performanceMeasureArray, OPM),
    ...GV.ComplexNoNonZeroNumOrDenom(performanceMeasureArray, OPM, ndrForumlas),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      didCalculationsDeviate,
      deviationReason
    ),
    ...GV.ComplexValidateNDRTotals(
      performanceMeasureArray,
      PMD.categories,
      ndrForumlas
    ),
    ...GV.ComplexValueSameCrossCategory({
      rateData: performanceMeasureArray,
      OPM,
    }),

    // OMS Validations
    ...GV.omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary: GV.omsLocationDictionary(
        OMSData(2023),
        PMD.qualifiers,
        PMD.categories
      ),
      validationCallbacks: [OMSValidations],
    }),
  ];
  return errorArray;
};

const OMSValidations: GV.Types.OmsValidationCallback = ({
  rateData,
  locationDictionary,
  label,
}) => {
  return OPM === undefined
    ? [
        ...GV.ComplexNoNonZeroNumOrDenomOMS(
          rateData?.["iuhh-rate"]?.rates ?? {},
          ndrForumlas,
          `Optional Measure Stratification: ${locationDictionary(label)}`,
          OPM.map((item: any) => item.description)
        ),
        ...GV.ComplexValueSameCrossCategoryOMS(
          rateData?.["iuhh-rate"]?.rates ?? {},
          PMD.categories,
          PMD.qualifiers,
          `Optional Measure Stratification: ${locationDictionary(label)}`
        ),
      ]
    : [
        ...GV.ComplexNoNonZeroNumOrDenomOMS(
          rateData?.rates,
          ndrForumlas,
          `Optional Measure Stratification: ${locationDictionary(label)}`,
          OPM.map((item: any) => item.description)
        ),
      ];
};

export const validationFunctions = [IUHHValidation];
