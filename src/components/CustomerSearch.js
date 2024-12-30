import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

import Search from "./ui/Search";
import BackButton from "./ui/BackButton";

const CustomerSearch = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 25;
    const apiUrl = process.env.REACT_APP_API_CUSTOMER;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;
    const { searchKeyword } = useParams();

    useEffect(() => {
        const fetchCustomers = async () => {

            setLoading(true);
            const allCustomers = [];

            try {
                const config = {
                    method: 'get',
                    url: `${apiUrl}/1/1/1/${searchKeyword}/${currentPage}/${itemsPerPage}/1/false`,
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

                const totalCount = validCustomers[0]?.TotalCount || 0;
                setTotalPages(Math.ceil(totalCount / itemsPerPage));

                allCustomers.push(...validCustomers);

                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error("Error fetching customer data:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false); 
                }, 100);
            }

            setCustomers(allCustomers);
        };

        fetchCustomers();

    }, [searchKeyword, apiUrl, apiKey, apiValue, currentPage]);


    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNext = () => {
        if (!totalPages || currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
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
                                className="btn btn-secondary btn-sm mx-3"
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={handleNext}
                                disabled={totalPages && currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid px-0">
                <div className="row">
                    {loading ? (
                        <div className="col-12">
                            <p>Loading . . .</p>
                        </div>
                    ) : customers.length > 0 ? (
                            customers.map((customer, index) => (
                            <div className="col-12 col-sm-6 col-lg-4" key={index}>
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h3 className="card-title"><b>{customer.AccountNumber}</b></h3>
                                        <p className="">{customer.CustomerName}</p>
                                        <a className="btn btn-primary d-inline-block" href={`/mis-customer-view/${customer.CustomerID}`}>View</a>
                                        <a className="btn btn-primary d-inline-block mx-2" href={`/mis-customer-history/${customer.CustomerID}`}>History</a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <p>No data available.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="pagination justify-content-between">
                <div>
                    <BackButton/>
                </div>
                <div>
                    <button
                        className="btn btn-secondary btn-sm mx-3"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleNext}
                        disabled={totalPages && currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerSearch;
