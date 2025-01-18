document.addEventListener('DOMContentLoaded', () => {
    fetch('data/ECCE Data 2022.csv')
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSV(data);
            populateFilterOptions(parsedData);
            populateColumnDropdown(parsedData);
            window.data = parsedData; // Store data globally for easy access
            displayData(parsedData); // Display the entire data initially
        });
});

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map((line, lineIndex) => {
        const values = line.split(',');
        if (values.length !== headers.length) {
            console.error(`Line ${lineIndex + 2} has a different number of values (${values.length}) than headers (${headers.length})`);
            console.error(`Line content: ${line}`);
            // Fill missing values with empty strings
            while (values.length < headers.length) {
                values.push('NA');
            }
            // Optionally, you can skip this line instead of filling missing values
            // return null;
        }
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index] ? values[index].trim() : '';
            return obj;
        }, {});
    }).filter(item => item !== null); // Filter out null entries if you choose to skip lines
}

function populateFilterOptions(data) {
    const stateFilter = document.getElementById('state-filter');
    const districtFilter = document.getElementById('district-filter');

    const states = [...new Set(data.map(item => item['Name of the State']))];
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateFilter.appendChild(option);
    });

    stateFilter.addEventListener('change', () => {
        const selectedState = stateFilter.value;
        const districts = [...new Set(data
            .filter(item => selectedState === 'All' || item['Name of the State'] === selectedState)
            .map(item => item['Name of the District']))];
        
        districtFilter.innerHTML = '<option value="All">All</option>';
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtFilter.appendChild(option);
        });
    });

    // Trigger change event to populate districts initially
    stateFilter.dispatchEvent(new Event('change'));
}

function populateColumnDropdown(data) {
    const columnFilter = document.getElementById('column-filter');
    const headers = Object.keys(data[0]);
    console.log('Headers:', headers); // Log headers to verify

    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        option.selected = true; // Select all columns by default
        columnFilter.appendChild(option);
    });
}

function displayData(data) {
    const dataDisplay = document.getElementById('data-display');
    dataDisplay.innerHTML = '';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const columnFilter = document.getElementById('column-filter');
    const selectedColumns = Array.from(columnFilter.selectedOptions).map(option => option.value);

    const headerRow = document.createElement('tr');
    selectedColumns.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    data.forEach(item => {
        const row = document.createElement('tr');
        selectedColumns.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header];
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    dataDisplay.appendChild(table);
}

function filterData() {
    const stateFilter = document.getElementById('state-filter').value;
    const districtFilter = document.getElementById('district-filter').value;

    let filteredData = window.data;
    if (stateFilter !== 'All') {
        filteredData = filteredData.filter(item => item['Name of the State'] === stateFilter);
    }
    if (districtFilter !== 'All') {
        filteredData = filteredData.filter(item => item['Name of the District'] === districtFilter);
    }

    displayData(filteredData);
}

function downloadData(type) {
    let dataToDownload = window.data;
    if (type === 'filtered') {
        const stateFilter = document.getElementById('state-filter').value;
        const districtFilter = document.getElementById('district-filter').value;

        if (stateFilter !== 'All') {
            dataToDownload = dataToDownload.filter(item => item['Name of the State'] === stateFilter);
        }
        if (districtFilter !== 'All') {
            dataToDownload = dataToDownload.filter(item => item['Name of the District'] === districtFilter);
        }
    }

    const columnFilter = document.getElementById('column-filter');
    const selectedColumns = Array.from(columnFilter.selectedOptions).map(option => option.value);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
        selectedColumns.join(',') + '\n' + 
        dataToDownload.map(item => selectedColumns.map(col => item[col]).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', type === 'all' ? 'entire_data.csv' : 'filtered_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}