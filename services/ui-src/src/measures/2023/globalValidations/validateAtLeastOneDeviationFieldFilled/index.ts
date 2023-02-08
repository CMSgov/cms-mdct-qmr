import * as Types from "measures/2023/CommonQuestions/types";
import { FormRateField } from "../types";

// When a user inputs data in multiple NDR sets in a performance measure
// Then the user must complete at least one NDR set in the Deviation of measure specification.
export const validateAtLeastOneDeviationFieldFilled = (
  performanceMeasureArray: FormRateField[][],
  ageGroups: string[],
  deviationArray: Types.DeviationFields[] | any,
  didCalculationsDeviate: boolean,
  errorMessage?: string
) => {
  let errorArray: FormError[] = [];
  let ndrCount = 0;
  let atLeastOneDevNDR: boolean = false;
  let isCCWAD: boolean = false;

  if (didCalculationsDeviate) {
    ageGroups.forEach((_ageGroup, i) => {
      performanceMeasureArray?.forEach((_performanceObj, index) => {
        if (
          performanceMeasureArray[index] &&
          performanceMeasureArray[index][i] &&
          performanceMeasureArray[index][i].denominator &&
          performanceMeasureArray[index][i].numerator &&
          performanceMeasureArray[index][i].rate
        ) {
          // CCW-AD
          if (
            performanceMeasureArray[index][i].label ===
            "All Women Ages 21 to 44"
          ) {
            isCCWAD = true;
          }
          ndrCount++;
        }
      });
    });

    if (ndrCount > 0) {
      deviationArray.forEach((deviationNDR: any) => {
        // CCW-AD validation
        let selectedOptions;
        if (isCCWAD) {
          selectedOptions = deviationNDR.SelectedOptions[0];
          if (
            deviationNDR[selectedOptions].denominator ||
            deviationNDR[selectedOptions].numerator ||
            deviationNDR[selectedOptions].other
          ) {
            atLeastOneDevNDR = true;
          } else {
            atLeastOneDevNDR = false;
          }
        } else {
          if (
            deviationNDR.denominator ||
            deviationNDR.numerator ||
            deviationNDR.other
          ) {
            atLeastOneDevNDR = true;
          } else {
            atLeastOneDevNDR = false;
          }
        }
        return atLeastOneDevNDR;
      });

      if (!atLeastOneDevNDR) {
        errorArray.push({
          errorLocation: "Deviations from Measure Specifications",
          errorMessage:
            errorMessage ??
            "At least one item must be selected and completed (Numerator, Denominator, or Other)",
        });
      }
    }
  }
  return errorArray;
};
