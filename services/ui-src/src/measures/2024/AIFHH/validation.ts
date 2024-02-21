import * as DC from "dataConstants";
import * as GV from "measures/2024/shared/globalValidations";
import * as PMD from "./data";
import { OMSData } from "measures/2024/shared/CommonQuestions/OptionalMeasureStrat/data";
//form type
import { DefaultFormData as FormData } from "measures/2024/shared/CommonQuestions/types";

// Rate structure by index in row
const ndrFormulas = [
  // Short-Term Admissions per 1,000 Enrollee Months
  {
    numerator: 1,
    denominator: 0,
    rateIndex: 2,
    mult: 1000,
  },
  // Medium-Term Admissions per 1,000 Enrollee Months
  {
    numerator: 3,
    denominator: 0,
    rateIndex: 4,
    mult: 1000,
  },
  // Long-Term Admissions per 1,000 Enrollee Months
  {
    numerator: 5,
    denominator: 0,
    rateIndex: 6,
    mult: 1000,
  },
];

let OPM: any;

const AIFHHValidation = (data: FormData) => {
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
    ...GV.validateAtLeastOneDataSourceType(data),
    ...GV.validateDateRangeRadioButtonCompletion(data),
    ...GV.validateBothDatesCompleted(dateRange),
    ...GV.validateYearFormat(dateRange),
    ...GV.validateOPMRates(OPM),
    ...GV.validateAtLeastOneDeliverySystem(data),
    ...GV.validateFfsRadioButtonCompletion(data),
    ...GV.validateAtLeastOneDefinitionOfPopulation(data),

    ...GV.ComplexValidateDualPopInformation(
      performanceMeasureArray,
      OPM,
      definitionOfDenominator
    ),

    // Performance Measure Validations
    ...GV.ComplexAtLeastOneRateComplete(performanceMeasureArray, OPM),
    ...GV.ComplexNoNonZeroNumOrDenom(performanceMeasureArray, OPM, ndrFormulas),
    ...GV.validateAtLeastOneDeviationFieldFilled(
      didCalculationsDeviate,
      deviationReason
    ),
    ...GV.ComplexValidateNDRTotals(
      performanceMeasureArray,
      PMD.categories,
      ndrFormulas
    ),

    // OMS Validations
    ...GV.omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary: GV.omsLocationDictionary(
        OMSData(),
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
  const rates = Object.keys(rateData?.rates ?? {}).map((x) => {
    return { rate: [rateData?.rates?.[x]?.OPM?.[0]] };
  });
  return OPM === undefined
    ? [
        ...GV.ComplexNoNonZeroNumOrDenomOMS(
          rateData?.["aifhh-rate"]?.rates ?? {},
          rates ?? [],
          ndrFormulas,
          `Optional Measure Stratification: ${locationDictionary(label)}`
        ),
      ]
    : [
        ...GV.ComplexNoNonZeroNumOrDenomOMS(
          rateData?.rates,
          rates ?? [],
          ndrFormulas,
          `Optional Measure Stratification: ${locationDictionary(label)}`
        ),
      ];
};

export const validationFunctions = [AIFHHValidation];
