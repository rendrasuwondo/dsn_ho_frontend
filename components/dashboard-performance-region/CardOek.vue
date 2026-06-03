<template>
  <div class="glass-card h-100 p-3 d-flex flex-column">
    <h5 class="kpi-title text-center mb-1"><i class="fas fa-seedling text-brown mr-2"></i> OEK</h5>
    <div class="text-center text-muted small text-uppercase mb-2 font-weight-bold">(PALM KERNEL OIL RENDEMEN %)</div>
    
    <div v-if="isLoading" class="flex-grow-1 d-flex flex-column justify-content-center">
      <b-skeleton width="60%" height="2.5rem" class="mb-2 mx-auto"></b-skeleton>
      <b-skeleton width="40%" class="mb-3 mx-auto"></b-skeleton>
      <b-skeleton width="80%" class="mb-1 mx-auto"></b-skeleton>
      <b-skeleton width="70%" class="mb-4 mx-auto"></b-skeleton>
    </div>
    
    <div v-else class="text-center flex-shrink-0 mt-3">
      <div class="kpi-value-large text-dark mb-1" style="font-size: 2.8rem;">{{ formatPercent(sbiData.oek_percentage) }}</div>
      <div class="kpi-target text-muted mb-3 font-weight-bold">TARGET: {{ formatPercent(sbiData.target_percentage) }}</div>
      <div class="font-weight-bold mb-0" :class="getColor(sbiData.vs_bulan_lalu_percentage)">VS BULAN LALU: ({{ formatVs(sbiData.vs_bulan_lalu_percentage) }})</div>
      <div class="font-weight-bold mb-2" :class="getColor(sbiData.yoy_percentage)">VS TAHUN LALU: ({{ formatVs(sbiData.yoy_percentage) }} YoY)</div>
      <div class="font-weight-bold mt-4 text-secondary">OEK TREND</div>
    </div>
    
    <div class="chart-wrapper flex-grow-1 mt-2 position-relative" style="min-height: 80px;">
      <div v-if="isLoading" class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
        <b-spinner variant="warning"></b-spinner>
      </div>
      <client-only v-else>
        <fusioncharts type="splinearea" width="100%" height="100%" dataFormat="json" :dataSource="computedChartData"></fusioncharts>
        <template #placeholder>
          <div class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
            <b-spinner variant="warning"></b-spinner>
          </div>
        </template>
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPerformanceRegionCardOek',
  props: {
    oekData: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const commonChartConfig = {
      theme: "fusion", showBorder: "0", bgColor: "#ffffff", bgAlpha: "0", canvasBgAlpha: "0",
      showValues: "0", showHoverEffect: "1", baseFont: "Quicksand", baseFontSize: "12",
      showToolTip: "1", toolTipBgColor: "#ffffff", toolTipBorderColor: "#e2e8f0", plotHoverEffect: "1",
    };
    return {
      defaultChartData: {
        chart: {
          ...commonChartConfig,
          paletteColors: "#e67e22", plotFillAlpha: "40", drawAnchors: "1", showYAxisValues: "1",
          yAxisValuesPadding: "5", showXAxisLine: "1", xAxisLineColor: "#ccc", divLineAlpha: "30",
          divLineColor: "#e0e0e0", divLineIsDashed: "1", numDivLines: "2", chartBottomMargin: "0",
          chartTopMargin: "15", chartLeftMargin: "0", chartRightMargin: "0", formatNumberScale: "0",
          decimals: "1", anchorRadius: "4", anchorBgColor: "#ffffff", anchorBorderColor: "#e67e22", 
          anchorBorderThickness: "2", valueFontColor: "#0f172a", valueFontSize: "9", valueFontBold: "1"
        },
        data: []
      }
    }
  },
  computed: {
    sbiData() {
      return this.oekData && this.oekData.sbi ? this.oekData.sbi : {
        oek_percentage: 0, target_percentage: 0, vs_bulan_lalu_percentage: 0, yoy_percentage: 0
      };
    },
    computedChartData() {
      const baseConfig = { ...this.defaultChartData.chart };
      let trendData = [];
      if (this.oekData && this.oekData.trend) {
        trendData = this.oekData.trend.map(item => ({
          label: item.month_name,
          value: item.total,
          showValue: item.total > 0 ? "1" : "0",
          tooltext: `<b>${item.month_name}</b>: ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(item.total)}%`
        }));
      }
      return {
        chart: baseConfig,
        data: trendData.length ? trendData : this.defaultChartData.data
      };
    }
  },
  methods: {
    formatPercent(val) {
      if (val == null) return '0%';
      return val + '%';
    },
    formatVs(val) {
      if (val == null) return '0%';
      return (val > 0 ? '+' : '') + val + '%';
    },
    getColor(val) {
      if (val == null) return 'text-secondary';
      return val >= 0 ? 'text-success' : 'text-danger';
    }
  }
}
</script>

<style scoped>
.text-brown {
  color: #8B4513;
}
</style>
