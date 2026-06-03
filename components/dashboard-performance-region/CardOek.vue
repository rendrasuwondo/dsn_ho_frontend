<template>
  <div class="glass-card h-100 p-3 d-flex flex-column">
    <h5 class="kpi-title text-center mb-1"><i class="fas fa-seedling text-brown mr-2"></i> OEK</h5>
    <div class="text-center text-muted small text-uppercase mb-2 font-weight-bold">(Palm Kernel Oil Rendemen %)</div>
    
    <div class="text-center flex-shrink-0 mt-3">
      <div class="kpi-value-large text-dark mb-1" style="font-size: 2.8rem;">1.9%</div>
      <div class="kpi-target text-muted mb-3 font-weight-bold">TARGET: 1.8%</div>
      <div class="text-success font-weight-bold mb-0">VS BULAN LALU: (+0.1%)</div>
      <div class="text-success font-weight-bold mb-2">VS TAHUN LALU: (+0.2% YoY)</div>
      <div class="font-weight-bold mt-4 text-secondary">OEK TREND</div>
    </div>
    <div class="chart-wrapper flex-grow-1 mt-2">
      <client-only>
        <fusioncharts type="splinearea" width="100%" height="100%" dataFormat="json" :dataSource="chartData"></fusioncharts>
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPerformanceRegionCardOek',
  data() {
    const commonChartConfig = {
      theme: "fusion", showBorder: "0", bgColor: "#ffffff", bgAlpha: "0", canvasBgAlpha: "0",
      showValues: "0", showHoverEffect: "1", baseFont: "Quicksand", baseFontSize: "12",
      showToolTip: "1", toolTipBgColor: "#ffffff", toolTipBorderColor: "#e2e8f0", plotHoverEffect: "1",
    };
    return {
      chartData: {
        chart: {
          ...commonChartConfig,
          paletteColors: "#e67e22", plotFillAlpha: "40", drawAnchors: "0", showYAxisValues: "1",
          yAxisValuesPadding: "5", showXAxisLine: "1", xAxisLineColor: "#ccc", divLineAlpha: "30",
          divLineColor: "#e0e0e0", divLineIsDashed: "1", numDivLines: "2", chartBottomMargin: "0",
          chartTopMargin: "10", chartLeftMargin: "0", chartRightMargin: "0", formatNumberScale: "0"
        },
        data: [
          { label: "JUN", value: "1.2" }, { label: "FEB", value: "1.3" }, { label: "MAR", value: "1.4" },
          { label: "APR", value: "1.5" }, { label: "MAI", value: "1.7" }, { label: "JUN", value: "1.9" },
          { label: "JUL", value: "1.8" }, { label: "AUG", value: "1.9" }, { label: "SEC", value: "2.0" },
        ]
      }
    }
  }
}
</script>
