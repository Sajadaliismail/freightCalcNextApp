import { useState, useEffect } from "react";
import Papa from "papaparse";

const useFetchCountries = (csvPath) => {
  const [zones, setZones] = useState([]);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const convertToCountryZoneObject = (data) => {
    const countryZoneMap = {};

    data.forEach((item) => {
      countryZoneMap[item.Country] = item.Zone;
    });

    return countryZoneMap;
  };

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch(csvPath);
        const csvData = await response.text();

        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const country = result.data.map((item) => item.Country);
            const zones = convertToCountryZoneObject(result.data);

            setCountries(country);
            setZones(zones);
          },
        });
      } catch (err) {
        setError(err);
      }
    };

    fetchCSV();
  }, [csvPath]);

  return { countries, zones, error };
};

export default useFetchCountries;
