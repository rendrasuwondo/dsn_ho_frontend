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
            <div class="row d-flex justify-content-center align-items-center">
              <div class="col-4">
                <a href="javascript:;" class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Ripeness</h5>
                    <p class="card-text">79.7%</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="mb-2 ml-2 mr-2">
            <no-ssr>
              <b-row>
                <b-col cols="6">
                  <div class="chart-container-ripeness">
                    <div class="card card-outline card-info">
                      <div class="card-body">
                        <fusioncharts
                          :type="chart.ripeness.type"
                          :width="chart.ripeness.width"
                          :height="chart.ripeness.height"
                          :dataformat="chart.ripeness.dataFormat"
                          :dataSource="chart.ripeness.dataSource"
                        >
                        </fusioncharts>
                      </div>
                    </div>
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="chart-container-ripeness2">
                    <div class="card card-outline card-info">
                      <div class="card-body">
                        <fusioncharts
                          :type="chart.ripeness2.type"
                          :width="chart.ripeness2.width"
                          :height="chart.ripeness2.height"
                          :dataformat="chart.ripeness2.dataFormat"
                          :dataSource="chart.ripeness2.dataSource"
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
                    v-model="puhus_id"
                    :options="puhus"
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
                  <div class="chart-container-detail-ripeness">
                    <div class="card card-outline card-info">
                      <div class="card-body">
                        <fusioncharts
                          :type="chart.detail_ripeness.type"
                          :width="chart.detail_ripeness.width"
                          :height="chart.detail_ripeness.height"
                          :dataformat="chart.detail_ripeness.dataFormat"
                          :dataSource="chart.detail_ripeness.dataSource"
                        >
                        </fusioncharts>
                      </div>
                    </div>
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="chart-container-detail-ripeness2">
                    <div class="card card-outline card-info">
                      <div class="card-body">
                        <fusioncharts
                          :type="chart.detail_ripeness2.type"
                          :width="chart.detail_ripeness2.width"
                          :height="chart.detail_ripeness2.height"
                          :dataformat="chart.detail_ripeness2.dataFormat"
                          :dataSource="chart.detail_ripeness2.dataSource"
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
                    v-model="puhus_id"
                    :options="puhus"
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
let chartDataRipeness = {
  caption: 'Ripeness',
  theme: 'fusion',
  xaxisname: '',
  yaxisname: '',
  numberSuffix: "%",
  formatnumberscale: '1',
  // plottooltext:
  //   '<b>$dataValue</b> <b>$seriesName</b> in $label',
  drawcrossline: '1',
}
let chartDataRipeness2 = {
  caption: 'Akurasi AKP RKH vs AKP Aktual (Ton)',
  theme: 'fusion',
  xaxisname: '',
  yaxisname: '',
  numberSuffix: "%",
  formatnumberscale: '1',
  // plottooltext:
  //   '<b>$dataValue</b> <b>$seriesName</b> in $label',
  drawcrossline: '1',
}

let chartDataJanjang = {
  caption: 'Akurasi AKP RKH vs AKP Aktual (Jjg)',
  theme: 'fusion',
  xaxisname: '',
  yaxisname: '',
  numberSuffix: "%",
  formatnumberscale: '1',
  // plottooltext:
  //   '<b>$dataValue</b> <b>$seriesName</b> in $label',
  drawcrossline: '1',
}
let chartDataTon = {
  caption: 'Akurasi AKP RKH vs AKP Aktual (Ton)',
  theme: 'fusion',
  xaxisname: '',
  yaxisname: '',
  numberSuffix: "%",
  formatnumberscale: '1',
  // plottooltext:
  //   '<b>$dataValue</b> <b>$seriesName</b> in $label',
  drawcrossline: '1',
}

async function getChartRipenessDataSource() {
  return {
    chart: chartDataRipeness,
    data: [
      {
        label: 'Puhus 1',
        value: '80'
      },
      {
        label: 'Puhus 2',
        value: '90'
      },
      {
        label: 'Puhus 3',
        value: '100'
      },
    ],
  }
}

async function getChartRipeness2DataSource() {
  return {
    chart: chartDataRipeness2,
    data: [
      {
        label: 'Puhus 1',
        value: '80'
      },
      {
        label: 'Puhus 2',
        value: '90'
      },
      {
        label: 'Puhus 3',
        value: '100'
      },
    ],
  }
}

async function getChartJanjangDataSource() {
  return {
    chart: chartDataJanjang,
    data: [
      {
        label: 'Puhus 1',
        value: '80'
      },
      {
        label: 'Puhus 2',
        value: '90'
      },
      {
        label: 'Puhus 3',
        value: '100'
      },
    ],
  }
}

async function getChartTonDataSource() {
  return {
    chart: chartDataTon,
    data: [
      {
        label: 'Puhus 1',
        value: '80'
      },
      {
        label: 'Puhus 2',
        value: '90'
      },
      {
        label: 'Puhus 3',
        value: '100'
      },
    ],
  }
}

async function getChartDetailTonDataSource() {
  return {
    chart: chartDataTon,
    data: [
      {
        label: 'Busuk',
        value: '10'
      },
      {
        label: 'Mentah',
        value: '0'
      },
      {
        label: 'Matang',
        value: '90'
      },
    ],
  }
}

async function getChartDetailJanjangDataSource() {
  return {
    chart: chartDataJanjang,
    data: [
      {
        label: 'Busuk',
        value: '10'
      },
      {
        label: 'Mentah',
        value: '0'
      },
      {
        label: 'Matang',
        value: '90'
      },
    ],
  }
}

export default {
  layout: 'admin',

  head() {
    return {
      title: 'PT',
    }
  },
  data() {
    return {
      afdeling: [],
      department: [],
      company: [],
      puhus: [
        {
          id: 1,
          code: 'Puhus 1',
        },
        {
          id: 2,
          code: 'Puhus 2',
        },
        {
          id: 3,
          code: 'Puhus 3',
        },
      ],
      afdeling_id: this.$route.query.q_afdeling_id,
      department_id: this.$route.query.q_department_id,
      company_id: this.$route.query.q_company_id,
      puhus_id: null,
      puhus_tonase_id: null,
    }
  },
  watchQuery: [
    'activitied_at_prepend',
    'activitied_at_append',
    'q_afdeling_id',
    'q_department_id',
    'q_company_id',
  ],
  async asyncData({ $axios, query, auth }) {
    function currentDate() {
      const current = new Date()
      current.setDate(current.getDate())
      const date = `${current.getFullYear()}-${current.getMonth() + 1}-${
        current.getDate() - 1
      }`

      return date
    }

    //page
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    //activitied_at_prepend
    let activitied_at_start = query.activitied_at_prepend
      ? query.activitied_at_prepend
      : currentDate()

    //activitied_at_append
    let activitied_at_end = query.activitied_at_append
      ? query.activitied_at_append
      : currentDate()

    // Company
    let company
    await $axios.get('/api/admin/lov_company_table').then((response) => {
      company = response.data.data
    })

    //Data department
    let department
    await $axios.get('/api/admin/lov_department').then((response) => {
      department = response.data.data
    })

    // Data afdeling
    let afdeling
    await $axios.get('/api/admin/lov_afdeling_table').then((response) => {
      afdeling = response.data.data
    })

    // const posts = await $axios.$get(
    //   `/api/admin/report/lph?q=${search}&page=${page}&activitied_at_prepend=${activitied_at_start}&activitied_at_append=${activitied_at_end}&q_afdeling_id=${q_afdeling_id}&q_department_id=${q_department_id}&status=${q_elhm_status_id}`
    // )

    return {
      chart: {
        ripeness: {
          type: 'column2d',
          renderAt: 'chart-container-ripeness',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: await getChartRipenessDataSource(),
        },
        ripeness2: {
          type: 'column2d',
          renderAt: 'chart-container-ripeness2',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: await getChartRipeness2DataSource(),
        },
        detail_ripeness: {
          type: 'pie2d',
          renderAt: 'chart-container-detail-ripeness',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: await getChartDetailJanjangDataSource(),
        },
        detail_ripeness2: {
          type: 'pie2d',
          renderAt: 'chart-container-detail-ripeness2',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: await getChartDetailTonDataSource(),
        },
        tonase: {
          type: 'column2d',
          renderAt: 'chart-container-janjang',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: await getChartJanjangDataSource(),
        },
        janjang: {
          type: 'column2d',
          renderAt: 'chart-container-tonase',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: await getChartTonDataSource(),
        },
        detail_tonase: {
          type: 'pie2d',
          renderAt: 'chart-container-detail-janjang',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: await getChartDetailTonDataSource(),
        },
        detail_janjang: {
          type: 'pie2d',
          renderAt: 'chart-container-detail-tonase',
          width: '100%',
          height: '350',
          dataFormat: 'json',
          dataSource: await getChartDetailJanjangDataSource(),
        },
      },
      // posts: posts.data,
      activitied_at_start: activitied_at_start,
      activitied_at_end: activitied_at_end,
      afdeling: afdeling,
      // afdeling_id: afdeling_id,
      department: department,
      // department_id: department_id_asyncData,
      company: company,
    }
  },

  methods: {
    async changeDetail(selected) {
      this.chart.detail_janjang.dataSource =
        await getChartDetailJanjangDataSource2()

      this.chart.detail_tonase.dataSource =
        await getChartDetailJanjangDataSource2()
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
