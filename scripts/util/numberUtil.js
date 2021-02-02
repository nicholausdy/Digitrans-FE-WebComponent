class NumberUtil {
  static roundDecimal(baseNumber, decimalDigitCount) {
    const decimalDivider = Math.pow(10, decimalDigitCount);
    const roundedNumber = (Math.round(baseNumber * decimalDivider)) / decimalDivider;
    return roundedNumber;
  }
}

export { NumberUtil }
