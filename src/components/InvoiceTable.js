import React, { useEffect, useState } from "react";
import axios from "axios";

const InvoiceTable = () => {
    const [invoices, setInvoice] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const apiUrl = process.env.REACT_APP_API_INVOICE;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;

    useEffect(() => {
        const fetchInvoice = async () => {
            const allInvoice = [];
            for (let i = 1; i <= 5; i++) {
                try {
                    const config = {
                        method: 'get',
                        url: `${apiUrl}/0/1/null/null/null/${i}/Invoice/1/null/null/null`,
                        headers: {
                            'Content-Type': 'application/json', 
                            [apiKey]: apiValue
                        },
                        maxBodyLength: Infinity
                    };

                    const response = await axios.request(config);

                    const validInvoice = response.data.filter(
                        (invoices) => invoices.EstName && invoices.EstName.trim() !== ""
                    );

                    allInvoice.push(...validInvoice);

                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error("Error fetching invoices data:", error);
                }
            }
            setInvoice(allInvoice);
        };

        fetchInvoice();
    }, [apiUrl, apiKey, apiValue]);

    // Calculate total pages
    const totalPages = Math.ceil(invoices.length / itemsPerPage);

    // Get current page's items
    const currentItems = invoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <div className="pagination justify-content-end mb-3">
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
                        <th align="left" scope="col">Count</th>
                        <th align="left" scope="col">Estimate Name</th>
                        <th align="left" scope="col">Customer Name</th>
                        <th align="left" scope="col">Sales Person</th>
                        <th align="left" scope="col">Estimator</th>
                        <th align="left" scope="col">Account #</th>
                        <th align="left" scope="col">Balance</th>
                        <th align="left" scope="col">Invoice Status</th> 
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? currentItems.map((invoices, index) => (
                        <tr key={index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{invoices.EstName}</td>
                            <td>{invoices.CustomerName}</td>
                            <td>{invoices.SalesPerson}</td>
                            <td>{invoices.Estimator}</td>
                            <td>{invoices.AccountNumber}</td>
                            <td>{invoices.Balance}</td>
                            <td>{invoices.InvoiceStatus}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={8} align="center">Loading . . .</td>
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

export default InvoiceTable;
