<template>
  <div class="glass-card h-100 p-3 d-flex flex-column justify-content-center align-items-center">
    <h5 class="kpi-title text-center mb-4"><i class="fas fa-bullseye text-danger mr-2"></i> KER <br><small class="text-muted">(KERNEL EXTRACTION RATE %)</small></h5>
    <div class="text-center w-100">
      <div class="kpi-value-large text-dark mb-2">4.5%</div>
      <div class="kpi-target text-muted mb-4 font-weight-bold">TARGET: 4.5%</div>
      <div class="kpi-vs-box bg-light-gray p-3 rounded shadow-sm mx-auto" style="max-width: 80%;">
        <div class="font-weight-bold text-secondary" style="font-size:1.1rem;">VS TAHUN LALU:</div>
        <div class="text-muted font-weight-bold">(+0.4% YoY)</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPerformanceRegionCardKer'
}
</script>
