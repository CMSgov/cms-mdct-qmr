interface NDRforumla {
  numerator: number;
  denominator: number;
  rateIndex: number;
}

/* Validation for manually entered rates */
export const PCRnoNonZeroNumOrDenom = (
  performanceMeasureArray: any,
  OPM: any,
  ndrFormulas: NDRforumla[],
  errorLocation: string = "Performance Measure/Other Performance Measure",
  explicitErrorMessage?: string
) => {
  let nonZeroRateError = false;
  let zeroRateError = false;
  let errorArray: any[] = [];
  performanceMeasureArray?.forEach((performanceMeasure: any) => {
    if (performanceMeasure && performanceMeasure.length > 0) {
      ndrFormulas.forEach((ndr: NDRforumla) => {
        if (
          performanceMeasure[ndr.numerator].value &&
          performanceMeasure[ndr.denominator].value &&
          performanceMeasure[ndr.rateIndex].value
        ) {
          if (
            parseFloat(performanceMeasure[ndr.rateIndex].value!) !== 0 &&
            parseFloat(performanceMeasure[ndr.numerator].value!) === 0
          ) {
            nonZeroRateError = true;
          }
          if (
            parseFloat(performanceMeasure[ndr.rateIndex].value!) === 0 &&
            parseFloat(performanceMeasure[ndr.numerator].value!) !== 0 &&
            parseFloat(performanceMeasure[ndr.denominator].value!) !== 0
          ) {
            zeroRateError = true;
          }
        }
      });
    }
  });

  OPM &&
    OPM.forEach((performanceMeasure: any) => {
      performanceMeasure.rate?.forEach((rate: any) => {
        if (parseFloat(rate.numerator) === 0 && parseFloat(rate.rate) !== 0) {
          nonZeroRateError = true;
        }
        if (
          parseFloat(rate.numerator) !== 0 &&
          parseFloat(rate.denominator) !== 0 &&
          parseFloat(rate.rate) === 0
        ) {
          zeroRateError = true;
        }
      });
    });
  if (nonZeroRateError) {
    errorArray.push({
      errorLocation: errorLocation,
      errorMessage: explicitErrorMessage
        ? explicitErrorMessage
        : `Manually entered rate should be 0 if numerator is 0`,
    });
  }
  if (zeroRateError) {
    errorArray.push({
      errorLocation: errorLocation,
      errorMessage:
        explicitErrorMessage ??
        `Rate should not be 0 if numerator and denominator are not 0. If the calculated rate is less than 0.5, disregard this validation.`,
    });
  }
  return zeroRateError || nonZeroRateError ? errorArray : [];
};
