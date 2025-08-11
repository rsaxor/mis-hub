import React, { useState, useEffect, useCallback } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import dataExportHandler from "../utils/dataExportHandler";
import { getUserAll } from "../utils/getApiData";

// Sub-component for Notifications
const Notification = ({ message, type, onDismiss }) => {
    if (!message) return null;
    const alertType = type === 'error' ? 'alert-danger' : 'alert-info';
    return (
        <div className={`alert ${alertType} alert-dismissible fade show col-12 col-sm-4`} role="alert">
            <span>{message}</span>
            <button type="button" className="btn-close" aria-label="Close" onClick={onDismiss}></button>
        </div>
    );
};


// Sub-components for Form Sections
const ReportOptions = ({ formState, salesReps, handleInputChange }) => (
    <>
        <div className="col-6 col-md-auto">
            <label htmlFor="reportType">Report Type</label>
            <select name="reportType" id="reportType" className="form-control" value={formState.reportType} onChange={handleInputChange}>
                <option value="estimate_by_sales">Estimate by Sales Person</option>
                <option value="sales_by_person">Sales by Person (Invoice)</option>
                <option value="all_customer_contact">Customer Contact List</option>
            </select>
        </div>
        <div className="col-6 col-md-auto">
            <label htmlFor="salesRep">Sales Rep</label>
            <select name="salesRep" id="salesRep" className="form-control" value={formState.salesRep} onChange={handleInputChange} disabled={salesReps.length === 0}>
                {salesReps.length > 0 ? salesReps.map((rep) => (
                    <option key={rep.UID} value={rep.UID}>{rep.FullName}</option>
                )) : <option>Loading...</option>}
            </select>
        </div>
        {formState.reportType !== "all_customer_contact" && (
            <>
                <div className="col-6 col-md-auto">
                    <label htmlFor="dateFrom">Date From</label>
                    <input name="dateFrom" id="dateFrom" className="form-control" type="date" value={formState.dateFrom} onChange={handleInputChange} />
                </div>
                <div className="col-6 col-md-auto">
                    <label htmlFor="dateTo">Date To</label>
                    <input name="dateTo" id="dateTo" className="form-control" type="date" value={formState.dateTo} onChange={handleInputChange} />
                </div>
            </>
        )}
    </>
);

// --- Main Exporter Component ---
const Exporter = () => {
    const [formState, setFormState] = useState({
        api: "customers",
        format: "csv",
        separateInvalid: true,
        sort: "alphabetical",
        salesRep: "",
        reportType: "estimate_by_sales",
        isSample: true,
        dateFrom: "",
        dateTo: "",
    });

    const [salesReps, setSalesReps] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [notification, setNotification] = useState({ type: "", message: "" });
    const [progressCount, setProgressCount] = useState(0);

    useEffect(() => {
        if (formState.api === "report") {
            const fetchSalesReps = async () => {
                try {
                    const allUsers = await getUserAll();
                    if (allUsers && allUsers.length > 0) {
                        setSalesReps(allUsers);
                        setFormState(prev => {
                            if (!prev.salesRep && allUsers.length > 0) {
                                return { ...prev, salesRep: allUsers[0].UID };
                            }
                            return prev;
                        });
                    }
                } catch (error) {
                    console.error("Error fetching sales reps:", error);
                    setNotification({ type: 'error', message: 'Failed to fetch sales reps.' });
                }
            };
            fetchSalesReps();
        }
    }, [formState.api]);

    useEffect(() => {
        setFormState(prev => ({
            ...prev,
            sort: prev.api === "customers" ? prev.sort : "",
        }));
    }, [formState.api]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const finalValue = value === "true" ? true : value === "false" ? false : value;
        setFormState(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleProgressUpdate = useCallback((count) => {
        setProgressCount(count);
    }, []);

    const handleExport = async (event) => {
        event.preventDefault();
        setIsExporting(true);
        setNotification({ type: "", message: "" });
        setProgressCount(0);

        try {
            const { validData, invalidData } = await dataExportHandler(
                formState,
                handleProgressUpdate
            );

            if (validData.length === 0 && invalidData.length === 0) {
                setNotification({ type: 'info', message: 'No data available for the selected criteria.' });
                return;
            }

            const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
            const exporter = formState.format === 'csv' ? exportToCSV : exportToExcel;

            if (validData.length > 0) {
                const filename = `exported_valid_${formState.api}_${timestamp}.${formState.format}`;
                exporter(validData, filename);
            }

            if (invalidData && invalidData.length > 0) {
                const filename = `exported_invalid_${formState.api}_${timestamp}.${formState.format}`;
                exporter(invalidData, filename);
                setNotification({ type: 'info', message: `Successfully exported ${validData.length} valid rows. Also exported ${invalidData.length} invalid rows separately.` });
            } else if (validData.length > 0) {
                setNotification({ type: 'info', message: `Successfully exported a total of ${validData.length} rows.` });
            }

        } catch (error) {
            console.error("Error exporting data:", error);
            setNotification({ type: 'error', message: error.message || 'An unknown error occurred during export.' });
        } finally {
            setIsExporting(false);
        }
    };

    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) return;
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(","),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header] === null || row[header] === undefined ? "" : row[header];
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(",")
            ),
        ];
        const csvBlob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
        saveAs(csvBlob, filename);
    };

    const exportToExcel = (data, filename) => {
        if (!data || data.length === 0) return;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, filename);
    };


    return (
        <div className="container-fluid px-0 py-4">
            <div className="row">
                <div className="col-12">
                    <h5>Data Exporter</h5>
                    <form onSubmit={handleExport}>
                        <div className="row align-items-end gy-3">
                            <div className="col-6 col-md-auto">
                                <label htmlFor="api">Select Data</label>
                                <select name="api" id="api" className="form-control" value={formState.api} onChange={handleInputChange}>
                                    <option value="customers">Customers</option>
                                    <option value="estimates">Estimates</option>
                                    <option value="invoices">Invoices</option>
                                    <option value="report">Report</option>
                                </select>
                            </div>

                            {formState.api === 'report' && <ReportOptions formState={formState} salesReps={salesReps} handleInputChange={handleInputChange} />}

                            <div className="col-6 col-md-auto">
                                <label htmlFor="format">File Format</label>
                                <select name="format" id="format" className="form-control" value={formState.format} onChange={handleInputChange}>
                                    <option value="csv">CSV</option>
                                    <option value="xls">Excel</option>
                                </select>
                            </div>

                            {formState.api === "customers" && (
                                <div className="col-6 col-md-auto">
                                    <label htmlFor="sort">Sort by</label>
                                    <select name="sort" id="sort" className="form-control" value={formState.sort} onChange={handleInputChange}>
                                        <option value="alphabetical">Alphabetical Name</option>
                                        <option value="customerId">Customer ID</option>
                                    </select>
                                </div>
                            )}

                            {(formState.api === "customers" || formState.api === "estimates") && (
                                <div className="col-6 col-md-auto">
                                    <label htmlFor="separateInvalid">Separate invalid data?</label>
                                    <select name="separateInvalid" id="separateInvalid" className="form-control" value={formState.separateInvalid} onChange={handleInputChange}>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                </div>
                            )}

                            {formState.api !== "report" && (
                                <div className="col-6 col-md-auto">
                                    <label htmlFor="isSample">Use sample data?</label>
                                    <select name="isSample" id="isSample" className="form-control" value={formState.isSample} onChange={handleInputChange}>
                                        <option value={true}>Yes (for testing)</option>
                                        <option value={false}>No (full export)</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="form-group mt-4">
                            <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ type: '', message: '' })} />

                            {isExporting && (
                                <div className="alert alert-warning">
                                    <b>Exporting in progress...</b> Do not close this window. Please allow multiple file downloads if prompted by your browser.
                                    {progressCount > 0 && (
                                        <div className="mt-2">
                                            <strong>Exporting row count: {progressCount}</strong>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button className="btn btn-primary" type="submit" disabled={isExporting}>
                                {isExporting ? "Exporting..." : "Export Data"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Exporter;