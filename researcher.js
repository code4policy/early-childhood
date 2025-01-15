document.addEventListener("DOMContentLoaded", () => {
    const loadDataBtn = document.getElementById("load-data");
    const columnFilter = document.getElementById("column-filter");
    const filterValueInput = document.getElementById("filter-value");
    const applyFilterBtn = document.getElementById("apply-filter");
    const resetFilterBtn = document.getElementById("reset-filter");
    const dataTable = document.getElementById("data-table");
    const downloadDataBtn = document.getElementById("download-data");

    let rawData = [];
    let filteredData = [];

    // Load data
    loadDataBtn.addEventListener("click", () => {
        d3.csv("Early Childhood Raw Data.csv").then(data => {
            rawData = data;
            filteredData = [...rawData];
            populateColumnFilter(rawData);
            displayTable(rawData);
            document.getElementById("filter-controls").style.display = "block";
            downloadDataBtn.style.display = "block";
        });
    });

    // Populate column filter
    function populateColumnFilter(data) {
        const columns = Object.keys(data[0]);
        columnFilter.innerHTML = columns.map(col => `<option value="${col}">${col}</option>`).join("");
    }

    // Display table
    function displayTable(data) {
        const columns = Object.keys(data[0]);
        const tableHtml = `
            <table border="1">
                <thead>
                    <tr>${columns.map(col => `<th>${col}</th>`).join("")}</tr>
                </thead>
                <tbody>
                    ${data.slice(0, 10).map(row => `
                        <tr>${columns.map(col => `<td>${row[col]}</td>`).join("")}</tr>
                    `).join("")}
                </tbody>
            </table>
        `;
        dataTable.innerHTML = tableHtml;
    }

    // Apply filter
    applyFilterBtn.addEventListener("click", () => {
        const column = columnFilter.value;
        const filterValue = filterValueInput.value.toLowerCase();
        filteredData = rawData.filter(row => row[column].toLowerCase().includes(filterValue));
        displayTable(filteredData);
    });

    // Reset filter
    resetFilterBtn.addEventListener("click", () => {
        filteredData = [...rawData];
        displayTable(filteredData);
    });

    // Download data
    downloadDataBtn.addEventListener("click", () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            [Object.keys(filteredData[0]).join(","), ...filteredData.map(row => Object.values(row).join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "filtered_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
