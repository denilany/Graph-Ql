export function createLineChart(g, data, width, height) {
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.xp)])
        .range([height, 0]);

    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.xp));

    // X Axis
    g.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %d')));

    // Y Axis
    g.append('g')
        .call(d3.axisLeft(yScale));

    // Line Path
    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#007acc')
        .attr('stroke-width', 2)
        .attr('d', line);
}
