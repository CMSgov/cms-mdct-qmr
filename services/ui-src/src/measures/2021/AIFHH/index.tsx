import * as CMQ from "measures/2021/CommonQuestions";
import * as PMD from "./data";
import * as QMR from "components";
import { FormData } from "./types";
import { getPerfMeasureRateArray } from "measures/2021/globalValidations";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { validationFunctions } from "./validation";
import { xNumbersYDecimals } from "utils";

export const AIFHH = ({
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
          <CMQ.MeasurementSpecification type="CMS" />
          <CMQ.DataSource />
          <CMQ.DateRange type="health" />
          <CMQ.DefinitionOfPopulation healthHomeMeasure={true} />
          {isPrimaryMeasureSpecSelected && (
            <>
              <CMQ.PerformanceMeasure
                data={PMD.data}
                RateComponent={QMR.ComplexRate}
                calcTotal={true}
              />
              <CMQ.DeviationFromMeasureSpec
                categories={PMD.categories}
                measureName={measureId}
              />
            </>
          )}
          {isOtherMeasureSpecSelected && (
            <CMQ.OtherPerformanceMeasure
              allowNumeratorGreaterThanDenominator
              customMask={xNumbersYDecimals(12, 1)}
            />
          )}
          <CMQ.CombinedRates healthHomeMeasure={true} />
          {showOptionalMeasureStrat && (
            <CMQ.OptionalMeasureStrat
              categories={PMD.categories}
              qualifiers={PMD.qualifiers}
              measureName={PMD.data.measureName}
              inputFieldNames={PMD.data.inputFieldNames}
              ndrFormulas={PMD.data.ndrFormulas}
              allowNumeratorGreaterThanDenominator
              adultMeasure={false}
              calcTotal={true}
              customMask={xNumbersYDecimals(12, 1)}
              AIFHHPerformanceMeasureArray={performanceMeasureArray}
              componentFlag={"AIF"}
            />
          )}
        </>
      )}
      <CMQ.AdditionalNotes />
    </>
  );
};
