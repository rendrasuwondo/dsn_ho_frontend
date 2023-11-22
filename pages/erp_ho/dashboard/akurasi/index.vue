<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-industry"></i> PT
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <FilterBar />
          <div class="container mb-2">
            <div class="row d-flex justify-items-center align-items-center">
              <div class="col">
                <a href="javascript:;"
                  class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Akurasi RKH</h5>
                    <p class="card-text">96.2%</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="mb-2 ml-2 mr-2">
            <no-ssr>
              <b-row>
                <b-col cols="6">
                  <div class="chart-container-janjang">
                    <div class="card card-outline card-info">
                      <div class="card-body">
                        <fusioncharts
                          :type="chart.janjang.type"
                          :width="chart.janjang.width"
                          :height="chart.janjang.height"
                          :dataformat="chart.janjang.dataFormat"
                          :dataSource="chart.janjang.dataSource"
                        >
                        </fusioncharts>
                      </div>
                    </div>
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="chart-container-tonase">
                    <div class="card card-outline card-info">
                      <div class="card-body">
                        <fusioncharts
                          :type="chart.tonase.type"
                          :width="chart.tonase.width"
                          :height="chart.tonase.height"
                          :dataformat="chart.tonase.dataFormat"
                          :dataSource="chart.tonase.dataSource"
                        >
                        </fusioncharts>
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </no-ssr>
          </div>
          <div class="mb-2 ml-2 mr-2">
            <b-row class="justify-content-center">
              <b-col cols="6">
                <div class="form-group">
                  <multiselect
                    v-model="department_id"
                    :options="department"
                    label="code"
                    track-by="id"
                    :searchable="true"
                    placeholder="Detail"
                    @input="changeDetail"
                  ></multiselect>
                </div>
              </b-col>
            </b-row>
          </div>
          <div class="mb-2 ml-2 mr-2">
            <no-ssr>
              <b-row>
                <b-col cols="6">
                  <div class="chart-container-detail-janjang">
                    <div class="card card-outline card-info">
                      <div class="card-body">
                        <fusioncharts
                          :type="chart.detail_janjang.type"
                          :width="chart.detail_janjang.width"
                          :height="chart.detail_janjang.height"
                          :dataformat="chart.detail_janjang.dataFormat"
                          :dataSource="chart.detail_janjang.dataSource"
                        >
                        </fusioncharts>
                      </div>
                    </div>
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="chart-container-detail-tonase">
                    <div class="card card-outline card-info">
                      <div class="card-body">
                        <fusioncharts
                          :type="chart.detail_tonase.type"
                          :width="chart.detail_tonase.width"
                          :height="chart.detail_tonase.height"
                          :dataformat="chart.detail_tonase.dataFormat"
                          :dataSource="chart.detail_tonase.dataSource"
                        >
                        </fusioncharts>
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </no-ssr>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  computed: {
    queryStringState() {
      return this.$store.state.queryString
    },
  },
  head() {
    return {
      title: 'PT',
    }
  },
  data() {
    return {
      afdeling: this.$store.state.afdeling,
      department: this.$store.state.department,
      company: this.$store.state.company,
      afdeling_id: this.$store.state.afdeling_id,
      department_id: this.$store.state.department_id,
      company_id: this.$store.state.company_id,
      puhus_id: null,
      puhus_tonase_id: null,
    }
  },
  watchQuery: [],
  async asyncData({ $axios, query, store }) {
    function currentDate() {
      const current = new Date()
      current.setDate(current.getDate())
      const date = `${current.getFullYear()}-${current.getMonth() + 1}-${
        current.getDate() - 1
      }`

      return date
    }

    // query params
    let queryParams = store.state.queryString

    //activitied_at_prepend
    let activitied_at_start = query.activitied_at_prepend
      ? query.activitied_at_prepend
      : currentDate()

    //activitied_at_append
    let activitied_at_end = query.activitied_at_append
      ? query.activitied_at_append
      : currentDate()

    // // Company
    // let company
    // await $axios.get('/api/admin/lov_company_table').then((response) => {
    //   company = response.data.data
    // })

    // //Data department
    // let department
    // await $axios.get('/api/admin/lov_department').then((response) => {
    //   department = response.data.data
    // })

    // // Data afdeling
    // let afdeling
    // await $axios.get('/api/admin/lov_afdeling_table').then((response) => {
    //   afdeling = response.data.data
    // })

    let janjangData
    await $axios
      .get(`/api/agro-dashboard-web/akurasi/janjang?q=${queryParams}`)
      .then((response) => {
        janjangData = response.data.data
      })

    let tonaseData
    await $axios
      .get(`/api/agro-dashboard-web/akurasi/tonase?q=${queryParams}`)
      .then((response) => {
        tonaseData = response.data.data
      })

    // let janjangDetailData
    // await $axios
    //   .get(`/api/agro-dashboard-web/akurasi/janjang/detail?department=${department_id}`)
    //   .then((response) => {
    //     janjangDetailData = response.data.data
    //   })

    // let tonaseDetailData
    // await $axios
    //   .get(`/api/agro-dashboard-web/akurasi/tonase/detail?department=${department_id}`)
    //   .then((response) => {
    //     tonaseDetailData = response.data.data
    //   })

    // Status
    let status
    await $axios.get(`/api/agro-dashboard-web/status?q=${queryParams}`).then((response) => {
      status = response.data.data
    })

    return {
      chart: {
        tonase: {
          type: 'column2d',
          renderAt: 'chart-container-janjang',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: janjangData,
        },
        janjang: {
          type: 'column2d',
          renderAt: 'chart-container-tonase',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: tonaseData,
        },
        detail_tonase: {
          type: 'column2d',
          renderAt: 'chart-container-detail-janjang',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: {},
        },
        detail_janjang: {
          type: 'column2d',
          renderAt: 'chart-container-detail-tonase',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: {},
        },
      },
      // posts: posts.data,
      activitied_at_start: activitied_at_start,
      activitied_at_end: activitied_at_end,
      // afdeling_id: afdeling_id,
      // department_id: department_id_asyncData,
      // afdeling: afdeling,
      // department: department,
      // company: company,
      queryParams: queryParams,
      status: {
        planTbs: {
          janjang: status.plan_tbs.janjang ?? '',
          tonase: status.plan_tbs.tonase ?? '',
        },
        tbsDiterimaPks: {
          janjang: status.tbs_diterima_pks.janjang ?? '',
          tonase: status.tbs_diterima_pks.tonase ?? '',
        },
      }
    }
  },

  methods: {
    async getChartDetailJanjangClientDataSource(department_id) {
      let data
      await this.$axios
        .get(
          `/api/agro-dashboard-web/akurasi/janjang/detail?q=${this.queryParams}&department=${department_id}`
        )
        .then((response) => {
          data = response.data.data
        })

      return data
    },
    async getChartDetailTonaseClientDataSource(department_id) {
      let data
      await this.$axios
        .get(
          `/api/agro-dashboard-web/akurasi/tonase/detail?q=${this.queryParams}&department=${department_id}`
        )
        .then((response) => {
          data = response.data.data
        })

      return data
    },
    async changeDetail(selected) {
      if (selected) {
        this.$nuxt.$loading.start()
        this.chart.detail_janjang.dataSource =
          await this.getChartDetailJanjangClientDataSource(selected.code)
        this.chart.detail_tonase.dataSource =
          await this.getChartDetailTonaseClientDataSource(selected.code)
        this.$nuxt.$loading.finish()
      }
    },
    changePage(page) {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.$route.query.q,
          page: page,
        },
      })
    },
    //searchData
    searchData() {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.search,
        },
      })
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins');
@import url('https://fonts.googleapis.com/css?family=Comfortaa');
body {
  background-color: #f9f9f9;
  font-family: 'Poppins', sans-serif;
}

.card-ui {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background: #fff;
  /* color: #212529; */
  color: #fff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
  -webkit-transition: all 0.1s ease-in-out;
  -moz-transition: all 0.1s ease-in-out;
  -ms-transition: all 0.1s ease-in-out;
  -o-transition: all 0.1s ease-in-out;
  transition: all 0.1s ease-in-out;
}

.card-ui.color-success {
  background: #008681;
}
.card-ui.color-primary {
  background: #005feb;
}
.card-ui.color-danger {
  background: #832643;
}
.card-ui.color-warning {
  background: #ff9f1a;
}

.card-ui .card-body {
  z-index: 1;
}
.card-ui .card-body h5 {
  font-weight: 700;
  font-family: 'Comfortaa';
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
}
.card-ui .card-body span {
  font-weight: 100;
  letter-spacing: 0.5px;
}
.card-ui img {
  height: 170px;
  width: 93%;
  border-radius: 10px;
  top: 9px;
  position: relative;
  left: 11px;
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  -ms-transition: all 0.2s ease-out;
  -o-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
  box-shadow: 0px 20px 20px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.card-ui .overlay {
  width: 118px;
  position: absolute;
  height: 118px;
  border-radius: 50%;
  top: 100%;
  right: 0;
  z-index: -1;
  -webkit-transition: all 0.4s ease-in-out;
  -moz-transition: all 0.4s ease-in-out;
  -ms-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}
.card-ui:hover {
  box-shadow: 0 7px 20px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  transform: translateY(-5px) scale(1.005) translateZ(0);
  box-shadow: 0 24px 36px rgba(0, 0, 0, 0.11),
    0 24px 46px var(rgba(220, 233, 255, 0.48));
}
.card-ui:hover .overlay {
  transform: scale(12) translateZ(0);
  overflow: hidden;
  background-image: linear-gradient(
    to bottom,
    #202020,
    #2c2c2c,
    #383838,
    #444545,
    #515252
  );
}
.card-ui:hover .overlay {
  background-image: linear-gradient(to top, #fff, #f4f3f3, #fff, #f4f3f3, #fff);
}
.card-ui:hover .card-body p,
.card-ui:hover .card-body h5 {
  color: #000;
}
.card-ui:hover .card-body span {
  color: #fff;
  background: #000;
}
</style>
