<template>
  <div class="glass-card h-100 p-3 d-flex flex-column">
    <h5 class="kpi-title mb-3"><i class="fas fa-tint text-warning mr-2"></i> PRODUKSI CPO <small class="text-muted">(CPO PRODUCTION)</small></h5>
    <div class="kpi-data flex-shrink-0">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <div class="kpi-value text-dark">37,200 <span style="font-size: 1.2rem;">TON</span></div>
          <div class="kpi-vs text-success mt-1 font-weight-bold">VS TAHUN LALU: (+2.8% YoY)</div>
        </div>
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
  name: 'DashboardPerformanceRegionCardCpo',
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
          paletteColors: "#f1c40f", plotFillAlpha: "40", drawAnchors: "0", showYAxisValues: "1",
          yAxisValuesPadding: "5", showXAxisLine: "1", xAxisLineColor: "#ccc", divLineAlpha: "30",
          divLineColor: "#e0e0e0", divLineIsDashed: "1", numDivLines: "3", chartBottomMargin: "0",
          chartTopMargin: "10", chartLeftMargin: "0", chartRightMargin: "0", formatNumberScale: "1",
          numberScaleValue: "1000", numberScaleUnit: "K"
        },
        data: [
          { label: "JUN", value: "15000" }, { label: "FEB", value: "14000" }, { label: "MAR", value: "18000" },
          { label: "APR", value: "19000" }, { label: "MAI", value: "24000" }, { label: "JUN", value: "37200" },
          { label: "JUL", value: "34000" }, { label: "AUG", value: "36000" }, { label: "SEC", value: "38000" },
        ]
      }
    }
  }
}
</script>
