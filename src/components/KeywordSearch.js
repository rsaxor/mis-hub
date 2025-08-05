import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from 'react-router-dom';
import Search from "./ui/Search";
import BackButton from "./ui/BackButton";
import { getPageTitleText } from "./ui/CurrentPage";

const getApiDetails = (queryPage, searchKeyword, currentPage, itemsPerPage) => {
    const baseUrls = {
        "mis-customer": process.env.REACT_APP_API_CUSTOMER,
        "mis-estimates": process.env.REACT_APP_API_ESTIMATE,
        "mis-jobs": process.env.REACT_APP_API_JOBS,
        "mis-purchases": process.env.REACT_APP_API_PURCHASE,
        "mis-shipment": process.env.REACT_APP_API_SHIPMENTS,
        "mis-invoice": process.env.REACT_APP_API_INVOICE
    };

    const apiUrl = baseUrls[queryPage] || "";

    const apiQueries = {
        "mis-customer": `${apiUrl}/1/1/1/${searchKeyword}/${currentPage}/${itemsPerPage}/1/false`,
        "mis-estimates": `${apiUrl}/1/1/${searchKeyword}/${currentPage}/${itemsPerPage}/All/All/All/All/1/null/null/null`,
        "mis-jobs": `${apiUrl}/1/1/false/JobCode/null/${currentPage}/${itemsPerPage}/1/All/${searchKeyword}/All/false/null/false/undefined/undefined/JobProgressDate`,
        "mis-purchases": `${apiUrl}/0/1/${searchKeyword}/${currentPage}/${itemsPerPage}/PO/1/null/null/null`,
        "mis-shipment": `${apiUrl}/0/1/${searchKeyword}/${currentPage}/${itemsPerPage}/1/null/null/null`,
        "mis-invoice": `${apiUrl}/0/1/${searchKeyword}/null/null/${currentPage}/Invoice/All/1/undefined/undefined/TransactionDate`
    };

    return {
        apiUrl,
        apiQuery: apiQueries[queryPage] || "",
    };
};

const SearchResultCard = ({ searchResult, queryPage }) => {
    switch (queryPage) {
        case "mis-customer":
            return (
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3 className="card-title"><b>{searchResult.AccountNumber}</b></h3>
                            <p>{searchResult.CustomerName}</p>
                            <a
                                className="btn btn-primary d-inline-block"
                                href={`/mis-customer-view/${searchResult.CustomerID}`}
                            >
                                View
                            </a>
                            <a
                                className="btn btn-primary d-inline-block mx-2"
                                href={`/mis-customer-history/${searchResult.CustomerID}`}
                            >
                                History
                            </a>
                        </div>
                    </div>
                </div>
            );

        case "mis-estimates":
            return (
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3 className="card-title mb-0"><b>{searchResult.EstimateCode}</b></h3>
                            <p className="mb-2"><b>{searchResult.EstimateName}</b></p>
                            <p>{searchResult.CustomerName}</p>
                            <a
                                className="btn btn-primary d-inline-block"
                                href={`/view/mis-estimates/${searchResult.EstID}`}
                            >
                                View
                            </a>
                        </div>
                    </div>
                </div>
            );

        case "mis-jobs":
            return (
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3 className="card-title mb-0"><b>{searchResult.JobCode}</b></h3>
                            <p className="mb-0"><b>{searchResult.EstName}</b></p>
                            <p className="mb-2">{searchResult.CustomerName}</p>
                            <p className="card-title">[Reference estimate code: <b>{searchResult.EstCode}</b>]</p>
                            <a
                                className="btn btn-primary d-inline-block"
                                href={`/view/mis-jobs/${searchResult.EstID}`}
                            >
                                View
                            </a>
                        </div>
                    </div>
                </div>
            );
        
        case "mis-purchases":
            return (
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3 className="card-title mb-0"><b>{searchResult.POID}</b></h3>
                            <p className="mb-0">Supplier: <b>{searchResult.SupplierName}</b></p>
                            <p className="mb-0">Customer name: <b>{searchResult.CustomerName}</b></p>
                            <p className="mb-0">Job reference: <b>{searchResult.ReffNo}</b></p>
                            <p className="mb-0">Total Amount: <b>{searchResult.POTotal}</b></p>
                            <p className="mb-0">Status: <b>{searchResult.PoStatus}</b></p>
                            <p className="mb-0">Date: <b>{searchResult.PODate}</b></p>
                            <p className="mb-0">Due Date: <b>{searchResult.PORequiredDate}</b></p>
                        </div>
                    </div>
                </div>
            );

            case "mis-shipment":
            return (
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3 className="card-title mb-0"><b>{searchResult.DelCode}</b></h3>
                            <p className="mb-0">Job Code: <b>{searchResult.JobCode}</b></p>
                            <p className="mb-0">Customer name: <b>{searchResult.CustomerName}</b></p>
                            <p className="mb-0">Job title: <b>{searchResult.JobTitle}</b></p>
                            <p className="mb-0">Qty: <b>{searchResult.QTYOrdered}</b></p>
                            <p className="mb-0">Shipping: <b>{searchResult.ShipDate}</b></p>
                            <p className="mb-0">Shipping Date: <b>{searchResult.ActualShipDate}</b></p>
                        </div>
                    </div>
                </div>
            );

            case "mis-invoice":
            return (
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3 className="card-title mb-0"><b>{searchResult.EstCode}</b></h3>
                            <h5 className="mb-0"><b>{searchResult.EstName}</b></h5>
                            <p className="mb-0">Job Code: <b>{searchResult.UdfJobCode}</b></p>
                            <p className="mb-0">Transaction Date: <b>{searchResult.TransactionDate}</b></p>
                            <p className="mb-0">Customer name: <b>{searchResult.CustomerName}</b></p>
                            <p className="mb-0">Total: <b>{searchResult.Total}</b></p>
                            <p className="mb-0">Status: <b>{searchResult.InvoiceStatus}</b></p>
                        </div>
                    </div>
                </div>
            );

        default:
            return (
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <p>No specific format available for queryPage: {queryPage}</p>
                        </div>
                    </div>
                </div>
            );
    }
};

const KeywordSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = parseInt(searchParams.get("page"), 10) || 1;
    const [searchResults, setSearchResult] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 25;
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiValue = process.env.REACT_APP_API_VALUE;
    const { searchKeyword, queryPage } = useParams();

    const handleSearchSubmit = () => {
        setCurrentPage(1);
    };
    
    useEffect(() => {
        const fetchSearchResult = async () => {

            setLoading(true);

            const { apiQuery } = getApiDetails(queryPage, searchKeyword, currentPage, itemsPerPage);

            if (!apiQuery) {
                console.error("Invalid queryPage or missing API details.");
                setLoading(false);
                return;
            }
        
            try {
                const config = {
                    method: 'get',
                    url: apiQuery,
                    headers: {
                        'Content-Type': 'application/json', 
                        [apiKey]: apiValue
                    },
                    maxBodyLength: Infinity
                };

                const response = await axios.request(config);

                const validSearchResult = response.data.filter(
                    (searchResult) => searchResult
                );

                const totalCount = validSearchResult[0]?.TotalCount || 0;
                setTotalPages(Math.ceil(totalCount / itemsPerPage));

                setSearchResult(validSearchResult);

            } catch (error) {
                console.error("Error fetching search result data:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false); 
                }, 100);
            }
        };

        fetchSearchResult();

    }, [apiKey, apiValue, queryPage, searchKeyword, currentPage]);


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

    // console.log(searchResults.length);

    return (
        <div>
            <div className="container-fluid px-0">
                <div className="row justify-content-between">
                    <div className="col-3">
                        <p>
                            Search for <b><i>"{searchKeyword}"</i></b> in: <b>{getPageTitleText(queryPage)}</b>
                        </p>
                        <Search onSearchSubmit={handleSearchSubmit} />
                    </div>
                    <div className="col-3">
                        <div className="pagination mb-3 justify-content-end">
                            <button
                                className="btn btn-secondary btn-sm mx-3"
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={handleNext}
                                disabled={(totalPages && currentPage === totalPages) || (searchResults.length === 0)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid px-0">
                <div className="row">
                    {loading ? (
                        <div className="col-12">
                            <p>Loading . . .</p>
                        </div>
                    ) : searchResults.length > 0 ? (
                            searchResults.map((searchResult, index) => (
                                <SearchResultCard
                                key={index}
                                searchResult={searchResult}
                                queryPage={queryPage}
                            />
                        ))
                    ) : (
                        <div className="col-12">
                            <p>No data available.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="pagination justify-content-between">
                <div>
                    <BackButton/>
                </div>
                <div>
                    <button
                        className="btn btn-secondary btn-sm mx-3"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleNext}
                        disabled={(totalPages && currentPage === totalPages) || (searchResults.length === 0)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KeywordSearch;
