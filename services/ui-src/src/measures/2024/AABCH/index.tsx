import * as CMQ from "shared/commonQuestions";
import * as PMD from "./data";
import * as QMR from "components";
import { getPerfMeasureRateArray } from "shared/globalValidations";
import { positiveNumbersWithMaxDecimalPlaces } from "utils";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { validationFunctions } from "./validation";
import { AABRateCalculation } from "utils/rateFormulas";
//form type
import { DefaultFormData as FormData } from "shared/types/FormData";

export const AABCH = ({
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
  let mask: RegExp = positiveNumbersWithMaxDecimalPlaces(1);
  const performanceMeasureArray = getPerfMeasureRateArray(data, PMD.data);
  const rateScale = 100;

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
      />

      {!isNotReportingData && (
        <>
          <CMQ.StatusOfData />
          <CMQ.MeasurementSpecification type="HEDIS" coreset="child" />
          <CMQ.DataSource type="child" />
          <CMQ.DateRange type="child" />
          <CMQ.DefinitionOfPopulation coreset="child" />
          {isPrimaryMeasureSpecSelected && (
            <>
              <CMQ.PerformanceMeasure
                data={PMD.data}
                rateCalc={AABRateCalculation}
              />
              <CMQ.DeviationFromMeasureSpec />
            </>
          )}
          {isOtherMeasureSpecSelected && (
            <CMQ.OtherPerformanceMeasure
              customMask={mask}
              rateMultiplicationValue={rateScale}
              allowNumeratorGreaterThanDenominator
              rateCalc={AABRateCalculation}
            />
          )}
          {showOptionalMeasureStrat && (
            <CMQ.OptionalMeasureStrat
              coreset="child"
              calcTotal
              categories={PMD.categories}
              customMask={mask}
              performanceMeasureArray={performanceMeasureArray}
              qualifiers={PMD.qualifiers}
              rateMultiplicationValue={rateScale}
              allowNumeratorGreaterThanDenominator
              rateCalc={AABRateCalculation}
            />
          )}
        </>
      )}
      <CMQ.AdditionalNotes />
    </>
  );
};
