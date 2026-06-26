<template>
  <div class="glass-card h-100 p-3 d-flex flex-column">
    <div class="d-flex align-items-start mb-3">
      <i
        class="fas fa-tint text-warning mr-2"
        style="font-size: 1.5rem; margin-top: 2px"
      ></i>
      <div style="line-height: 1.2">
        <h5 class="kpi-title mb-0">PRODUKSI CPO</h5>
        <small class="text-muted font-weight-bold" style="font-size: 0.75rem"
          >(CPO PRODUCTION)</small
        >
      </div>
    </div>
    <div class="kpi-data flex-shrink-0">
      <div v-if="isLoading" class="py-2">
        <b-skeleton width="70%" height="2.5rem" class="mb-2"></b-skeleton>
        <b-skeleton width="40%"></b-skeleton>
      </div>
      <div v-else class="d-flex justify-content-between align-items-start">
        <div>
          <div class="kpi-value text-dark">
            {{ formattedTotalTonase }}
            <span style="font-size: 1.2rem">TON</span>
          </div>
          <div class="kpi-vs mt-1 font-weight-bold" :class="yoyColorClass">
            VS TAHUN LALU: ({{ formattedYoy }} YoY)
          </div>
        </div>
        <div
          class="badge px-3 py-2 rounded-pill shadow-sm"
          :class="targetBadgeClass"
          style="font-size: 0.9rem"
        >
          {{ formattedTarget }} DARI<br />TARGET
        </div>
      </div>
    </div>
    <div class="chart-wrapper flex-grow-1 mt-3 position-relative">
      <div
        v-if="isLoading"
        class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
      >
        <b-spinner variant="warning"></b-spinner>
      </div>
      <client-only v-else>
        <fusioncharts
          type="area2d"
          width="100%"
          height="100%"
          dataFormat="json"
          :dataSource="computedChartData"
        ></fusioncharts>
        <template #placeholder>
          <div
            class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
          >
            <b-spinner variant="warning"></b-spinner>
          </div>
        </template>
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPerformanceRegionCardCpo',
  props: {
    cpoData: {
      type: Object,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const commonChartConfig = {
      theme: 'fusion',
      showBorder: '0',
      bgColor: '#ffffff',
      bgAlpha: '0',
      canvasBgAlpha: '0',
      showValues: '0',
      showHoverEffect: '1',
      baseFont: 'Quicksand',
      baseFontSize: '12',
      showToolTip: '1',
      toolTipBgColor: '#ffffff',
      toolTipBorderColor: '#e2e8f0',
      plotHoverEffect: '1',
    }
    return {
      defaultChartData: {
        chart: {
          ...commonChartConfig,
          paletteColors: '#f1c40f',
          plotFillAlpha: '40',
          drawAnchors: '1',
          showValues: '1',
          showYAxisValues: '1',
          yAxisMinValue: '0',
          setMinAsZero: '1',
          setAdaptiveYMin: '0',
          yAxisValuesPadding: '5',
          showXAxisLine: '1',
          xAxisLineColor: '#ccc',
          divLineAlpha: '30',
          divLineColor: '#e0e0e0',
          divLineIsDashed: '1',
          adjustDiv: '0',
          chartBottomMargin: '0',
          chartTopMargin: '25',
          chartLeftMargin: '0',
          chartRightMargin: '0',
          formatNumberScale: '1',
          numberScaleValue: '1000',
          numberScaleUnit: 'K',
          decimals: '0',
          anchorRadius: '4',
          anchorBgColor: '#ffffff',
          anchorBorderColor: '#f1c40f',
          anchorBorderThickness: '2',
          valueFontColor: '#0f172a',
          valueFontSize: '9',
          valueFontBold: '1',
        },
        data: [
          { label: 'JUN', value: '15000' },
          { label: 'FEB', value: '14000' },
          { label: 'MAR', value: '18000' },
          { label: 'APR', value: '19000' },
          { label: 'MAI', value: '24000' },
          { label: 'JUN', value: '37200' },
          { label: 'JUL', value: '34000' },
          { label: 'AUG', value: '36000' },
          { label: 'SEC', value: '38000' },
        ],
      },
    }
  },
  computed: {
    formattedTotalTonase() {
      if (!this.cpoData || this.cpoData.total_tonase == null) return '0'
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      }).format(this.cpoData.total_tonase)
    },
    formattedYoy() {
      if (!this.cpoData || this.cpoData.yoy_percentage == null) return '0%'
      const val = this.cpoData.yoy_percentage
      return (val > 0 ? '+' : '') + val + '%'
    },
    yoyColorClass() {
      if (!this.cpoData || this.cpoData.yoy_percentage == null)
        return 'text-secondary'
      return this.cpoData.yoy_percentage >= 0 ? 'text-success' : 'text-danger'
    },
    formattedTarget() {
      if (!this.cpoData || this.cpoData.vs_target_percentage == null)
        return '0%'
      const val = this.cpoData.vs_target_percentage
      return (val > 0 ? '+' : '') + val + '%'
    },
    targetBadgeClass() {
      if (!this.cpoData || this.cpoData.vs_target_percentage == null)
        return 'badge-secondary'
      return this.cpoData.vs_target_percentage >= 0
        ? 'badge-success'
        : 'badge-danger'
    },
    computedChartData() {
      const baseConfig = { ...this.defaultChartData.chart }
      let trendData = []
      let maxVal = 0
      if (this.cpoData && this.cpoData.trend) {
        let lastValidIndex = -1;
        for (let i = this.cpoData.trend.length - 1; i >= 0; i--) {
          if (Number(this.cpoData.trend[i].total) > 0) {
            lastValidIndex = i;
            break;
          }
        }
        
        const monthMap = { 'JAN': 'JAN', 'FEB': 'FEB', 'MAR': 'MAR', 'APR': 'APR', 'MAY': 'MEI', 'MAI': 'MEI', 'JUN': 'JUN', 'JUL': 'JUL', 'AUG': 'AGU', 'AGU': 'AGU', 'SEP': 'SEP', 'OCT': 'OKT', 'OKT': 'OKT', 'NOV': 'NOV', 'DEC': 'DES', 'DES': 'DES' };

        trendData = this.cpoData.trend.map((item, index) => {
          if (item.total > maxVal) maxVal = Number(item.total)
          
          let monthLabel = item.month_name ? item.month_name.toUpperCase() : '';
          if (monthMap[monthLabel]) {
            monthLabel = monthMap[monthLabel];
          } else if (item.month_name) {
            monthLabel = item.month_name;
          }
          
          const val = index <= lastValidIndex ? item.total : null;
          
          return {
            label: monthLabel,
            value: val,
            showValue: item.total > 0 ? '1' : '0',
            tooltext: `<b>${monthLabel}</b>: ${new Intl.NumberFormat(
              'en-US',
              { maximumFractionDigits: 2 }
            ).format(item.total)} TON`,
          }
        })
      }

      if (maxVal > 0) {
        const paddedMax = maxVal * 1.1
        const magnitude = Math.pow(10, Math.floor(Math.log10(paddedMax)))
        const normalized = paddedMax / magnitude
        let niceMultiplier
        if (normalized <= 1.2) niceMultiplier = 1.2
        else if (normalized <= 2) niceMultiplier = 2
        else if (normalized <= 4) niceMultiplier = 4
        else if (normalized <= 6) niceMultiplier = 6
        else if (normalized <= 8) niceMultiplier = 8
        else niceMultiplier = 10

        baseConfig.yAxisMaxValue = (niceMultiplier * magnitude).toString()
        baseConfig.yAxisMinValue = '0'
        baseConfig.numDivLines = '3'
        baseConfig.adjustDiv = '0'
      }

      return {
        chart: baseConfig,
        data: trendData.length ? trendData : this.defaultChartData.data,
      }
    },
  },
}
</script>
