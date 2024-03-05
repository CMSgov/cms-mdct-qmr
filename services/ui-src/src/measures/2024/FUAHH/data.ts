import { DataDrivenTypes } from "measures/2024/shared/CommonQuestions/types";
import { getCatQualLabels } from "../rateLabelText";

export const { categories, qualifiers } = getCatQualLabels("FUA-HH");

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "Percentage of emergency department (ED) visits for health home enrollees age 13 and older with a principal diagnosis of  substance use disorder (SUD), or any diagnosis of drug overdose, for which there was follow-up.  Two rates are reported:",
  ],
  questionListItems: [
    "Percentage of ED visits for which the enrollee received follow-up within 30 days of the ED visit (31 total days)",
    "Percentage of ED visits for which the enrollee received follow-up within 7 days of the ED visit (8 total days)",
  ],
  categories,
  qualifiers,
};
