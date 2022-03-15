import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { useCustomRegister } from "hooks/useCustomRegister";
import * as Types from "../types";
import * as DC from "dataConstants";

const HEDISChildren = () => {
  const register = useCustomRegister<Types.MeasurementSpecification>();

  return (
    <>
      <CUI.Text key="measureSpecDescriptor" size="sm" pb="3">
        NCQA, the measure steward, changed its naming convention. HEDIS MY 2020
        refers to a different federal fiscal year (FFY) than HEDIS 2020. Please
        note the FFY Core Set specification above.
      </CUI.Text>
      <QMR.Select
        {...register(DC.MEASUREMENT_SPECIFICATION_HEDIS)}
        label="Specify the version of HEDIS measurement year used:"
        placeholder="Select option"
        options={[
          {
            displayValue: "HEDIS MY 2020 (FFY 2021 Core Set Reporting)",
            value: DC.HEDIS_MY_2020,
          },
          {
            displayValue: "HEDIS 2020 (FFY 2020 Core Set Reporting)",
            value: DC.HEDIS_2020,
          },
          {
            displayValue: "HEDIS 2019 (FFY 2019 Core Set Reporting)",
            value: DC.HEDIS_2019,
          },
        ]}
      />
    </>
  );
};

interface Props {
  type: "HEDIS" | "OPA" | "AHRQ" | "CMS" | "AHRQ-NCQA";
}

const specifications = {
  HEDIS: {
    displayValue:
      "National Committee for Quality Assurance (NCQA)/Healthcare Effectiveness Data and Information Set (HEDIS)",
    value: DC.NCQA,
    children: [<HEDISChildren key="HEDIS-Child" />],
  },
  OPA: {
    displayValue: "HHS Office of Population Affairs (OPA)",
    value: DC.OPA,
  },
  AHRQ: {
    displayValue: "Agency for Healthcare Research and Quality (AHRQ)",
    value: DC.AHRQ,
  },
  "AHRQ-NCQA": {
    displayValue:
      "Agency for Healthcare Research and Quality (AHRQ) (survey instrument) and National Committee for Quality Assurance (survey administrative protocol)",
    value: DC.AHRQ_NCQA,
  },
  CMS: {
    displayValue: "Centers for Medicare & Medicaid Services (CMS)",
    value: DC.CMS,
  },
};

export const MeasurementSpecification = ({ type }: Props) => {
  const register = useCustomRegister<Types.MeasurementSpecification>();

  return (
    <QMR.CoreQuestionWrapper label="Measurement Specification">
      <QMR.RadioButton
        {...register(DC.MEASUREMENT_SPECIFICATION)}
        options={[
          specifications[type],
          {
            displayValue: "Other",
            value: DC.OTHER,
            children: [
              <QMR.TextArea
                textAreaProps={{ marginBottom: "10" }}
                {...register(DC.MEASUREMENT_SPEC_OMS_DESCRIPTION)}
                label="Describe the specifications that were used to calculate the measure and explain how they deviated from Core Set specifications:"
                key={DC.MEASUREMENT_SPEC_OMS_DESCRIPTION}
              />,
              <QMR.Upload
                label="If you need additional space to describe your state's methodology, please attach further documentation below."
                {...register(DC.MEASUREMENT_SPEC_OMS_DESCRIPTION_UPLOAD)}
              />,
            ],
          },
        ]}
      />
    </QMR.CoreQuestionWrapper>
  );
};
