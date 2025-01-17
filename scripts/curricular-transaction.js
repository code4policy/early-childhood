const data = [
    { Location: "Ahmadguda, near anjaneya swamy temple kamaan", Average: 2.368421 },
    { Location: "Nagaram, Medchal District", Average: 2.473684 },
    { Location: "AWC-III, SC Colony, Nagaram, Medchal district", Average: 2.315789 },
    { Location: "Awc-1507167, Lalanguda, Keesara, Medchal district", Average: 3.210526 },
    { Location: "Ahmadguda, Keesara, Medchal district", Average: 2.0 },
    { Location: "Other Center 1", Average: 3.5 },
    { Location: "Other Center 2", Average: 1.8 },
    { Location: "AWC Ahmadguda", Average: 2.368421 },
    { Location: "AWC Medchal District ", Average: 2.473684 },
    { Location: "AWC-III SC Colony", Average: 2.315789 },
    { Location: "AWC-Lalanguda", Average: 3.210526 },
    { Location: "AWC Ahmadguda-2", Average: 2.0 },
    { Location: " AWC Vandana school", Average: 3.5 },
    { Location: "Malik High School", Average: 1.8 },
    { Location: "AWC Shameerpet", Average: 2.368421 },
    { Location: "AWC Ankiredapelly", Average: 2.473684 },
    { Location: "AWC Nagaram", Average: 2.315789 },
    { Location: "AWC Keesera", Average: 3.210526 },
    { Location: "Blue bells SHIVANANDAPURI", Average: 2.0 },
    { Location: "AWC-III BANGARU", Average: 3.5 },
    { Location: "AWC-II,LALGADI", Average: 1.8 },
    { Location: "AWC NAGARAM-2", Average: 2.368421 },
    { Location: "AWC Rampally", Average: 2.473684 },
    { Location: "AWC Premavatipet", Average: 2.315789 },
    { Location: "AWC Milardevpalli", Average: 3.210526 },
    { Location: "AWC Budwel", Average: 2.0 },
    { Location: "AWC CHINTALMET", Average: 3.5 },
    { Location: "AWC Rajendra Nagar", Average: 1.8 },
    { Location: "AWC Brundavan colony", Average: 2.368421 },
    { Location: "AWC PADMASALIPURAM", Average: 2.473684 },
    { Location: "AWC UPPERPALLY", Average: 2.315789 }
];

// Sort the data by Average in descending order
data.sort((a, b) => b.Average - a.Average);

// Log the chart data
console.log(data);

// Render the chart with D3.js
const margin = { top: 20, right: 50, bottom: 40, left: 300 };
const width = 800 - margin.left - margin.right;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right);

const drawChart = (filteredData) => {
    const height = filteredData.length * 40 + margin.top + margin.bottom;
    svg.attr("height", height);

    svg.selectAll("*").remove(); // Clear existing chart content

    const x = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.Average)])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(filteredData.map(d => d.Location))
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5));

    svg.selectAll(".bar")
        .data(filteredData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", margin.left)
        .attr("y", d => y(d.Location))
        .attr("height", y.bandwidth())
        .attr("width", d => x(d.Average))
        .style("fill", "maroon");

    // Add labels for scores on the far right
    svg.selectAll(".label")
        .data(filteredData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => margin.left + x(d.Average || 0) + 5) // Position slightly to the right of the bar
        .attr("y", d => y(d.Location) + y.bandwidth() / 2)
        .attr("dy", ".35em") // Center vertically
        .text(d => (d.Average ? d.Average.toFixed(2) : ""));

    // Add key below the x-axis
    svg.append("text")
        .attr("class", "chart-key")
        .attr("x", margin.left + width / 2) // Center the key horizontally
        .attr("y", height - margin.bottom + 40) // Add space below the x-axis
        .attr("text-anchor", "middle") // Center-align the text
        .style("font-size", "12px") // Font size
        .style("fill", "maroon") // Maroon color for the text
        .style("font-weight", "bold") // Make the text bold
        .text("4 = Excellent | 3 = Good | 2 = Average | 1 = Poor");
};

// Initial rendering with the top 5 issues
let showingAll = false;
const top5Data = data.slice(0, 5);
drawChart(top5Data);

// Toggle functionality with debugging
const toggleButton = d3.select("#toggle-chart");
toggleButton.on("click", () => {
    showingAll = !showingAll;
    drawChart(showingAll ? data : top5Data);
    toggleButton.text(showingAll ? "Show Top 5" : "Show All");
});

