import { FormData } from "./types";
import { validateReasonForNotReporting } from "measures/2023/shared/globalValidations";
import * as GV from "measures/2023/shared/globalValidations";
import * as DC from "dataConstants";

const CPAADValidation = (data: FormData) => {
  let errorArray: any[] = [];
  const whyDidYouNotCollect = data["WhyDidYouNotCollect"];

  if (data["DidCollect"] === undefined) {
    errorArray.push({
      errorLocation: "Did you collect this measure",
      errorMessage:
        "You must select at least one option for Did you collect this measure?",
    });
  }

  if (data["DidCollect"] === DC.NO) {
    errorArray = [...validateReasonForNotReporting(whyDidYouNotCollect, true)];
    return errorArray;
  }

  errorArray = [...errorArray, ...GV.validateHedisYear(data)];

  return errorArray;
};

export const validationFunctions = [CPAADValidation];
