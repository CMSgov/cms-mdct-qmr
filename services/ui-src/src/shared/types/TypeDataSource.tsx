import * as DC from "dataConstants";

export interface DataSource {
  [DC.DATA_SOURCE]: string[];
  [DC.DATA_SOURCE_SELECTIONS]: {
    [label: string]: {
      [DC.DESCRIPTION]: string;
      [DC.SELECTED]: string[];
    };
  };
  [DC.DATA_SOURCE_DESCRIPTION]: string;
  [DC.DATA_SOURCE_CAHPS_VERSION]?: string;
  [DC.DATA_SOURCE_CAHPS_VERSION_OTHER]?: string;
}

export interface OptionNode {
  value: string;
  subOptions?: {
    label?: string;
    options: OptionNode[];
  }[];
  description?: boolean;
}

export interface DataSourceData {
  options: OptionNode[];
  optionsLabel: string;
}

export const defaultData: DataSourceData = {
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
      value: DC.OTHER_DATA_SOURCE,
      description: true,
    },
  ],
};
