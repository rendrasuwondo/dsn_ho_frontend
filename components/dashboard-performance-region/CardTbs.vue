<template>
  <div class="glass-card h-100 p-3 d-flex flex-column">
    <h5 class="kpi-title mb-3"><i class="fas fa-clipboard-list text-success mr-2"></i> PRODUKSI TBS <small class="text-muted">(TBS RECEIVED)</small></h5>
    <div class="kpi-data flex-shrink-0">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <div class="kpi-value text-dark">160,000 <span style="font-size: 1.2rem;">TON</span></div>
          <div class="kpi-vs text-success mt-1 font-weight-bold">VS TAHUN LALU: (+5.5% YoY)</div>
        </div>
        <div class="badge badge-success px-3 py-2 rounded-pill shadow-sm" style="font-size: 0.9rem;">+3.1% DARI<br>TARGET</div>
      </div>
    </div>
    <div class="chart-wrapper flex-grow-1 mt-3">
      <client-only>
        <fusioncharts type="splinearea" width="100%" height="100%" dataFormat="json" :dataSource="chartData"></fusioncharts>
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPerformanceRegionCardTbs',
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
          paletteColors: "#3498db", plotFillAlpha: "40", drawAnchors: "0", showYAxisValues: "1",
          yAxisValuesPadding: "5", showXAxisLine: "1", xAxisLineColor: "#ccc", divLineAlpha: "30",
          divLineColor: "#e0e0e0", divLineIsDashed: "1", numDivLines: "3", chartBottomMargin: "0",
          chartTopMargin: "10", chartLeftMargin: "0", chartRightMargin: "0", formatNumberScale: "1",
          numberScaleValue: "1000", numberScaleUnit: "K"
        },
        data: [
          { label: "JUN", value: "80000" }, { label: "FEB", value: "70000" }, { label: "MAR", value: "85000" },
          { label: "APR", value: "90000" }, { label: "MAI", value: "110000" }, { label: "JUN", value: "160000" },
          { label: "JUL", value: "140000" }, { label: "AUG", value: "155000" }, { label: "SEC", value: "165000" },
        ]
      }
    }
  }
}
</script>
