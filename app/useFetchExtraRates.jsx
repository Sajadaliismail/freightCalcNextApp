import { useState, useEffect } from "react";
import Papa from "papaparse";

const useFetchExtraRates = (csvPath) => {
  const [extraRates, setExtraRates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch(csvPath);
        const csvData = await response.text();

        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const rates = result.data.map((item) => parseFloat(item.Rate));
            setExtraRates(rates);
          },
        });
      } catch (err) {
        setError(err);
      }
    };

    fetchCSV();
  }, [csvPath]);

  return { extraRates, error };
};

export default useFetchExtraRates;
