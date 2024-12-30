import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Search from "./ui/Search";

const CustomerTable = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = parseInt(searchParams.get("page"), 10) || 1;
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 25;
    const apiUrl = process.env.REACT_APP_API_CUSTOMER;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;
    const keysToDisplay = ["Row", "AccountNumber", "CustomerName", "Email", "Tel1", "Contact", "Type" ];

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            console.log(currentPage);
            try {
                const config = {
                    method: 'get',
                    url: `${apiUrl}/1/1/1/null/${currentPage}/${itemsPerPage}/1/false`,
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

                setCustomers(validCustomers);
            } catch (error) {
                console.error("Error fetching customer data:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false); 
                }, 100);
            }
        };

        fetchCustomers();

    }, [currentPage, apiUrl, apiKey, apiValue]);

    const handlePrevious = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            setSearchParams({ page: newPage });
        }
    };

    const handleNext = () => {
        if (!totalPages || currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            setSearchParams({ page: newPage });
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
                                className="btn btn-secondary btn-sm"
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="mx-3 inline-block">
                                Page {currentPage} of {totalPages || "..."}
                            </span>
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
            <table className="table">
                <thead>
                    <tr>
                        {keysToDisplay.map((key, index) => (
                            <th key={index} align="left" scope="col">
                                {key}
                            </th>
                        ))}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={keysToDisplay.length + 1 || 1} align="center">
                                Loading . . .
                            </td>
                        </tr>
                    ) : customers.length > 0 ? (
                        customers.map((customer, index) => (
                            <tr key={index}>
                                {keysToDisplay.map((key, keyIndex) => (
                                    <td key={keyIndex}>{customer[key] ? customer[key] : `---`}</td>
                                ))}
                                <td><a className="btn btn-dark btn-sm" href={`/mis-customer-view/${customer.CustomerID}`}>View</a></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={keysToDisplay.length || 1} align="center">
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="pagination justify-content-end">
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mx-3 inline-block">
                    Page {currentPage} of {totalPages || "..."}
                </span>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleNext}
                    disabled={totalPages && currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CustomerTable;
