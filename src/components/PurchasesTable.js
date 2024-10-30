import React, { useEffect, useState } from "react";
import axios from "axios";

const PurchasesTable = () => {
    const [purchases, setPurchases] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const apiUrl = process.env.REACT_APP_API_PURCHASE;

    useEffect(() => {
        const fetchPurchases = async () => {
            const allPurchases = [];
            for (let i = 1; i <= 3; i++) {
                try {
                    const response = await axios.get( // this endpoint is only a 1 pager
                        `${apiUrl}/0/1/null/${i}/50/PO/1/null/null/null`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }
                    );

                    const validPurchases = response.data.filter(
                        (purchases) => purchases.SupplierName && purchases.SupplierName.trim() !== ""
                    );

                    allPurchases.push(...validPurchases);

                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error("Error fetching purchases data:", error);
                }
            }
            setPurchases(allPurchases);
        };

        fetchPurchases();
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(purchases.length / itemsPerPage);

    // Get current page's items
    const currentItems = purchases.slice(
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
                        <th align="left" scope="col">PO ID</th>
                        <th align="left" scope="col">PO Code</th>
                        <th align="left" scope="col">Supplier Name</th>
                        <th align="left" scope="col">Email</th>
                        <th align="left" scope="col">Customer Name</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? currentItems.map((purchases, index) => (
                        <tr key={index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{purchases.POID}</td>
                            <td>{purchases.POCode}</td>
                            <td>{purchases.SupplierName}</td>
                            <td>{purchases.Email}</td>
                            <td>{purchases.CustomerName}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} align="center">Loading . . .</td>
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

export default PurchasesTable;
