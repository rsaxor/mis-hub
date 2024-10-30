import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerTable = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const apiUrl = process.env.REACT_APP_API_CUSTOMER;

    useEffect(() => {
        const fetchCustomers = async () => {
            const allCustomers = [];

            for (let i = 1; i <= 10; i++) { // 836
                try {
                    const response = await axios.get(
                        `${apiUrl}/1/1/1/null/${i}/50/1/false`,
                        //
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }
                    );

                    const validCustomers = response.data.filter(
                        (customer) => customer.Email && customer.Email.trim() !== ""
                    );

                    allCustomers.push(...validCustomers);

                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error("Error fetching customer data:", error);
                }
            }
            setCustomers(allCustomers);
        };

        fetchCustomers();
    }, []);

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

    return (
        <div>
            <div className="pagination mb-3 justify-content-end">
                <button className="btn btn-primary btn-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mx-3 inline-block">Page {currentPage} of {totalPages ? totalPages : '...'}</span>
                <button className="btn btn-primary btn-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th align="left" scope="col">#</th>
                        <th align="left" scope="col">Customer Name</th>
                        <th align="left" scope="col">Customer ID</th>
                        <th align="left" scope="col">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? currentItems.map((customer, index) => (
                        <tr key={index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{customer.CustomerName}</td>
                            <td>{customer.CustomerID}</td>
                            <td>{customer.Email}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} align="center">Loading . . .</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="pagination justify-content-end">
                <button className="btn btn-primary btn-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mx-3 inline-block">Page {currentPage} of {totalPages ? totalPages : '...'}</span>
                <button className="btn btn-primary btn-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CustomerTable;
