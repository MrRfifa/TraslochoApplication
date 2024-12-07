export const countryData = [
  { index: 1, code: "AT", name: "Austria", prefix: 43, numberOfDigits: 13 },
  { index: 2, code: "BE", name: "Belgium", prefix: 32, numberOfDigits: 9 },
  { index: 3, code: "BG", name: "Bulgaria", prefix: 359, numberOfDigits: 10 },
  { index: 4, code: "HR", name: "Croatia", prefix: 385, numberOfDigits: 11 },
  { index: 5, code: "CY", name: "Cyprus", prefix: 357, numberOfDigits: 8 },
  {
    index: 6,
    code: "CZ",
    name: "Czech Republic",
    prefix: 420,
    numberOfDigits: 12,
  },
  { index: 7, code: "DK", name: "Denmark", prefix: 45, numberOfDigits: 8 },
  { index: 8, code: "EE", name: "Estonia", prefix: 372, numberOfDigits: 11 },
  { index: 9, code: "FI", name: "Finland", prefix: 358, numberOfDigits: 10 },
  { index: 10, code: "FR", name: "France", prefix: 33, numberOfDigits: 10 },
  { index: 11, code: "DE", name: "Germany", prefix: 49, numberOfDigits: 11 },
  { index: 12, code: "GR", name: "Greece", prefix: 30, numberOfDigits: 10 },
  { index: 13, code: "HU", name: "Hungary", prefix: 36, numberOfDigits: 9 },
  { index: 14, code: "IE", name: "Ireland", prefix: 353, numberOfDigits: 9 },
  { index: 15, code: "IT", name: "Italy", prefix: 39, numberOfDigits: 10 },
  { index: 13, code: "LV", name: "Latvia", prefix: 371, numberOfDigits: 8 },
  { index: 17, code: "LT", name: "Lithuania", prefix: 370, numberOfDigits: 8 },
  {
    index: 18,
    code: "LU",
    name: "Luxembourg",
    prefix: 352,
    numberOfDigits: 12,
  },
  { index: 19, code: "MT", name: "Malta", prefix: 356, numberOfDigits: 8 },
  { index: 20, code: "NL", name: "Netherlands", prefix: 31, numberOfDigits: 9 },
  { index: 21, code: "PL", name: "Poland", prefix: 48, numberOfDigits: 9 },
  { index: 22, code: "PT", name: "Portugal", prefix: 351, numberOfDigits: 9 },
  { index: 23, code: "RO", name: "Romania", prefix: 40, numberOfDigits: 9 },
  { index: 24, code: "SK", name: "Slovakia", prefix: 421, numberOfDigits: 9 },
  { index: 25, code: "SI", name: "Slovenia", prefix: 386, numberOfDigits: 8 },
  { index: 26, code: "ES", name: "Spain", prefix: 34, numberOfDigits: 9 },
  { index: 27, code: "SE", name: "Sweden", prefix: 46, numberOfDigits: 13 },
];

export const findCountry = (countryData, prefix) => {
  return countryData.find((country) => country.prefix === prefix);
};
export const findCountryByCode = (countryData, code) => {
  return countryData.find((country) => country.code === code);
};

export const findCountryByIndex = (index) => {
  return countryData.find((country) => country.index === index);
};
