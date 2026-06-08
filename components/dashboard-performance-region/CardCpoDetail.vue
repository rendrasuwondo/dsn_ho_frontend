<template>
  <div class="glass-card h-100 p-3 d-flex flex-column">
    <div class="d-flex align-items-center justify-content-center mb-1">
      <i class="fas fa-chart-line text-warning fa-2x mr-3"></i>
      <div>
        <h5 class="kpi-title mb-0">DETAIL PRODUKSI CPO</h5>
        <small class="text-muted text-uppercase font-weight-bold">(Detailed CPO Analysis)</small>
      </div>
    </div>
    <h6 class="text-center font-weight-bold mt-1 mb-0">PRODUKSI CPO PKS <small class="text-muted">(BEST TO WORST PKS)</small></h6>
    <div class="text-center text-muted small mb-1 font-weight-bold">PKS Terbaik ke Terpuruk</div>
    <div class="chart-wrapper flex-grow-1 position-relative mt-1">
      <div v-if="isLoading" class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
        <b-spinner variant="warning"></b-spinner>
      </div>
      <client-only v-else>
        <fusioncharts type="mscolumn2d" width="100%" height="100%" dataFormat="json" :dataSource="computedChartData"></fusioncharts>
        <template #placeholder>
          <div class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
            <b-spinner variant="warning"></b-spinner>
          </div>
        </template>
      </client-only>
    </div>
    
    <!-- Custom Legend -->
    <div class="d-flex justify-content-center flex-wrap mt-1 text-muted" style="font-size: 0.75rem;">
      <div class="d-flex align-items-center mr-3 mb-1">
        <strong class="mr-1">Kiri (Target):</strong>
        <span style="display:inline-block; width:12px; height:12px; background-color:#1e8449; border-radius:2px;"></span>
      </div>
      <div class="d-flex align-items-center mb-1">
        <strong class="mr-1">Kanan (Aktual):</strong>
        <span style="display:inline-block; width:12px; height:12px; background-color:#82e0aa; border-radius:2px;"></span>
        <span class="ml-1">≥100%</span>
        <span class="ml-2" style="display:inline-block; width:12px; height:12px; background-color:#f1c40f; border-radius:2px;"></span>
        <span class="ml-1">95-99%</span>
        <span class="ml-2" style="display:inline-block; width:12px; height:12px; background-color:#e74c3c; border-radius:2px;"></span>
        <span class="ml-1">&lt;95%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPerformanceRegionCardCpoDetail',
  props: {
    cpoDetailData: {
      type: Array,
      default: () => null
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const commonChartConfig = {
      theme: "fusion", showBorder: "0", bgColor: "#ffffff", bgAlpha: "0", canvasBgAlpha: "0",
      showValues: "1", showHoverEffect: "1", baseFont: "Quicksand", baseFontSize: "12",
      showToolTip: "1", toolTipBgColor: "#ffffff", toolTipBorderColor: "#e2e8f0", plotHoverEffect: "1",
    };
    return {
      defaultChartData: {
        chart: {
          ...commonChartConfig,
          valueFontColor: "#000", valueFontBold: "1", valueFontSize: "8",
          plotSpacePercent: "15", showYAxisValues: "1", yAxisValuesPadding: "5", divLineAlpha: "30",
          divLineColor: "#e0e0e0", divLineIsDashed: "1", formatNumberScale: "1", numberScaleValue: "1000",
          numberScaleUnit: "K", decimals: "1", chartBottomMargin: "0", chartTopMargin: "30", chartLeftMargin: "0", chartRightMargin: "0",
          showLegend: "0"
        },
        categories: [ { category: [] } ],
        dataset: [
          { seriesname: "Target", data: [] },
          { seriesname: "Aktual", data: [] }
        ]
      }
    }
  },
  computed: {
    computedChartData() {
      const baseConfig = { ...this.defaultChartData.chart };
      
      if (!this.cpoDetailData || this.cpoDetailData.length === 0) {
        return this.defaultChartData;
      }

      let categories = [];
      let actualData = [];
      let planData = [];
      let maxVal = 0;

      this.cpoDetailData.forEach(item => {
        if (item.plan > maxVal) maxVal = Number(item.plan);
        if (item.actual > maxVal) maxVal = Number(item.actual);

        categories.push({ label: item.department_code });
        
        planData.push({ 
          value: item.plan,
          color: "#1e8449", // dark green
          tooltext: `<b>${item.department_code} Target</b>: ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(item.plan)} TON`
        });

        let actualColor = "#e74c3c"; // red
        if (item.percentage >= 100) {
          actualColor = "#82e0aa"; // light green
        } else if (item.percentage >= 95) {
          actualColor = "#f1c40f"; // yellow
        }

        actualData.push({
          value: item.actual,
          color: actualColor,
          tooltext: `<b>${item.department_code} Aktual</b>: ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(item.actual)} TON<br>Persentase: ${item.percentage}%`
        });
      });

      if (maxVal > 0) {
        // Add 30% headroom to ensure values are placed above the tallest bars
        baseConfig.yAxisMaxValue = Math.ceil(maxVal * 1.3).toString();
      }

      return {
        chart: baseConfig,
        categories: [ { category: categories } ],
        dataset: [
          { seriesname: "Target", data: planData },
          { seriesname: "Aktual", data: actualData }
        ]
      };
    }
  }
}
</script>
