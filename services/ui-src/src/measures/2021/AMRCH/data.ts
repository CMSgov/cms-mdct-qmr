import { DataDrivenTypes } from "measures/2021/CommonQuestions/types";
import { getRateInfo } from "utils";

export const { categories, qualifiers } = getRateInfo();

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "The percentage of children and adolescents ages 5 to 18 who were identified as having persistent asthma and had a ratio of controller medications to total asthma medications of 0.50 or greater during the measurement year.",
  ],
  categories,
  qualifiers,
};
