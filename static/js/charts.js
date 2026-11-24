
// =================================
// NEXASPEND
// Theme-aware Chart.js Dashboard
// =================================


// =================================
// 1. READ CHART DATA FROM FLASK
// =================================

const chartDataElement = document.getElementById("chart-data");

let chartData = {
    monthlyLabels: [],
    monthlyIncome: [],
    monthlyExpenses: [],
    categoryLabels: [],
    categoryAmounts: []
};

if (chartDataElement) {
    try {
        chartData = {
            monthlyLabels: JSON.parse(
                chartDataElement.dataset.monthlyLabels || "[]"
            ),

            monthlyIncome: JSON.parse(
                chartDataElement.dataset.monthlyIncome || "[]"
            ),

            monthlyExpenses: JSON.parse(
                chartDataElement.dataset.monthlyExpenses || "[]"
            ),

            categoryLabels: JSON.parse(
                chartDataElement.dataset.categoryLabels || "[]"
            ),

            categoryAmounts: JSON.parse(
                chartDataElement.dataset.categoryAmounts || "[]"
            )
        };
    } catch (error) {
        console.error("Could not read chart data:", error);
    }
}


// =================================
// 2. THEME COLOURS
// =================================

function getChartThemeColors() {
    const styles = getComputedStyle(document.documentElement);

    return {
        text: (
            styles.getPropertyValue("--text-muted").trim() ||
            styles.getPropertyValue("--text-secondary").trim() ||
            "#94a3b8"
        ),

        border: (
            styles.getPropertyValue("--border").trim() ||
            "rgba(148, 163, 184, 0.2)"
        ),

        surface: (
            styles.getPropertyValue("--surface").trim() ||
            "#111c33"
        )
    };
}


// Keep references to the charts
const charts = [];


// =================================
// 3. MONTHLY INCOME VS EXPENSES
// =================================

const monthlyCanvas = document.getElementById("monthlyChart");

if (monthlyCanvas && typeof Chart !== "undefined") {

    const monthlyChart = new Chart(monthlyCanvas, {
        type: "bar",

        data: {
            labels: chartData.monthlyLabels,

            datasets: [
                {
                    label: "Income",
                    data: chartData.monthlyIncome,
                    backgroundColor: "#38bdf8",
                    borderRadius: 6
                },

                {
                    label: "Expenses",
                    data: chartData.monthlyExpenses,
                    backgroundColor: "#a78bfa",
                    borderRadius: 6
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom",

                    labels: {
                        color: getChartThemeColors().text,
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: getChartThemeColors().text
                    },

                    grid: {
                        display: false
                    }
                },

                y: {
                    beginAtZero: true,

                    ticks: {
                        color: getChartThemeColors().text,

                        callback: function(value) {
                            return "₦" +
                                Number(value).toLocaleString("en-NG");
                        }
                    },

                    grid: {
                        color: getChartThemeColors().border
                    }
                }
            }
        }
    });

    charts.push(monthlyChart);
}


// =================================
// 4. EXPENSE BREAKDOWN
// =================================

const categoryCanvas = document.getElementById("categoryChart");

if (categoryCanvas && typeof Chart !== "undefined") {

    const categoryChart = new Chart(categoryCanvas, {
        type: "doughnut",

        data: {
            labels: chartData.categoryLabels,

            datasets: [{
                data: chartData.categoryAmounts,

                backgroundColor: [
                    "#38bdf8",
                    "#a78bfa",
                    "#34d399",
                    "#fbbf24",
                    "#fb7185",
                    "#818cf8",
                    "#2dd4bf",
                    "#f97316"
                ],

                borderColor: getChartThemeColors().surface,
                borderWidth: 3,
                hoverOffset: 8
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",

            plugins: {
                legend: {
                    position: "bottom",

                    labels: {
                        color: getChartThemeColors().text,
                        usePointStyle: true,
                        padding: 18
                    }
                }
            }
        }
    });

    charts.push(categoryChart);
}


// =================================
// 5. UPDATE CHARTS WHEN THEME CHANGES
// =================================

function updateChartTheme() {
    const colors = getChartThemeColors();

    charts.forEach(function(chart) {

        // Update legend text
        if (chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = colors.text;
        }

        // Update monthly chart axes and grid
        if (chart.options.scales) {

            if (chart.options.scales.x) {
                chart.options.scales.x.ticks.color = colors.text;
            }

            if (chart.options.scales.y) {
                chart.options.scales.y.ticks.color = colors.text;
                chart.options.scales.y.grid.color = colors.border;
            }
        }

        // Update doughnut chart border
        if (chart.config.type === "doughnut") {
            chart.data.datasets[0].borderColor = colors.surface;
        }

        chart.update();
    });
}


// Watch for dark/light theme changes
const themeObserver = new MutationObserver(function() {
    updateChartTheme();
});

themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
});


// Apply the current theme immediately
updateChartTheme();
