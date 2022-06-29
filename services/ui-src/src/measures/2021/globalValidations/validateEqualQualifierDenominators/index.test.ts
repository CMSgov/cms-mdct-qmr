import {
  validateEqualQualifierDenominatorsOMS,
  validateEqualQualifierDenominatorsPM,
} from "./index";

import {
  generateOmsCategoryRateData,
  locationDictionary,
  doubleRate,
  simpleRate,
  partialRate,
} from "utils/testUtils/validationHelpers";

describe("Testing Equal Qualifier Denominators Across Category Validation", () => {
  const categories = ["Test Cat 1", "Test Cat 2"];
  const qualifiers = ["Test Qual 1", "Test Qual 2"];

  const baseOMSInfo = {
    categories,
    qualifiers,
    locationDictionary,
    isOPM: false,
    label: ["TestLabel"],
  };

  // PM
  describe("PM/OPM Validation", () => {
    it("should return NO errors", () => {
      const errors = validateEqualQualifierDenominatorsPM(
        [[simpleRate, simpleRate]],
        qualifiers
      );

      expect(errors).toHaveLength(0);
    });

    it("should have error", () => {
      const errors = validateEqualQualifierDenominatorsPM(
        [
          [simpleRate, simpleRate],
          [doubleRate, doubleRate],
        ],
        qualifiers
      );

      expect(errors).toHaveLength(2);
      expect(errors[0].errorLocation).toBe("Performance Measure");
      expect(errors[0].errorMessage).toBe(
        `Denominators must be the same for each category of performance measures for ${qualifiers[0]}`
      );
    });

    it("should NOT have error from empty rate value", () => {
      const errors = validateEqualQualifierDenominatorsPM(
        [
          [partialRate, partialRate],
          [partialRate, partialRate],
        ],
        qualifiers
      );

      expect(errors).toHaveLength(0);
    });
  });

  // OMS
  describe("OMS Validation", () => {
    it("should return NO errors", () => {
      const data = generateOmsCategoryRateData(categories, qualifiers, [
        simpleRate,
        simpleRate,
      ]);
      const errors = validateEqualQualifierDenominatorsOMS({
        ...baseOMSInfo,
        rateData: data,
      });

      expect(errors).toHaveLength(0);
    });

    it("should return no errors if OPM", () => {
      const data = generateOmsCategoryRateData(categories, qualifiers, [
        simpleRate,
        simpleRate,
      ]);
      const errors = validateEqualQualifierDenominatorsOMS({
        ...baseOMSInfo,
        rateData: data,
        isOPM: true,
      });

      expect(errors).toHaveLength(0);
    });

    it("should have errors", () => {
      const locationDictionaryJestFunc = jest.fn();
      const data = generateOmsCategoryRateData(categories, qualifiers, [
        simpleRate,
        doubleRate,
      ]);
      const errors = validateEqualQualifierDenominatorsOMS({
        ...baseOMSInfo,
        locationDictionary: locationDictionaryJestFunc,
        rateData: data,
      });

      expect(errors).toHaveLength(2);
      expect(errors[0].errorLocation).toContain(
        "Optional Measure Stratification:"
      );
      expect(locationDictionaryJestFunc).toHaveBeenCalledWith([
        "TestLabel",
        qualifiers[0],
      ]);
    });
  });
});

// TODO: Test for custom errorMessage
