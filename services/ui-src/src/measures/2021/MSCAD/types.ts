import * as Types from "measures/2021/CommonQuestions/types";
import * as Type from "shared/types";

export interface FormData
  extends Types.DefinitionOfPopulation,
    Types.StatusOfData,
    Types.DateRange,
    Types.DidReport,
    Type.AdditionalNotes,
    Types.WhyAreYouNotReporting,
    Type.CombinedRates,
    Types.OtherPerformanceMeasure,
    Types.MeasurementSpecification,
    Types.PerformanceMeasure,
    Types.DeviationFromMeasureSpecification,
    Types.OptionalMeasureStratification {
  //DataSource
  "DataSource-CAHPS-Version": string;
  "DataSource-CAHPS-Version-Other": string;
}
