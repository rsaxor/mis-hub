import { FormatDate } from "../../utils/formatDate"

const SingleJobCard = ({ result, customerContact, customerData, spectrumRep }) => {
    return (
        <div className="col-12">
            <h2><b>Job: {result.JobCode}</b></h2>
            <div className="row">
                <div className="col-12 col-sm-8 col-lg-9">
                    <div className="row">
                        <div className="col-6">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="text-uppercase"><b>Customer Data</b></h5>
                                    <hr></hr>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p className=""><b>Name</b></p>
                                        </div>
                                        <div className="col-md-8">
                                            <p className="mb-2">{customerContact?.FullName || "---"}</p>
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
                        <div className="col-6">
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
                        <div className="col-12">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="text-uppercase"><b>Project</b></h5>
                                    <hr></hr>
                                    <p className="mb-2">Project Name: {result.EstimateName}</p>
                                    <p className="mb-2">Subtotal: AED {result.SubTotal}</p>
                                </div>
                                <div className="card-body">
                                    <h5 className="text-uppercase"><b>Project Items</b></h5>
                                    <hr></hr>
                                    <p className="mb-2">Total Item/s: {result.EstimateItem.length}</p>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '30%' }}>Item</th>
                                                <th style={{ width: '45%' }}>JO</th>
                                                <th style={{ width: '10%' }}>Qty</th>
                                                <th style={{ width: '15%' }}>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.EstimateItem.length > 0 ? (
                                                result.EstimateItem.map((item, index) => (
                                                    <tr key={`${item.id}-${index}`}>
                                                        <td>
                                                            <p className="mb-1"><b>{item.ItemName || '---'}</b></p>
                                                            <p className="mb-0">{item.Description || 'No description'}</p>
                                                        </td>
                                                        <td>
                                                            <p style={{ whiteSpace: 'pre-wrap' }} className="mb-0">{item.InvoiceDesc || '---'}</p>
                                                        </td>
                                                        <td>{item.EstimateItemPart[0]?.ItemQty1 || 0}</td>
                                                        <td>AED {item.SubTotal || '0.00'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">No items found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-12 col-sm-4 col-lg-3">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="text-uppercase"><b>Internal</b></h5>
                            <hr></hr>
                            <p className="mb-2">Estimate code: {result?.EstimateCode || "---"}</p>
                            <p className="mb-2">Estimate Date: <FormatDate date={result?.EstimateDate} /></p>
                            <p className="mb-2">Revised Date: <FormatDate date={result?.EstimateRevisedDate} /></p>
                            <p className="mb-2">Job Progress Date: <FormatDate date={result?.JobProgrDate} /></p>
                            <p className="mb-2">Status: {result?.ExportStatusID || "---"}</p>
                            <p className="mb-2">Sales Rep: {spectrumRep?.FullName || "---"}</p>
                            <p className="mb-2">PO: {result?.OrderReff || "---"}</p>
                            <p className="mb-2">Repeat Job: {result?.PreviousJobs || "---"}</p>
                            <p className="mb-2">Ship Date: <FormatDate date={result?.dtShipDate} /></p>
                            <p className="mb-2">Delivery Date: <FormatDate date={result?.DeliveryDate} /></p>
                            <p className="mb-2">Invoice Date: <FormatDate date={result?.InvoiceDate} /></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleJobCard;