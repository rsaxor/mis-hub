import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

import Search from "./ui/Search";

const CustomerSearch = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const apiUrl = process.env.REACT_APP_API_CUSTOMER;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;
    const { searchKeyword } = useParams();

    useEffect(() => {
        const fetchCustomers = async () => {
            const allCustomers = [];

            try {
                const config = {
                    method: 'get',
                    url: `${apiUrl}/1/1/1/${searchKeyword}/1/25/1/false`,
                    headers: {
                        'Content-Type': 'application/json', 
                        [apiKey]: apiValue
                    },
                    maxBodyLength: Infinity
                };

                const response = await axios.request(config);

                const validCustomers = response.data.filter(
                    (customer) => customer
                );

                allCustomers.push(...validCustomers);

                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }

            setCustomers(allCustomers);
        };

        fetchCustomers();

    }, [searchKeyword, apiUrl, apiKey, apiValue]);


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
    // const allKeys = customers.length
    //     ? Object.keys(customers[0])
    //     : [];

    return (
        <div>
            <div className="container-fluid px-0">
                <div className="row justify-content-between">
                    <div className="col-3">
                        <Search />
                    </div>
                    <div className="col-3">
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
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    {currentItems.map((customer, index) => (
                        <div className="col-6" key={index}>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h3 className="card-title"><b>{customer.AccountNumber}</b></h3>
                                    <p className="">{customer.CustomerName}</p>
                                    <a className="btn btn-primary d-inline-block" href={`/mis-customer-view/${customer.CustomerID}`}>View</a>
                                </div>
                            </div>
                        </div>
                        ))
                    }
                </div>
            </div>
            {/* <table className="table">
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
            </table> */}
            <div className="pagination justify-content-end">
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
    );
};

export default CustomerSearch;
