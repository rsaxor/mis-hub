import axios from "axios";

const apiKey = process.env.REACT_APP_API_KEY;
const apiValue = process.env.REACT_APP_API_VALUE;

export const getCustomerContact = async (customerID, contactId) => {
	const apiUrlCustomerContact = process.env.REACT_APP_API_CUSTOMER_CONTACT
	try {
		const config = {
			method: "get",
			url: `${apiUrlCustomerContact}/Get/${customerID}`,
			headers: {
				"Content-Type": "application/json",
				[apiKey]: apiValue,
			},
		};
		const response = await axios.request(config);

		const match = response.data.find(contact => contact.ContactID === contactId);
    	return match || null;
		
	} catch (error) {
		console.error("Error fetching contact info of customer:", error);
		return null; // Return an empty object on failure
	}
}

export const getCustomer = async (customerID) => {
	const apiUrlCustomer = process.env.REACT_APP_API_CUSTOMER_VIEW
	try {
		const config = {
			method: "get",
			url: `${apiUrlCustomer}/${customerID}`,
			headers: {
				"Content-Type": "application/json",
				[apiKey]: apiValue,
			},
		};
		const response = await axios.request(config);

    	return response.data || null;
		
	} catch (error) {
		console.error("Error fetching customers:", error);
		return null; // Return an empty object on failure
	}
}

export const getUserById = async (userID) => {
	const apiUrlUsers = process.env.REACT_APP_API_USERS
	try {
		const config = {
			method: "get",
			url: `${apiUrlUsers}`,
			headers: {
				"Content-Type": "application/json",
				[apiKey]: apiValue,
			},
		};
		const response = await axios.request(config);

		const match = response.data.find(user => user.UID === userID);
    	return match || null;
		
	} catch (error) {
		console.error("Error fetching user", error);
		return null; // Return an empty object on failure
	}
}

export const getUserAll = async () => {
	const apiUrlUsers = process.env.REACT_APP_API_USERS
	try {
		const config = {
			method: "get",
			url: `${apiUrlUsers}`,
			headers: {
				"Content-Type": "application/json",
				[apiKey]: apiValue,
			},
		};

		const response = await axios.request(config);

    	return response.data || null;
		
	} catch (error) {
		console.error("Error fetching user", error);
		return null; // Return an empty object on failure
	}
}

export const setSalesReport = async (userId, dtFrom, dtTo) => {
	const apiService = process.env.REACT_APP_API_SERVICE;
	//ExportrptEstimateBySalesPersonToExcel
	//ExportrptSalesByPersonToExcel

	try {
		const config = {
			method: "get",
			url: `${apiService}/api/ReportGrid/ExportrptSalesByPersonToExcel?dtfrom=${dtFrom}&dtTo=${dtTo}%20&SalesPersonFrom=0,${userId}&LoginName=Spectrum&CompanyName=Spectrum%20UAE%20Ltd`,
			// url: `${apiService}/api/ReportGrid/ExportrptAllCustomerslistToExcel?LoginName=Spectrum&CompanyName=Spectrum%20UAE%20Ltd`,
			headers: {
				"Content-Type": "application/json",
			},
		};

		const response = await axios.request(config);

		return response.data || null;
		
	} catch (error) {
		console.error("Error fetching user", error);
		return null; // Return an empty object on failure
	}
}

export const getTotalCount = async (selectedApi) => {
	const apiConfigs = {
		customers: {
			url: process.env.REACT_APP_API_CUSTOMER,
			query: "/1/1/1/null/1/25/1/false",
		},
		estimates: {
			url: process.env.REACT_APP_API_ESTIMATE,
			query: "/1/1/null/1/25/All/All/All/1/null/null/null",
		},
		invoices: {
			url: process.env.REACT_APP_API_INVOICE,
			query: "/0/1/null/null/null/1/Invoice/1/null/null/null",
		},
		history: {
			url: process.env.REACT_APP_API_HISTORY,
        	query: "/1/1/null/1/25/1",
		}
	};

	// Get the config for the selected API
	const apiConfig = apiConfigs[selectedApi];

	if (!apiConfig) {
		console.error(`Invalid API selection: ${selectedApi}`);
		return 0;
	}

	const apiQuery = `${apiConfig.url}${apiConfig.query}`;
	const config = {
		method: "get",
		url: apiQuery,
		headers: {
			"Content-Type": "application/json",
			[process.env.REACT_APP_API_KEY]: process.env.REACT_APP_API_VALUE,
		},
		maxBodyLength: Infinity,
	};

	try {
		const response = await axios.request(config);
		if (response.data && response.data[0]?.TotalCount) {
			return parseInt(response.data[0].TotalCount, 10);
		} else {
			console.error("TotalCount not found in response.");
			return 0;
		}
	} catch (error) {
		console.error("Error fetching total count:", error);
		return 0;
	}
};