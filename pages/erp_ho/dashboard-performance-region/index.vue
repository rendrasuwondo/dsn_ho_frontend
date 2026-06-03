<template>
  <div class="dashboard-performance-region">
    <div class="tv-container d-flex flex-column">

      <!-- Header -->
      <div class="header-section text-center d-flex flex-column justify-content-center align-items-center mb-2 flex-shrink-0">
        <h1 class="main-title mb-1">DASHBOARD KINERJA BULANAN PKS: OPTIMALISASI PABRIK KELAPA SAWIT</h1>
        <h4 class="sub-title text-muted mb-2">MONTHLY PKS PERFORMANCE DASHBOARD</h4>
        <div class="month-selector mt-1 shadow-sm">
          {{ displayTitle }}
        </div>
      </div>

      <!-- Content -->
      <div class="content-section flex-grow-1 d-flex flex-column" style="min-height: 0;">

        <!-- Top Row (4 items) -->
        <div class="row flex-grow-1 mb-2 mx-0">
          <div class="col-12 col-md-6 col-xl-3 mb-3 pl-xl-0 pr-xl-2 px-2">
            <DashboardPerformanceRegionCardTbs :tbsData="tbsData" :isLoading="$fetchState.pending" />
          </div>
          <div class="col-12 col-md-6 col-xl-3 mb-3 px-2">
            <DashboardPerformanceRegionCardCpo :cpoData="cpoData" :isLoading="$fetchState.pending" />
          </div>
          <div class="col-12 col-md-6 col-xl-3 mb-3 px-2">
            <DashboardPerformanceRegionCardOer :oerData="oerData" :isLoading="$fetchState.pending" />
          </div>
          <div class="col-12 col-md-6 col-xl-3 mb-3 pr-xl-0 pl-xl-2 px-2">
            <DashboardPerformanceRegionCardKer :kerData="kerData" :isLoading="$fetchState.pending" />
          </div>
        </div>

        <!-- Bottom Row (3 items) -->
        <div class="row flex-grow-1 mb-0 mx-0">
          <div class="col-12 col-lg-6 col-xl-4 mb-3 mb-xl-0 pl-xl-0 pr-xl-2 px-2">
            <DashboardPerformanceRegionCardTbsDetail />
          </div>
          <div class="col-12 col-lg-6 col-xl-5 mb-3 mb-xl-0 px-2">
            <DashboardPerformanceRegionCardCpoDetail />
          </div>
          <div class="col-12 col-xl-3 mb-3 mb-xl-0 pr-xl-0 pl-xl-2 px-2">
            <DashboardPerformanceRegionCardOek :oekData="oekData" :isLoading="$fetchState.pending" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  layout: 'performance-region',
  head() {
    return {
      title: 'Dashboard - Kinerja Bulanan PKS'
    }
  },
  data() {
    return {
      displayTitle: 'BULAN: MEMUAT...',
      tbsData: null,
      cpoData: null,
      oerData: null,
      kerData: null,
      oekData: null
    }
  },
  async fetch() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = currentYear - 1;
    }

    const monthNames = [
      "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
      "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
    ];
    const prevMonthName = monthNames[prevMonth - 1];
    this.displayTitle = `BULAN: ${prevMonthName} ${prevYear}`;

    try {
      const [resTbs, resCpo, resOer, resKer, resOek] = await Promise.all([
        this.$axios.$get(`/api/agro-dashboard-web/public/tbs-masuk?year=${prevYear}&month=${prevMonth}`).catch(() => null),
        this.$axios.$get(`/api/agro-dashboard-web/public/produksi-cpo?year=${prevYear}&month=${prevMonth}`).catch(() => null),
        this.$axios.$get(`/api/agro-dashboard-web/public/oer?year=${prevYear}&month=${prevMonth}`).catch(() => null),
        this.$axios.$get(`/api/agro-dashboard-web/public/ker?year=${prevYear}&month=${prevMonth}`).catch(() => null),
        this.$axios.$get(`/api/agro-dashboard-web/public/oek?year=${prevYear}&month=${prevMonth}`).catch(() => null)
      ]);

      if (resTbs && resTbs.status === 'success' && resTbs.data) {
        this.tbsData = resTbs.data.tbs_masuk;
      }

      if (resCpo && resCpo.status === 'success' && resCpo.data) {
        this.cpoData = resCpo.data.produksi_cpo;
      }

      if (resOer && resOer.status === 'success' && resOer.data) {
        this.oerData = resOer.data.oer;
      }

      if (resKer && resKer.status === 'success' && resKer.data) {
        this.kerData = resKer.data.ker;
      }

      if (resOek && resOek.status === 'success' && resOek.data) {
        this.oekData = resOek.data.oek;
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  }
}
</script>

<style>
/* Unscoped styles so child components inherit properly inside .dashboard-performance-region */
.dashboard-performance-region {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  font-family: 'Quicksand', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;

  /* Modern Premium Background */
  background: radial-gradient(circle at top left, #f1f5f9 0%, #e2e8f0 100%);
  position: relative;
}

/* Semi-transparent pattern for texture */
.dashboard-performance-region::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 1;
}

.dashboard-performance-region .tv-container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 1.5rem 1rem;
}

@media (min-width: 1200px) {
  .dashboard-performance-region .tv-container {
    padding: 0.5rem 1.5rem;
  }
}

/* Typography */
.dashboard-performance-region .main-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
}
@media (min-width: 992px) {
  .dashboard-performance-region .main-title {
    font-size: 2rem;
  }
}

.dashboard-performance-region .sub-title {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #475569 !important;
}
@media (min-width: 992px) {
  .dashboard-performance-region .sub-title {
    font-size: 1.1rem;
  }
}

.dashboard-performance-region .month-selector {
  background: #ffffff;
  color: #0f172a;
  padding: 0.5rem 1.8rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
}

/* Glassmorphism Cards */
.dashboard-performance-region .glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

@media (max-width: 1199.98px) {
  .dashboard-performance-region .glass-card {
    min-height: 320px;
  }
}

.dashboard-performance-region .kpi-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1e293b;
}

.dashboard-performance-region .kpi-value {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.1;
  color: #0f172a;
}
.dashboard-performance-region .kpi-value-large {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1;
  color: #0f172a;
}

.dashboard-performance-region .kpi-target {
  font-size: 0.9rem;
}
.dashboard-performance-region .kpi-vs {
  font-size: 0.85rem;
}

.dashboard-performance-region .bg-light-blue {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
}
.dashboard-performance-region .bg-light-gray {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
}

.dashboard-performance-region .text-brown {
  color: #8b4513;
}

.dashboard-performance-region .chart-wrapper {
  position: relative;
  min-height: 100px;
  flex: 1 1 auto;
}
</style>
