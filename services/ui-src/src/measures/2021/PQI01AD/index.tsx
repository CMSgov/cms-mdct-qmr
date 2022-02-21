import * as Q from "./questions";
import * as CMQ from "../CommonQuestions";
import * as Types from "../CommonQuestions/types";
import { useFormContext, useWatch } from "react-hook-form";
import { Measure } from "./validation/types";
import { useEffect } from "react";
import { validationFunctions } from "./validation/customValidationFunctions";
import { positiveNumbersWithMaxDecimalPlaces } from "utils/numberInputMasks";

export const PQI01AD = ({
  name,
  year,
  measureId,
  setValidationFunctions,
}: Measure.Props) => {
  useEffect(() => {
    if (setValidationFunctions) {
      setValidationFunctions(validationFunctions);
    }
  }, [setValidationFunctions]);

  const { getValues } = useFormContext<Types.OtherPerformanceMeasure>();

  // Watch Values of Form Questions
  const watchReportingRadio = useWatch({
    name: "DidReport",
  });
  const watchMeasureSpecification = useWatch({
    name: "MeasurementSpecification",
  });
  const watchPerformanceMeasureAgeRates = useWatch({
    name: "PerformanceMeasure-AgeRates",
  });

  const watchOtherPerformanceMeasureRates = useWatch({
    name: "OtherPerformanceMeasure-Rates",
  });

  // Conditionals for Performance Measures
  const isAHRQ = watchMeasureSpecification === "AHRQ";

  const isOtherSpecification = watchMeasureSpecification === "Other";
  // Age Conditionals for Deviations from Measure Specifications/Optional Measure Stratification
  const showAges18To64 = !!watchPerformanceMeasureAgeRates?.[0]?.rate;
  const showAges65AndOlder = !!watchPerformanceMeasureAgeRates?.[1]?.rate;
  const showOtherPerformanceMeasureRates = !!watchOtherPerformanceMeasureRates;

  // Logic to conditionally show age groups in Deviations from Measure Specifications/Optional Measure Stratification
  const ageGroups = [];

  if (showAges18To64) {
    ageGroups.push({ label: "Ages 18 to 64", id: 0 });
  }

  if (showAges65AndOlder) {
    ageGroups.push({ label: "Ages 65 and older", id: 1 });
  }
  if (showOtherPerformanceMeasureRates) {
    let otherRates = getValues("OtherPerformanceMeasure-Rates");
    otherRates.forEach((rate) => {
      if (rate.description) {
        ageGroups.push({ label: rate.description, id: ageGroups.length });
      }
    });
  }

  return (
    <>
      <CMQ.Reporting
        reportingYear={year}
        measureName={name}
        measureAbbreviation={measureId}
      />

      {!watchReportingRadio?.includes("No") && (
        <>
          <CMQ.StatusOfData />
          <Q.MeasurementSpecification />
          <Q.DataSource />
          <CMQ.DateRange type="adult" />
          <CMQ.DefinitionOfPopulation />
          {/* Show Performance Measure when HEDIS is selected from DataSource */}
          {isAHRQ && <Q.PerformanceMeasure />}
          {/* Show Deviation only when Other is not selected */}
          {isAHRQ && <Q.DeviationFromMeasureSpec options={ageGroups} />}
          {/* Show Other Performance Measures when isAHRQ is not true  */}
          {isOtherSpecification && (
            <CMQ.OtherPerformanceMeasure
              rateMultiplicationValue={100000}
              customMask={positiveNumbersWithMaxDecimalPlaces(1)}
            />
          )}
          <CMQ.CombinedRates />
          {(showAges18To64 ||
            showAges65AndOlder ||
            showOtherPerformanceMeasureRates) && (
            <Q.OptionalMeasureStratification
              ageGroups={ageGroups}
              deviationConditions={{
                showAges18To64,
                showAges65AndOlder,
                showOtherPerformanceMeasureRates,
              }}
            />
          )}
        </>
      )}
      <CMQ.AdditionalNotes />
    </>
  );
};
