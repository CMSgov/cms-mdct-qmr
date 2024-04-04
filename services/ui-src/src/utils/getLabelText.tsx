import { CategoryLabelData, QualifierLabelData } from "shared/types";
import { cleanString } from "utils";

type LabelText = { [key: string]: string };
export interface LabelData {
  label: string;
  text: string;
  id: string;
}
const addLabelTextData = (acc: LabelText, data: LabelData) => {
  acc[data.label] = data.text;
  return acc;
};

export const getLabelText = (): { [key: string]: string } => {
  const { pathname } = window.location;
  const params = pathname.split("/");
  const year = params[2];
  const measure = params[4];
  if (year && measure) {
    const { data } = require(`../measures/${year}/rateLabelText`);

    return {
      ...data[measure]?.qualifiers.reduce(addLabelTextData, {}),
      ...data[measure]?.categories.reduce(addLabelTextData, {}),
    };
  }
  return {};
};

//this function is to convert legacy data structure that's used for 2021 & 2022 data to work with year >= 2023 components
export const stringToLabelData = (arr: string[] | LabelData[]): LabelData[] => {
  if (typeof arr[0] === "string") {
    (arr as string[]).map((qual: string) => {
      return { id: cleanString(qual), label: qual, text: qual };
    });
  }
  return arr as LabelData[];
};

export const convertToQualifierLabelData = (
  arr: string[]
): QualifierLabelData[] => {
  return arr.map((item) => {
    return { id: cleanString(item), label: item, text: item };
  });
};

export const convertToCategoryLabelData = (
  arr: string[]
): CategoryLabelData[] => {
  return arr.map((item) => {
    return { id: cleanString(item), label: item, text: item };
  });
};
