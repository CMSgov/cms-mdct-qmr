import { DataDrivenTypes } from "measures/2024/shared/CommonQuestions/types";
import { getCatQualLabels } from "../rateLabelText";

export const { categories, qualifiers } = getCatQualLabels("PQI08-AD");

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "Hospitalizations with a principal diagnosis of heart failure per 100,000 beneficiary months for beneficiaries age 18 and older.",
  ],
  categories,
  qualifiers,
};
