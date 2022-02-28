import * as QMR from "components";
import { useCustomRegister } from "hooks/useCustomRegister";
import { useFormContext } from "react-hook-form";

import * as Types from "../types";
import { OMSData, OmsNode } from "./data";

import { PerformanceMeasureProvider } from "./context";
import { TopLevelOmsChildren } from "./omsNodeBuilder";
import * as CUI from "@chakra-ui/react";
import { useEffect } from "react";

interface OmsCheckboxProps {
  /** name for react-hook-form registration */
  name: string;
  /** data object for dynamic rendering */
  data: OmsNode[];
}

/**
 * Builds out parent level checkboxes
 * ex: Race, Ethnicity, Sex, Etc.
 */
export const buildOmsCheckboxes = ({ name, data }: OmsCheckboxProps) => {
  return data.map((lvlOneOption) => {
    const displayValue = lvlOneOption.id;
    const value = lvlOneOption.id.replace(/[^\w]/g, "");

    const children = [
      <TopLevelOmsChildren
        options={lvlOneOption.options}
        addMore={!!lvlOneOption.addMore}
        parentDisplayName={lvlOneOption.id}
        addMoreSubCatFlag={!!lvlOneOption.addMoreSubCatFlag}
        name={`${name}.selections.${value}`}
        key={`${name}.selections.${value}`}
        id={displayValue}
      />,
    ];

    return { value, displayValue, children };
  });
};

interface BaseProps extends Types.Qualifiers, Types.Categories {
  /** string array for perfromance measure descriptions */
  performanceMeasureArray: Types.RateFields[][];
  /** should the total for each portion of OMS be calculated? */
  calcTotal?: boolean;
}

/** data for dynamic rendering will be provided */
interface DataDrivenProp {
  /** data array for dynamic rendering */
  data: OmsNode[];
  /** cannot set adultMeasure if using custom data*/
  adultMeasure?: never;
}

/** default data is being used for this component */
interface DefaultDataProp {
  /** is this an adult measure? Should this contain the ACA portion? */
  adultMeasure: boolean;
  /** cannot set data if using default data */
  data?: never;
}

type Props = BaseProps & (DataDrivenProp | DefaultDataProp);

/** OMS react-hook-form typing */
type OMSType = Types.OptionalMeasureStratification & {
  DataSource: string[];
} & { MeasurementSpecification: string } & {
  "OtherPerformanceMeasure-Rates": Types.OtherRatesFields[];
};

/**
 * Final OMS built
 */
export const OptionalMeasureStrat = ({
  performanceMeasureArray,
  qualifiers = [],
  categories = [],
  data,
  calcTotal = false,
  adultMeasure,
}: Props) => {
  const omsData = data ?? OMSData(adultMeasure);
  const { watch, getValues, unregister } = useFormContext<OMSType>();
  const values = getValues();

  const dataSourceWatch = watch("DataSource");
  const OPM = values["OtherPerformanceMeasure-Rates"];
  const watchDataSourceSwitch = watch("MeasurementSpecification");

  const register = useCustomRegister();
  const checkBoxOptions = buildOmsCheckboxes({
    ...register("OptionalMeasureStratification"),
    data: omsData,
  });

  const rateReadOnly =
    dataSourceWatch?.every((source) => source === "AdministrativeData") ?? true;

  /**
   * Clear all data from OMS if the user switches from Performance Measure to Other Performance measure or vice-versa
   */
  useEffect(() => {
    return () => {
      unregister("OptionalMeasureStratification");
    };
  }, [watchDataSourceSwitch, unregister]);

  return (
    <QMR.CoreQuestionWrapper label="Optional Measure Stratification">
      <PerformanceMeasureProvider
        value={{
          OPM,
          performanceMeasureArray,
          rateReadOnly,
          calcTotal,
          qualifiers,
          categories,
        }}
      >
        <CUI.Text py="3">
          If this measure is also reported by additional
          classifications/sub-categories, e.g. racial, ethnic, sex, language,
          disability status, or geography, complete the following as applicable.
          If your state reported for classifications/sub-categories other than
          those listed below, or reported for different rate sets, please click
          on “Add Another” to add Additional/Alternative
          Classification/Sub-categories as needed.
        </CUI.Text>
        <CUI.Text py="3">
          Do not select categories and sub-classifications for which you will
          not be reporting any data.
        </CUI.Text>
        <QMR.Checkbox
          {...register("OptionalMeasureStratification.options")}
          options={checkBoxOptions}
        />
      </PerformanceMeasureProvider>
    </QMR.CoreQuestionWrapper>
  );
};
