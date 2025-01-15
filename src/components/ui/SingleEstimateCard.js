const SingleEstimateCard = ({result, customerContact, customerData, spectrumRep}) => {
    return (
        <div className="col-12">
            <h2><b>Estimate: {result.EstimateCode}</b></h2>
            <div className="row">
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="text-uppercase"><b>Customer Data</b></h5>
                            <hr></hr>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className=""><b>Name</b></p>
                                </div>
                                <div className="col-md-8">
                                    <p className="mb-2">{customerContact.FullName}</p>
                                </div>
                                <div className="col-md-4">
                                    <p className=""><b>Company</b></p>
                                </div>
                                <div className="col-md-8">
                                    <p className="mb-2">{customerData[0].CustomerName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="text-uppercase"><b>Project</b></h5>
                            <hr></hr>
                            <p className="mb-2">{result.EstimateName}</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="text-uppercase"><b>Address</b></h5>
                            <hr></hr>
                            <p className="mb-2">{customerData[0].Address11}</p>
                            <p className="mb-2">{customerData[0].Address12}</p>
                            <p className="mb-2">{customerData[0].PostCode}</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="text-uppercase"><b>Internal</b></h5>
                            <hr></hr>
                            <p className="mb-2">Status: {result.ExportStatusID}</p>
                            <p className="mb-2">Ship: {result.dtShipDate}</p>
                            <p className="mb-2">Sales Rep: {result.FullName}</p>
                            <p className="mb-2">PO: {result.OrderReff}</p>
                            <p className="mb-2">Repeat Job: {result.PreviousJobs}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleEstimateCard;