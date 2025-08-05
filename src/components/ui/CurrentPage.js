import React from "react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/mis-customer": "Customer",
  "/mis-estimates": "Estimates",
  "/mis-jobs": "Jobs",
  "/mis-purchases": "Purchases",
  "/mis-inventory": "Inventory",
  "/mis-shipment": "Shipment",
  "/mis-invoice": "Invoice",
  "/mis-search": "Search",
  "/mis-customer-history": "Customer History",
  "/mis-customer-view": "Customer View",
  "/mis-exporter": "Exporter",
  "/mis-client-salesrep": "Client/SalesRep Export",
};

const getPageTitle = (path) => {
  // Map path to the corresponding title
  return pageTitles[`/${path}`] || "MIS Datahub";
};

const getPageBaseURL = (path) => {
  const basePath = path.split("/")[1];
  return basePath;
}

export const CurrentPage = () => {
  const location = useLocation();
  const basePath = location.pathname.split("/")[1];
  const title = getPageTitle(basePath);

  return <span className="current-page">{` - ${title}`}</span>;
};

// Function-only component for retrieving the title
export const getPageTitleText = (locationPath) => getPageTitle(locationPath);
export const currentPageBaseURL = (locationPath) => getPageBaseURL(locationPath);

export default CurrentPage;
