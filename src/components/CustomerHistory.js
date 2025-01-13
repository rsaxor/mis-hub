import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import BackButton from "./ui/BackButton";
 

const CustomerHistory = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const apiUrl = process.env.REACT_APP_API_CUSTOMER_HISTORY_BY_ID;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;
    const { customerId } = useParams();

    useEffect(() => {
        const fetchCustomers = async () => {
            const allCustomers = [];
            try {
                const config = {
                    method: 'get',
                    url: `${apiUrl}/${customerId}/0`,
                    headers: {
                        'Content-Type': 'application/json',
                        [apiKey]: apiValue
                    },
                    maxBodyLength: Infinity
                };

                const response = await axios.request(config);

                const validCustomers = response.data.filter(
                    (customer) => customer.EstID !== ""
                );

                allCustomers.push(...validCustomers);

                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }

            setCustomers(allCustomers);
        };

        fetchCustomers();

    }, [customerId, apiUrl, apiKey, apiValue]);


    // Calculate total pages
    const totalPages = Math.ceil(customers.length / itemsPerPage);

    // Get current page's items
    const currentItems = customers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Get all unique keys from the customer data
    const allKeys = customers.length
        ? Object.keys(customers[0])
        : [];

    return (
        <div>
            <div className="pagination mb-3 justify-content-end">
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mx-3 inline-block">
                    Page {currentPage} of {totalPages ? totalPages : "..."}
                </span>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            {allKeys.map((key, index) => (
                                <th key={index} align="left" scope="col">
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((customer, index) => (
                                <tr key={index}>
                                    {allKeys.map((key, keyIndex) => (
                                        <td key={keyIndex}>{customer[key]}</td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={allKeys.length} align="center">
                                    Loading . . .
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="pagination justify-content-between">
                <div>
                    <BackButton/>
                </div>
                <div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-3 inline-block">
                        Page {currentPage} of {totalPages ? totalPages : "..."}
                    </span>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerHistory;
