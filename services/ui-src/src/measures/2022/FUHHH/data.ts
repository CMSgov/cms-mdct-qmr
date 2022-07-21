import { DataDrivenTypes } from "measures/2022/CommonQuestions/types";
import { getCatQualLabels } from "../rateLabelText";

export const { categories, qualifiers } = getCatQualLabels("FUH-HH");

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "Percentage of discharges for health home enrollees age 6 and older who were hospitalized for treatment of selected mental illness or intentional self-harm diagnoses and who had a follow-up visit with a mental health provider. Two rates are reported:",
  ],
  questionListItems: [
    "Percentage of discharges for which the enrollee received follow-up within 30 days after discharge",
    "Percentage of discharges for which the enrollee received follow-up within 7 days after discharge",
  ],
  categories,
  qualifiers,
};
