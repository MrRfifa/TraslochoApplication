export const countryData = [
  { code: "AT", name: "Austria", prefix: 43, numberOfDigits: 13 },
  { code: "BE", name: "Belgium", prefix: 32, numberOfDigits: 9 },
  { code: "BG", name: "Bulgaria", prefix: 359, numberOfDigits: 10 },
  { code: "HR", name: "Croatia", prefix: 385, numberOfDigits: 11 },
  { code: "CY", name: "Cyprus", prefix: 357, numberOfDigits: 8 },
  { code: "CZ", name: "Czech Republic", prefix: 420, numberOfDigits: 12 },
  { code: "DK", name: "Denmark", prefix: 45, numberOfDigits: 8 },
  { code: "EE", name: "Estonia", prefix: 372, numberOfDigits: 11 },
  { code: "FI", name: "Finland", prefix: 358, numberOfDigits: 10 },
  { code: "FR", name: "France", prefix: 33, numberOfDigits: 10 },
  { code: "DE", name: "Germany", prefix: 49, numberOfDigits: 11 },
  { code: "GR", name: "Greece", prefix: 30, numberOfDigits: 10 },
  { code: "HU", name: "Hungary", prefix: 36, numberOfDigits: 9 },
  { code: "IE", name: "Ireland", prefix: 353, numberOfDigits: 9 },
  { code: "IT", name: "Italy", prefix: 39, numberOfDigits: 10 },
  { code: "LV", name: "Latvia", prefix: 371, numberOfDigits: 8 },
  { code: "LT", name: "Lithuania", prefix: 370, numberOfDigits: 8 },
  { code: "LU", name: "Luxembourg", prefix: 352, numberOfDigits: 12 },
  { code: "MT", name: "Malta", prefix: 356, numberOfDigits: 8 },
  { code: "NL", name: "Netherlands", prefix: 31, numberOfDigits: 9 },
  { code: "PL", name: "Poland", prefix: 48, numberOfDigits: 9 },
  { code: "PT", name: "Portugal", prefix: 351, numberOfDigits: 9 },
  { code: "RO", name: "Romania", prefix: 40, numberOfDigits: 9 },
  { code: "SK", name: "Slovakia", prefix: 421, numberOfDigits: 9 },
  { code: "SI", name: "Slovenia", prefix: 386, numberOfDigits: 8 },
  { code: "ES", name: "Spain", prefix: 34, numberOfDigits: 9 },
  { code: "SE", name: "Sweden", prefix: 46, numberOfDigits: 13 },
];

export const findCountry = (countryData, prefix) => {
  return countryData.find((country) => country.prefix === prefix);
};
export const findCountryByCode = (countryData, code) => {
  return countryData.find((country) => country.code === code);
};
