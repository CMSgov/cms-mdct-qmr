import { OmsNodes as OMS, RateFields } from "../CommonQuestions/types";
import { DefaulFormData } from "../CommonQuestions/types";

type locationDictionaryFunction = (labels: string[]) => string;

type OmsValidationCallback = (data: {
  rateData: OMS.OmsRateFields;
  qualifiers: string[];
  categories: string[];
  label: string[];
  locationDictionary: locationDictionaryFunction;
}) => FormError[];

const cleanString = (s: string) => s.replace(/[^\w]/g, "");

export const omsValidations = (
  data: DefaulFormData,
  qualifiers: string[],
  categories: string[],
  locationDictionary: locationDictionaryFunction,
  checkIsFilled = true
) => {
  return validateNDRs(
    data,
    [validateDenominatorGreaterThanNumerator, validateDenominatorsAreTheSame],
    qualifiers,
    categories,
    locationDictionary,
    checkIsFilled
  );
};

const validateDenominatorsAreTheSame: OmsValidationCallback = ({
  rateData,
  categories,
  qualifiers,
  label,
  locationDictionary,
}) => {
  const errors: FormError[] = [];
  const areDenomsTheSame = (rateArr: RateFields[]) => {
    if (rateArr.length === 0) return true;
    const compareValue = rateArr[0].denominator;

    return rateArr.every((rate) => rate.denominator === compareValue);
  };

  for (const qual of qualifiers) {
    const cleanQual = cleanString(qual);
    const rateArr: RateFields[] = [];
    for (const cat of categories.map((s) => cleanString(s))) {
      if (rateData.rates?.[cleanQual]?.[cat]) {
        const temp = rateData.rates[cleanQual][cat][0];
        if (temp && temp.denominator) {
          rateArr.push(temp);
        }
      }
    }
    if (!areDenomsTheSame(rateArr)) {
      errors.push({
        errorLocation: `Optional Measure Stratification: ${locationDictionary(
          label
        )} - ${qual}`,
        errorMessage: "Denominators must be the same.",
      });
    }
  }
  return errors;
};

const validateDenominatorGreaterThanNumerator: OmsValidationCallback = ({
  categories,
  qualifiers,
  rateData,
  label,
  locationDictionary,
}) => {
  const error: FormError[] = [];
  for (const qual of qualifiers.map((s) => cleanString(s))) {
    for (const cat of categories.map((s) => cleanString(s))) {
      if (rateData.rates?.[qual]?.[cat]) {
        const temp = rateData.rates[qual][cat][0];
        if (temp && temp.denominator && temp.numerator) {
          if (parseFloat(temp.denominator) < parseFloat(temp.numerator)) {
            error.push({
              errorLocation: `Optional Measure Stratification: ${locationDictionary(
                label
              )}`,
              errorMessage:
                "Numerator cannot be greater than the Denominator for NDR sets.",
            });
          }
        }
      }
    }
  }

  return error;
};

const validateNDRs = (
  data: DefaulFormData,
  callbackArr: OmsValidationCallback[],
  qualifiers: string[],
  categories: string[],
  locationDictionary: locationDictionaryFunction,
  checkIsFilled: boolean
) => {
  const isFilled: { [key: string]: boolean } = {};
  const errorArray: FormError[] = [];

  // validates top levels, ex: Race, Geography, Sex
  const validateTopLevelNode = (node: OMS.TopLevelOmsNode, label: string[]) => {
    // validate children if exist
    if (node.options?.length) {
      for (const option of node.options) {
        validateChildNodes(node.selections?.[option] ?? {}, [...label, option]);
      }
    }

    // validate for additionals category
    for (const addtnl of node.additionalSelections ?? []) {
      validateChildNodes(addtnl, [...label, "Additional Category"]);
    }

    // ACA validate
    if (node.rateData) {
      validateNodeRates(node.rateData, label);
    }
  };

  // validate mid level, ex: White, African American, etc
  const validateChildNodes = (node: OMS.MidLevelOMSNode, label: string[]) => {
    // validate sub categories
    if (node.additionalSubCategories?.length) {
      for (const subCat of node.additionalSubCategories) {
        validateChildNodes(subCat, [...label, "sub-category"]);
      }
    }

    // validate sub type, ex: Asian -> Korean, Chinese, etc
    if (node.aggregate?.includes("No")) {
      for (const key of node.options ?? []) {
        validateChildNodes(node.selections?.[key] ?? {}, [...label, key]);
      }
    }

    //validate rates
    if (node.rateData) {
      validateNodeRates(node.rateData, label);
    }
  };

  // Rate containers to be validated
  const validateNodeRates = (rateData: OMS.OmsRateFields, label: string[]) => {
    for (const callback of callbackArr) {
      errorArray.push(
        ...callback({
          rateData,
          categories,
          qualifiers,
          label,
          locationDictionary,
        })
      );
    }

    if (checkIsFilled)
      isFilled[label[0]] = isFilled[label[0]] || checkNdrsFilled(rateData);
  };

  //checks at least one ndr filled
  const checkNdrsFilled = (rateData: OMS.OmsRateFields) => {
    for (const qual of qualifiers.map((s) => cleanString(s))) {
      for (const cat of categories.map((s) => cleanString(s))) {
        if (rateData.rates?.[qual]?.[cat]) {
          const temp = rateData.rates[qual][cat][0];
          if (temp && temp.denominator && temp.numerator && temp.rate) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Loop through top level nodes for validation
  for (const key of data.OptionalMeasureStratification.options) {
    isFilled[key] = false;
    validateTopLevelNode(
      data.OptionalMeasureStratification.selections?.[key] ?? {},
      [key]
    );
  }

  if (checkIsFilled) {
    for (const topLevelKey in isFilled) {
      if (!isFilled[topLevelKey]) {
        errorArray.push({
          errorLocation: `Optional Measure Stratification: ${locationDictionary(
            [topLevelKey]
          )}`,
          errorMessage: "Must fill out at least one NDR set.",
        });
      }
    }
  }

  console.log(errorArray);
  return errorArray;
};
