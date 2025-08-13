import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Search from "./ui/Search";

const InvoiceTable = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = parseInt(searchParams.get("page"), 10) || 1;
    const [invoices, setInvoice] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 25;
    const apiUrl = process.env.REACT_APP_API_INVOICE;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;
    const keysToDisplay = ["EstCode", "UdfJobCode", "TransactionDate", "CustomerName", "ContactName", "OrderReff", "EstName", "SubTotal", "VAT", "Total", "BalanceB4Carriage", "SalesRep", "InvoiceStatus" ];

    useEffect(() => {
        const fetchInvoice = async () => {
            setLoading(true);
            if(searchParams.get("page") === null) {
                setCurrentPage(1);
            }
            try {
                const config = {
                    method: 'get',
                    url: `${apiUrl}/0/1/null/null/null/${currentPage}/Invoice/All/1/undefined/undefined/TransactionDate/0`,
                    headers: {
                        'Content-Type': 'application/json', 
                        [apiKey]: apiValue
                    },
                    maxBodyLength: Infinity
                };

                const response = await axios.request(config);

                const validInvoice = response.data.filter(
                    // (invoices) => invoices.EstName && invoices.EstName.trim() !== ""
                    (invoices) => invoices
                );

                const totalCount = validInvoice[0]?.TotalCount || 0;
                setTotalPages(Math.ceil(totalCount / itemsPerPage));

                setInvoice(validInvoice);
                
            } catch (error) {
                console.error("Error fetching invoice data:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false); 
                }, 100);
            }
        };

        fetchInvoice();
    }, [currentPage, apiUrl, apiKey, apiValue, searchParams]);

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

    return (
        <div>
            <div className="container-fluid px-0">
                <div className="row justify-content-between">
                    <div className="col-3">
                        <Search />
                    </div>
                    <div className="col-3">
                        <div className="pagination justify-content-end mb-3">
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
                    ) : invoices.length > 0 ? (
                        invoices.map((customer, index) => (
                            <tr key={index}>
                                {keysToDisplay.map((key, keyIndex) => (
                                    <td key={keyIndex}>{customer[key] ? customer[key] : `---`}</td>
                                ))}
                                <td><a className="btn btn-primary btn-sm" href={`/view/mis-invoice/${customer.EstID}`}>View</a></td>
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

export default InvoiceTable;
