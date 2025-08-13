export const singleViewApis = (queryPage, key) => {
    const baseUrls = {
        "mis-estimates": process.env.REACT_APP_API_ESTIMATEFORJOBPROGRESS,
        "mis-jobs": process.env.REACT_APP_API_ESTIMATEFORJOBPROGRESS, // same with estimate
        "mis-invoice": process.env.REACT_APP_API_ESTIMATEFORJOBPROGRESS, // same with estimate
    };

    const apiUrl = baseUrls[queryPage] || "";

    const apiQueries = {
        "mis-estimates": `${apiUrl}/${key}`,
        "mis-jobs": `${apiUrl}/${key}`,
        "mis-invoice": `${apiUrl}/${key}`,
    };

	// const columnHeadings = {
    //     "mis-estimates": ["AccountNumber", "CustomerID"],
    //     "mis-jobs": ["AccountNumber", "CustomerID"],
	// }

    return {
        apiUrl,
        apiQuery: apiQueries[queryPage] || "",
		// columnHeadings: columnHeadings[queryPage] || ""
    };
}