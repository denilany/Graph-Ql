export class GraphManager {
  constructor() {
      this.svgNS = "http://www.w3.org/2000/svg";
  }

createLineGraph(data, container) {
    const sortedData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    let cumulativeXP = 0;
    const points = sortedData.map(item => {
        cumulativeXP += item.amount;
        return {
            date: new Date(item.createdAt),
            xp: cumulativeXP
        };
    });

    const width = 600;
    const height = 300;
    const paddingLeft = 120; // Increased left padding
    const paddingRight = 40;

    const svg = document.createElementNS(this.svgNS, "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    const xScale = (width - paddingLeft - paddingRight) / (points.length - 1);
    const yScale = (height - 2 * paddingRight) / Math.max(...points.map(p => p.xp));

    let pathD = `M ${paddingLeft} ${height - paddingRight - points[0].xp * yScale}`;
    points.forEach((point, i) => {
        pathD += ` L ${paddingLeft + i * xScale} ${height - paddingRight - point.xp * yScale}`;
    });

    const path = document.createElementNS(this.svgNS, "path");
    path.setAttribute("d", pathD);
    path.setAttribute("stroke", "#007bff");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "2");

    const xAxis = document.createElementNS(this.svgNS, "line");
    xAxis.setAttribute("x1", paddingLeft);
    xAxis.setAttribute("y1", height - paddingRight);
    xAxis.setAttribute("x2", width - paddingRight);
    xAxis.setAttribute("y2", height - paddingRight);
    xAxis.setAttribute("stroke", "black");

    const yAxis = document.createElementNS(this.svgNS, "line");
    yAxis.setAttribute("x1", paddingLeft);
    yAxis.setAttribute("y1", paddingRight);
    yAxis.setAttribute("x2", paddingLeft);
    yAxis.setAttribute("y2", height - paddingRight);
    yAxis.setAttribute("stroke", "black");

    const gridLines = document.createElementNS(this.svgNS, "g");
    gridLines.setAttribute("class", "grid-lines");
    
    for (let i = 0; i <= 5; i++) {
        const x = paddingLeft + (width - paddingLeft - paddingRight) * (i / 5);
        const line = document.createElementNS(this.svgNS, "line");
        line.setAttribute("x1", x);
        line.setAttribute("y1", paddingRight);
        line.setAttribute("x2", x);
        line.setAttribute("y2", height - paddingRight);
        line.setAttribute("stroke", "#e0e0e0");
        line.setAttribute("stroke-width", "1");
        gridLines.appendChild(line);
        
        if (points.length > 0) {
            const dateLabel = document.createElementNS(this.svgNS, "text");
            const pointIndex = Math.min(Math.floor(i * points.length / 5), points.length - 1);
            const date = points[pointIndex].date;
            dateLabel.textContent = date.toLocaleDateString();
            dateLabel.setAttribute("x", x);
            dateLabel.setAttribute("y", height - paddingRight + 20);
            dateLabel.setAttribute("text-anchor", "middle"); 
            dateLabel.setAttribute("font-size", "12px");
            svg.appendChild(dateLabel);
        }
    }

    const maxXP = Math.max(...points.map(p => p.xp));
    for (let i = 0; i <= 5; i++) {
        const y = height - paddingRight - (height - 2 * paddingRight) * (i / 5);
        const line = document.createElementNS(this.svgNS, "line");
        line.setAttribute("x1", paddingLeft);
        line.setAttribute("y1", y);
        line.setAttribute("x2", width - paddingRight);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "#e0e0e0"); 
        line.setAttribute("stroke-width", "1");
        gridLines.appendChild(line);
        
        const xpLabel = document.createElementNS(this.svgNS, "text");
        xpLabel.textContent = Math.round(maxXP * i / 5).toLocaleString() + " XP";
        xpLabel.setAttribute("x", paddingLeft - 10);
        xpLabel.setAttribute("y", y);
        xpLabel.setAttribute("text-anchor", "end");
        xpLabel.setAttribute("alignment-baseline", "middle");
        xpLabel.setAttribute("font-size", "12px");
        svg.appendChild(xpLabel);
    }

    const xLabel = document.createElementNS(this.svgNS, "text");
    xLabel.textContent = "Time";
    xLabel.setAttribute("x", (width + paddingLeft - paddingRight) / 2);
    xLabel.setAttribute("y", height - 5);
    xLabel.setAttribute("text-anchor", "middle");
    xLabel.setAttribute("font-size", "14px");

    const yLabel = document.createElementNS(this.svgNS, "text");
    yLabel.textContent = "XP Gained";
    yLabel.setAttribute("x", -height / 2);
    yLabel.setAttribute("y", 15);
    yLabel.setAttribute("text-anchor", "middle");
    yLabel.setAttribute("transform", "rotate(-90)");
    yLabel.setAttribute("font-size", "14px");

    svg.appendChild(path);
    svg.appendChild(xAxis);
    svg.appendChild(yAxis);
    svg.insertBefore(gridLines, path);
    svg.appendChild(xLabel);
    svg.appendChild(yLabel);

    const title = document.createElement("h3");
    title.textContent = "XP Progress Over Time";
    container.appendChild(title);
    container.appendChild(svg);
}

  // Method to create a pie chart
  createPieChart(data, container) {
      const width = 300;
      const height = 300;
      const radius = Math.min(width, height) / 2 - 10;
      const centerX = width / 2;
      const centerY = height / 2;

      const svg = document.createElementNS(this.svgNS, "svg");
      svg.setAttribute("width", width);
      svg.setAttribute("height", height);

      const total = data.pass + data.fail;
      const passAngle = (data.pass / total) * 360;
      const failAngle = (data.fail / total) * 360;

      const passSlice = this.createPieSlice(centerX, centerY, radius, 0, passAngle, "#28a745");
      const failSlice = this.createPieSlice(centerX, centerY, radius, passAngle, passAngle + failAngle, "#dc3545");

      svg.appendChild(passSlice);
      svg.appendChild(failSlice);

      const legend = document.createElement("div");
      legend.innerHTML = `
          <div style="margin-top: 10px;">
              <span style="color: #28a745;">■</span> Pass (${Math.round(data.pass / total * 100)}%)
              <span style="color: #dc3545; margin-left: 10px;">■</span> Fail (${Math.round(data.fail / total * 100)}%)
          </div>
      `;

      const title = document.createElement("h3");
      title.textContent = "Project Success Ratio";
      container.appendChild(title);
      container.appendChild(svg);
      container.appendChild(legend);
  }

  createPieSlice(centerX, centerY, radius, startAngle, endAngle, color) {
      const start = this.polarToCartesian(centerX, centerY, radius, endAngle);
      const end = this.polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      const d = [
          "M", centerX, centerY,
          "L", start.x, start.y,
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
          "Z"
      ].join(" ");

      const path = document.createElementNS(this.svgNS, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", color);

      return path;
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
          x: centerX + (radius * Math.cos(angleInRadians)),
          y: centerY + (radius * Math.sin(angleInRadians))
      };
  }
}