import React from "react";
import { useLocation } from "react-router-dom";

const CurrentPage = () => {
  const location = useLocation();

  // Map paths to human-readable titles
  const pageTitles = {
    "/mis-customer": "Customer",
    "/mis-estimates": "Estimates",
    "/mis-jobs": "Jobs",
    "/mis-purchases": "Purchases",
    "/mis-inventory": "Inventory",
    "/mis-shipment": "Shipment",
    "/mis-invoice": "Invoice",
    "/mis-customer-search": "Customer Search",
    "/mis-customer-history": "Customer History",
    "/mis-customer-view": "Customer View",
  };

  // Get the base path for the title
  const path = location.pathname.split("/")[1];
  const title = pageTitles[`/${path}`] || "MIS Datahub";

  return <span className="current-page">{` - ${title}`}</span>;
};

export default CurrentPage;