import * as QMR from "components";
import * as CUI from "@chakra-ui/react";
import * as DC from "dataConstants";
import { useCustomRegister } from "hooks/useCustomRegister";
import * as Types from "../types";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DataDrivenTypes } from "../types";

interface Props {
  rateAlwaysEditable?: boolean;
  rateMultiplicationValue?: number;
  customMask?: RegExp;
  allowNumeratorGreaterThanDenominator?: boolean;
  data?: DataDrivenTypes.PerformanceMeasure;
  RateComponent?: RateComp;
  rateCalc?: RateFormula;
}

const stringIsReadOnly = (dataSource: string) => {
  return dataSource === "AdministrativeData";
};

const arrayIsReadOnly = (dataSource: string[]) => {
  if (dataSource.length === 0) {
    return false;
  }
  return (
    dataSource?.every((source) => source === "AdministrativeData") ?? false
  );
};

export const OtherPerformanceMeasure = ({
  rateAlwaysEditable,
  rateMultiplicationValue,
  customMask,
  allowNumeratorGreaterThanDenominator,
  data = {},
  RateComponent = QMR.Rate,
  rateCalc,
}: Props) => {
  const register = useCustomRegister<Types.OtherPerformanceMeasure>();
  const { getValues } = useFormContext<Types.OtherPerformanceMeasure>();
  const savedRates = getValues(DC.OPM_RATES);
  const { control } = useFormContext();
  const [showRates, setRates] = React.useState<Types.OtherRatesFields[]>(
    savedRates ?? [
      {
        rate: [{ denominator: "", numerator: "", rate: "" }],
        description: "",
      },
    ]
  );

  const { remove } = useFieldArray({
    name: DC.OPM_RATES,
    control,
    shouldUnregister: true,
  });

  // ! Waiting for data source refactor to type data source here
  const { watch } = useFormContext<Types.DataSource>();

  // Watch for dataSource data
  const dataSourceWatch = watch(DC.DATA_SOURCE);

  // Conditional check to let rate be readonly when administrative data is the only option or no option is selected

  let rateReadOnly = false;
  if (rateAlwaysEditable !== undefined) {
    rateReadOnly = false;
  } else if (dataSourceWatch && Array.isArray(dataSourceWatch)) {
    rateReadOnly = arrayIsReadOnly(dataSourceWatch);
  } else if (dataSourceWatch) {
    rateReadOnly = stringIsReadOnly(dataSourceWatch);
  }

  return (
    <QMR.CoreQuestionWrapper testid="OPM" label="Other Performance Measure">
      <QMR.TextArea
        label="Describe the other methodology used:"
        formLabelProps={{ fontWeight: 700 }}
        {...register(DC.OPM_EXPLAINATION)}
      />
      <CUI.Box marginTop={10}>
        {showRates.map((_item, index) => {
          return (
            <QMR.DeleteWrapper
              allowDeletion={index !== 0}
              onDelete={() => remove(index)}
              key={index}
            >
              <CUI.Stack key={index} my={10}>
                <CUI.Heading fontSize="lg" fontWeight="600">
                  Describe the Rate:
                </CUI.Heading>
                <QMR.TextInput
                  label="For example, specify the age groups and whether you are reporting on a certain indicator:"
                  name={`${DC.OPM_RATES}.${index}.${DC.DESCRIPTION}`}
                />
                <CUI.Text
                  fontWeight="bold"
                  mt={5}
                  dangerouslySetInnerHTML={{
                    __html:
                      data.customPrompt ??
                      `Enter a number for the numerator and the denominator. Rate will
            auto-calculate:`,
                  }}
                  data-cy="Enter a number for the numerator and the denominator"
                />
                {(dataSourceWatch?.[0] !== "AdministrativeData" ||
                  dataSourceWatch?.length !== 1) && (
                  <CUI.Heading pt="5" size={"sm"}>
                    Please review the auto-calculated rate and revise if needed.
                  </CUI.Heading>
                )}
                <RateComponent
                  rates={[
                    {
                      id: index,
                    },
                  ]}
                  name={`${DC.OPM_RATES}.${index}.${DC.RATE}`}
                  rateMultiplicationValue={rateMultiplicationValue}
                  customMask={customMask}
                  readOnly={rateReadOnly}
                  allowNumeratorGreaterThanDenominator={
                    allowNumeratorGreaterThanDenominator
                  }
                  rateCalc={rateCalc}
                />
              </CUI.Stack>
            </QMR.DeleteWrapper>
          );
        })}

        <QMR.ContainedButton
          buttonText={"+ Add Another"}
          buttonProps={{
            variant: "outline",
            colorScheme: "blue",
            color: "blue.500",
          }}
          onClick={() => {
            showRates.push({
              description: "",
              rate: [
                {
                  denominator: "",
                  numerator: "",
                  rate: "",
                },
              ],
            });
            setRates([...showRates]);
          }}
        />
      </CUI.Box>
    </QMR.CoreQuestionWrapper>
  );
};
