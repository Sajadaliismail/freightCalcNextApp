"use client";
import React, { useEffect, useRef, useState } from "react";
import { calculatePrice, validateData } from "./utilities";
import useFetchCSV from "./useFetchZones.jsx";
import useFetchExtraRates from "./useFetchExtraRates.jsx";
import useFetchRates from "./useFetchRates.jsx";

const FormField = ({ label, type, value, onChange, name, error, ...props }) => {
  return (
    <div className="w-full mb-2 md:mb-1">
      <label
        className="block font-medium md:text-base text-sm  mb-1"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`
            w-full px-3 py-2 bg-white text-gray-900 rounded-md
            border ${error ? "border-red-500" : "border-gray-300"}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition duration-150 ease-in-out
          `}
          placeholder={label}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <p className=" text-sm text-red-500 ">{error}</p>
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
const RadioButton = ({ id, value, checked, onChange, label }) => {
  return (
    <label
      htmlFor={id}
      className="flex items-center space-x-3 cursor-pointer group"
    >
      <div className="relative">
        <input
          type="radio"
          id={id}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full group-hover:border-blue-500 transition-colors">
          <div
            className={`absolute w-3 h-3 bg-blue-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity ${
              checked ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        </div>
      </div>
      <span className="text-lg font-medium  group-hover:text-blue-200 transition-colors">
        {label}
      </span>
    </label>
  );
};
const SummaryItem = ({ label, value, highlight = false }) => {
  return (
    <div
      className={`flex justify-between items-center p-3 rounded ${
        highlight ? "bg-gray-700 col-span-full md:col-span-3" : "bg-gray-700/50"
      }`}
    >
      <h2 className={`font-medium ${highlight ? "text-lg" : "text-base"}`}>
        {label}:
      </h2>
      <span className={`font-semibold ${highlight ? "text-xl" : "text-lg"}`}>
        {value}
      </span>
    </div>
  );
};

function App() {
  const [mode, setMode] = useState("import");
  const [heading, setHeading] = useState("Import from");
  const [selectedImport, setSelectedImport] = useState("India");
  const [selectedExport, setSelectedExport] = useState("Qatar");
  const [isQuerySend, setIsQuerySend] = useState(false);
  const { countries, zones } = useFetchCSV("/importZones.csv");
  const { extraRates } = useFetchExtraRates("./extraZones.csv");
  const { data } = useFetchRates("./rateCards.csv");
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const [error, setError] = useState({
    weight: "",
    boxes: "",
    name: "",
    phone: "",
    length: "",
    width: "",
    height: "",
    postCode: "",
    email: "",
    countrySelected: "",
  });
  const [summary, setSummary] = useState({});

  const [formValues, setformValues] = useState({
    weight: undefined,
    boxes: undefined,
    name: undefined,
    phone: undefined,
    length: undefined,
    width: undefined,
    height: undefined,
    postCode: undefined,
    email: undefined,
    remarks: undefined,
  });
  const resetError = () => {
    setError({
      weight: "",
      boxes: "",
      name: "",
      phone: "",
      length: "",
      width: "",
      height: "",
      postCode: "",
      email: "",
      countrySelected: "",
    });
  };
  const submitForm = async () => {
    try {
      setSummary({});
      const validate = validateData({
        ...formValues,
        mode,
        selectedExport,
        selectedImport,
      });

      setError(validate.error);

      if (!validate.err) {
        resetError();
        const result = calculatePrice(
          {
            ...formValues,
            mode,
            selectedExport,
            selectedImport,
          },
          zones,
          extraRates,
          data
        );

        setSummary(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitQuery = async () => {
    const validate = validateData({
      ...formValues,
      mode,
      selectedExport,
      selectedImport,
    });

    setError(validate.error);

    if (validate.err) return;

    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          mode,
          selectedExport,
          selectedImport,
        }),
      });

      const result = await response.json();
      setIsQuerySend(true);
      if (result.success) {
        // alert("Form submitted successfully!");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      setIsQuerySend(true);

      console.error("Error submitting form:", error);
      // alert("Submission failed.");
    }
  };

  const toggleMode = (e) => {
    setIsQuerySend(false);
    setSummary({});
    resetError();
    if (e.target.value === "import") {
      setSelectedImport("UAE");
      setSelectedExport("Afghanistan");
    } else if (e.target.value === "export") {
      setSelectedExport("UAE");
      setSelectedImport("Afghanistan");
    }

    setMode(e.target.value);
  };

  const handleImportCountryChange = (e) => {
    setIsQuerySend(false);

    setSummary({});
    resetError();

    setError((prev) => ({
      ...prev,
      countrySelected: "",
    }));
    setSelectedImport(e.target.value);
  };
  const handleExportCountryChange = (e) => {
    setIsQuerySend(false);

    setSummary({});

    setError((prev) => ({
      ...prev,
      countrySelected: "",
    }));
    setSelectedExport(e.target.value);
  };

  const handleInputChange = (e) => {
    setSummary({});
    setIsQuerySend(false);

    const { name, value } = e.target;
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
    setformValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    setHeading(() => {
      if (mode === "import") return "Import form";
      else if (mode === "export") return "Export form";
      else if (mode === "crosstrade") return "Cross trade form";
    });
  }, [mode]);

  return (
    <>
      <div className="bg-white  h-20 relative items-center gap-14 text-xl text-[#21428b] ">
        <img
          src="/logixman.svg"
          width={120}
          height={116}
          className=" absolute left-4 md:left-36 -bottom-12"
        ></img>
        <div className="sm:hidden relative items-center flex justify-center h-full">
          <img
            src="/menu.svg"
            onClick={toggleDrawer}
            className="cursor-pointer rounded-md ml-auto mr-2 hover:bg-[#ff6900] transition-colors duration-300"
            width={50}
          ></img>
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out`}
          >
            <div ref={drawerRef} className="flex flex-col p-4">
              <button
                onClick={toggleDrawer}
                className="self-end p-2 mb-4  transition-colors duration-300 rounded-md"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6  fill-black hover:bg-[#ff6900] rounded-md transition-colors duration-300"
                  viewBox="0 0 24 24"
                  stroke="#21428B"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <a
                className="hover:text-[#f69321]  duration-300 transition-colors"
                href="/"
              >
                Home
              </a>
              <a
                className="hover:text-[#f69321] duration-300 transition-colors"
                href="/about-us"
              >
                About Us
              </a>
              <a
                className="hover:text-[#f69321] duration-300 transition-colors"
                href="/services"
              >
                Services
              </a>
              <a
                className="hover:text-[#f69321] duration-300 transition-colors"
                href="/contact-us"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        <div className="sm:flex flex-row md:justify-center sm:justify-end items-center gap-16 h-full hidden">
          <a
            className="hover:text-[#f69321]  duration-300 transition-colors"
            href="/"
          >
            Home
          </a>
          <a
            className="hover:text-[#f69321] duration-300 transition-colors"
            href="/about-us"
          >
            About Us
          </a>
          <a
            className="hover:text-[#f69321] duration-300 transition-colors"
            href="/services"
          >
            Services
          </a>
          <a
            className="hover:text-[#f69321] duration-300 transition-colors"
            href="/contact-us"
          >
            Contact Us
          </a>
        </div>
      </div>
      <div className="flex flex-col min-w-[100vw]  bg-[radial-gradient(ellipse_at_center,_#21428b,_#020024)] text-white pt-14">
        <h1 className="text-center text-3xl md:text-5xl py-8 font-semibold ">
          Rate Calculation
        </h1>
        <div className="flex flex-row flex-wrap justify-center gap-8 text-lg">
          <RadioButton
            id="export"
            value="export"
            checked={mode === "export"}
            onChange={toggleMode}
            label="EXPORT"
          />
          <RadioButton
            id="import"
            value="import"
            checked={mode === "import"}
            onChange={toggleMode}
            label="IMPORT"
          />
          <RadioButton
            id="crosstrade"
            value="crosstrade"
            checked={mode === "crosstrade"}
            onChange={toggleMode}
            label="CROSS TRADE"
          />
        </div>

        <h1 className="text-center text-4xl font-semibold w-fit mx-auto p-1 rounded-md   my-3">
          {heading}
        </h1>
        {error.countrySelected && (
          <span className="text-center text-white bg-red-500 w-fit mx-auto p-1 rounded-md">
            {error.countrySelected}
          </span>
        )}

        <div className="flex md:flex-row flex-col gap-16 md:gap-0 md:px-3 px-3 w-full">
          <div className="flex flex-col w-full text-center md:px-16 gap-3">
            <label className="flex flex-col">
              Country from
              <select
                className="h-10 rounded-md   text-black "
                value={selectedImport}
                onChange={handleImportCountryChange}
              >
                {mode === "export" ? (
                  <option className="text-black" value={"UAE"}>
                    UAE
                  </option>
                ) : (
                  countries
                    .filter((country) => {
                      if (mode !== "crosstrade" && country === "UAE") {
                        return false;
                      }
                      return true;
                    })
                    .map((country, idx) => (
                      <option className="text-black" key={idx} value={country}>
                        {country}
                      </option>
                    ))
                )}
              </select>
            </label>
            <FormField
              error={error.weight}
              label="Total Weight (Kg)"
              type="number"
              value={formValues.weight}
              name="weight"
              onChange={handleInputChange}
            />
            <FormField
              error={error.boxes}
              label="Number of Boxes"
              type="number"
              value={formValues.boxes}
              name={"boxes"}
              onChange={handleInputChange}
            />
            <FormField
              error={error.name}
              label="Name"
              type="text"
              value={formValues.name}
              name="name"
              onChange={handleInputChange}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                error={error.phone}
                label="Phone"
                type="tel"
                value={formValues.phone}
                name="phone"
                onChange={handleInputChange}
              />
              <FormField
                error={error.email}
                label="Email"
                type="email"
                value={formValues.email}
                name="email"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-col w-full text-center md:px-16 gap-3">
            <label className="flex flex-col">
              Country to
              <select
                className="h-10 rounded-md  text-black "
                value={selectedExport}
                onChange={handleExportCountryChange}
              >
                {mode === "import" ? (
                  <option className="text-black" value={"UAE"}>
                    UAE
                  </option>
                ) : (
                  countries
                    .filter((country) => {
                      if (mode !== "crosstrade" && country === "UAE") {
                        return false;
                      }
                      return true;
                    })
                    .map((country, idx) => (
                      <option className="text-black" key={idx} value={country}>
                        {country}
                      </option>
                    ))
                )}
              </select>
            </label>

            <div className="flex flex-row w-full gap-3">
              <FormField
                error={error.length}
                label="Length (cm)"
                type="number"
                value={formValues.length}
                name="length"
                onChange={handleInputChange}
              />
              <FormField
                label="Width (cm)"
                error={error.width}
                type="number"
                value={formValues.width}
                name="width"
                onChange={handleInputChange}
              />
              <FormField
                label="Height (cm)"
                type="number"
                error={error.height}
                value={formValues.height}
                name="height"
                onChange={handleInputChange}
              />
            </div>

            <FormField
              label="Post code"
              type="text"
              error={error.postCode}
              value={formValues.postCode}
              name="postCode"
              onChange={handleInputChange}
            />
            <label className="flex flex-col font-medium text-sm md:text-base">
              Remarks
              <textarea
                className="rounded-md outline-0 text-black p-2"
                rows={5}
                placeholder="Your remarks"
                maxLength={250}
                value={formValues.remarks}
                name="remarks"
                onChange={handleInputChange}
                style={{ resize: "none" }}
              ></textarea>
            </label>
          </div>
        </div>
        <div className="md:py-10 py-4  flex justify-center flex-col md:text-xl text-lg">
          {mode === "crosstrade" ? (
            <button
              onClick={submitQuery}
              className="bg-[#f69321] hover:bg-[#21428B] w-fit text-white mx-auto h-12 px-3 rounded-md shadow-xl hover:scale-105 duration-300 "
            >
              Get a quote for this
            </button>
          ) : (
            <button
              onClick={submitForm}
              className="bg-[#f69321]  hover:bg-[#21428B] w-fit text-white mx-auto h-12 px-3 rounded-md shadow-xl hover:scale-105 duration-300"
            >
              Calculate shipping charge
            </button>
          )}
          {isQuerySend && (
            <div className="bg-green-700 text-white p-4 rounded-md shadow-md text-center font-medium flex items-center justify-center gap-2 w-fit mx-auto my-3">
              Thank you for your query! We’ll get in touch with you shortly.
            </div>
          )}
          {summary.price && (
            <div className="w-full max-w-4xl mx-auto my-3 p-6 rounded-md bg-transparent text-white">
              <h1 className="text-3xl font-bold text-center mb-6">Summary</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryItem
                  label="Total Weight"
                  value={`${summary.totalWeight} Kg`}
                />
                <SummaryItem
                  label="Total Volume"
                  value={`${summary.volume} L`}
                />
                <SummaryItem
                  label="Total Boxes"
                  value={`${summary.totalBoxes} Nos`}
                />

                <SummaryItem
                  label="Estimated Cost"
                  value={
                    new Intl.NumberFormat("en-AE", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(summary.price) + " AED"
                  }
                  highlight
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
