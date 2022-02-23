import * as QMR from "components";
import * as CUI from "@chakra-ui/react";

import * as Types from "../types";
import { usePerformanceMeasureContext } from "./context";

interface NdrProps {
  /** name for react-hook-form registration */
  name: string;
  // ageGroups: Types.AgeGroups;
  // performanceMeasureDescriptions: Types.PerformanceMeasureDescriptions;
}

interface AgeGroupProps {
  /** name for react-hook-form registration */
  name: string;
  /** should rate be user editable? */
  rateReadOnly: boolean;
  /** Which performance measure rates are filled in */
  performanceMeasureArray?: Types.RateFields[][];
  ageGroups: string[];
  performanceMeasureDescriptions: string[];
}

interface OPMProps {
  /** Rate fields and descs from OPM */
  OPM: Types.OtherRatesFields[];
  /** should rate be user editable? */
  rateReadOnly: boolean;
  /** name for react-hook-form registration */
  name: string;
}

// interface TotalProps {
//   /** name for react-hook-form registration */
//   name: string;
//   /** should rate be user editable? */
//   rateReadOnly: boolean;
// }

interface NdrOptionBuilderProps extends AgeGroupProps {
  values: string[];
  addSecondaryRegisterTag: boolean;
  performanceMeasureDescriptions: string[];
}

interface ConditionalRateBuilderProps {
  addSecondaryRegisterTag: boolean;
  rateReadOnly: boolean;
  performanceMeasureArray: Types.RateFields[][];
  performanceMeasureDescriptions: string[];
  majorIndex: number;
  value: string;
  name: string;
}

type CheckBoxBuilder = (props: AgeGroupProps) => QMR.CheckboxOption[];

/**
 * Total Rate NDR that calculates from filled OMS NDR sets
 */
// const CalcTotalNDR = ({}: TotalProps) => {
//   return <div>Example Placement</div>;
// };

const buildConditionalRateArray = ({
  addSecondaryRegisterTag,
  rateReadOnly,
  performanceMeasureArray = [[]],
  majorIndex,
  value,
  name,
  performanceMeasureDescriptions,
}: ConditionalRateBuilderProps) => {
  const ndrSets: React.ReactElement[] = [];
  const cleanedLabel = value?.replace(/[^\w]/g, "") ?? "CHECKBOX_VALUE_NOT_SET";

  // create NDR sets for applicable PMs
  performanceMeasureArray.forEach((performanceMeasure, idx) => {
    if (
      performanceMeasure &&
      performanceMeasure[majorIndex] &&
      performanceMeasure[majorIndex].rate
    ) {
      const cleanedPMDescLabel =
        addSecondaryRegisterTag && performanceMeasureDescriptions[idx]
          ? // @ts-ignore
            `_${performanceMeasureDescriptions[idx].replace(/[^\w]/g, "")}`
          : "";

      const adjustedName =
        `${name}.rates.${cleanedLabel}.${idx}` + cleanedPMDescLabel;

      ndrSets.push(
        <QMR.Rate
          readOnly={rateReadOnly}
          name={adjustedName}
          key={adjustedName}
          rates={[
            {
              id: 0,
              label: `${
                performanceMeasureDescriptions[idx]
                  ? performanceMeasureDescriptions[idx]
                  : ""
              }`,
            },
          ]}
        />
      );
    }
  });

  return ndrSets;
};

/**
 * Generic builder function for any variation of AgeGroupNDRSets
 * - no ageGroups but performanceDescription
 * - no performanceDescription but ageGroups
 * - both ageGroups and performanceDescription
 */
const buildPerformanceMeasureNDRCheckboxOptions = ({
  values,
  addSecondaryRegisterTag,
  performanceMeasureArray = [[]],
  name,
  rateReadOnly,
  performanceMeasureDescriptions,
}: NdrOptionBuilderProps) => {
  const checkboxes: QMR.CheckboxOption[] = [];

  values.forEach((val, i) => {
    // add tp checkbox options
    const ndrSets = buildConditionalRateArray({
      value: val,
      addSecondaryRegisterTag,
      performanceMeasureArray,
      rateReadOnly,
      majorIndex: i,
      name,
      performanceMeasureDescriptions,
    });
    if (ndrSets.length) {
      const cleanedLabel = val.replace(/[^\w]/g, "");
      const ageGroupCheckBox = {
        value: cleanedLabel,
        displayValue: val,
        children: [
          <CUI.Heading key={`${name}.rates.${cleanedLabel}Header`} size={"sm"}>
            Enter a number for the numerator and the denominator. Rate will
            auto-calculate
          </CUI.Heading>,
          ...(!rateReadOnly
            ? [
                <CUI.Heading
                  pt="1"
                  key={`${name}.rates.${cleanedLabel}HeaderHelper`}
                  size={"sm"}
                >
                  Rate will auto-calculate. Please review the auto-calculated
                  rate and revise if needed.
                </CUI.Heading>,
              ]
            : []),
          ...ndrSets,
        ],
      };
      checkboxes.push(ageGroupCheckBox);
    }
  });

  return checkboxes;
};

/**
 * Builds Performance Measure AgeGroup Checkboxes
 */
const buildAgeGroupsCheckboxes: CheckBoxBuilder = (props) => {
  if (!props.ageGroups.length) {
    return buildPerformanceMeasureNDRCheckboxOptions({
      ...props,
      addSecondaryRegisterTag: false,
      values: props.performanceMeasureDescriptions,
    });
  }
  return buildPerformanceMeasureNDRCheckboxOptions({
    ...props,
    addSecondaryRegisterTag: true,
    values: props.ageGroups,
  });
};

/**
 * Builds NDRs for Performance Measure AgeGroups
 */
const AgeGroupNDRSets = ({ name }: NdrProps) => {
  const {
    performanceMeasureArray,
    rateReadOnly,
    ageGroups,
    performanceMeasureDescriptions,
  } = usePerformanceMeasureContext();
  const ageGroupsOptions = buildAgeGroupsCheckboxes({
    name: name,
    rateReadOnly: !!rateReadOnly,
    performanceMeasureArray,
    ageGroups,
    performanceMeasureDescriptions,
  });

  return (
    <QMR.Checkbox
      name={`${name}.options`}
      key={`${name}.options`}
      options={ageGroupsOptions}
    />
  );
};

/**
 * Builds OPM Checkboxes
 */
const renderOPMChckboxOptions = ({ OPM, rateReadOnly, name }: OPMProps) => {
  const checkBoxOptions: QMR.CheckboxOption[] = [];

  OPM.forEach(({ description }, idx) => {
    if (description) {
      const cleanedFieldName = description?.replace(/[^\w]/g, "");

      checkBoxOptions.push({
        value: cleanedFieldName,
        displayValue: description ?? `UNSET_OPM_FIELD_NAME_${idx}`,
        children: [
          <CUI.Heading
            key={`${name}.rates.${cleanedFieldName}Header`}
            size={"sm"}
          >
            Enter a number for the numerator and the denominator. Rate will
            auto-calculate
          </CUI.Heading>,
          ...(!rateReadOnly
            ? [
                <CUI.Heading
                  pt="1"
                  size={"sm"}
                  key={`${name}.rates.${cleanedFieldName}HeaderHelper`}
                >
                  Rate will auto-calculate. Please review the auto-calculated
                  rate and revise if needed.
                </CUI.Heading>,
              ]
            : []),
          <QMR.Rate
            rates={[
              {
                id: 0,
              },
            ]}
            name={`${name}.rates.${cleanedFieldName}`}
            key={`${name}.rates.${cleanedFieldName}`}
            readOnly={rateReadOnly}
          />,
        ],
      });
    }
  });

  return checkBoxOptions;
};

/**
 * Builds NDRs for Other Performance Measure sets
 */
const OPMNDRSets = ({ name }: NdrProps) => {
  const { OPM = [], rateReadOnly } = usePerformanceMeasureContext();
  return (
    <QMR.Checkbox
      name={`${name}.options`}
      key={`${name}.options`}
      options={renderOPMChckboxOptions({
        OPM,
        name,
        rateReadOnly: !!rateReadOnly,
      })}
    />
  );
};

/**
 * Builds Base level NDR Sets
 */
export const NDRSets = ({ name }: NdrProps) => {
  const { OPM } = usePerformanceMeasureContext();
  return (
    <CUI.VStack key={`${name}.NDRwrapper`} alignItems={"flex-start"}>
      {OPM && <OPMNDRSets name={name} key={name} />}
      {!OPM && <AgeGroupNDRSets name={name} key={name} />}
      {
        //TODO: finish Total section for NDRs
        /* {!OPM && calcTotal && (
        <CalcTotalNDR
          name={name}
          key={`${name}.TotalWrapper`}
          rateReadOnly={!!rateReadOnly}
        />
      )} */
      }
    </CUI.VStack>
  );
};
