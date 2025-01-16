import React, { useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import dataExportHandler from "../utils/dataExportHandler"


const Exporter = () => {
    const [selectedApi, setSelectedApi] = useState("customers");
    const [selectedFormat, setSelectedFormat] = useState("csv");
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (event) => {
        event.preventDefault();
        setIsExporting(true);
        
        try {

            const { validData, invalidData  } = await dataExportHandler(selectedApi);
            const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12); // Format: YYYYMMDDHHMM

            if (validData.length > 0) {
                if (selectedFormat === "csv") {
                    exportToCSV(validData, `exported_valid_${selectedApi}_${timestamp}.csv`);
                } else if (selectedFormat === "xls") {
                    exportToExcel(validData, `exported_valid_${selectedApi}_${timestamp}.xlsx`);
                }
            }

            if (invalidData.length > 0) {
                alert(
                    `There are ${invalidData.length} rows with invalid data. Exporting separately.`
                );
                if (selectedFormat === "csv") {
                    exportToCSV(invalidData, `exported_invalid_${selectedApi}_${timestamp}.csv`);
                } else if (selectedFormat === "xls") {
                    exportToExcel(invalidData, `exported_invalid_${selectedApi}_${timestamp}.xlsx`);
                }
            }

            if (validData.length === 0 && invalidData.length === 0) {
                alert("No data available for export.");
            }

        } catch (error) {
            console.error("Error exporting data:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const exportToCSV = (data, filename) => {
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(","), // Header row
            ...data.map(row =>
                headers.map(header => JSON.stringify(row[header] || "")).join(",")
            ),
        ];

        const csvBlob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        saveAs(csvBlob, filename);
    };

    const exportToExcel = (data, filename) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, filename);
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
                                    <select
                                        id="select-api"
                                        className="form-control"
                                        value={selectedApi}
                                        onChange={(e) => setSelectedApi(e.target.value)}
                                    >
                                        <option value="customers">Customers</option>
                                        <option value="estimates">Estimates</option>
                                        <option value="invoices">Invoices</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-6 col-md-auto">
                                <div className="form-group">
                                    <label htmlFor="select-format">Select file format</label>
                                    <select
                                        id="select-format"
                                        className="form-control"
                                        value={selectedFormat}
                                        onChange={(e) => setSelectedFormat(e.target.value)}
                                    >
                                        <option value="csv">CSV</option>
                                        <option value="xls">Excel</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            <div className={isExporting ? `d-inline-block px-3 py-3 mb-2 bg-warning text-dark` : `d-none`}>
                                <b>Warning:</b> Do not close the window while exporting... It might take a while.
                                <span className="d-block"><b>Note:</b> Please allow multiple file download when prompted by the browser.</span>
                            </div>
                            <div className="d-block">
                                <button className="btn btn-primary" type="submit" disabled={isExporting}>
                                    {isExporting ? "Exporting..." : "Export"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Exporter;