import * as Types from "measures/2021/CommonQuestions/types";

export interface FormData
  extends Types.AdditionalNotes,
    Types.MeasurementSpecification,
    Types.DidCollect {
  //HowDidYouReport
  HowDidYouReport: string[];
  "HowDidYouReport-Explanation": string;

  //DataSource
  "DataSource-Included-ItemSets": string[];
  "DataSource-Included-ItemSets-Other": string;
  "DataSource-CAHPS-Version": string;
  "DataSource-CAHPS-Version-Other": string;
  "DataSource-Admin-Protocol": string;
  "DataSource-Admin-Protocol-Other": string;

  //WhyDidYouNotCollect
  WhyDidYouNotCollect: string[];
  AmountOfPopulationNotCovered: string;
  PopulationNotCovered: string;
  PartialPopulationNotCoveredExplanation: string;
  WhyIsDataNotAvailable: string;
  "WhyIsDataNotAvailable-Other": string;
  DataInconsistenciesAccuracyIssues: string;
  DataSourceNotEasilyAccessible: string;
  "DataSourceNotEasilyAccessible-Other": string;
  InformationNotCollected: string;
  "InformationNotCollected-Other": string;
  LimitationWithDatCollecitonReportAccuracyCovid: string;
  SmallSampleSizeLessThan30: string;
  "WhyDidYouNotCollect-Other": string;

  //DefinitionOfPopulation
  DefinitionOfSurveySample: string[];
  "DefinitionOfSurveySample-Other": string;
  "DefinitionOfSurveySample-Changes": string;
}
