import * as QMR from "components";
import { useCustomRegister } from "hooks/useCustomRegister";
import { Measure } from "../validation/types";

export const HowDidYouReport = () => {
  const register = useCustomRegister<Measure.Form>();
  return (
    <QMR.CoreQuestionWrapper label="How did you report this measure?">
      <QMR.RadioButton
        {...register("HowDidYouReport")}
        options={[
          {
            displayValue: "Submitted raw data to AHRQ (CAHPS Database)",
            value: "Submitted raw data to AHRQ (CAHPS Database)",
          },
          {
            displayValue: "Other",
            value: "Other",
            children: [
              <QMR.TextArea
                {...register("HowDidYouReport-Explanation")}
                label="Explain"
                formLabelProps={{
                  fontWeight: "normal",
                  fontSize: "normal",
                }}
              />,
            ],
          },
        ]}
        formLabelProps={{ fontWeight: "bold" }}
      />
    </QMR.CoreQuestionWrapper>
  );
};
