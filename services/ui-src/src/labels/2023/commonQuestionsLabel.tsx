export const commonQuestionsLabel = {
  AdditonalNotes: {
    header: "Additional Notes/Comments on the measure (optional)",
    section:
      "Please add any additional notes or comments on the measure not otherwise captured above (<em>text in this field is included in publicly-reported state-specific comments</em>):",
    upload:
      "If you need additional space to include comments or supplemental information, please attach further documentation below.",
  },
  CombinedRates: {
    header: "Combined Rate(s) from Multiple Reporting Units",
    healthHome: {
      question:
        "Did you combine rates from multiple reporting units (e.g. Health Home Providers) to create a Health Home Program-Level rate?",
      optionYes:
        "Yes, we combined rates from multiple reporting units to create a Health Home Program-Level rate.",
      optionNo:
        "No, we did not combine rates from multiple reporting units to create a Program-Level rate for Health Home measures.",
      notWeightedRate:
        "The rates are not weighted based on the size of the measure-eligible population. All reporting units are given equal weights when calculating a Program-Level rate.",
      weightedRate:
        "The rates are weighted based on the size of the measure-eligible population for each reporting unit.",
      weightedRateOther:
        "The rates are weighted based on another weighting factor.",
      weightedRateOtherExplain: "Describe the other weighting factor:",
    },
    notHealthHome: {
      question:
        "Did you combine rates from multiple reporting units (e.g. health plans, delivery systems, programs) to create a State-Level rate?",
      optionYes:
        "Yes, we combined rates from multiple reporting units to create a State-Level rate.",
      optionNo:
        "No, we did not combine rates from multiple reporting units to create a State-Level rate.",
      notWeightedRate:
        "The rates are not weighted based on the size of the measure-eligible population. All reporting units are given equal weights when calculating a State-Level rate.",
      weightedRate:
        "The rates are weighted based on the size of the measure-eligible population for each reporting unit.",
      weightedRateOther:
        "The rates are weighted based on another weighting factor.",
      weightedRateOtherExplain: "Describe the other weighting factor:",
    },
  },
  DataSource: {
    ehrSrc: "Describe the data source:",
    descDataSrc:
      "Describe the data source (<em>text in this field is included in publicly-reported state-specific comments</em>):",
    srcExplanation: "Data Source Explanation",
    srcExplanationText:
      "For each data source selected above, describe which reporting entities used each data source (e.g., health plans, FFS). If the data source differed across health plans or delivery systems, identify the number of plans or delivery systems that used each data source.",
  },
};

export default commonQuestionsLabel;
