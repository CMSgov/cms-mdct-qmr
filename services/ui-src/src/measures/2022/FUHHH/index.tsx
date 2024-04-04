import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import * as CMQ from "measures/2022/shared/CommonQuestions";
import * as PMD from "./data";
import { validationFunctions } from "./validation";
import { getPerfMeasureRateArray } from "measures/2022/shared/globalValidations";
import * as QMR from "components";
//form type
import { DefaultFormData as FormData } from "measures/2022/shared/CommonQuestions/types";
import { convertToQualifierLabelData, convertToCategoryLabelData } from "utils";

export const FUHHH = ({
  name,
  year,
  measureId,
  setValidationFunctions,
  isNotReportingData,
  isPrimaryMeasureSpecSelected,
  showOptionalMeasureStrat,
  isOtherMeasureSpecSelected,
}: QMR.MeasureWrapperProps) => {
  const { watch } = useFormContext<FormData>();
  const data = watch();

  useEffect(() => {
    if (setValidationFunctions) {
      setValidationFunctions(validationFunctions);
    }
  }, [setValidationFunctions]);

  const performanceMeasureArray = getPerfMeasureRateArray(data, PMD.data);

  return (
    <>
      <CMQ.Reporting
        reportingYear={year}
        measureName={name}
        measureAbbreviation={measureId}
        healthHomeMeasure
      />

      {!isNotReportingData && (
        <>
          <CMQ.StatusOfData />
          <CMQ.MeasurementSpecification type="HEDIS" />
          <CMQ.DataSource />
          <CMQ.DateRange type="health" />
          <CMQ.DefinitionOfPopulation healthHomeMeasure={true} />
          {isPrimaryMeasureSpecSelected && (
            <>
              <CMQ.PerformanceMeasure data={PMD.data} calcTotal={true} />
              <CMQ.DeviationFromMeasureSpec
                categories={PMD.categories}
                customTotalLabel={PMD.qualifiers[3]}
              />
            </>
          )}
          {isOtherMeasureSpecSelected && <CMQ.OtherPerformanceMeasure />}
          <CMQ.CombinedRates healthHomeMeasure={true} />
          {showOptionalMeasureStrat && (
            <CMQ.OptionalMeasureStrat
            qualifiers={convertToQualifierLabelData(PMD.qualifiers)}
            categories={convertToCategoryLabelData(PMD.categories)}
              performanceMeasureArray={performanceMeasureArray}
              adultMeasure={false}
              calcTotal={true}
            />
          )}
        </>
      )}
      <CMQ.AdditionalNotes />
    </>
  );
};
