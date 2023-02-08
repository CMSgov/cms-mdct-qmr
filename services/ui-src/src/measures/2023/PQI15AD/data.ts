import { DataDrivenTypes } from "measures/2022/CommonQuestions/types";
import { getCatQualLabels } from "../rateLabelText";

export const { categories, qualifiers } = getCatQualLabels("PQI15-AD");

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "Number of inpatient hospital admissions for asthma per 100,000 beneficiary months for beneficiaries ages 18 to 39.",
  ],
  categories,
  qualifiers,
};
