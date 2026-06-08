<template>
  <div class="glass-card h-100 p-3 d-flex flex-column">
    <div class="d-flex align-items-start mb-2">
      <i class="fas fa-bullseye text-danger mr-2" style="font-size: 1.5rem; margin-top: 2px;"></i>
      <div style="line-height: 1.2;">
        <h5 class="kpi-title mb-0">KER %</h5>
        <small class="text-muted font-weight-bold" style="font-size: 0.75rem;">(KERNEL EXTRACTION RATE %)</small>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex-grow-1 d-flex flex-column justify-content-center">
      <b-skeleton width="60%" height="2rem" class="mb-2 mx-auto"></b-skeleton>
      <b-skeleton width="40%" class="mb-3 mx-auto"></b-skeleton>
      <hr class="w-100 my-2" style="border-top: 1px dashed #cbd5e1;">
      <b-skeleton width="60%" height="2rem" class="mb-2 mx-auto"></b-skeleton>
      <b-skeleton width="40%" class="mx-auto"></b-skeleton>
    </div>
    
    <div v-else class="flex-grow-1 d-flex flex-column justify-content-between text-center w-100">
      <!-- BULAN INI (BI / sb) -->
      <div class="kpi-section pb-1">
        <div class="text-muted font-weight-bold mb-1" style="font-size: 0.75rem;">BULAN INI (BI)</div>
        <div class="kpi-value-large text-dark mb-1" style="font-size: 1.8rem; line-height: 1;">{{ formatPercent(sbData.ker_percentage) }}</div>
        <div class="kpi-target text-muted mb-2 font-weight-bold" style="font-size: 0.8rem;">TARGET: {{ formatPercent(sbData.target_percentage) }}</div>
        <div class="kpi-vs-box bg-light-gray py-1 px-2 rounded shadow-sm mx-auto d-inline-block">
          <div class="font-weight-bold" :class="getColor(sbData.vs_bulan_lalu_percentage)" style="font-size:0.85rem;">
            {{ formatVs(sbData.vs_bulan_lalu_percentage) }} vs BLN LALU
          </div>
          <div class="text-muted font-weight-bold" style="font-size: 0.75rem;">({{ formatVs(sbData.yoy_percentage) }} YoY)</div>
        </div>
      </div>
      
      <hr class="w-100 my-2" style="border-top: 1px dashed #cbd5e1; margin: 0;">
      
      <!-- SAMPAI BULAN INI (SBI / sbi) -->
      <div class="kpi-section pt-1">
        <div class="text-muted font-weight-bold mb-1" style="font-size: 0.75rem;">SAMPAI BULAN INI (SBI)</div>
        <div class="kpi-value-large text-dark mb-1" style="font-size: 1.8rem; line-height: 1;">{{ formatPercent(sbiData.ker_percentage) }}</div>
        <div class="kpi-target text-muted mb-2 font-weight-bold" style="font-size: 0.8rem;">TARGET: {{ formatPercent(sbiData.target_percentage) }}</div>
        <div class="kpi-vs-box bg-light-gray py-1 px-2 rounded shadow-sm mx-auto d-inline-block">
          <div class="font-weight-bold" :class="getColor(sbiData.vs_bulan_lalu_percentage)" style="font-size:0.85rem;">
            {{ formatVs(sbiData.vs_bulan_lalu_percentage) }} vs BLN LALU
          </div>
          <div class="text-muted font-weight-bold" style="font-size: 0.75rem;">({{ formatVs(sbiData.yoy_percentage) }} YoY)</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPerformanceRegionCardKer',
  props: {
    kerData: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    sbData() {
      return this.kerData && this.kerData.sb ? this.kerData.sb : {
        ker_percentage: 0, target_percentage: 0, vs_bulan_lalu_percentage: 0, yoy_percentage: 0
      };
    },
    sbiData() {
      return this.kerData && this.kerData.sbi ? this.kerData.sbi : {
        ker_percentage: 0, target_percentage: 0, vs_bulan_lalu_percentage: 0, yoy_percentage: 0
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
.bg-light-gray {
  background-color: #f1f5f9;
}
.kpi-value-large {
  font-weight: 800;
  letter-spacing: -1px;
}
</style>
