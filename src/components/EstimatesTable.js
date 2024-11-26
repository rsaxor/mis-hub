import React, { useEffect, useState } from "react";
import axios from "axios";

const EstimatesTable = () => {
    const [estimates, setEstimates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const apiUrl = process.env.REACT_APP_API_ESTIMATE;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;

    useEffect(() => {
        const fetchEstimates = async () => {
            const allEstimates = [];
            for (let i = 1; i <= 5; i++) {
                try {
                    const config = {
                        method: 'get',
                        url: `${apiUrl}/1/1/null/${i}/50/All/All/All/1/null/null/null`,
                        headers: {
                            'Content-Type': 'application/json', 
                            [apiKey]: apiValue
                        },
                        maxBodyLength: Infinity
                    };

                    const response = await axios.request(config);

                    const validEstimates = response.data.filter(
                        (estimates) => estimates.EstimateName && estimates.EstimateName.trim() !== ""
                    );

                    allEstimates.push(...validEstimates);

                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error("Error fetching estimates data:", error);
                }
            }
            setEstimates(allEstimates);
        };

        fetchEstimates();
    }, [apiUrl, apiKey, apiValue]);

    // Calculate total pages
    const totalPages = Math.ceil(estimates.length / itemsPerPage);

    // Get current page's items
    const currentItems = estimates.slice(
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
                        <th align="left" scope="col">#</th>
                        <th align="left" scope="col">Estimate Name</th>
                        <th align="left" scope="col">Account Manager</th>
                        <th align="left" scope="col">Customer Name</th>
                        <th align="left" scope="col">Customer Email</th>
                        <th align="left" scope="col">Subtotal</th>
                        <th align="left" scope="col">Estimate total</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? currentItems.map((estimate, index) => (
                        <tr key={index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{estimate.EstimateName}</td>
                            <td>{estimate.AccountManager}</td>
                            <td>{estimate.CustomerName}</td>
                            <td>{estimate.Email}</td>
                            <td>{estimate.SubTotal}</td>
                            <td>{estimate.EstTotal}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={7} align="center">Loading . . .</td>
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

export default EstimatesTable;
