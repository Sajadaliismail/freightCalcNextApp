export const validateData = (data) => {
  console.log(data);

  const error = {};
  let err = false;

  if (data.selectedExport === data.selectedImport) {
    error.countrySelected = "Same country is selected";
    err = true;
  }

  for (const [key, value] of Object.entries(data)) {
    if (value === "" || value === null || value === undefined) {
      if (key === "remarks") continue;
      error[key] = "*required";
      err = true;
      continue;
    }

    if (["weight", "boxes", "length", "height", "width"].includes(key)) {
      if (isNaN(value)) {
        error[key] = "invalid entry";
        err = true;
      } else {
        const numValue = parseFloat(value);

        if (numValue <= 0 || numValue >= 1000) {
          error[key] = "invalid range";
          err = true;
        }
      }
    }

    if (key === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(value)) {
        error[key] = "invalid email format";
        err = true;
      }
    }

    if (key === "phone") {
      const phonePattern = /^[0-9]{10,}$/;
      if (!phonePattern.test(value)) {
        error[key] = "invalid phone number ";
        err = true;
      }
    }

    if (key === "name") {
      const namePattern = /^[a-zA-Z\s]+$/;
      if (!namePattern.test(value) || !value.trim()) {
        error[key] = "invalid name";
        err = true;
      }
    }
  }

  return { error, err: err };
};

const roundNumber = (num) => {
  if (num < 10) {
    const floorValue = Math.floor(num);
    const decimalPart = num - floorValue;

    if (decimalPart < 0.25) {
      return floorValue;
    } else if (decimalPart < 0.75) {
      return floorValue + 0.5;
    } else {
      return floorValue + 1;
    }
  } else {
    return Math.round(num);
  }
};

export const calculatePrice = (
  data,
  importZones,
  extraRates,
  zonePricesArray
) => {
  let country;
  let result = null;
  const zonePrices = new Map(zonePricesArray);

  if (data.mode === "import") country = data.selectedImport;
  else if (data.mode === "export") country = data.selectedExport;
  else return null;

  const rate = importZones[country];

  const volume = ((data.length * data.width * data.height) / 1000) * data.boxes;
  let weight = data.weight;
  let maxValue = roundNumber(Math.max(volume * data.boxes, weight));
  if (maxValue <= 70) {
    result = zonePrices.get(maxValue)[rate - 1];
  } else {
    let extraUnitsCharge = ((maxValue - 70) / 0.5) * extraRates[rate - 1];
    let minimumCharge = zonePrices.get(70)[rate - 1];
    result = extraUnitsCharge + minimumCharge;
  }
  const summary = {
    price: result,
    totalWeight: weight,
    volume: volume,
    totalBoxes: data.boxes,
    mode: data.mode,
    imported: data.selectedImport,
    exported: data.selectedExport,
  };
  return summary;
};
