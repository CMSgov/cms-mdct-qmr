import { DataDrivenTypes } from "measures/2022/CommonQuestions/types";
import * as DC from "dataConstants";

export const qualifiers = ["Ages 18 to 64", "Age 65 and older"];
export const categories = [];

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText: [
    "Percentage of beneficiaries age 18 and older screened for depression on the date of the encounter or 14 days prior to the date of the encounter using an age-appropriate standardized depression screening tool, and if positive, a follow-up plan is documented on the date of the eligible encounter.",
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
              value: DC.ADMINISTRATIVE_DATA_OTHER,
              description: true,
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
