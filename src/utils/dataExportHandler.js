import axios from "axios";
import { getTotalCount, setSalesReport } from "./getApiData"; 
import { csvToJson } from "../utils/csvToJson"; 

const apiKey = process.env.REACT_APP_API_KEY;
const apiValue = process.env.REACT_APP_API_VALUE;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAMPLE_PAGE_COUNT = 2;

const apiConfigurations = {
    customers: {
        name: "customers",
        url: process.env.REACT_APP_API_CUSTOMER,
        endpoint: (page) => `/1/1/1/null/${page}/25/1/false`,
        validateData: (row) => !row.Email || emailRegex.test(row.Email),
    },
    estimates: {
        name: "estimates",
        url: process.env.REACT_APP_API_ESTIMATE,
        endpoint: (page) => `/1/1/null/${page}/25/All/All/All/1/null/null/null`,
        validateData: (row) => !row.Email || emailRegex.test(row.Email),
    },
    invoices: {
        name: "invoices",
        url: process.env.REACT_APP_API_INVOICE,
        endpoint: (page) => `/0/1/null/null/null/${page}/Invoice/1/null/null/null`,
        validateData: () => true,
    },
    report: {
        name: "report",
        url: process.env.REACT_APP_API_SERVICE,
    },
};

const fetchPaginatedData = async (apiConfig, isSample, exportSeparately, onProgress) => {
    const validData = [];
    const invalidData = [];
    let processedRowCount = 0;

    let totalPages = await getTotalCount(apiConfig.name);
    if (totalPages === 0) {
        return { validData, invalidData };
    }
    totalPages = isSample ? SAMPLE_PAGE_COUNT : totalPages;

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const config = {
            method: "get",
            url: `${apiConfig.url}${apiConfig.endpoint(currentPage)}`,
            headers: { "Content-Type": "application/json", [apiKey]: apiValue },
        };

        try {
            const response = await axios.request(config);
            const data = response.data;

            if (!data || data.length === 0) {
                break;
            }

            for (const row of data) {
                const isRowValid = apiConfig.validateData(row);
                if (!exportSeparately || isRowValid) {
                    validData.push(row);
                } else {
                    invalidData.push(row);
                }
                processedRowCount++;
                onProgress(processedRowCount);
            }

        } catch (error) {
            console.error(`Error fetching page ${currentPage} for ${apiConfig.name}:`, error);
        }
    }

    return { validData, invalidData };
};

const fetchSalesReportData = async (salesRep, dateFrom, dateTo) => {
    try {
        const isStorageSet = await setSalesReport(salesRep, dateFrom, dateTo);
        if (!isStorageSet) {
             throw new Error("Failed to set up the sales report session.");
        }

        const data = await csvToJson(apiConfigurations.report.url);
        if (!data) return { validData: [], invalidData: [] };

        const companySet = new Set();
        const validData = [];
        for (const row of data) { 
            const companyName = row?.__parsed_extra?.[2]?.trim() || "";
            const companyTel = row?.__parsed_extra?.[4]?.trim() || "";
            if (companyName && !companySet.has(companyName)) {
                validData.push({ company: companyName, tel: companyTel });
                companySet.add(companyName);
            }
        }

        validData.sort((a, b) => a.company.localeCompare(b.company));
        return { validData, invalidData: [] };

    } catch (error) {
        console.error("Error fetching sales report:", error);
        throw new Error("An error occurred while generating the sales report.");
    }
}

const dataExportHandler = async (formState, onProgress) => {
    const {
        api: selectedApi,
        separateInvalid: exportSeparately,
        isSample,
        sort: sortType,
        salesRep: selectedSalesrep,
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
    } = formState;

    const apiConfig = apiConfigurations[selectedApi];
    if (!apiConfig) {
        throw new Error(`Invalid API selection: ${selectedApi}`);
    }

    let result = { validData: [], invalidData: [] };

    if (selectedApi !== "report") {
        result = await fetchPaginatedData(apiConfig, isSample, exportSeparately, onProgress);
        
        if (selectedApi === "customers" && sortType === "customerId") {
            const sortById = (a, b) => a.CustomerID - b.CustomerID;
            result.validData.sort(sortById);
            if (result.invalidData.length > 0) {
                result.invalidData.sort(sortById);
            }
        }
    } else {
        result = await fetchSalesReportData(selectedSalesrep, selectedDateFrom, selectedDateTo);
    }
    
    return result;
};

export default dataExportHandler;