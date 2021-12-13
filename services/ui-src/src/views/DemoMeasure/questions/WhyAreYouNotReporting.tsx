import * as QMR from "components";
import { useCustomRegister } from "hooks/useCustomRegister";
import { DemoForm } from "../DemoFormType";

export const WhyAreYouNotReporting = () => {
  const register = useCustomRegister<DemoForm.DemoFormType>();
  // questionText
  return (
    <QMR.CoreQuestionWrapper label="Are you reporting on this measure?">
      <QMR.Checkbox
        {...register("WhyAreYouNotReporting-Answer")}
        options={[
          {
            displayValue: `Service not covered`,
            value: "ServiceNotCovered",
          },
          {
            displayValue: `Population not covered`,
            value: "PopulationNotCovered",
            children: [
              <QMR.RadioButton
                {...register("AmountOfPopulationNotCovered")}
                options={[
                  {
                    displayValue: "Entire population not covered",
                    value: "EntirePopulationNotCovered",
                  },
                  {
                    displayValue: "Partial population not covered",
                    value: "PartialPopulationNotCovered",
                    children: [
                      <QMR.TextArea
                        label="Explain the partial population not covered:"
                        {...register("PartialPopulationNotCoveredExplanation")}
                      />,
                    ],
                  },
                ]}
              />,
            ],
          },
          {
            displayValue: `Data not available`,
            value: "DataNotAvailable",
            children: [
              <QMR.Checkbox
                {...register("WhyIsDataNotAvailable-Answer")}
                label="Why is data not available?"
                renderHelperTextAbove
                helperText="Select all that apply:"
                options={[
                  {
                    displayValue: "Budget constraints",
                    value: "BudgetConstraints",
                  },
                  {
                    displayValue: "Staff Constraints",
                    value: "StaffConstraints",
                  },
                  {
                    displayValue: "Data Inconsistencies/Accuracy Issues",
                    value: "DataInconsistenciesAccuracyIssues",
                    children: [
                      <QMR.TextArea
                        label="Explain the Data inconsistencies/Accuracy issues:"
                        {...register("DataIconAccuracyIssues")}
                      />,
                    ],
                  },
                  {
                    displayValue: "Data source not easily accessible",
                    value: "DataSourceNotEasilyAccessible",
                    children: [
                      <QMR.Checkbox
                        label="Select all that apply:"
                        {...register("DataSourceNotEasilyAccessible-Answer")}
                        options={[
                          {
                            displayValue: "Requires medical record review",
                            value: "RequiresMedicalRecordReview",
                          },
                          {
                            displayValue:
                              "Requires data linkage which does not currently exist",
                            value: "RequireDataLinkage",
                          },
                          {
                            displayValue: "Other",
                            value: "Other",
                            children: [
                              <QMR.TextInput
                                label="Explain:"
                                {...register(
                                  "DataSourceNotEasilyAccessible-Other"
                                )}
                              />,
                            ],
                          },
                        ]}
                      />,
                    ],
                  },
                  {
                    displayValue: "Information not collected",
                    value: "InformationNotCollected",
                    children: [
                      <QMR.Checkbox
                        label="Select all that apply:"
                        {...register("InformationNotCollected-Answer")}
                        options={[
                          {
                            displayValue:
                              "Not Collected by Provider (Hospital/Health Plan)",
                            value: "NotCollectedByProviderHospitalHealthPlan",
                          },
                          {
                            displayValue: "Other",
                            value: "Other",
                            children: [
                              <QMR.TextArea
                                label="Explain:"
                                {...register("InformationNotCollected-Other")}
                              />,
                            ],
                          },
                        ]}
                      />,
                    ],
                  },
                  {
                    displayValue: "Other",
                    value: "Other",
                    children: [
                      <QMR.TextArea
                        label="Explain:"
                        {...register("WhyIsDataNotAvailable-Other")}
                      />,
                    ],
                  },
                ]}
              />,
            ],
          },
          {
            displayValue:
              "Limitations with data collection, reporting, or accuracy due to the COVID-19 pandemic",
            value: "LimitationWithDatCollecitonReportAccuracyCovid",
            children: [
              <QMR.TextArea
                label="Describe your state's limitations with regard to collection, reporting, or accuracy of data for this measure:"
                {...register("LimitationWithDatCollecitonReportAccuracyCovid")}
              />,
            ],
          },
          {
            displayValue: "Small sample size (less than 30)",
            value: "SmallSampleSizeLessThan30",
            children: [
              <QMR.NumberInput
                label="Enter specific sample size:"
                {...register("SmallSampleSizeLessThan30")}
              />,
            ],
          },
          {
            displayValue: "Other",
            value: "Other",
            children: [
              <QMR.TextArea
                label="Explain:"
                {...register("WhyAreYouNotReporting-Other")}
              />,
            ],
          },
        ]}
      />
    </QMR.CoreQuestionWrapper>
  );
};
