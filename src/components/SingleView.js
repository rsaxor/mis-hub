import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import BackButton from "./ui/BackButton";
import SingleEstimateCard from "./ui/SingleEstimateCard" ;
import SingleJobCard from "./ui/SingleJobCard" ;
import { singleViewApis } from "../utils/singleViewApis"
import { getCustomerContact, getCustomer, getUserById } from "../utils/getApiData"

const apiKey = process.env.REACT_APP_API_KEY;
const apiValue = process.env.REACT_APP_API_VALUE;

const ResultCard = ({ result, queryPage }) => {
    if (!result) {
        return <div className="mb-5">No data available.</div>;
    }

    switch (queryPage) {
        case "mis-estimates":
            return (
                <SingleEstimateCard
                    result={result}
                    customerContact={result.customerContact}
                    customerData={result.customerData}
                    spectrumRep={result.spectrumRep}
                />
            );

        case "mis-jobs":
            return (
                <SingleJobCard
                    result={result}
                    customerContact={result.customerContact}
                    customerData={result.customerData}
                    spectrumRep={result.spectrumRep}
                />
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

const SingleView = () => {
    const [resultProps, setResultProps] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { queryPage, key } = useParams();

    useEffect(() => {
        const fetchResult = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const { apiQuery } = singleViewApis(queryPage, key);

                if (!apiQuery) {
                    throw new Error("Invalid queryPage or missing API details.");
                }

                const config = {
                    method: 'get',
                    url: apiQuery,
                    headers: {
                        'Content-Type': 'application/json',
                        [apiKey]: apiValue,
                    },
                    maxBodyLength: Infinity,
                };

                const response = await axios.request(config);
				const result = response.data;

                const pageSameApis = ['mis-estimates', 'mis-jobs'];

                if (pageSameApis.includes(queryPage) && result) {
                    const [customerContact, customerData, spectrumRep] = await Promise.all([
                        getCustomerContact(result.CustomerID, result.ContactID),
                        getCustomer(result.CustomerID),
						getUserById(result.SalesPersonId),
                    ]);
                    setResultProps({ ...result, customerContact, customerData, spectrumRep });
                } else {
                    setResultProps(result || null);
                }
            } catch (err) {
                setError("Error fetching data.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResult();
    }, [queryPage, key]);

    if (isLoading) {
        return <div className="mb-5">Loading...</div>;
    }

    if (error) {
        return <div className="mb-5">Error: {error}</div>;
    }

    if (!resultProps) {
        return <div className="mb-5">No data available.</div>;
    }

    return (
        <div>
            <div className="container-fluid px-0">
                <div className="row justify-content-between">
                    <div className="col-12">
                        <div className="row">
                            <ResultCard result={resultProps} queryPage={queryPage} />
                        </div>
                    </div>
                    <div className="col-12">
                        <div>
                            <BackButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SingleView;
