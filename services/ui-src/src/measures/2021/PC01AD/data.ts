import { DataDrivenTypes } from "shared/types";
import * as DC from "dataConstants";
import { getCatQualLabels } from "../rateLabelText";

export const { categories, qualifiers } = getCatQualLabels("PC01-AD");

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "The percentage of women with elective vaginal deliveries or elective cesarean sections at ≥ 37 and < 39 weeks of gestation completed.",
  ],
  questionListItems: [],
  categories,
  qualifiers,
};

export const dataSourceData: DataDrivenTypes.DataSource = {
  optionsLabel:
    "If reporting entities (e.g., health plans) used different data sources, please select all applicable data sources used below.",
  options: [
    {
      value: DC.HYBRID_DATA,
      subOptions: [
        {
          label: "What is the Administrative Data Source?",
          options: [
            {
              value: DC.MEDICAID_MANAGEMENT_INFO_SYSTEM,
            },
            {
              value: DC.VITAL_DATA_SOURCE,
            },
            {
              value: DC.OTHER_DATA_SOURCE,
              description: true,
            },
          ],
        },
        {
          label: "What is the Medical Records Data Source?",
          options: [
            {
              value: DC.EHR_DATA,
            },
            {
              value: DC.PAPER,
            },
          ],
        },
      ],
    },
    {
      value: DC.ELECTRONIC_HEALTH_RECORDS,
      description: true,
    },
    {
      value: DC.OTHER_DATA_SOURCE,
      description: true,
    },
  ],
};
