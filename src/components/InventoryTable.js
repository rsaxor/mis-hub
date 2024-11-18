import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryTable = () => {
    const [inventory, setInventory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const apiUrl = process.env.REACT_APP_API_INVENTORY;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;

    useEffect(() => {
        const fetchInventory = async () => {
            const allInventory = [];
            for (let i = 1; i <= 1; i++) {
                try {
                    const config = {
                        method: 'get',
                        url: `${apiUrl}?CatId=0&SubCatId=0&BrandId=-1`,
                        headers: {
                            'Content-Type': 'application/json', 
                            [apiKey]: apiValue
                        },
                        maxBodyLength: Infinity
                    };

                    const response = await axios.request(config);

                    const validInventory = response.data.filter(
                        (inventory) => inventory.ItemName && inventory.ItemName.trim() !== ""
                    );

                    allInventory.push(...validInventory);

                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error("Error fetching inventory data:", error);
                }
            }
            setInventory(allInventory);
        };

        fetchInventory();
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(inventory.length / itemsPerPage);

    // Get current page's items
    const currentItems = inventory.slice(
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
                        <th align="left" scope="col">ID</th>
                        <th align="left" scope="col">Item Name</th>
                        <th align="left" scope="col">Category Name</th>
                        <th align="left" scope="col">Cost Price</th>
                        <th align="left" scope="col">Package qty</th>
                        <th align="left" scope="col">Price per qty</th>
                        <th align="left" scope="col">StockIn</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? currentItems.map((inventory, index) => (
                        <tr key={index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{inventory.ID}</td>
                            <td>{inventory.ItemName}</td>
                            <td>{inventory.CategoryName}</td>
                            <td>{inventory.Cost}</td>
                            <td>{inventory.PackageQty}</td>
                            <td>{inventory.PerQty}</td>
                            <td>{inventory.StockIn}</td>
                        </tr>
                    )): (
                        <tr>
                            <td colSpan={9} align="center">Loading . . .</td>
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

export default InventoryTable;
