export const singleViewApis = (queryPage, key) => {
    const baseUrls = {
        "mis-estimates": process.env.REACT_APP_API_ESTIMATEFORJOBPROGRESS,
    };

    const apiUrl = baseUrls[queryPage] || "";

    const apiQueries = {
        "mis-estimates": `${apiUrl}/${key}`,
    };

	const columnHeadings = {
        "mis-estimates": ["AccountNumber", "CustomerID"],
	}

    return {
        apiUrl,
        apiQuery: apiQueries[queryPage] || "",
		columnHeadings: columnHeadings[queryPage] || ""
    };
}