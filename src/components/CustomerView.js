import React, { useEffect, useState } from "react";
import axios from "axios";
import Search from "./ui/Search";

import { useParams } from 'react-router-dom';
import BackButton from "./ui/BackButton";


const CustomerView = () => {
    const [customerProps, setCustomerProps] = useState([]);
    const apiUrl = process.env.REACT_APP_API_CUSTOMER_VIEW;
    const apiUrlPayment = process.env.REACT_APP_API_PAYMENT_TERMS;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;
    const { customerId } = useParams();
    const keysToDisplay = ["CustomerID", "AccountNumber", "CustomerName", "PaymentTerms", "TaxNo", "Email", "Tel1", "Contact", "Type", "CustomerTypeStatus", "DefaultTaxCodeID", "Address" ];

    useEffect(() => {
    
        const fetchPaymentTerms = async () => {
            try {
                const config = {
                    method: "get",
                    url: apiUrlPayment,
                    headers: {
                        "Content-Type": "application/json",
                        [apiKey]: apiValue,
                    },
                };
                const response = await axios.request(config);

                // Create a map of TermsID to PaymentTerms
                const termsMap = {};
                response.data.forEach(term => {
                    termsMap[term.TermsID] = term.PaymentTerms;
                });

                return termsMap; // Return the map for further usage
                
            } catch (error) {
                console.error("Error fetching payment terms:", error);
                return {}; // Return an empty object on failure
            }
        };

        const fetchCustomer = async (termsMap) => {
            try {
                const config = {
                    method: 'get',
                    url: `${apiUrl}/${customerId}`,
                    headers: {
                        'Content-Type': 'application/json', 
                        [apiKey]: apiValue
                    },
                    maxBodyLength: Infinity
                };

                const response = await axios.request(config);

                const validCustomerProps = response.data.filter(
                    (customer) => customer
                );

                const processedCustomers = validCustomerProps.map((customer) => {
                    const combinedAddress = [
                        customer["Address11"] || "",
                        customer["Address12"] || "",
                        customer["City"] || "",
                        customer["Town"] || "",
                        customer["Country"] || "",
                    ]
                        .filter(Boolean) // Remove empty or undefined values
                        .join(", "); // Combine with a comma and space
                    return {
                        ...customer,
                        Address: combinedAddress,
                        PaymentTerms: termsMap[customer["PaymentTermsID"]] || "---", };
                });
                
                setCustomerProps(processedCustomers);
            } 
            catch (error) {
                console.error("Error fetching customer data:", error);
            }
        }; 

         // Fetch payment terms first, then customers
         const fetchData = async () => {
            const termsMap = await fetchPaymentTerms();
            await fetchCustomer(termsMap);
        };

        fetchData();

    }, [apiUrl, apiKey, apiValue, customerId, apiUrlPayment]);


    // const allKeys = customerProps.length
    // ? Object.keys(customerProps[0])
    // : [];

    return (
        <div>
            <div className="container-fluid px-0">
                <div className="row justify-content-between">
                    <div className="col-3">
                        <Search />
                    </div>
                    <div className="col-12">
                        <div className="row">
                            {customerProps.length > 0 ? (
                                customerProps.map((customer, index) => (
                                    <div key={index} className="col-12 mb-4">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title"><b>Customer Details</b></h5>
                                                {keysToDisplay.map((key, keyIndex) => (
                                                    <div key={keyIndex} className="row">
                                                        <div className="col-md-3 font-weight-bold">
                                                            {key}:
                                                        </div>
                                                        <div className="col-md-9">
                                                            {customer[key] ? customer[key] : `---`}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <a className="btn btn-primary d-inline-block mt-4" href={`/mis-customer-history/${customer.CustomerID}`}>History</a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <p className="text-center">Loading . . .</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-12">
                        <BackButton/>
                    </div>
                </div>
            </div>
        </div>
    );

};
export default CustomerView;