import * as QMR from "components";
import * as Q from "./AdditionalNotes";
import * as CUI from "@chakra-ui/react";
import { useCustomRegister } from "hooks/useCustomRegister";
import { Measure } from "measures/types";
import React from "react";

export const OtherPerformanceMeasure = () => {
  const register = useCustomRegister<Measure.Form>();
  const rates = [
    {
      label: "",
      denominator: "",
      numerator: "",
      rate: "",
      id: 1,
    },
  ];
  const [showRates, setRates] = React.useState(rates);

  return (
    <QMR.CoreQuestionWrapper label="9. Other Performance Measure">
      <QMR.TextArea
        label="Describe the other methodology used:"
        {...register("OtherPerformanceMeasure-Explanation")}
      />
      <CUI.Box marginTop={10}>
        {showRates.map((item) => {
          return (
            <CUI.Stack my={10}>
              <CUI.Heading fontSize="lg" fontWeight="600">
                Describe the Rate:
              </CUI.Heading>
              <QMR.TextInput
                label="For example, specify the age groups and whether you are reporting on a certian indicator:"
                name={`OtherPerformanceMeasure-Rates.${item.id}.description`}
              />
              <QMR.Rate
                rates={[item]}
                name={`OtherPerformanceMeasure-Rates.${item.id}`}
              />
            </CUI.Stack>
          );
        })}

        <QMR.ContainedButton
          buttonText={"+ Add Another"}
          buttonProps={{
            variant: "outline",
            colorScheme: "blue",
            textTransform: "capitalize",
          }}
          onClick={() => {
            showRates.push({
              label: "",
              denominator: "",
              numerator: "",
              rate: "",
              id: showRates.length + 1,
            });
            setRates([...showRates]);
          }}
        />
        <Q.AdditionalNotes {...register("OtherPerformanceMeasure-Notes")} />
      </CUI.Box>
    </QMR.CoreQuestionWrapper>
  );
};
