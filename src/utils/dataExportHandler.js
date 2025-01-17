import axios from "axios";
import { getTotalCount } from "./getApiData";

const apiKey = process.env.REACT_APP_API_KEY;
const apiValue = process.env.REACT_APP_API_VALUE;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression to validate email format
const sampleTotalCount = 2; // Test value

const apiConfigurations = {
    customers: {
        url: process.env.REACT_APP_API_CUSTOMER,
        endpoint: (page) => `/1/1/1/null/${page}/25/1/false`,
        validateData: (row) => !row.Email || emailRegex.test(row.Email),
    },
    estimates: {
        url: process.env.REACT_APP_API_ESTIMATE,
        endpoint: (page) => `/1/1/null/${page}/25/All/All/All/1/null/null/null`,
        validateData: (row) => !row.Email || emailRegex.test(row.Email),
    },
    invoices: {
        url: process.env.REACT_APP_API_INVOICE,
        endpoint: (page) => `/0/1/null/null/null/${page}/Invoice/1/null/null/null`,
        validateData: () => true, // No specific validation for invoices
    },
};

const dataExportHandler = async (selectedApi, exportSeparately, selectedSample, selectedSort) => {
    const apiConfig = apiConfigurations[selectedApi];

    if (!apiConfig) {
        console.error(`Invalid API selection: ${selectedApi}`);
        return {};
    }

    let totalCount = await getTotalCount(selectedApi);

    if (totalCount === 0) {
        alert("Unable to fetch total count. Export canceled.");
        return {};
    }

    const validData = [];
    const invalidData = [];

    totalCount = Number(selectedSample) === 1 ? sampleTotalCount : totalCount;

    for (let currentPage = 1; currentPage <= totalCount; currentPage++) {
        const config = {
            method: "get",
            url: `${apiConfig.url}${apiConfig.endpoint(currentPage)}`,
            headers: {
                "Content-Type": "application/json",
                [apiKey]: apiValue,
            },
            maxBodyLength: Infinity,
        };

        try {
            const response = await axios.request(config);
            const data = response.data;

            if (!data || data.length === 0) {
                break;
            }

            // Separate valid and invalid data based on API-specific validation logic
            data.forEach((row) => {
                let isValid = apiConfig.validateData(row);
                isValid = Number(exportSeparately) === 0 ? true : isValid; // always true if exportSeparately is not selected (false)

                if (isValid) {
                    validData.push(row);
                } else {
                    invalidData.push(row);
                }
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred during export. Please try again.");
            return {};
        }
    }

    if (selectedApi === "customers" && selectedSort === "customerId") {
        validData.sort((a, b) => a.CustomerID - b.CustomerID);
        if( Number(exportSeparately) === 1 && invalidData.length > 0 ) {
            invalidData.sort((a, b) => a.CustomerID - b.CustomerID);
        }
    }

    return {
        validData,
        invalidData,
    };
};

export default dataExportHandler;
