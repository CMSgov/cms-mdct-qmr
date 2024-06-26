import * as QMR from "components";
import { useCustomRegister } from "hooks/useCustomRegister";
import * as Types from "../types";
import * as DC from "dataConstants";

interface Props {
  measureName: string;
  measureAbbreviation: string;
  reportingYear: string;
}

export const Reporting = ({ reportingYear }: Props) => {
  const register = useCustomRegister<Types.FormData>();

  return (
    <>
      <QMR.CoreQuestionWrapper
        testid="reporting"
        label="Did you collect this measure?"
      >
        <QMR.RadioButton
          {...register(DC.DID_COLLECT)}
          options={[
            {
              displayValue: `Yes, we did collect data for Medical Assistance with Smoking and Tobacco Use Cessation (MSC-AD) for FFY ${reportingYear} quality measure reporting.`,
              value: `Yes, we did collect data for Medical Assistance with Smoking and Tobacco Use Cessation (MSC-AD) for FFY ${reportingYear} quality measure reporting.`,
            },
            {
              displayValue: `No, we did not collect data for Medical Assistance with Smoking and Tobacco Use Cessation (MSC-AD) for ${reportingYear} quality measure reporting.`,
              value: `No, we did not collect data for Medical Assistance with Smoking and Tobacco Use Cessation (MSC-AD) for FFY ${reportingYear} quality measure reporting.`,
            },
          ]}
        />
      </QMR.CoreQuestionWrapper>
    </>
  );
};
