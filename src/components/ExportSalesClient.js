import React, { useState } from 'react';
import Papa from 'papaparse';

const ExportSalesClient = () => {
	const [usersJson, setUsersJson] = useState([]);
	const [customerData, setCustomerData] = useState([]);
	const [selectedSalesRep, setSelectedSalesRep] = useState('all');
	const [filteredCustomers, setFilteredCustomers] = useState([]);

	// Load Salesperson JSON file
	const handleUserFileUpload = (event) => {
		const file = event.target.files[0];
		if (file && file.name.endsWith('.json')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setUsersJson(JSON.parse(e.target.result));
			};
			reader.readAsText(file);
		}
	};

	// Load Customer CSV file
	const handleCustomerFileUpload = (event) => {
		const file = event.target.files[0];
		if (file && file.name.endsWith('.csv')) {
			Papa.parse(file, {
				complete: (result) => {
					const data = result.data.filter(row => Object.values(row).some(val => val)); // Remove empty rows
					setCustomerData(data);
				},
				header: true,
				skipEmptyLines: true,
			});
		}
	};

	// Assign SalesRep to customers by matching ManagerID with users.json UID
	const assignSalesRepToCustomers = () => {
		return customerData.map(customer => {
			const user = usersJson.find(user => user.UID.toString() === customer.ManagerID);
			return { ...customer, SalesRep: user ? user.FullName : 'Unknown' };
		});
	};

	// Generate CSV file
	const generateCSV = (customers, salesRepName) => {
		const headers = ['CustomerName', 'Type', 'AccountNumber', 'Tel1', 'Email', 'SalesRep', 'Address11', 'Address12', 'City', 'Town', 'Country'];
		const rows = customers.map(customer => [
			customer.CustomerName,
			customer.Type,
			customer.AccountNumber,
			customer.Tel1,
			customer.Email,
			customer.SalesRep,
			customer.Address11,
			customer.Address12,
			customer.City,
			customer.Town,
			customer.Country,
		]);

		const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = salesRepName === 'all' ? 'all_salespersons.csv' : `${salesRepName.replace(/\s+/g, '_')}_customers.csv`;
		link.click();
	};

	// Handle form submission
	const handleSubmit = (event) => {
		event.preventDefault();
		const customersWithSalesRep = assignSalesRepToCustomers();

		if (selectedSalesRep === 'all') {
			usersJson.forEach(user => {
				const filtered = customersWithSalesRep.filter(customer => customer.SalesRep === user.FullName);
				if (filtered.length > 0) {
					generateCSV(filtered, user.FullName);
				}
			});
		} else {
			const filtered = customersWithSalesRep.filter(customer => customer.SalesRep === selectedSalesRep);
			setFilteredCustomers(filtered);
			generateCSV(filtered, selectedSalesRep);
		}
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-3">
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<p className="m-0"><b>Instruction:</b></p>
							<p className="small">Please upload list of sales rep (json file) and list of customers (csv file).</p>
						</div>
						<div className="form-group">
							<label htmlFor="userFileUpload">Upload Sales Rep. JSON: </label>
							<input type="file" id="userFileUpload" className="form-control" accept=".json" onChange={handleUserFileUpload} />
						</div>
						<div className="form-group mt-3">
							<label htmlFor="customerFileUpload">Upload Customer CSV: </label>
							<input type="file" id="customerFileUpload" className="form-control" accept=".csv" onChange={handleCustomerFileUpload} />
						</div>
						<div className="form-group mt-3">
							<label htmlFor="salesRepDropdown">Select Sales Rep: </label>
							<select
								id="salesRepDropdown"
								value={selectedSalesRep}
								onChange={(e) => setSelectedSalesRep(e.target.value)}
								className="form-control"
							>
								<option value="all">All</option>
								{usersJson.map((user) => (
									<option key={user.UID} value={user.FullName}>
										{user.FullName}
									</option>
								))}
							</select>
						</div>
						<button type="submit" className="btn btn-primary mt-4">Generate and Download CSV</button>
					</form>
				</div>
				<div className="col-9">
					<table className="table">
						<thead>
							<tr>
								<th>CustomerName</th>
								<th>Type</th>
								<th>AccountNumber</th>
								<th>Tel1</th>
								<th>Email</th>
								<th>SalesRep</th>
								<th>Address</th>
							</tr>
						</thead>
						<tbody>
							{filteredCustomers.map((customer, index) => (
								<tr key={index}>
									<td>{customer.CustomerName}</td>
									<td>{customer.Type}</td>
									<td>{customer.AccountNumber}</td>
									<td>{customer.Tel1}</td>
									<td>{customer.Email}</td>
									<td>{customer.SalesRep}</td>
									<td>{customer.Address11}, {customer.Address12}, {customer.City}, {customer.Town}, {customer.Country}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ExportSalesClient;
