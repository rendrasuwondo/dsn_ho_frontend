<!-- pages\erp_ho\dashboard-performance-region\index.vue -->
<template>
  <div class="dashboard-performance-region">
    <div class="tv-container d-flex flex-column">
      <!-- Header (Selalu Tampil) -->
      <div
        class="header-section text-center d-flex flex-column justify-content-center align-items-center flex-shrink-0"
      >
        <h1 class="main-title mb-1">
          DASHBOARD KINERJA BULANAN PKS: OPTIMALISASI PABRIK KELAPA SAWIT
        </h1>
        <h4 class="sub-title text-muted mb-2">
          MONTHLY PKS PERFORMANCE DASHBOARD
        </h4>
        <div class="month-selector mt-1 shadow-sm">
          {{ displayTitle }}
        </div>
      </div>

      <!-- Slideshow Container (Hanya Content yang digeser) -->
      <div class="slideshow-wrapper">
        <!-- Slide 1: Map -->
        <div class="slide-item map-section" :class="slideStates[1]">
          <img
            src="/img/dashboard/Peta.png"
            alt="Peta Dashboard"
            class="peta-image"
          />
        </div>

        <!-- Slide 2: Dashboard Content -->
        <div class="slide-item content-section" :class="slideStates[2]">
          <!-- Top Row (4 items) -->
            <div class="row row-top mx-0">
              <div class="col-12 col-md-6 col-xl-3 dash-col">
                <DashboardPerformanceRegionCardTbs
                  :tbsData="tbsData"
                  :isLoading="$fetchState.pending"
                />
              </div>
              <div class="col-12 col-md-6 col-xl-3 dash-col">
                <DashboardPerformanceRegionCardCpo
                  :cpoData="cpoData"
                  :isLoading="$fetchState.pending"
                />
              </div>
              <div class="col-12 col-md-6 col-xl-3 dash-col">
                <DashboardPerformanceRegionCardOer
                  :oerData="oerData"
                  :isLoading="$fetchState.pending"
                />
              </div>
              <div class="col-12 col-md-6 col-xl-3 dash-col">
                <DashboardPerformanceRegionCardKer
                  :kerData="kerData"
                  :isLoading="$fetchState.pending"
                />
              </div>
            </div>

            <!-- Bottom Row (3 items) -->
            <div class="row row-bottom mx-0">
              <div class="col-12 col-lg-6 col-xl-4 dash-col">
                <DashboardPerformanceRegionCardTbsDetail
                  :tbsDetailData="tbsDetailData"
                  :isLoading="$fetchState.pending"
                />
              </div>
              <div class="col-12 col-lg-6 col-xl-5 dash-col">
                <DashboardPerformanceRegionCardCpoDetail
                  :cpoDetailData="cpoDetailData"
                  :isLoading="$fetchState.pending"
                />
              </div>
              <div class="col-12 col-xl-3 dash-col">
                <DashboardPerformanceRegionCardOek
                  :oekData="oekData"
                  :isLoading="$fetchState.pending"
                />
              </div>
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
      title: 'Dashboard - Kinerja Bulanan PKS',
    }
  },
  data() {
    return {
      displayTitle: 'BULAN: MEMUAT...',
      tbsData: null,
      cpoData: null,
      oerData: null,
      kerData: null,
      oekData: null,
      tbsDetailData: null,
      cpoDetailData: null,
      refreshInterval: null,
      slideStates: {
        1: 'slide-active',
        2: 'slide-enter-right'
      },
      slide1Duration: 5000, // Waktu tayang Slide 1 (Peta) dalam ms -> 5 detik
      slide2Duration: 30000, // Waktu tayang Slide 2 (Dashboard) dalam ms -> 1 menit
      slideTimer: null,
      animationTimer: null,
    }
  },
  async fetch() {
    await this.loadDashboardData()
  },
  mounted() {
    // Refresh data silently every 1 hour (3600000 milliseconds)
    this.refreshInterval = setInterval(() => {
      this.loadDashboardData()
    }, 3600000) //1 jam

    // Mulai Slideshow
    this.startSlideshow()
  },
  beforeDestroy() {
    // Clear the interval when user navigates away from this page
    if (this.refreshInterval) clearInterval(this.refreshInterval)
    if (this.slideTimer) clearTimeout(this.slideTimer)
    if (this.animationTimer) clearTimeout(this.animationTimer)
  },
  methods: {
    startSlideshow() {
      this.slideStates = { 1: 'slide-active', 2: 'slide-enter-right' }
      this.scheduleNextSlide(1, this.slide1Duration)
    },
    scheduleNextSlide(currentSlide, delay) {
      if (this.slideTimer) clearTimeout(this.slideTimer)
      this.slideTimer = setTimeout(() => {
        this.transitionToNext(currentSlide)
      }, delay)
    },
    transitionToNext(currentSlide) {
      const nextSlide = currentSlide === 1 ? 2 : 1
      const nextDuration = nextSlide === 1 ? this.slide1Duration : this.slide2Duration

      this.slideStates = {
        ...this.slideStates,
        [currentSlide]: 'slide-exit-left',
        [nextSlide]: 'slide-active'
      }

      if (this.animationTimer) clearTimeout(this.animationTimer)
      this.animationTimer = setTimeout(() => {
        this.slideStates = {
          ...this.slideStates,
          [currentSlide]: 'slide-enter-right'
        }
        this.scheduleNextSlide(nextSlide, nextDuration)
      }, 1000) // 1000ms transition time
    },
    async loadDashboardData() {
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth() + 1

      let prevMonth = currentMonth - 1
      let prevYear = currentYear
      if (prevMonth === 0) {
        prevMonth = 12
        prevYear = currentYear - 1
      }

      const monthNames = [
        'JANUARI',
        'FEBRUARI',
        'MARET',
        'APRIL',
        'MEI',
        'JUNI',
        'JULI',
        'AGUSTUS',
        'SEPTEMBER',
        'OKTOBER',
        'NOVEMBER',
        'DESEMBER',
      ]
      const prevMonthName = monthNames[prevMonth - 1]
      this.displayTitle = `BULAN: ${prevMonthName} ${prevYear}`

      try {
        const [
          resTbs,
          resCpo,
          resOer,
          resKer,
          resOek,
          resTbsDetail,
          resCpoDetail,
        ] = await Promise.all([
          this.$axios
            .$get(
              `/api/agro-dashboard-web/public/tbs-masuk?year=${prevYear}&month=${prevMonth}`
            )
            .catch(() => null),
          this.$axios
            .$get(
              `/api/agro-dashboard-web/public/produksi-cpo?year=${prevYear}&month=${prevMonth}`
            )
            .catch(() => null),
          this.$axios
            .$get(
              `/api/agro-dashboard-web/public/oer?year=${prevYear}&month=${prevMonth}`
            )
            .catch(() => null),
          this.$axios
            .$get(
              `/api/agro-dashboard-web/public/ker?year=${prevYear}&month=${prevMonth}`
            )
            .catch(() => null),
          this.$axios
            .$get(
              `/api/agro-dashboard-web/public/oek?year=${prevYear}&month=${prevMonth}`
            )
            .catch(() => null),
          this.$axios
            .$get(
              `/api/agro-dashboard-web/public/detail-produksi-tbs?year=${prevYear}&month=${prevMonth}`
            )
            .catch(() => null),
          this.$axios
            .$get(
              `/api/agro-dashboard-web/public/detail-produksi-cpo?year=${prevYear}&month=${prevMonth}`
            )
            .catch(() => null),
        ])

        if (resTbs && resTbs.status === 'success' && resTbs.data) {
          this.tbsData = resTbs.data.tbs_masuk
        }

        if (resCpo && resCpo.status === 'success' && resCpo.data) {
          this.cpoData = resCpo.data.produksi_cpo
        }

        if (resOer && resOer.status === 'success' && resOer.data) {
          this.oerData = resOer.data.oer
        }

        if (resKer && resKer.status === 'success' && resKer.data) {
          this.kerData = resKer.data.ker
        }

        if (resOek && resOek.status === 'success' && resOek.data) {
          this.oekData = resOek.data.oek
        }

        if (
          resTbsDetail &&
          resTbsDetail.status === 'success' &&
          resTbsDetail.data
        ) {
          this.tbsDetailData = resTbsDetail.data.detail_produksi_tbs
        }

        if (
          resCpoDetail &&
          resCpoDetail.status === 'success' &&
          resCpoDetail.data
        ) {
          this.cpoDetailData = resCpoDetail.data.detail_produksi_cpo
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
    },
  },
}
</script>

<style>
/* ============================================================
   SLIDESHOW ANIMATION & WRAPPER
   ============================================================ */
.slideshow-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  width: 100%;
  flex: 1 1 auto;
  overflow: hidden;
}
.slide-item {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  width: 100%;
}
.map-section {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
.peta-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Mencegah gambar terpotong */
}

/* Animasi Slide Pure CSS (Tanpa v-show) */
.slide-active {
  transform: translateX(0%);
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s;
  opacity: 1;
  pointer-events: auto;
  z-index: 2;
}
.slide-exit-left {
  transform: translateX(-100%);
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s;
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}
.slide-enter-right {
  transform: translateX(100%);
  transition: none; /* INSTANT TELEPORT, tanpa animasi */
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}

/* ============================================================
   BASE (MOBILE FIRST) — selalu boleh scroll
   ============================================================ */
.dashboard-performance-region {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  font-family: 'Quicksand', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
  background: radial-gradient(circle at top left, #f1f5f9 0%, #e2e8f0 100%);
  position: relative;
  box-sizing: border-box;
}
.dashboard-performance-region *,
.dashboard-performance-region *::before,
.dashboard-performance-region *::after {
  box-sizing: border-box;
}

/* Tekstur grid */
.dashboard-performance-region::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(148, 163, 184, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 1;
  pointer-events: none;
}

.dashboard-performance-region .tv-container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 1.25rem 1rem;
}

.dashboard-performance-region .header-section {
  margin-bottom: 0.5rem;
}

/* Kolom: jarak horizontal saja, margin vertikal dikontrol di sini */
.dashboard-performance-region .dash-col {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-bottom: 0.75rem;
}

@media (max-width: 1199.98px) {
  .dashboard-performance-region .glass-card {
    min-height: 320px;
  }
}

/* ============================================================
   DESKTOP / TV (>=1200px) — MODE NYAMAN (TIDAK FULLSCREEN)
   Tinggi baris mengikuti isi (flex:1 1 auto), TIDAK dipaksa 50/50.
   Kartu tidak akan pernah lebih pendek dari isinya -> tidak kepotong.
   Kalau total tidak muat, halaman boleh scroll.
   ============================================================ */
@media (min-width: 1200px) {
  .dashboard-performance-region {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .dashboard-performance-region .tv-container {
    height: auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: clamp(0.5rem, 1vh, 1rem);
    padding: clamp(0.6rem, 1.3vh, 1.5rem) clamp(0.75rem, 1.4vw, 2rem);
  }

  .dashboard-performance-region .header-section {
    flex: 0 0 auto;
    margin-bottom: 0 !important;
  }

  .dashboard-performance-region .content-section {
    display: flex;
    flex-direction: column;
    gap: clamp(0.5rem, 1vh, 1rem);
  }

  /* basis AUTO = ikut isi (bukan 0) -> tidak memaksa tinggi separuh */
  .dashboard-performance-region .row-top,
  .dashboard-performance-region .row-bottom {
    flex: 1 1 auto;
    min-height: 0;
    margin: 0;
  }

  .dashboard-performance-region .dash-col {
    margin-bottom: 0;
    padding-left: clamp(0.25rem, 0.5vw, 0.6rem);
    padding-right: clamp(0.25rem, 0.5vw, 0.6rem);
    display: flex;
  }

  .dashboard-performance-region .glass-card {
    width: 100%;
    height: 100%; /* stretch ke tinggi baris (= isi kartu tertinggi) */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: clamp(0.6rem, 1.3vh, 1.1rem) !important;
  }

  .dashboard-performance-region .chart-wrapper {
    flex: 1 1 auto;
    min-height: 150px;
  }

  /* --- TIPOGRAFI BERBASIS VH (override inline style pakai !important) --- */
  .dashboard-performance-region .main-title {
    font-size: clamp(1.2rem, 2.4vh, 3rem) !important;
  }
  .dashboard-performance-region .sub-title {
    font-size: clamp(0.7rem, 1.2vh, 1.4rem) !important;
  }
  .dashboard-performance-region .month-selector {
    font-size: clamp(0.7rem, 1.3vh, 1.4rem) !important;
    padding: clamp(0.2rem, 0.6vh, 0.6rem) clamp(0.8rem, 1.6vw, 2rem) !important;
  }
  .dashboard-performance-region .kpi-title {
    font-size: clamp(0.8rem, 1.5vh, 1.6rem) !important;
  }
  .dashboard-performance-region .kpi-value {
    font-size: clamp(1.3rem, 2.8vh, 3rem) !important;
  }
  .dashboard-performance-region .kpi-value-large {
    font-size: clamp(1.2rem, 2.6vh, 3rem) !important;
  }
  .dashboard-performance-region .kpi-target {
    font-size: clamp(0.65rem, 1.1vh, 1.1rem) !important;
  }
  .dashboard-performance-region .kpi-vs {
    font-size: clamp(0.65rem, 1.1vh, 1.1rem) !important;
  }
}

/* ============================================================
   MODE FULLSCREEN — PAKSA MUAT 1 LAYAR (tanpa scroll)
   Hanya di sini baris memakai flex:1 1 0 + rantai min-height:0
   sehingga kartu menyusut agar pas dalam tinggi layar.
   Layar fullscreen cukup tinggi, jadi isi tetap muat & rapi.
   ============================================================ */
.dashboard-performance-region:fullscreen,
.dashboard-performance-region:-webkit-full-screen {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}
.dashboard-performance-region:fullscreen .tv-container,
.dashboard-performance-region:-webkit-full-screen .tv-container {
  height: 100vh;
  min-height: 0;
}
.dashboard-performance-region:fullscreen .slideshow-wrapper,
.dashboard-performance-region:-webkit-full-screen .slideshow-wrapper {
  flex: 1 1 auto;
  min-height: 0;
}
.dashboard-performance-region:fullscreen .content-section,
.dashboard-performance-region:-webkit-full-screen .content-section {
  min-height: 0;
}
.dashboard-performance-region:fullscreen .row-top,
.dashboard-performance-region:fullscreen .row-bottom,
.dashboard-performance-region:-webkit-full-screen .row-top,
.dashboard-performance-region:-webkit-full-screen .row-bottom {
  flex: 1 1 0; /* paksa bagi rata 50/50 agar muat 1 layar */
  min-height: 0;
}
.dashboard-performance-region:fullscreen .dash-col,
.dashboard-performance-region:-webkit-full-screen .dash-col {
  height: 100%;
  min-height: 0;
}
.dashboard-performance-region:fullscreen .glass-card,
.dashboard-performance-region:-webkit-full-screen .glass-card {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
.dashboard-performance-region:fullscreen .chart-wrapper,
.dashboard-performance-region:-webkit-full-screen .chart-wrapper {
  min-height: 0 !important;
}

/* ============================================================
   KARTU & ELEMEN VISUAL (default)
   ============================================================ */
.dashboard-performance-region .main-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8);
  margin-bottom: 0.25rem;
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

.dashboard-performance-region .glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08),
    0 8px 10px -6px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-performance-region .kpi-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1e293b;
}
.dashboard-performance-region .kpi-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.1;
  color: #0f172a;
}
.dashboard-performance-region .kpi-value-large {
  font-size: 2.6rem;
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
