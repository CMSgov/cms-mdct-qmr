export namespace DemoForm {
  export interface DemoFormType {
    DidReport: string;
    DataStatus: string[];
    DataSource: string[];
    "DataStatus-ProvisionalExplanation": string;
    "DataSource-Administrative"?: string[];
    "DataSource-Administrative-Other"?: string;
    "DataSource-Administrative-Other-Explanation"?: string;
    "DataSource-Other": string;
    "DataSource-Other-Explanation": string;
    "DataSource-Hybrid"?: string[];
    "DataSource-Hybrid-Other"?: string;
    "DataSource-Hybrid-Other-Explanation"?: string;
    "DataSource-Hybrid-MedicalRecord-DataSoruce"?: string;
    "DataSource-ElectronicHealthRecords"?: string;
    "DataSource-ElectronicHealthRecords-Explanation"?: string;
    "WhyAreYouNotReporting-Answer": string[];
    AmountOfPopulationNotCovered: string;
    PopulationNotCovered: string;
    PartialPopulationNotCoveredExplanation: string;
    "WhyIsDataNotAvailable-Answer": string;
    "WhyIsDataNotAvailable-Other": string;
    DataIconAccuracyIssues: string;
    "DataSourceNotEasilyAccessible-Answer": string;
    "DataSourceNotEasilyAccessible-Other": string;
    "InformationNotCollected-Answer": string;
    "InformationNotCollected-Other": string;
    LimitationWithDatCollecitonReportAccuracyCovid: string;
    "SmallSampleSizeLessThan30": string;
    "WhyAreYouNotReporting-Other": string;
  }
}
