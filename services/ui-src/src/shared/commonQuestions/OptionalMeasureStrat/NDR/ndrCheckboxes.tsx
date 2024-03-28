import * as CUI from "@chakra-ui/react";
import * as DC from "dataConstants";
import * as Types from "shared/types";
import * as QMR from "components";
import { LabelData, cleanString } from "utils";
import { useFormContext } from "react-hook-form";
import { usePerformanceMeasureContext } from "../context";
import { stringToLabelData } from "./util";
import { useRatesForCompletedPmQualifiers, useStandardRateArray } from "./rates";

type CheckBoxBuilder = (name: string) => QMR.CheckboxOption[];

/**
 * Builds Performance Measure AgeGroup Checkboxes
 */
export const useAgeGroupsCheckboxes: CheckBoxBuilder = (name) => {
    const options: QMR.CheckboxOption[] = [];
    const { categories, qualifiers, calcTotal, customPrompt } =
      usePerformanceMeasureContext();
    const cleanedCategories: LabelData[] = stringToLabelData(categories);
    const cleanedQualifiers: LabelData[] = stringToLabelData(qualifiers);
  
    const qualRates = useRatesForCompletedPmQualifiers(name);
    const standardRates = useStandardRateArray(name);
    const rateArrays =
      !cleanedCategories.length || !cleanedCategories.some((item) => item.label)
        ? qualRates
        : standardRates;
    const quals = calcTotal ? cleanedQualifiers.slice(0, -1) : cleanedQualifiers;
    const { watch } = useFormContext<Types.DataSource>();
    const dataSourceWatch = watch(DC.DATA_SOURCE);
  
    const shouldDisplay =
      dataSourceWatch?.[0] !== "AdministrativeData" ||
      dataSourceWatch?.length !== 1;
  
    const checkbox = cleanedCategories.some((cat) => cat.label)
      ? cleanedCategories
      : quals;
    checkbox?.forEach((value, idx) => {
      if (rateArrays?.[idx]?.length) {
        const ageGroupCheckBox = {
          value: value.id,
          displayValue: value.text,
          children: [
            <CUI.Heading
              key={`${name}.rates.${value.id}Header`}
              size={"sm"}
              dangerouslySetInnerHTML={{
                __html:
                  customPrompt ??
                  `Enter a number for the numerator and the denominator. Rate will
              auto-calculate:`,
              }}
            />,
            <CUI.Heading
              pt="1"
              key={`${name}.rates.${value.id}HeaderHelper`}
              size={"sm"}
              hidden={!shouldDisplay}
            >
              Please review the auto-calculated rate and revise if needed.
            </CUI.Heading>,
            ...rateArrays[idx],
          ],
        };
        options.push(ageGroupCheckBox);
      }
    });
  
    return options;
  };


/**
 * Builds OPM Checkboxes
 */
export const useRenderOPMCheckboxOptions = (name: string) => {
    const checkBoxOptions: QMR.CheckboxOption[] = [];
  
    const {
      OPM,
      rateReadOnly,
      rateMultiplicationValue,
      customMask,
      allowNumeratorGreaterThanDenominator,
      customDenominatorLabel,
      customNumeratorLabel,
      customRateLabel,
      rateCalculation,
      customPrompt,
    } = usePerformanceMeasureContext();
  
    const { watch } = useFormContext<Types.DataSource>();
    const dataSourceWatch = watch(DC.DATA_SOURCE);
  
    const shouldDisplay =
      dataSourceWatch?.[0] !== "AdministrativeData" ||
      dataSourceWatch?.length !== 1;
  
    OPM?.forEach(({ description }, idx) => {
      if (description) {
        const cleanedFieldName = `${DC.OPM_KEY}${cleanString(description)}`;
  
        const RateComponent = (
          <QMR.Rate
            rates={[
              {
                id: 0,
              },
            ]}
            name={`${name}.rates.OPM.${cleanedFieldName}`}
            key={`${name}.rates.OPM.${cleanedFieldName}`}
            readOnly={rateReadOnly}
            rateMultiplicationValue={rateMultiplicationValue}
            customMask={customMask}
            allowNumeratorGreaterThanDenominator={
              allowNumeratorGreaterThanDenominator
            }
            customNumeratorLabel={customNumeratorLabel}
            customDenominatorLabel={customDenominatorLabel}
            customRateLabel={customRateLabel}
            rateCalc={rateCalculation}
          />
        );
  
        checkBoxOptions.push({
          value: cleanedFieldName,
          displayValue: description ?? `UNSET_OPM_FIELD_NAME_${idx}`,
          children: [
            <CUI.Heading
              key={`${name}.rates.${cleanedFieldName}Header`}
              size={"sm"}
              dangerouslySetInnerHTML={{
                __html:
                  customPrompt ??
                  `Enter a number for the numerator and the denominator. Rate will
                auto-calculate:`,
              }}
            />,
            <CUI.Heading
              pt="1"
              size={"sm"}
              key={`${name}.rates.${cleanedFieldName}HeaderHelper`}
              hidden={!shouldDisplay}
            >
              Please review the auto-calculated rate and revise if needed.
            </CUI.Heading>,
            RateComponent,
          ],
        });
      }
    });
  
    return checkBoxOptions;
  };
  