import { CCSMQualifierForm } from "./types";
import { DeliverySystem } from "./types";

const validate21To64EqualsToOneHundredPercent = (data: CCSMQualifierForm) => {
  const values = data["PercentageEnrolledInEachDeliverySystem"];
  const errorArray: any[] = [];

  const totalUnder21MedicaidPercent = values?.reduce(
    (acc: number, curr: DeliverySystem) => {
      return acc + parseFloat(curr.UnderTwentyOne || "0");
    },
    0
  );

  if (
    totalUnder21MedicaidPercent > 0 &&
    (totalUnder21MedicaidPercent < 99 || totalUnder21MedicaidPercent > 101)
  ) {
    errorArray.push({
      errorLocation: "Delivery System",
      errorMessage: "Entries for Under Age 21 Medicaid column must total 100",
    });
  }
  return errorArray.length ? errorArray : [];
};

export const validationFunctions = [validate21To64EqualsToOneHundredPercent];
