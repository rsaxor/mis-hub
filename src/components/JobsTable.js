import React, { useEffect, useState } from "react";
import axios from "axios";

const JobsTable = () => {
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const apiUrl = process.env.REACT_APP_API_JOBS;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;

    useEffect(() => {
        const fetchJobs = async () => {
            const allJobs = [];
            for (let i = 1; i <= 5; i++) {
                try {
                    const config = {
                        method: 'get',
                        url: `${apiUrl}/1/1/false/JobCode/null/${i}/50/1/null/All/false/null/false/null/null/null`,
                        headers: {
                            'Content-Type': 'application/json', 
                            [apiKey]: apiValue
                        },
                        maxBodyLength: Infinity
                    };

                    const response = await axios.request(config);

                    const validJobs = response.data.filter(
                        (jobs) => jobs.EstCode && jobs.EstCode.trim() !== ""
                    );

                    allJobs.push(...validJobs);

                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error("Error fetching jobs data:", error);
                }
            }
            setJobs(allJobs);
        };

        fetchJobs();
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(jobs.length / itemsPerPage);

    // Get current page's items
    const currentItems = jobs.slice(
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
                        <th align="left" scope="col">Estimate ID</th>
                        <th align="left" scope="col">Estimate Code</th>
                        <th align="left" scope="col">Job Code</th>
                        <th align="left" scope="col">Job Name</th>
                        <th align="left" scope="col">Manager</th>
                        <th align="left" scope="col">Sales Rep</th>
                        <th align="left" scope="col">Customer</th>
                        <th align="left" scope="col">Estimate total</th>
                        <th align="left" scope="col">ExportStatus</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? currentItems.map((jobs, index) => (
                        <tr key={index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{jobs.EstID}</td>
                            <td>{jobs.EstCode}</td>
                            <td>{jobs.JobCode}</td>
                            <td>{jobs.EstName}</td>
                            <td>{jobs.Manager}</td>
                            <td>{jobs.SalesRep}</td>
                            <td>{jobs.ContactName}</td>
                            <td>{jobs.EstTotal}</td>
                            <td>{jobs.EstStatus}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={10} align="center">Loading . . .</td>
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

export default JobsTable;
