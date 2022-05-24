import { DataDrivenTypes } from "measures/2022/CommonQuestions/types";
import * as DC from "dataConstants";

export const qualifiers = [
  "Meningococcal",
  "Tdap",
  "Human Papillomavirus (HPV)",
  "Combination 1 (Meningococcal, Tdap)",
  "Combination 2 (Meningococcal, Tdap, HPV)",
];
export const categories = [];

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "Percentage of adolescents age 13 who had one dose of meningococcal vaccine, one tetanus, diphtheria toxoids and acellular pertussis (Tdap) vaccine, and have completed  the human papillomavirus (HPV) vaccine series by their 13th birthday. The measure calculates a rate for each vaccine and two combination rates.",
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
      value: DC.ADMINISTRATIVE_DATA,
      subOptions: [
        {
          label: "What is the Administrative Data Source?",
          options: [
            {
              value: DC.MEDICAID_MANAGEMENT_INFO_SYSTEM,
            },
            {
              value: DC.IMMUNIZATION_REGISTRY,
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
              value: DC.MEDICAID_MANAGEMENT_INFO_SYSTEM,
            },
            {
              value: DC.IMMUNIZATION_REGISTRY,
            },
            {
              value: DC.OTHER,
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
      value: DC.OTHER_DATA_SOURCE,
      description: true,
    },
  ],
};
