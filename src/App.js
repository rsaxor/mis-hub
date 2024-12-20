import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerTable from "./components/CustomerTable";
import EstimatesTable from "./components/EstimatesTable";
import JobsTable from "./components/JobsTable";
import PurchasesTable from "./components/PurchasesTable";
import InventoryTable from "./components/InventoryTable";
import ShipmentTable from "./components/ShipmentTable";
import InvoiceTable from "./components/InvoiceTable";
import CustomerSearch from "./components/CustomerSearch";
import CustomerHistory from "./components/CustomerHistory";
import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <h1 className="fw-bold">MIS Datahub</h1>
        <nav className="main-nav">
          <Link to="/mis-customer">Customer</Link>
          <Link to="/mis-estimates">Estimates</Link>
          <Link to="/mis-jobs">Jobs</Link>
          <Link to="/mis-purchases">Purchases</Link>
          <Link to="/mis-inventory">Inventory</Link>
          <Link to="/mis-shipment">Shipment</Link>
          <Link to="/mis-invoice">Invoice</Link>
        </nav>
        <Routes>
          <Route path="/mis-customer-search/:searchKeyword" element={<CustomerSearch />} />
          <Route path="/mis-customer-history/:customerId" element={<CustomerHistory />} />
          <Route path="/mis-customer" element={<CustomerTable />} />
          <Route path="/mis-estimates" element={<EstimatesTable />} />
          <Route path="/mis-jobs" element={<JobsTable />} />
          <Route path="/mis-purchases" element={<PurchasesTable />} />
          <Route path="/mis-inventory" element={<InventoryTable />} />
          <Route path="/mis-shipment" element={<ShipmentTable />} />
          <Route path="/mis-invoice" element={<InvoiceTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
