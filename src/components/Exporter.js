// import React, { useEffect, useState } from "react";

const Exporter = () => {
    const handleExport = (event) => {
        event.preventDefault();
        
    };
    return (
        <div className="container-fluid px-0">
            <div className="row">
                <div className="col-12">
                    <form onSubmit={handleExport} className="">
                        <div className="row">
                            <div className="col-6 col-md-auto">
                                <div className="form-group">
                                    <label htmlFor="select-api">Select data to export</label>
                                    <select id="select-api" className="form-control">
                                        <option value={`customers`}>Customers</option>
                                    </select>
                                </div>

                            </div>
                            <div className="col-6 col-md-auto">
                                <div className="form-group">
                                    <label htmlFor="select-format">Select file format</label>
                                    <select id="select-format" className="form-control">
                                        <option value={`csv`}>csv</option>
                                        <option value={`xls`}>excel</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            <button className="btn btn-primary" type="submit">
                                Export
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Exporter;