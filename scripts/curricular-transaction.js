// Data for the chart
const data = [
    { Location: "Ahmadguda, near anjaneya swamy temple kamaan", Average: 2.368421 },
    { Location: "Nagaram, Medchal District", Average: 2.473684 },
    { Location: "AWC-III, SC Colony, Nagaram, Medchal district", Average: 2.315789 },
    { Location: "Awc-1507167, Lalanguda, Keesara, Medchal district", Average: 3.210526 },
    { Location: "Ahmadguda, Keesara, Medchal district", Average: 2.0 },
];

// Set dimensions and margins
const margin = { top: 20, right: 50, bottom: 40, left: 300 };
const width = 800 - margin.left - margin.right;
const height = data.length * 40;

// Create the SVG canvas
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create scales
const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Average)])
    .range([0, width]);

const y = d3.scaleBand()
    .domain(data.map(d => d.Location))
    .range([0, height])
    .padding(0.1);

// Add axes
svg.append("g").call(d3.axisLeft(y));
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5));

// Create bars
svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", d => y(d.Location))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", d => x(d.Average))
    .style("fill", "maroon");

// Add labels
svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => x(d.Average) + 5)
    .attr("y", d => y(d.Location) + y.bandwidth() / 2)
    .attr("dy", ".35em")
    .text(d => d.Average.toFixed(2));
