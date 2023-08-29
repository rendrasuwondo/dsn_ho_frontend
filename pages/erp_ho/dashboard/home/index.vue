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
          <ClientOnly>
            <b-card
              border-variant="primary"
              header="Filter"
              header-bg-variant="info"
              header-text-variant="white"
              class="mb-5"
            >
              <b-card-text>
                <b-container class="bv-example-row mb-1">
                  <b-row>
                    <b-col cols="2">
                      <div class="form-group">
                        <multiselect
                          v-model="company_id"
                          :options="company"
                          label="code"
                          track-by="id"
                          :searchable="true"
                          placeholder="PT"
                        ></multiselect></div
                    ></b-col>
                    <b-col cols="2">
                      <div class="form-group">
                        <multiselect
                          v-model="department_id"
                          :options="department"
                          label="code"
                          track-by="id"
                          :searchable="true"
                          placeholder="Estate"
                        ></multiselect></div
                    ></b-col>
                    <b-col cols="2">
                      <div class="form-group">
                        <multiselect
                          v-model="afdeling_id"
                          :options="afdeling"
                          label="id"
                          track-by="code"
                          :searchable="true"
                          placeholder="Afdeling"
                        ></multiselect></div
                    ></b-col>
                    <b-col cols="3">
                      <b-input-group>
                        <b-form-datepicker
                          v-model="activitied_at_start"
                          :max="activitied_at_end"
                          :date-format-options="{
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            weekday: 'short',
                          }"
                          placeholder="Start Date"
                        ></b-form-datepicker>
                        <template #append>
                          <b-btn size="sm" @click="activitied_at_start = ''"
                            ><i class="fa fa-trash"></i
                          ></b-btn>
                        </template>
                      </b-input-group>
                    </b-col>
                    <b-col cols="3">
                      <b-input-group>
                        <b-form-datepicker
                          v-show="true"
                          v-model="activitied_at_end"
                          :min="activitied_at_start"
                          :date-format-options="{
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            weekday: 'short',
                          }"
                          placeholder="End Date"
                        ></b-form-datepicker>
                        <template #append>
                          <b-btn
                            size="sm"
                            @click="activitied_at_end = ''"
                            v-show="true"
                            ><i class="fa fa-trash"></i
                          ></b-btn>
                        </template>
                      </b-input-group>
                    </b-col>
                  </b-row>
                </b-container>

                <b-container class="bv-example-row row justify-content-end p-0">
                  <div class="input-group-append">
                    <button @click="searchData" class="btn btn-info">
                      <i class="fa fa-search"></i>
                      CARI
                    </button>
                  </div>
                </b-container>
              </b-card-text>
            </b-card>
          </ClientOnly>
          <div class="container">
            <div class="row d-flex justify-items-center align-items-center">
              <div class="col">
                <a href="javascript:;" class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Total Plan TBS</h5>
                    <p class="card-text">41287 Jjg | 763.8 Ton</p>
                  </div>
                </a>
              </div>

              <div class="col">
                <a href="javascript:;" class="card-ui card color-warning">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Total TBS diterima PKS</h5>
                    <p class="card-text">31280 Jjg | 578.6 Ton</p>
                  </div>
                </a>
              </div>

              <div class="col">
                <a href="javascript:;" class="card-ui card color-danger">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Persentase Brondol</h5>
                    <p class="card-text">22.5 Ton | 2.3 %</p>
                  </div>
                </a>
              </div>
            </div>

            <div class="row d-flex justify-items-center align-items-center">
              <div class="col">
                <a href="javascript:;" class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Persentase Restan</h5>
                    <p class="card-text">15.1% | 10.3% | 3.1%</p>
                  </div>
                </a>
              </div>

              <div class="col">
                <a href="javascript:;" class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Restan</h5>
                    <p class="card-text">42Jjg |0.77Ton</p>
                  </div>
                </a>
              </div>
            </div>

            <div class="row d-flex justify-items-center align-items-center">
              <div class="col">
                <a href="javascript:;" class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Akurasi RKH</h5>
                    <p class="card-text">96.2%</p>
                  </div>
                </a>
              </div>

              <div class="col">
                <a href="javascript:;" class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Avg. BJR</h5>
                    <p class="card-text">17.3Kg</p>
                  </div>
                </a>
              </div>
            </div>

            <div class="row d-flex justify-items-center align-items-center">
              <div class="col">
                <a href="javascript:;" class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Ripeness</h5>
                    <p class="card-text">79.7%</p>
                  </div>
                </a>
              </div>

              <div class="col">
                <a href="javascript:;" class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Produktivitas SKU</h5>
                    <p class="card-text">1.1 Ton/day</p>
                  </div>
                </a>
              </div>

              <div class="col">
                <a href="javascript:;" class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Performance Unit Angkut</h5>
                    <p class="card-text">67,6%</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div id="chart-container">
            <no-ssr>
              <fusioncharts
                :type="type"
                :width="width"
                :height="height"
                :dataformat="dataFormat"
                :dataSource="dataSource"
              >
              </fusioncharts>
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

  head() {
    return {
      title: 'PT',
    }
  },
  data() {
    const chartData = [
      {
        label: 'Venezuela',
        value: '290',
      },
      {
        label: 'Saudi',
        value: '260',
      },
      {
        label: 'Canada',
        value: '180',
      },
      {
        label: 'Iran',
        value: '140',
      },
      {
        label: 'Russia',
        value: '115',
      },
      {
        label: 'UAE',
        value: '100',
      },
      {
        label: 'US',
        value: '30',
      },
      {
        label: 'China',
        value: '30',
      },
    ]

    const dataSource = {
      chart: {
        caption: 'Countries With Most Oil Reserves [2017-18]',
        subcaption: 'In MMbbl = One Million barrels',
        xaxisname: 'Country',
        yaxisname: 'Reserves (MMbbl)',
        numbersuffix: 'K',
        theme: 'fusion',
      },
      data: chartData,
    }

    return {
      type: 'column2d',
      renderAt: 'chart-container',
      width: '550',
      height: '350',
      dataFormat: 'json',
      dataSource,
      afdeling: [],
      department: [],
      company: [],
      afdeling_id: this.$route.query.q_afdeling_id,
      department_id: this.$route.query.q_department_id,
      company_id: this.$route.query.q_company_id,
    }
  },
  watchQuery: [
    'q',
    'page',
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
    await $axios
      .get('/api/admin/lov_company_table')
      .then((response) => {
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
/* https://codepen.io/nadjmandev/pen/zVXgRr?editors=1100 */

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
