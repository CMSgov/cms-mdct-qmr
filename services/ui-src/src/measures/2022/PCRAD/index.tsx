import * as CMQ from "measures/2022/shared/CommonQuestions";
import * as PMD from "./data";
import * as QMR from "components";
import { getPerfMeasureRateArray } from "measures/2022/shared/globalValidations";
import { PCRADPerformanceMeasure } from "./questions/PerformanceMeasure";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { validationFunctions } from "./validation";
//form type
import { DefaultFormData as FormData } from "measures/2022/shared/CommonQuestions/types";
import { convertToQualifierLabelData, convertToCategoryLabelData } from "utils";

export const PCRAD = ({
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
        removeLessThan30
      />

      {!isNotReportingData && (
        <>
          <CMQ.StatusOfData />
          <CMQ.MeasurementSpecification type="HEDIS" />
          <CMQ.DataSource />
          <CMQ.DateRange type="adult" />
          <CMQ.DefinitionOfPopulation />
          {isPrimaryMeasureSpecSelected && (
            <>
              <PCRADPerformanceMeasure data={PMD.data} />
              <CMQ.DeviationFromMeasureSpec
                categories={PMD.qualifiers}
                measureName={measureId}
              />
            </>
          )}
          {isOtherMeasureSpecSelected && <CMQ.OtherPerformanceMeasure />}
          <CMQ.CombinedRates />
          {showOptionalMeasureStrat && (
            <CMQ.OptionalMeasureStrat
              performanceMeasureArray={performanceMeasureArray}
              qualifiers={convertToQualifierLabelData(PMD.qualifiers)}
              categories={convertToCategoryLabelData(PMD.categories)}
              componentFlag={"PCR"}
              adultMeasure
            />
          )}
        </>
      )}
      <CMQ.AdditionalNotes />
    </>
  );
};
