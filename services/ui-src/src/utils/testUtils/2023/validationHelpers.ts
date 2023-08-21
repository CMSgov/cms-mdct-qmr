/**  
NOTE: This validationHelper was cloned when categories & qualifiers were updated to use LabelData[] as type instead of string[]
This should be the file used for some of the unit test from year 2023 onward
*/

import * as DC from "dataConstants";
import * as Types from "measures/2023/shared/CommonQuestions/types";
import {
  OMSData,
  OmsNode,
} from "measures/2023/shared/CommonQuestions/OptionalMeasureStrat/data";
import { LabelData } from "utils";
import {
  RateFields,
  OmsNodes as OMS,
  DataDrivenTypes as DDT,
  PerformanceMeasure,
} from "measures/2023/shared/CommonQuestions/types";

// Test Rate Objects
export const partialRate: RateFields = {
  numerator: "5",
};
export const badNumeratorRate: RateFields = {
  numerator: "7",
  denominator: "5",
  rate: "33.3",
};
export const manualZeroRate: RateFields = {
  numerator: "7",
  denominator: "5",
  rate: "0.0",
};
export const manualNonZeroRate: RateFields = {
  numerator: "0",
  denominator: "5",
  rate: "55.0",
};
export const simpleRate: RateFields = {
  numerator: "1",
  denominator: "2",
  rate: "50.0",
};
export const doubleRate: RateFields = {
  numerator: "2",
  denominator: "4",
  rate: "50.0",
  label: "Double Test Label",
};
export const lowerRate: RateFields = {
  numerator: "1",
  denominator: "4",
  rate: "25.0",
  label: "Lower Rate Label",
};
export const higherRate: RateFields = {
  numerator: "3",
  denominator: "4",
  rate: "75.0",
  label: "Higher Rate Label",
};
export const incorrectNumeratorRate: RateFields = {
  numerator: "3",
  denominator: "4",
  rate: "50.0",
  label: "Numerator Test Label",
};
export const incorrectDenominatorRate: RateFields = {
  numerator: "2",
  denominator: "5",
  rate: "50.0",
  label: "Denominator Test Label",
};
export const emptyRate: RateFields = {
  numerator: "",
  denominator: "",
  rate: "",
  label: "Empty Test Label",
};

/**
 * Helper function to prep oms validation test data  by slotting test data in qualifier order
 *
 * @param categories should always at least contain "singleCategory"
 * @param qualifiers a non-negotiable LabelData array
 * @param testData what test data to place in the qualifier location in rate data
 *
 * @note testData MUST be the same length as chosen qualifiers
 */
export const generateOmsQualifierRateData = (
  categories: LabelData[],
  qualifiers: LabelData[],
  testData: RateFields[]
) => {
  if (testData.length !== qualifiers.length) {
    console.error("Mismatch in test data length");
    return {};
  }
  const rateData: OMS.OmsRateFields = {};
  const cats = categories.length
    ? categories.map((item) => item.id)
    : [DC.SINGLE_CATEGORY];
  rateData.options = qualifiers.map((s) => s.id);

  for (const [i, q] of qualifiers.map((q) => q.id).entries()) {
    for (const c of cats) {
      rateData.rates ??= {};
      rateData.rates[c] ??= {};
      rateData.rates[c][q] = [testData[i]];
    }
  }

  return rateData;
};

/**
 * Helper function to prep oms validation test data  by slotting test data in category order
 *
 * @param categories should be longer than just singleCategory
 * @param qualifiers a non-negotiable LabelData array
 * @param testData what test data to place in the category location in rate data
 *
 * @note testData MUST be the same length as chosen categories
 */
export const generateOmsCategoryRateData = (
  categories: LabelData[],
  qualifiers: LabelData[],
  testData: RateFields[]
) => {
  if (testData.length !== categories.length) {
    console.error("Mismatch in test data length");
    return {};
  }

  const rateData: OMS.OmsRateFields = {};
  rateData.options = qualifiers.map((s) => s.id);

  for (const [i, c] of categories.map((c) => c.id).entries()) {
    for (const q of qualifiers.map((q) => q.id)) {
      rateData.rates ??= {};
      rateData.rates[c] ??= {};
      rateData.rates[c][q] = [testData[i]];
    }
  }

  return rateData;
};

/**
 * Helper function to prep pm validation test data by slotting test data in qualifier order
 *
 * @param pmd needs to contain the qualifiers and categories
 * @param testData an array of rate objects that is the same length as qualifiers
 */
export const generatePmQualifierRateData = (
  pmd: DDT.PerformanceMeasure,
  testData: RateFields[]
) => {
  if (testData.length !== pmd?.qualifiers?.length) {
    console.error("Mismatch in test data length");
    return {};
  }
  const rateData: PerformanceMeasure = { PerformanceMeasure: { rates: {} } };
  const cats = pmd.categories?.length
    ? pmd.categories.map((item) => item.id)
    : [DC.SINGLE_CATEGORY];

  for (let i = 0; i < pmd.qualifiers.length; i++) {
    for (const c of cats ?? []) {
      rateData.PerformanceMeasure!.rates![c] ??= [];
      rateData?.PerformanceMeasure?.rates?.[c]?.push(testData[i]);
    }
  }

  return rateData;
};

/**
 * Helper function to prep pm validation test data by slotting test data in category order
 *
 * @param pmd needs to contain the categories and qualifiers
 * @param testData an array of rate objects that is the same length as categories
 */
export const generatePmCategoryRateData = (
  pmd: DDT.PerformanceMeasure,
  testData: RateFields[]
) => {
  if (testData.length !== pmd?.categories?.length) {
    console.error("Mismatch in test data length");
    return {};
  }

  const rateData: PerformanceMeasure = { PerformanceMeasure: { rates: {} } };

  for (const [i, c] of pmd.categories.map((c) => c.id).entries()) {
    pmd.qualifiers?.forEach(() => {
      rateData.PerformanceMeasure!.rates![c] ??= [];
      rateData?.PerformanceMeasure?.rates?.[c]?.push(testData[i]);
    });
  }

  return rateData;
};

/**
 * Helper function to prep opm validation test data by slotting test data into x number of fields
 * @param testData object to be pushed onto OPM rates
 * @param numberOfFields how many field sets to make
 */
export const generateOtherPerformanceMeasureData = (
  testData: RateFields[],
  numberOfFields = 3
) => {
  const data: Types.OtherRatesFields[] = [];

  for (let index = 0; index < numberOfFields; index++) {
    data.push({ rate: testData });
  }

  return data;
};

/**
 * Dummy location dictionary function for testing utility
 */
export const locationDictionary = (s: string[]) => {
  return s[0];
};

/**
 * Generates a filled OMS form data object
 *
 * @param rateData test data that is applied to all nodes
 * @param addToSelections should every node be added to checkbox selections
 * @param renderData in case you want a specific OMS layout
 */
export const generateOmsFormData = (
  rateData: OMS.OmsRateFields,
  addToSelections = true,
  renderData?: Types.DataDrivenTypes.OptionalMeasureStrat
) => {
  const data = renderData ?? OMSData();
  const description = "TestAdditionalCategoryOrSubCategory";
  const omsData: Types.OptionalMeasureStratification = {
    OptionalMeasureStratification: { options: [], selections: {} },
  };

  // urban/domestic - english/spanish - etc
  const createMidLevelNode = (
    node: OmsNode
  ): Types.OmsNodes.MidLevelOMSNode => {
    const midNode: Types.OmsNodes.MidLevelOMSNode = {};
    if (!!node.options?.length) {
      midNode.aggregate = "NoIndependentData";
      for (const opt of node.options) {
        midNode.options ??= [];
        midNode.label ??= "";
        midNode.selections ??= {};
        addToSelections && midNode.options.push(opt.id);
        midNode.selections[opt.id] = {
          rateData,
          additionalSubCategories: [{ description, rateData }],
        };
      }
    } else {
      midNode.rateData = rateData;
      midNode.additionalSubCategories = [{ description, rateData }];
    }

    return midNode;
  };

  // race - sex - geography - etc
  const createTopLevelNode = (
    node: OmsNode
  ): Types.OmsNodes.TopLevelOmsNode => {
    const topNode: Types.OmsNodes.TopLevelOmsNode = {};
    if (!node.options) {
      topNode.rateData = rateData;
    }
    if (!!node.options?.length) {
      for (const opt of node.options) {
        topNode.options ??= [];
        topNode.label ??= "";
        topNode.selections ??= {};
        addToSelections && topNode.options.push(opt.id);
        topNode.selections[opt.id] = createMidLevelNode(opt);
      }
    }
    if (node.addMore) {
      const tempAdd: Types.OmsNodes.AddtnlOmsNode = {
        description,
        rateData,
        additionalSubCategories: [{ description, rateData }],
      };
      topNode.additionalSelections = [tempAdd, tempAdd];
    }
    return topNode;
  };

  // makes top level node for each omsnode
  const createBaseOMS = (node: OmsNode) => {
    addToSelections &&
      omsData.OptionalMeasureStratification.options.push(node.id);
    omsData.OptionalMeasureStratification.selections ??= {};
    omsData.OptionalMeasureStratification.selections[node.id] =
      createTopLevelNode(node);
  };

  data.forEach((node) => createBaseOMS(node));

  return omsData;
};
