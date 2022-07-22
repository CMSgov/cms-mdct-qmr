import { DataDrivenTypes } from "measures/2021/CommonQuestions/types";
import { getCatQualLabels } from "../rateLabelText";

export const { categories, qualifiers } = getCatQualLabels("CCW-CH");

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "Among women ages 15 to 20 at risk of unintended pregnancy, the percentage that:",
  ],
  questionListItems: [
    "Were provided a most effective or moderately effective method of contraception",
    "Were provided a long-acting reversible method of contraception (LARC)",
  ],
  categories,
  qualifiers,
};
