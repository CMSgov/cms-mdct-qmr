import { useEffect } from "react";
import * as CMQ from "measures/2023/shared/CommonQuestions";
import * as PMD from "./data";
import { validationFunctions } from "./validation";
import * as QMR from "components";

export const FVAAD = ({
  name,
  year,
  measureId,
  setValidationFunctions,
  isNotReportingData,
  isPrimaryMeasureSpecSelected,
  showOptionalMeasureStrat,
  isOtherMeasureSpecSelected,
}: QMR.MeasureWrapperProps) => {
  useEffect(() => {
    if (setValidationFunctions) {
      setValidationFunctions(validationFunctions);
    }
  }, [setValidationFunctions]);

  return (
    <>
      <CMQ.Reporting
        reportingYear={year}
        measureName={name}
        measureAbbreviation={measureId}
        removeLessThan30
      />

      {!isNotReportingData && (
        <>
          <CMQ.StatusOfData />
          <CMQ.MeasurementSpecification type="HEDIS" />
          <CMQ.DataSourceRadio />
          <CMQ.DateRange type="adult" />
          <CMQ.DefinitionOfPopulation />
          {isPrimaryMeasureSpecSelected && (
            <>
              <CMQ.PerformanceMeasure data={PMD.data} />
              <CMQ.DeviationFromMeasureSpec categories={PMD.categories} />
            </>
          )}
          {isOtherMeasureSpecSelected && <CMQ.OtherPerformanceMeasure />}
          <CMQ.CombinedRates />
          {showOptionalMeasureStrat && <CMQ.NotCollectingOMS />}
        </>
      )}
      <CMQ.AdditionalNotes />
    </>
  );
};
