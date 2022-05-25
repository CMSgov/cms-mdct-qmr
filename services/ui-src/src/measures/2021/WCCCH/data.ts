import { DataDrivenTypes } from "measures/2021/CommonQuestions/types";
import * as DC from "dataConstants";

export const categories = [
  "Body mass index (BMI) percentile documentation",
  "Counseling for Nutrition",
  "Counseling for Physical Activity",
];
export const qualifiers = [
  "Ages 3 to 11",
  "Ages 12 to 17",
  "Total (Ages 3 to 17)",
];

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "The percentage of children ages 3 to 17 who had an outpatient visit with a primary care practitioner (PCP) or obstetrician/gynecologist (OB/GYN) and who had evidence of the following during the measurement year:",
  ],
  questionListItems: categories,
  categories,
  qualifiers,
};

export const dataSourceData: DataDrivenTypes.DataSource = {
  optionsLabel:
    "If reporting entities (e.g., health plans) used different data sources, please select all applicable data sources used below.",
  options: [
    {
      value: DC.ADMINISTRATIVE_DATA,
      subOptions: [
        {
          label: "What is the Administrative Data Source?",
          options: [
            {
              value: DC.MEDICAID_MANAGEMENT_INFO_SYSTEM,
            },
            {
              value: DC.ADMINISTRATIVE_DATA_OTHER,
              description: true,
            },
          ],
        },
      ],
    },
    {
      value: DC.HYBRID_DATA,
      subOptions: [
        {
          label: "What is the Administrative Data Source?",
          options: [
            {
              value: "Medicaid Management Information System (MMIS)",
            },
            {
              value: "Other",
              description: true,
            },
          ],
        },
        {
          label:
            "What is the Medical Records Data Source? (Both can be selected)",
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
