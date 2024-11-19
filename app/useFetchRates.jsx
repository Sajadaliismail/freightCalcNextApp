import { useState, useEffect } from "react";
import Papa from "papaparse";

const useFetchRates = (csvPath) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const convertData = (dataArray) => {
    return dataArray.map((data) => [
      parseFloat(data.Weight),
      Object.keys(data)
        .filter((key) => key.startsWith("Zone"))
        .map((zone) => parseFloat(data[zone])),
    ]);
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
            const data = convertData(result.data);
            setData(data);
          },
        });
      } catch (err) {
        setError(err);
      }
    };

    fetchCSV();
  }, [csvPath]);

  return { data, error };
};

export default useFetchRates;
