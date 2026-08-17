(function () {
  if (window.Chart) return;

  class SimpleChart {
    static defaults = {
      font: { family: "system-ui, sans-serif" },
      color: "#1f3341"
    };

    constructor(canvas, config) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.config = config;
      this.resizeHandler = () => this.draw();
      window.addEventListener("resize", this.resizeHandler);
      this.draw();
    }

    destroy() {
      window.removeEventListener("resize", this.resizeHandler);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
      this.fitCanvas();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.config.type === "doughnut") this.drawDoughnut();
      if (this.config.type === "bar") this.drawBar();
    }

    fitCanvas() {
      const parent = this.canvas.parentElement || this.canvas;
      const rect = parent.getBoundingClientRect();
      const width = Math.max(280, Math.round(rect.width || parent.clientWidth || 280));
      const height = Math.max(220, Math.round(rect.height || parent.clientHeight || 220));
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.width = width;
      this.height = height;
    }

    textColor() {
      return SimpleChart.defaults.color || "#1f3341";
    }

    font(size, weight = 600) {
      return `${weight} ${size}px ${SimpleChart.defaults.font.family}`;
    }

    drawDoughnut() {
      const dataset = this.config.data.datasets[0];
      const values = dataset.data;
      const labels = this.config.data.labels;
      const colors = dataset.backgroundColor;
      const total = values.reduce((sum, value) => sum + value, 0) || 1;
      const radius = Math.min(this.width, this.height - 56) * 0.31;
      const innerRadius = radius * 0.62;
      const centerX = this.width / 2;
      const centerY = (this.height - 46) / 2 + 8;
      let start = -Math.PI / 2;

      values.forEach((value, index) => {
        const angle = (value / total) * Math.PI * 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, start, start + angle);
        this.ctx.arc(centerX, centerY, innerRadius, start + angle, start, true);
        this.ctx.closePath();
        this.ctx.fillStyle = colors[index];
        this.ctx.fill();
        start += angle;
      });

      this.ctx.fillStyle = this.textColor();
      this.ctx.textAlign = "center";
      this.ctx.font = this.font(24, 800);
      this.ctx.fillText(String(total), centerX, centerY + 6);
      this.ctx.font = this.font(12, 700);
      this.ctx.fillText("Total Areas", centerX, centerY + 27);

      const legendY = this.height - 42;
      const itemCount = labels.length || 1;
      const itemWidth = Math.min(190, this.width / itemCount - 8);
      labels.forEach((label, index) => {
        const x = this.width / 2 - (itemCount * itemWidth) / 2 + index * itemWidth;
        this.ctx.fillStyle = colors[index] || "#1f9d63";
        this.ctx.fillRect(x, legendY - 9, 12, 12);
        this.ctx.fillStyle = this.textColor();
        this.ctx.font = this.font(11, 650);
        this.ctx.textAlign = "left";
        const displayLabel = label.replace(" Societies", "");
        this.ctx.fillText(`${displayLabel}: ${values[index]}`, x + 16, legendY + 2);
      });
    }

    drawBar() {
      const labels = this.config.data.labels;
      const dataset = this.config.data.datasets[0];
      const values = dataset.data;
      const colors = dataset.backgroundColor;
      const left = 48;
      const right = 16;
      const top = 20;
      const bottom = 72;
      const chartWidth = this.width - left - right;
      const chartHeight = this.height - top - bottom;
      const maxValue = 100;

      this.ctx.strokeStyle = "rgba(120, 140, 150, .34)";
      this.ctx.lineWidth = 1;
      this.ctx.fillStyle = this.textColor();
      this.ctx.font = this.font(11, 650);
      this.ctx.textAlign = "right";

      for (let tick = 0; tick <= maxValue; tick += 25) {
        const y = top + chartHeight - (tick / maxValue) * chartHeight;
        this.ctx.beginPath();
        this.ctx.moveTo(left, y);
        this.ctx.lineTo(left + chartWidth, y);
        this.ctx.stroke();
        this.ctx.fillText(`${tick}%`, left - 8, y + 4);
      }

      const gap = 9;
      const barWidth = Math.max(12, (chartWidth - gap * (labels.length - 1)) / labels.length);

      labels.forEach((label, index) => {
        const value = values[index];
        const barHeight = (value / maxValue) * chartHeight;
        const x = left + index * (barWidth + gap);
        const y = top + chartHeight - barHeight;

        this.roundedRect(x, y, barWidth, barHeight, 6, colors[index]);

        this.ctx.fillStyle = this.textColor();
        this.ctx.font = this.font(10, 750);
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${value}%`, x + barWidth / 2, y - 6);

        this.ctx.save();
        this.ctx.translate(x + barWidth / 2, top + chartHeight + 14);
        this.ctx.rotate(-Math.PI / 4);
        this.ctx.font = this.font(10, 650);
        this.ctx.textAlign = "right";
        this.ctx.fillText(label, 0, 0);
        this.ctx.restore();
      });
    }

    roundedRect(x, y, width, height, radius, color) {
      const r = Math.min(radius, width / 2, height / 2);
      this.ctx.beginPath();
      this.ctx.moveTo(x + r, y);
      this.ctx.lineTo(x + width - r, y);
      this.ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      this.ctx.lineTo(x + width, y + height);
      this.ctx.lineTo(x, y + height);
      this.ctx.lineTo(x, y + r);
      this.ctx.quadraticCurveTo(x, y, x + r, y);
      this.ctx.closePath();
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }
  }

  window.Chart = SimpleChart;
})();
