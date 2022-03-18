import * as DC from "dataConstants";
import * as Types from "measures/CommonQuestions/types";
import { DataDrivenTypes as DDT } from "measures/CommonQuestions/types";
import { PerformanceMeasure as PM } from "./types";

/**
 * Extracts Performance Measure Rates into double array for validation.
 * Should be in order of category string array.
 * If no categories, grabs singleCat backup from data.
 */
export const getPerfMeasureRateArray = (
  formData: Types.PerformanceMeasure,
  renderData: DDT.PerformanceMeasure
) => {
  const performanceMeasureData: PM[][] = [];

  if (renderData.categories?.length) {
    for (const cat of renderData.categories) {
      performanceMeasureData.push(
        formData.PerformanceMeasure?.rates?.[cat.replace(/[^\w]/g, "")] ?? []
      );
    }
  } else if (renderData.qualifiers?.length) {
    performanceMeasureData.push(
      formData.PerformanceMeasure?.rates?.[DC.SINGLE_CATEGORY] ?? []
    );
  }

  return performanceMeasureData;
};

interface PMErrorDictionary {
  [cleanedLabel: string]: string;
}

/** Map the user readable location category to the cleaned category used for data storage. */
export const performanceMeasureErrorLocationDicitonary = (
  renderData: DDT.PerformanceMeasure
) => {
  const errorDict: PMErrorDictionary = {};

  for (const cat of renderData?.categories ?? []) {
    errorDict[cat.replace(/[^\w]/g, "")] = cat;
  }

  errorDict[DC.SINGLE_CATEGORY] = DC.PERFORMANCE_MEASURE;
};

/**
 * Takes render data for OMS and creates a cleaned dictionary of node locations for error generation.
 */
export const omsLocationDictionary = (
  renderData: DDT.OptionalMeasureStrat,
  qualifiers?: string[],
  categories?: string[]
) => {
  const dictionary: { [cleanedLabel: string]: string } = {};
  const checkNode = (node: DDT.SingleOmsNode) => {
    // dive a layer
    for (const option of node.options ?? []) {
      checkNode(option);
    }
    dictionary[node.id.replace(/[^\w]/g, "")] = node.id;
  };

  for (const node of renderData) {
    checkNode(node);
  }

  for (const qual of qualifiers ?? []) {
    dictionary[qual.replace(/[^\w]/g, "")] = qual;
  }

  for (const cat of categories ?? []) {
    dictionary[cat.replace(/[^\w]/g, "")] = cat;
  }

  return (labels: string[]) =>
    labels.reduce((prevValue, currentValue, index) => {
      if (index === 0) {
        return dictionary[currentValue] ?? currentValue;
      }
      return `${prevValue} - ${dictionary[currentValue] ?? currentValue}`;
    }, "");
};

export const getDeviationNDRArray = (
  deviationOptions: Types.DeviationFromMeasureSpecification[typeof DC.DEVIATION_OPTIONS],
  data: Types.DeviationFromMeasureSpecification[typeof DC.DEVIATIONS],
  ageGroups?: boolean
) => {
  let deviationArray: any[] = [];
  deviationOptions?.forEach((option) => {
    const objectToSearch = ageGroups ? data[option] : data;
    if (objectToSearch) {
      if (ageGroups) {
        if (objectToSearch.RateDeviationsSelected) {
          deviationArray.push(objectToSearch);
        } else {
          for (const key of Object.keys(objectToSearch).filter(
            (prop) => prop !== DC.SELECTED_OPTIONS
          )) {
            deviationArray.push(data[option][key as Types.DeviationKeys]);
          }
        }
      } else {
        if (data) {
          deviationArray = Object.values(data);
        }
      }
    }
  });
  return deviationArray;
};
