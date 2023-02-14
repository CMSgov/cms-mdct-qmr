import { DateRange } from "measures/2022/shared/CommonQuestions/types";

export const validateYearFormat = (
  dateRange: DateRange["DateRange"],
  errorMessage?: string
) => {
  const errorArray: FormError[] = [];
  if (
    dateRange?.startDate?.selectedYear &&
    dateRange.startDate.selectedYear.toString().length !== 4
  ) {
    errorArray.push({
      errorLocation: "Date Range",
      errorMessage:
        errorMessage ?? "Please enter start date year in YYYY-format",
      errorType: "Warning",
    });
  }
  if (
    dateRange?.endDate?.selectedYear &&
    dateRange.endDate.selectedYear.toString().length !== 4
  ) {
    errorArray.push({
      errorLocation: "Date Range",
      errorMessage: errorMessage ?? "Please enter end date year in YYYY-format",
      errorType: "Warning",
    });
  }
  return errorArray;
};
