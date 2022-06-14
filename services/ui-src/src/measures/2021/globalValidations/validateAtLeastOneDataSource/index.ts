import * as Types from "measures/2021/CommonQuestions/types";

export const validateAtLeastOneDataSource = (
  data: Types.DataSource,
  customErrorMessage?: string
) => {
  const errorArray: FormError[] = [];
  if (!data.DataSource || data.DataSource.length === 0) {
    errorArray.push({
      errorLocation: "Data Source",
      errorMessage: customErrorMessage
        ? customErrorMessage
        : "You must select at least one Data Source option",
    });
  }

  return errorArray;
};
