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
		console.error("Error fetching contact info of customer:", error);
		return null; // Return an empty object on failure
	}
}