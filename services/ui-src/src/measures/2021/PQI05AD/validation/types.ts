import * as Types from "../../CommonQuestions/types";

export namespace Measure {
  export interface Props {
    name: string;
    year: string;
    measureId: string;
    handleSubmit?: any;
    handleValidation?: any;
    setValidationFunctions?: React.Dispatch<React.SetStateAction<any>>;
  }

  interface RateFields {
    numerator: string;
    denominator: string;
    rate: string;
  }

  interface AggregateRate {
    subRate: RateFields[];
    total: RateFields[];
  }

  interface OtherRatesFields {
    description: string[];
    rate: RateFields[];
  }

  export interface Form
    extends Types.DefinitionOfPopulation,
      Types.StatusOfData,
      Types.DefinitionOfPopulation,
      Types.DateRange {
    //Report
    DidReport: string;

    //DataSource
    DataSource: string[];
    "DataSource-Administrative"?: string[];
    "DataSource-Administrative-Other"?: string;
    "DataSource-Administrative-Other-Explanation"?: string;
    "DataSource-Other": string;
    "DataSource-Other-Explanation": string;

    //CombinedRates
    CombinedRates: string;
    "CombinedRates-CombinedRates": string;
    "CombinedRates-CombinedRates-Other-Explanation": string;

    //MeasurementSpecification
    MeasurementSpecification: string;
    "MeasurementSpecification-OtherMeasurementSpecificationDescription": string;
    "MeasurementSpecification-OtherMeasurementSpecificationDescription-Upload": File;

    //WhyAreYouNotReporting
    WhyAreYouNotReporting: string[];
    AmountOfPopulationNotCovered: string;
    PopulationNotCovered: string;
    PartialPopulationNotCoveredExplanation: string;
    WhyIsDataNotAvailable: string;
    "WhyIsDataNotAvailable-Other": string;
    DataIconAccuracyIssues: string;
    DataSourceNotEasilyAccessible: string;
    "DataSourceNotEasilyAccessible-Other": string;
    InformationNotCollected: string;
    "InformationNotCollected-Other": string;
    LimitationWithDatCollecitonReportAccuracyCovid: string;
    SmallSampleSizeLessThan30: string;
    "WhyAreYouNotReporting-Other": string;

    //Other Performance Measure
    "OtherPerformanceMeasure-Explanation": string;
    "OtherPerformanceMeasure-Rates": OtherRatesFields[];
    "OtherPerformanceMeasure-Notes": string;
    "OtherPerformanceMeasure-Rates-TextInput": string;

    //AdditionalNotes
    "AdditionalNotes-AdditionalNotes"?: string;
    "AdditionalNotes-Upload"?: File[];

    //DeviationFromMeasureSpec
    DidCalculationsDeviate: string;
    DeviationOptions: string[];
    "DeviationOptions-AgeRanges": string[];
    DeviationFields: {
      options: string[];
      denominator: string;
      numerator: string;
      other: string;
    };

    "PerformanceMeasure-Explanation": string;
    "PerformanceMeasure-AgeRates": {
      denominator: string;
      numerator: string;
      other: string;
      id: string;
      label: string;
      rate: string;
    }[];

    //OptionalMeasureStratification
    CategoriesReported: string[];

    AddtnlEthnicity: string[];
    AddtnlEthnicityRates: AggregateRate[];

    AddtnlNonHispanicRace: string[];
    AddtnlNonHispanicRaceRates: AggregateRate[];
    AddtnlNonHispanicRaceSubCatTitle: { titles: string[] }[];
    AddtnlNonHispanicRaceSubCatOptions: string[][];
    AddtnlNonHispanicRaceSubCatRates: { rates: AggregateRate[] }[];

    AddtnlNonHispanicSubCat: string[];
    AddtnlNonHispanicSubCatRates: AggregateRate[];

    NonHispanicRacialCategories: string[];
    "NHRC-WhiteRates": AggregateRate;
    "NHRC-BlackOrAfricanAmericanRates": AggregateRate;
    "NHRC-AmericanIndianOrAlaskaNativeRates": AggregateRate;
    "NHRC-AggregateAsianRates": AggregateRate;
    "NHRC-IndependentAsianRates": AggregateRate[];
    "NHRC-AggregateHawaiianOrPacificIslanderRates": AggregateRate;
    "NHRC-IndependentHawaiianOrPacificIslanderRates": AggregateRate[];

    EthnicityCategories: string[];
    EthnicitySubCategories: string[];
    NonHispanicEthnicityRates: AggregateRate;
    HispanicIndependentReporting: string;
    HispanicEthnicityAggregateRate: AggregateRate;
    IndependentHispanicOptions: string[];
    IndependentHispanicRates: AggregateRate[];

    AsianIndependentReporting: string;
    IndependentAsianOptions: string[];
    NativeHawaiianIndependentReporting: string;
    IndependentNativeHawaiianOptions: string[];

    SexOptions: string[];
    MaleSexRates: AggregateRate;
    FemaleSexRates: AggregateRate;

    PrimaryLanguageOptions: string[];
    AddtnlPrimaryLanguage: string[];
    AddtnlPrimaryLanguageRates: AggregateRate[];
    EnglishLanguageRate: AggregateRate;
    SpanishLanguageRate: AggregateRate;

    DisabilityStatusOptions: string[];
    DisabilitySSIRate: AggregateRate;
    DisabilityNonSSIRate: AggregateRate;
    AddtnlDisabilityStatusDesc: string;
    AddtnlDisabilityRate: AggregateRate;

    GeographyOptions: string[];
    UrbanGeographyRate: AggregateRate;
    RuralGeographyRate: AggregateRate;
    AddtnlGeographyDesc: string;
    AddtnlGeographyRate: AggregateRate;

    ACAGroupRate: AggregateRate;
  }
}
