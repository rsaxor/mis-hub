import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import CurrentPage from "./components/ui/CurrentPage";
import CustomerTable from "./components/CustomerTable";
import EstimatesTable from "./components/EstimatesTable";
import JobsTable from "./components/JobsTable";
import PurchasesTable from "./components/PurchasesTable";
import InventoryTable from "./components/InventoryTable";
import ShipmentTable from "./components/ShipmentTable";
import InvoiceTable from "./components/InvoiceTable";
import KeywordSearch from "./components/KeywordSearch";
import CustomerHistory from "./components/CustomerHistory";
import CustomerView from "./components/CustomerView";
import SingleView from "./components/SingleView";
import Exporter from "./components/Exporter";
import ExportSalesClient from "./components/ExportSalesClient";

function App() {
  return (
    <Router>
      <div className="App">
        <h1 className="fw-bold">MIS Datahub <CurrentPage /></h1>
        <nav className="main-nav px-2 py-3">
          <NavLink to="/mis-customer" className={({ isActive }) => isActive ? "active" : ""}>Customer</NavLink>
          <NavLink to="/mis-estimates" className={({ isActive }) => isActive ? "active" : ""}>Estimates</NavLink>
          <NavLink to="/mis-jobs" className={({ isActive }) => isActive ? "active" : ""}>Jobs</NavLink>
          <NavLink to="/mis-purchases" className={({ isActive }) => isActive ? "active" : ""}>Purchases</NavLink>
          <NavLink to="/mis-inventory" className={({ isActive }) => isActive ? "active" : ""}>Inventory</NavLink>
          <NavLink to="/mis-shipment" className={({ isActive }) => isActive ? "active" : ""}>Shipment</NavLink>
          <NavLink to="/mis-invoice" className={({ isActive }) => isActive ? "active" : ""}>Invoice</NavLink>
          <NavLink to="/mis-exporter" className={({ isActive }) => isActive ? "active" : ""}>Export</NavLink>
          <NavLink to="/mis-client-salesrep" className={({ isActive }) => isActive ? "active" : ""}>Client/SalesRep Export</NavLink>
        </nav>
        <Routes>
          <Route path="/mis-customer" element={<CustomerTable />} />
          <Route path="/mis-search/:queryPage/:searchKeyword/" element={<KeywordSearch />} />
          <Route path="/mis-customer-history/:customerId" element={<CustomerHistory />} />
          <Route path="/mis-customer-view/:customerId" element={<CustomerView />} />
          <Route path="/mis-estimates" element={<EstimatesTable />} />
          <Route path="/mis-jobs" element={<JobsTable />} />
          <Route path="/mis-purchases" element={<PurchasesTable />} />
          <Route path="/mis-inventory" element={<InventoryTable />} />
          <Route path="/mis-shipment" element={<ShipmentTable />} />
          <Route path="/mis-invoice" element={<InvoiceTable />} />
          <Route path="/mis-exporter" element={<Exporter />} />
          <Route path="/mis-client-salesrep" element={<ExportSalesClient />} />
          <Route path="/view/:queryPage/:key" element={<SingleView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
