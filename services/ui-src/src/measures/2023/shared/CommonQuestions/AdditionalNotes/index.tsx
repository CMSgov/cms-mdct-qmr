import * as QMR from "components";
import * as CUI from "@chakra-ui/react";
import { useCustomRegister } from "hooks/useCustomRegister";
import { Upload } from "components/Upload";
import * as Types from "../types";
import * as DC from "dataConstants";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

export const AdditionalNotes = () => {
  const register = useCustomRegister<Types.AdditionalNotes>();
  const { getValues, resetField } = useFormContext();
  const didReport = getValues()["DidReport"];

  useEffect(() => {
    resetField("AdditionalNotes-AdditionalNotes");
  }, [didReport, resetField]);

  return (
    <QMR.CoreQuestionWrapper
      testid="additional-notes"
      label="Additional Notes/Comments on the measure (optional)"
    >
      <QMR.TextArea
        label="Please add any additional notes or comments on the measure not otherwise captured above (text in this field is included in publicly-reported state-specific comments):"
        {...register(DC.ADDITIONAL_NOTES)}
      />
      <CUI.Box marginTop={10}>
        <Upload
          label="If you need additional space to include comments or supplemental information, please attach further documentation below."
          {...register(DC.ADDITIONAL_NOTES_UPLOAD)}
        />
      </CUI.Box>
    </QMR.CoreQuestionWrapper>
  );
};
