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
          <!-- <p>{{ queryStringState }}</p> -->
          <FilterBar/>
          <div class="container">
            <div class="row d-flex justify-items-center align-items-center">
              <div class="col">
                <nuxt-link
                  :to="{
                    name: 'erp_ho-dashboard-tbs_pks',
                  }"
                  class="card-ui card color-success"
                >
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Total Plan TBS</h5>
                    <p class="card-text">{{ this.status.planTbs.janjang }} Jjg | {{ this.status.planTbs.tonase }} Ton</p>
                  </div>
                </nuxt-link>
              </div>

              <div class="col">
                <nuxt-link
                  :to="{
                    name: 'erp_ho-dashboard-tbs_pks',
                  }"
                  class="card-ui card color-warning"
                >
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Total TBS diterima PKS</h5>
                    <p class="card-text">{{ this.status.tbsDiterimaPks.janjang }} Jjg | {{ this.status.tbsDiterimaPks.tonase }} Ton</p>
                  </div>
                </nuxt-link>
              </div>

              <div class="col">
                <nuxt-link
                  :to="{
                    name: 'erp_ho-dashboard-tbs_pks',
                  }"
                  class="card-ui card color-danger"
                >
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Persentase Brondol</h5>
                    <p class="card-text">22.5 Ton | 2.3 %</p>
                  </div>
                </nuxt-link>
              </div>
            </div>

            <div class="row d-flex justify-items-center align-items-center">
              <div class="col">
                <nuxt-link
                  :to="{
                    name: 'erp_ho-dashboard-restan',
                  }"
                  class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Persentase Restan</h5>
                    <p class="card-text">15.1% | 10.3% | 3.1%</p>
                  </div>
                </nuxt-link>
              </div>

              <div class="col">
                <nuxt-link
                  :to="{
                    name: 'erp_ho-dashboard-restan',
                  }"
                  class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Restan</h5>
                    <p class="card-text">42Jjg |0.77Ton</p>
                  </div>
                </nuxt-link>
              </div>
            </div>

            <div class="row d-flex justify-items-center align-items-center">
              <div class="col">
                <nuxt-link
                  :to="{
                    name: 'erp_ho-dashboard-akurasi',
                  }"
                  class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Akurasi RKH</h5>
                    <p class="card-text">96.2%</p>
                  </div>
                </nuxt-link>
              </div>

              <div class="col">
                <nuxt-link
                  :to="{
                    name: 'erp_ho-dashboard-avg_bjr',
                  }"
                   class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Avg. BJR</h5>
                    <p class="card-text">17.3Kg</p>
                  </div>
                </nuxt-link>
              </div>
            </div>

            <div class="row d-flex justify-items-center align-items-center">
              <div class="col">
                <nuxt-link
                  :to="{
                    name: 'erp_ho-dashboard-ripeness',
                  }"
                   class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Ripeness</h5>
                    <p class="card-text">79.7%</p>
                  </div>
                </nuxt-link>
              </div>

              <div class="col">
                <nuxt-link
                  :to="{
                    name: 'erp_ho-dashboard-produktivitas_sku',
                  }"
                  class="card-ui card color-success">
                  <div class="overlay"></div>
                  <div class="card-body">
                    <h5 class="card-title">Produktivitas SKU</h5>
                    <p class="card-text">1.1 Ton/day</p>
                  </div>
                </nuxt-link>
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
      return this.$store.state.queryString;
    }
  },
  head() {
    return {
      title: 'PT',
    }
  },
  data() {
    return {
    }
  },
  watchQuery: [
    'activitied_at_prepend',
    'activitied_at_append',
    'q_afdeling_id',
    'q_department_id',
    'q_company_id',
  ],
  async asyncData({ $axios, query, store }) {
    function currentDate() {
      const current = new Date()
      current.setDate(current.getDate())
      const date = `${current.getFullYear()}-${current.getMonth() + 1}-${
        current.getDate() - 1
      }`

      return date
    }

    //activitied_at_prepend
    let activitied_at_start = query.activitied_at_prepend
      ? query.activitied_at_prepend
      : currentDate()

    //activitied_at_append
    let activitied_at_end = query.activitied_at_append
      ? query.activitied_at_append
      : currentDate()

    // Company
    let company, companyId
    await $axios.get('/api/admin/lov_user_company').then((response) => {
      company = response.data.data
      companyId = response.data.data[0]
    })

    //Data department
    let department, departmentId
    await $axios.get('/api/admin/lov_user_department').then((response) => {
      department = response.data.data
      departmentId = response.data.data[0]
    })

    // Data afdeling
    let afdeling, afdelingId
    await $axios.get(`/api/admin/lov_afdeling_department?department_id=${departmentId.id}`).then((response) => {
      afdeling = response.data.data
      afdelingId = response.data.data[0]
    })


    if (store.state.initState) {
      const currentDateFilter = new Date();
      const startOfMonth = new Date(currentDateFilter.getFullYear(), currentDateFilter.getMonth(), 1);
      const previousDate = new Date(currentDateFilter.getFullYear(), currentDateFilter.getMonth(), currentDateFilter.getDate() - 1);
      const formattedStartOfMonth = `${startOfMonth.getFullYear()}-${startOfMonth.getMonth() + 1}-${startOfMonth.getDate()}`;
      const formattedPreviousDate = `${previousDate.getFullYear()}-${previousDate.getMonth() + 1}-${previousDate.getDate()}`;

      store.commit('updateDashboardState', {
        query: `&company=${companyId ? companyId.code : ""}&department=${departmentId ? departmentId.code : ""}&afdeling=${afdelingId ? afdelingId.id : ""}&date_start=${formattedStartOfMonth ?? ''}&date_end=${formattedPreviousDate ?? ''}`
      })
    }

    // query params
    let queryParams = store.state.queryString

    // console.log("recalllllllllllllllllllllllllllllllllllll")
    // console.log(store.state.initState)
    // console.log(queryParams)

    // Status
    let status
    await $axios.get(`/api/agro-dashboard-web/status?q=${queryParams}`).then((response) => {
      status = response.data.data
    })

    return {
      // posts: posts.data,
      activitied_at_start: activitied_at_start,
      activitied_at_end: activitied_at_end,
      afdeling: afdeling,
      afdelingId: afdelingId,
      department: department,
      departmentId: departmentId,
      company: company,
      companyId: companyId,
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
  watch: {
    async '$store.state.search'(newValue, oldValue) {
      if (newValue !== oldValue) {
        await this.$nuxt.refresh()
      }
    }
  },
  created() {

    this.$store.commit('updateAfdelingState', this.afdeling)
    this.$store.commit('updateDepartmentState', this.department)
    this.$store.commit('updateCompanyState', this.company)

    if (this.$store.state.initState) {
      this.$store.commit('updateAfdelingIdState', this.afdelingId)
      this.$store.commit('updateDepartmentIdState', this.departmentId)
      this.$store.commit('updateCompanyIdState', this.companyId)

      const currentDate = new Date();

      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);

      const formattedStartOfMonth = `${startOfMonth.getFullYear()}-${startOfMonth.getMonth() + 1}-${startOfMonth.getDate()}`;
      const formattedPreviousDate = `${previousDate.getFullYear()}-${previousDate.getMonth() + 1}-${previousDate.getDate()}`;

      this.$store.commit('updateDateStartState', formattedStartOfMonth)
      this.$store.commit('updateDateEndState', formattedPreviousDate)

      // Set init state to false
      this.$store.state.initState = false
    }
    // this.$store.commit('updateDateStartState', this.activitied_at_start)
    // this.$store.commit('updateDateEndState', this.activitied_at_end)
  },

  methods: {
    getParams() {
      return {
        activitied_at_prepend: 'hehehe',
        activitied_at_append: '',
        q_afdeling_id: '',
        q_department_id: '',
        q_company_id: '',
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
