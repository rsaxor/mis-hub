import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Search from "./ui/Search";

const JobsTable = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = parseInt(searchParams.get("page"), 10) || 1;
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 25;
    const apiUrl = process.env.REACT_APP_API_JOBS;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;
    const keysToDisplay = ["JobCode", "EstCode", "EstName", "CustomerName", "ContactName", "CompletionDate", "OrderReff", "SalesRep", "SubTotal", "ExportStatus"];

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            if(searchParams.get("page") === null) {
                setCurrentPage(1);
            }
            try {
                const config = {
                    method: 'get',
                    url: `${apiUrl}/1/1/false/JobCode/null/${currentPage}/${itemsPerPage}/1/All/null/All/false/null/false/null/null/null`,
                    headers: {
                        'Content-Type': 'application/json', 
                        [apiKey]: apiValue
                    },
                    maxBodyLength: Infinity
                };

                const response = await axios.request(config);

                const validJobs = response.data.filter(
                    // (jobs) => jobs.EstCode && jobs.EstCode.trim() !== ""
                    (jobs) => jobs
                );

                const totalCount = validJobs[0]?.TotalCount || 0;
                setTotalPages(Math.ceil(totalCount / itemsPerPage));

                setJobs(validJobs);

            } catch (error) {
                console.error("Error fetching jobs data:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false); 
                }, 100);
            }
        };

        fetchJobs();
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
                    ) : jobs.length > 0 ? (
                        jobs.map((customer, index) => (
                            <tr key={index}>
                                {keysToDisplay.map((key, keyIndex) => (
                                    <td key={keyIndex}>{customer[key] ? customer[key] : `---`}</td>
                                ))}
                                <td><a className="btn btn-primary btn-sm" href={`/#`}>View</a></td>
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

export default JobsTable;
