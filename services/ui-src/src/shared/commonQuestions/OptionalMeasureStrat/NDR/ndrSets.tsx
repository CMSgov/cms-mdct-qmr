import * as CUI from "@chakra-ui/react";
import * as DC from "dataConstants";
import * as Types from "shared/types";
import * as QMR from "components";
import { LabelData } from "utils";
import { useFormContext } from "react-hook-form";
import { usePerformanceMeasureContext } from "../context";
import { useRenderOPMCheckboxOptions } from "./ndrCheckboxes";
import { useAgeGroupsCheckboxes } from "./ndrCheckboxes";
import { TotalNDRSets } from "./totalNDRSets";
import { stringToLabelData } from "./util";

interface NdrProps {
  name: string;
}
/**
 * Builds NDRs for Performance Measure AgeGroups
 */
const AgeGroupNDRSets = ({ name }: NdrProps) => {
  const { calcTotal } = usePerformanceMeasureContext();
  const ageGroupsOptions = useAgeGroupsCheckboxes(name);
  return (
    <>
      <QMR.Checkbox
        name={`${name}.options`}
        key={`${name}.options`}
        options={ageGroupsOptions}
      />
      {calcTotal && <TotalNDRSets name={name} key={`${name}.totalWrapper`} />}
    </>
  );
};

const IUHHNDRSets = ({ name }: NdrProps) => {
  const { calcTotal } = usePerformanceMeasureContext();
  return (
    <>
      {calcTotal && (
        <TotalNDRSets
          componentFlag={"IU"}
          name={`${name}.iuhh-rate`}
          key={`${name}.iuhh-rate.totalWrapper`}
        />
      )}
    </>
  );
};

const AIFHHNDRSets = ({ name }: NdrProps) => {
  const { calcTotal } = usePerformanceMeasureContext();
  const ageGroupsOptions = useAgeGroupsCheckboxes(`${name}.aifhh-rate`);
  return (
    <>
      <QMR.Checkbox
        name={`${name}.aifhh-rate.options`}
        key={`${name}.aifhh-rate.options`}
        options={ageGroupsOptions}
      />
      {calcTotal && (
        <TotalNDRSets
          componentFlag={"AIF"}
          name={`${name}.aifhh-rate`}
          key={`${name}.aifhh-rate.totalWrapper`}
        />
      )}
    </>
  );
};

const PCRNDRSets = ({ name }: NdrProps) => {
  const { rateReadOnly, qualifiers, customMask } =
    usePerformanceMeasureContext();
  const cleanedQualifiers: LabelData[] = stringToLabelData(qualifiers);

  const rates = cleanedQualifiers.map((qual, i) => {
    return { label: qual.label, id: i };
  });
  // ! Waiting for data source refactor to type data source here
  const { watch } = useFormContext<Types.DataSource>();

  // Watch for dataSource data
  const dataSourceWatch = watch(DC.DATA_SOURCE);

  return (
    <>
      <CUI.Heading key={`${name}.rates.Header`} size={"sm"}>
        Enter a number for the numerator and the denominator. Rate will
        auto-calculate
      </CUI.Heading>
      {dataSourceWatch?.[0] !== "AdministrativeData" ||
        (dataSourceWatch?.length !== 1 && (
          <CUI.Heading pt="1" key={`${name}.rates.HeaderHelper`} size={"sm"}>
            Please review the auto-calculated rate and revise if needed.
          </CUI.Heading>
        ))}
      <QMR.PCRRate
        rates={rates}
        name={`${name}.pcr-rate`}
        readOnly={rateReadOnly}
        customMask={customMask}
      />
    </>
  );
};

/**
 * Builds NDRs for Other Performance Measure sets
 */
const OPMNDRSets = ({ name }: NdrProps) => {
  const options = useRenderOPMCheckboxOptions(name);
  return (
    <QMR.Checkbox
      name={`${name}.options`}
      key={`${name}.options`}
      options={options}
    />
  );
};

/**
 * Builds Base level NDR Sets
 */
export const NDRSets = ({ name }: NdrProps) => {
  const { OPM, componentFlag } = usePerformanceMeasureContext();
  const children: JSX.Element[] = [];

  if (OPM) children.push(<OPMNDRSets name={name} key={name} />);

  const components = {
    ["DEFAULT"]: <AgeGroupNDRSets name={name} key={name} />,
    ["IU"]: <IUHHNDRSets name={name} key={name} />,
    ["AIF"]: <AIFHHNDRSets name={name} key={name} />,
    ["PCR"]: <PCRNDRSets name={name} key={name} />,
  };

  if (!OPM && componentFlag) {
    children.push(components[componentFlag]);
  }

  return (
    <CUI.VStack key={`${name}.NDRwrapper`} alignItems={"flex-start"}>
      {children}
    </CUI.VStack>
  );
};
