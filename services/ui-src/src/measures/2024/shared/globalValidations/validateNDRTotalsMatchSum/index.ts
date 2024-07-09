import { RateFields } from "measures/2024/shared/CommonQuestions/types";
import { FormRateField } from "measures/2024/shared/globalValidations/types";

export function validateNDRTotalsMatchSum(
  performanceMeasureArray: FormRateField[][]
) {
  console.log("pma", performanceMeasureArray);
  const errorArray: FormError[] = [];

  const allRates = Object.values(performanceMeasureArray)
    .filter((arr): arr is RateFields[] => arr !== undefined)
    .flat();

  const requiredFields = [
    "numerator",
    "denominator",
    "label",
    "category",
  ] as const;
  type CompletedRate = RateFields &
    Required<Pick<RateFields, typeof requiredFields[number]>>;
  const isCompleted = (rate: RateFields): rate is CompletedRate =>
    requiredFields.every((field) => rate[field]) &&
    rate.category!.includes(":");

  const groupKeyOf = (rate: CompletedRate) => {
    const [categoryType, _subCategory] = rate.category.split(":");
    return `${categoryType} - ${rate.label}`;
  };

  const groups: Record<string, CompletedRate[]> = {};
  for (let rate of allRates) {
    if (!isCompleted(rate)) continue;
    const groupKey = groupKeyOf(rate);
    groups[groupKey] = (groups[groupKey] ?? []).concat([rate]);
  }
  console.log(groups);

  for (let group of Object.values(groups)) {
    console.log(group);
    let totalRate = group.find((rate) => rate.isTotal);
    let otherRates = group.filter((rate) => !rate.isTotal);
    if (!totalRate) continue;

    const numeratorSum = otherRates
      .map((rate) => parseInt(rate.numerator))
      .reduce((sum, num) => sum + num, 0);
    if (parseInt(totalRate.numerator) !== numeratorSum) {
      errorArray.push({
        errorLocation: "Performance Measure",
        errorMessage:
          "Numerators must be the sum for each category of performance measures",
      });
    }

    const denominatorSum = otherRates
      .map((rate) => parseInt(rate.denominator))
      .reduce((sum, num) => sum + num, 0);
    if (parseInt(totalRate.denominator) !== denominatorSum) {
      errorArray.push({
        errorLocation: "Performance Measure",
        errorMessage:
          "Denominators must be the sum for each category of performance measures",
      });
    }
  }

  return errorArray;
}
