import * as QMR from "components";
import { useCustomRegister } from "hooks/useCustomRegister";
import { useFormContext } from "react-hook-form";
import { WhyDidYouNotCollect } from ".";
import { FormData } from "../types";

interface Props {
  measureName: string;
  measureAbbreviation: string;
  reportingYear: string;
}

export const Reporting = ({ reportingYear }: Props) => {
  const register = useCustomRegister<FormData>();
  const { watch } = useFormContext<FormData>();
  const watchRadioStatus = watch("DidCollect");

  return (
    <>
      <QMR.CoreQuestionWrapper label="Did you collect this measure?">
        <QMR.RadioButton
          {...register("DidCollect")}
          options={[
            {
              displayValue: `Yes, we did collect data for the Consumer Assessment of Healthcare Providers and Systems (CAHPS®) Health Plan Survey 5.1H - Child Version Including Medicaid and Children with Chronic Conditions Supplemental Items (CPC-CH) for FFY ${reportingYear} quality measure reporting`,
              value: "yes",
            },
            {
              displayValue: `No, we did not collect data for the Consumer Assessment of Healthcare Providers and Systems (CAHPS®) Health Plan Survey 5.1H - Child Version Including Medicaid and Children with Chronic Conditions Supplemental Items (CPC-CH) for FFY ${reportingYear} quality measure reporting`,
              value: "no",
            },
          ]}
        />
      </QMR.CoreQuestionWrapper>
      {watchRadioStatus?.includes("no") && <WhyDidYouNotCollect />}
    </>
  );
};
