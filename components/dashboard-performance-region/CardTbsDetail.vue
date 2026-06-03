<template>
  <div class="glass-card h-100 p-3 d-flex flex-column">
    <div class="d-flex align-items-center justify-content-center mb-1">
      <i class="fas fa-chart-bar text-success fa-2x mr-3"></i>
      <div>
        <h5 class="kpi-title mb-0">DETAIL PRODUKSI TBS</h5>
        <small class="text-muted text-uppercase font-weight-bold">(Detailed TBS Analysis)</small>
      </div>
    </div>
    <h6 class="text-center font-weight-bold mt-3 mb-0">PRODUKSI TBS KEBUN <small class="text-muted">(BEST TO WORST KEBUN)</small></h6>
    <div class="text-center text-muted small mb-2 font-weight-bold">Perkebunan Terbaik ke Terpuruk</div>
    <div class="chart-wrapper flex-grow-1">
      <client-only>
        <fusioncharts type="column2d" width="100%" height="100%" dataFormat="json" :dataSource="chartData"></fusioncharts>
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPerformanceRegionCardTbsDetail',
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
          showValues: "1", valueFontColor: "#000", valueFontBold: "1", valueFontSize: "11",
          plotSpacePercent: "40", showYAxisValues: "1", yAxisValuesPadding: "5", divLineAlpha: "30",
          divLineColor: "#e0e0e0", divLineIsDashed: "1", formatNumberScale: "1", numberScaleValue: "1000",
          numberScaleUnit: "K", chartBottomMargin: "0", chartTopMargin: "15", chartLeftMargin: "0", chartRightMargin: "0",
        },
        data: [
          { label: "PT Kebun 1", value: "35000", color: "#27ae60" }, { label: "PT Kebun 2", value: "32000", color: "#27ae60" },
          { label: "PT Kebun 2", value: "32000", color: "#27ae60" }, { label: "PT Kebun 2", value: "32000", color: "#27ae60" },
          { label: "PT Kebun 3", value: "28000", color: "#27ae60" }, { label: "PT Kebun 3", value: "24000", color: "#27ae60" },
          { label: "PT Kebun 3", value: "24000", color: "#27ae60" }, { label: "PT Kebun 3", value: "18000", color: "#27ae60" },
          { label: "PT Kebun 3", value: "18000", color: "#f39c12" }, { label: "PT Kebun 4", value: "18000", color: "#f39c12" },
          { label: "PT Kebun 5", value: "12000", color: "#e74c3c" }, { label: "PT Kebun X", value: "12000", color: "#e74c3c" },
          { label: "PT Kebun X", value: "10000", color: "#e74c3c" },
        ]
      }
    }
  }
}
</script>
