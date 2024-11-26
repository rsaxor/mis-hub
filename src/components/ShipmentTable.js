import React, { useEffect, useState } from "react";
import axios from "axios";

const ShipmentTable = () => {
    const [shipments, setShipment] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const apiUrl = process.env.REACT_APP_API_SHIPMENTS;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;

    useEffect(() => {
        const fetchShipment = async () => {
            const allShipment = [];
            for (let i = 1; i <= 3; i++) {
                try {
                    const config = {
                        method: 'get',
                        url: `${apiUrl}/0/1/null/${i}/50/1/null/null/null`,
                        headers: {
                            'Content-Type': 'application/json', 
                            [apiKey]: apiValue
                        },
                        maxBodyLength: Infinity
                    };

                    const response = await axios.request(config);

                    const validShipment = response.data.filter(
                        (shipments) => shipments.Address && shipments.Address.trim() !== ""
                    );

                    allShipment.push(...validShipment);

                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error("Error fetching shipments data:", error);
                }
            }
            setShipment(allShipment);
        };

        fetchShipment();
    }, [apiUrl, apiKey, apiValue]);

    // Calculate total pages
    const totalPages = Math.ceil(shipments.length / itemsPerPage);

    // Get current page's items
    const currentItems = shipments.slice(
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
                        <th align="left" scope="col">Delivery ID</th>
                        <th align="left" scope="col">Delivery Code</th>
                        <th align="left" scope="col">Delivery Date</th>
                        <th align="left" scope="col">Address</th>
                        <th align="left" scope="col">Contact Name</th>
                        <th align="left" scope="col">Customer Name</th> 
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? currentItems.map((shipments, index) => (
                        <tr key={index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{shipments.DelID}</td>
                            <td>{shipments.DelCode}</td>
                            <td>{shipments.DelDate}</td>
                            <td>{shipments.Address}</td>
                            <td>{shipments.ContactName}</td>
                            <td>{shipments.CustomerName}</td>
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

export default ShipmentTable;
