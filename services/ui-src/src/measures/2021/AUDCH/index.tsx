import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import * as CMQ from "measures/2021/CommonQuestions";
import * as PMD from "./data";
import { validationFunctions } from "./validation";
import { getPerfMeasureRateArray } from "measures/2021/globalValidations";
import * as QMR from "components";
//form type
import { DefaultFormData as FormData } from "measures/2021/CommonQuestions/types";

export const AUDCH = ({
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
      />

      {!isNotReportingData && (
        <>
          <CMQ.StatusOfData />
          <CMQ.MeasurementSpecification type="CDC" />
          <CMQ.DataSource data={PMD.dataSourceData} />
          <CMQ.DateRange type="child" />
          <CMQ.DefinitionOfPopulation childMeasure={true} />
          {isPrimaryMeasureSpecSelected && (
            <>
              <CMQ.PerformanceMeasure data={PMD.data} />
              <CMQ.DeviationFromMeasureSpec categories={PMD.categories} />
            </>
          )}
          {isOtherMeasureSpecSelected && <CMQ.OtherPerformanceMeasure />}
          <CMQ.CombinedRates />
          {showOptionalMeasureStrat && (
            <CMQ.OptionalMeasureStrat
              performanceMeasureArray={performanceMeasureArray}
              qualifiers={PMD.qualifiers}
              categories={PMD.categories}
              adultMeasure={false}
            />
          )}
        </>
      )}
      <CMQ.AdditionalNotes />
    </>
  );
};
