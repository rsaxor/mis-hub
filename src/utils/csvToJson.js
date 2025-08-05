import axios from "axios";
import Papa from "papaparse";

export const csvToJson = async (apiUrl) => {
    // const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const proxyUrl = "https://api.codetabs.com/v1/proxy?quest=";
    // const strType = "EstSalesPerson";
    // const strType = "SalesByPerson";
    const strType = "AllCustomers";
    try {
        // Step 1: Fetch the CSV file data
        const config = {
            method: "get",
            url: `${proxyUrl}${apiUrl}/Reports/frmInventoryDownload.aspx?strType=${strType}&CompanyID=1`,
            responseType: "blob", // Ensure we get the file as a Blob
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await axios.request(config);

        // Step 2: Convert the Blob to Text
        const csvText = await response.data.text();

        // Step 3: Parse CSV into JSON using PapaParse
        const parsedData = Papa.parse(csvText, {
            header: true, // Treat the first row as headers
            skipEmptyLines: true, // Ignore empty rows
        });

        // console.log("Full Parsed JSON Data:", parsedData.data);

        // Step 4: Return the parsed JSON data starting from array #6
        const slicedData = parsedData.data.slice(6); // Start from the 6th element
        // console.log("Sliced JSON Data (from #6):", slicedData);

        return slicedData; // Return only data starting from the 6th element
    } catch (error) {
        console.error("Error fetching data:", error);

        // Provide additional clarity if the issue is CORS
        if (error.message.includes("CORS")) {
            console.warn(
                "CORS issue detected. Ensure the server supports CORS or use a valid proxy."
            );
        }

        return null; // Return null on error
    }
};
