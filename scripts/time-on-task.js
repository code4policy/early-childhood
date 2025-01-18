fetch('data/time-on-task.xlsx')
    .then((response) => response.arrayBuffer()) // Use arrayBuffer to process the file correctly
    .then(async (buffer) => {
        const workbook = XLSX.read(buffer, { type: 'array' }); // Read the buffer as an array
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Debugging: Log the raw parsed data
        console.log("Parsed data:", data); // Check the structure and content of the data

        // Extract data for the chart
        const locations = data.map((row) => row.Location); // Assuming 'Location' is the column header
        const earlyLateMinutes = data.map((row) => {
            const openTime = row['Column D'] || 0;  // Check if column headers are correct
            const closeTime = row['Column G'] || 0; // Same for Column G
            return openTime + closeTime; // Sum of early/late minutes
        });

        // Debugging: Check extracted data
        console.log("Locations:", locations);  // Log locations
        console.log("Early/Late Minutes:", earlyLateMinutes);  // Log early/late minutes

        // Create the bar chart
        const ctx = document.getElementById('timeOnTaskChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: locations,
                datasets: [
                    {
                        label: 'Minutes Early or Late',
                        data: earlyLateMinutes,
                        backgroundColor: earlyLateMinutes.map((val) =>
                            val > 0 ? '#800000' : '#D2B48C'
                        ), // Maroon for late, tan for early
                        borderColor: '#333', // Dark border for visibility
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false, // Hide the legend if you don't need it
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const minutes = context.raw;
                                return `${minutes > 0 ? 'Late' : 'Early'}: ${Math.abs(minutes)} min`;
                            },
                        },
                    },
                    title: {
                        display: true, // Make sure the title is displayed
                        text: 'Time on Task: Early or Late Openings/Closings', // Your headline text here
                        font: {
                            size: 18, // Customize the font size as needed
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45, // Diagonal slanted text for the x-axis labels
                        },
                        title: {
                            display: true,
                            text: 'Location', // Title for the x-axis
                            color: '#333',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Minutes', // Title for the y-axis
                            color: '#333',
                        },
                        beginAtZero: true,
                    },
                },
            },
        });
    })
    .catch((err) => console.error('Error loading or parsing the Excel file:', err));
