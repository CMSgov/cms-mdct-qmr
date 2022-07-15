import { DataDrivenTypes } from "measures/2022/CommonQuestions/types";
import { getCatQualLabels } from "../rateLabelText";

export const { categories, qualifiers } = getCatQualLabels("CCP-CH");

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "Among women ages 15 to 20 who had a live birth, the percentage that:",
  ],
  questionListItems: [
    "Were provided a most effective or moderately effective method of contraception within 3 and 60 days of delivery",
    "Were provided a long-acting reversible method of contraception (LARC) within 3 and 60 days of delivery",
  ],
  categories,
  qualifiers,
};
