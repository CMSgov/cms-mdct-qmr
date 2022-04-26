import { DateRange } from "measures/CommonQuestions/types";

// Ensure the user populates the data range
export const validateBothDatesInRange = (dateRange: DateRange["DateRange"]) => {
  let errorArray: any[] = [];
  let error;

  if (dateRange) {
    const startDateCompleted =
      !!dateRange.startDate?.selectedMonth &&
      !!dateRange.startDate?.selectedYear;

    const endDateCompleted =
      !!dateRange.endDate?.selectedMonth && !!dateRange.endDate?.selectedYear;

    if (!startDateCompleted || !endDateCompleted) {
      error = true;
    }

    if (error) {
      errorArray.push({
        errorLocation: `Date Range`,
        errorMessage: `Date Range must be completed`,
      });
    }
  }

  return error ? errorArray : [];
};
