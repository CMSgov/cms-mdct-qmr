import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import * as CMQ from "measures/2021/CommonQuestions";
import * as PMD from "./data";
import * as QMR from "components";
import { validationFunctions } from "./validation";
import { positiveNumbersWithMaxDecimalPlaces } from "utils";
import { getPerfMeasureRateArray } from "measures/2021/globalValidations";
import { FormData } from "./types";

export const PQI01AD = ({
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
          <CMQ.MeasurementSpecification type="AHRQ" />
          <CMQ.DataSource />
          <CMQ.DateRange type="adult" />
          <CMQ.DefinitionOfPopulation />
          {isPrimaryMeasureSpecSelected && (
            <>
              <CMQ.PerformanceMeasure
                data={PMD.data}
                rateScale={100000}
                customMask={positiveNumbersWithMaxDecimalPlaces(1)}
                allowNumeratorGreaterThanDenominator
              />
              <CMQ.DeviationFromMeasureSpec categories={PMD.categories} />
            </>
          )}
          {isOtherMeasureSpecSelected && (
            <CMQ.OtherPerformanceMeasure
              rateMultiplicationValue={100000}
              customMask={positiveNumbersWithMaxDecimalPlaces(1)}
              allowNumeratorGreaterThanDenominator
            />
          )}
          <CMQ.CombinedRates />
          {showOptionalMeasureStrat && (
            <CMQ.OptionalMeasureStrat
              categories={PMD.categories}
              qualifiers={PMD.qualifiers}
              rateMultiplicationValue={100000}
              customMask={positiveNumbersWithMaxDecimalPlaces(1)}
              performanceMeasureArray={performanceMeasureArray}
              adultMeasure
              allowNumeratorGreaterThanDenominator
            />
          )}
        </>
      )}
      <CMQ.AdditionalNotes />
    </>
  );
};
