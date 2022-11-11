<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <div v-if="show === 0">
      <b-img right src="\img/dsn_logo.png" alt="" class="img-logo"></b-img>
      <p class="txt-2">Loading</p>
      <div class="spinonediv-4"></div>
    </div>

    <section class="content" v-if="show === 1">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-sun"></i> <b>PENYINARAN</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <b-card
            border-variant="primary"
            header="Filter"
            header-bg-variant="info"
            header-text-variant="white"
          >
            <b-card-text>
              <!-- <b-container class="bv-example-row mb-3"> -->
              <b-row>
                <b-col cols="1">Bulan :</b-col>
                <b-col cols="4">
                  <multiselect
                    v-model="f_month_id"
                    :options="months"
                    label="name"
                    track-by="id"
                    :searchable="true"
                  ></multiselect>
                </b-col>
                <b-col class="ml-4" cols="1">Tahun : </b-col>
                <b-col cols="4">
                  <multiselect
                    v-model="f_year_id"
                    :options="years"
                    label="year_at"
                    track-by="id"
                    :searchable="true"
                  ></multiselect>
                </b-col>
              </b-row>
              <!-- </b-container> -->
            </b-card-text>
          </b-card>
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <button
                  title="Upload File"
                  class="btn btn-info"
                  @click="showModal"
                >
                  <i class="fa fa-file-upload"></i>
                </button>

                <button
                  title="Export To Excel"
                  class="btn btn-info"
                  @click="exportData"
                >
                  <i class="fa fa-file-excel"></i>
                </button>

                <button
                  title="Download Template Excel"
                  class="btn btn-info"
                  @click="exportDataTemplate"
                >
                  <i class="fa fa-file-alt"></i>
                </button>

                <b-modal ref="my-modal" hide-footer title="Form Upload File">
                  <div class="form-group">
                    <b-container fluid>
                      <b-row class="my-1">
                        <b-col sm="3">
                          <label for="input-small">Tahun :</label>
                        </b-col>
                        <b-col sm="9">
                          <multiselect
                            v-model="year_id"
                            :options="years"
                            label="year_at"
                            track-by="id"
                            :searchable="true"
                          ></multiselect>
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                  <div class="form-group">
                    <b-container fluid>
                      <b-row class="my-1">
                        <b-col sm="3">
                          <label for="input-small">Bulan :</label>
                        </b-col>
                        <b-col sm="9">
                          <multiselect
                            v-model="month_id"
                            :options="months"
                            label="name"
                            track-by="id"
                            :searchable="true"
                          ></multiselect>
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                  <div class="form-group">
                    <b-container class="bv-example-row">
                      <b-row>
                        <b-col sm="3">
                          <label class="mr-1">Pilih File :</label>
                        </b-col>
                        <b-col sm="9">
                          <p class="selected float-left">
                            <!-- <br /> -->
                            <input
                              type="file"
                              name="file"
                              @change="upload"
                              id="actual-btn"
                              hidden
                            />

                            <!-- our custom upload button -->
                            <label for="actual-btn" class="f_upload">
                              Choose File
                            </label>
                          </p>
                        </b-col>
                      </b-row>
                      <b-row class="pb-2">
                        <b-col sm="3"></b-col>
                        <b-col sm="9">
                          {{ files ? files.name : 'No File Chosen' }}
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                  <div class="form-group">
                    <b-container class="bv-example-row">
                      <b-row>
                        <b-col>
                          <b-button
                            :disabled="files == null"
                            class="btn btn-info mr-1 btn-modal"
                            block
                            @click="submitFileUpload"
                          >
                            <i class="fa fa-upload"></i> UPLOAD
                          </b-button>
                        </b-col>
                        <b-col>
                          <b-button
                            class="btn btn-warning btn-modal"
                            block
                            @click="hideModal"
                          >
                            <i class="fa fa-redo"></i> BATAL
                          </b-button>
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                </b-modal>
              </div>
              <input
                type="text"
                class="form-control"
                v-model="search"
                @keypress.enter="searchData"
                placeholder=""
              />
              <div class="input-group-append">
                <button @click="searchData" class="btn btn-info">
                  <i class="fa fa-search"></i>
                  CARI
                </button>
              </div>
            </div>
          </div>
          <!-- table -->
          <b-table
            small
            responsive
            striped
            bordered
            hover
            :items="posts"
            :fields="fields"
            show-empty
          >
          </b-table>

          <!-- pagination -->
          <b-row>
            <b-col
              ><b-pagination
                v-model="pagination.current_page"
                :total-rows="pagination.total"
                :per-page="pagination.per_page"
                @change="changePage"
                align="left"
                class="mt-1"
              ></b-pagination
            ></b-col>
            <b-col class="text-right" align-self="center"
              >{{ rowcount }} data</b-col
            >
          </b-row>
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
      title: 'PENYINARAN',
    }
  },

  data() {
    return {
      f_year_id: this.$route.query.q_year_id,
      f_month_id: this.$route.query.q_month_id,

      query_year_id: '',
      query_month_id: '',

      files: null,

      year_id: '',
      month_id: '',

      years: [],
      months: [],

      show: 1,

      fields: [
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Tanggal',
          key: 'PERIOD_DAY',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Bulan',
          key: 'PERIOD_MONTH',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Tahun',
          key: 'PERIOD_YEAR',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'SITE',
          key: 'SITE_CODE',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Lama Penyinaran (Jam)',
          key: 'DURATION_OF_IRRADIATION',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US')
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
      ],
      sweet_alert: {
        title: '',
        icon: '',
      },
    }
  },
  watchQuery: ['q', 'page', 'q_year_id', 'q_month_id'],

  async asyncData({ $axios, query }) {
    // DEFAULT MONTH AND YEAR
    const current = new Date()
    let month_at = current.getMonth() + 1

    let year_at = current.getFullYear()

    let year_list = await $axios.$get(`/api/admin/lov_years`)

    let month_list = await $axios.$get(`/api/admin/lov_months`)

    //FILTER PADA TABLE
    //MONTH
    let q_month_id = query.q_month_id ? query.q_month_id : month_at

    let f_month_id = []

    if (query.q_month_id) {
      // console.log('rendra')
      $axios
        .get(`/api/admin/lov_months?q_month_id=${q_month_id}`)
        .then((response) => {
          f_month_id = response.data.data
        })
    } else {
      f_month_id = []

      q_month_id = month_at
    }

    if (q_month_id == undefined || q_month_id == '') {
      q_month_id = month_at
    }

    //YEAR
    let q_year_id = query.q_year_id ? query.q_year_id : year_at

    let f_year_id = []

    if (query.q_year_id) {
      $axios
        .get(`/api/admin/lov_years?q_year_id=${q_year_id}`)
        .then((response) => {
          f_year_id = response.data.data
        })
    } else {
      f_year_id = []

      q_year_id = year_at
    }

    if (q_year_id == undefined || q_year_id == '') {
      q_year_id = year_at
    }

    //MODAL
    //GET YEAR
    let year_id = []

    $axios.get(`/api/admin/lov_years?q_year_id=${year_at}`).then((response) => {
      year_id = response.data.data
    })

    // GET MONTH
    let month_id = []

    $axios
      .get(`/api/admin/lov_months?q_month_id=${month_at}`)
      .then((response) => {
        month_id = response.data.data
      })

    //page
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    //fetching posts
    const posts = await $axios.$get(
      `/api/admin/irradiation?q=${search}&page=${page}&q_month_id=${q_month_id}&q_year_id=${q_year_id}`
    )

    return {
      posts: posts.data.data,
      pagination: posts.data,
      search: search,
      rowcount: posts.data.total,
      year_id: year_id,
      month_id: month_id,
      f_month_id: f_month_id,
      f_year_id: f_year_id,
      years: year_list.data,
      months: month_list.data,
    }
  },
  methods: {
    showModal() {
      this.$refs['my-modal'].show()
    },

    hideModal() {
      this.$refs['my-modal'].hide()
    },

    changePage(page) {
      const current = new Date()

      // MONTH
      let month_at = current.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      // YEAR
      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.$route.query.q,
          page: page,
          q_month_id: this.query_month_id ? this.query_month_id : month_at,
          q_year_id: this.query_year_id ? this.query_year_id : year_at,
        },
      })
    },
    //searchData
    searchData() {
      this.show = 0
      const current = new Date()

      // MONTH
      let month_at = current.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      // YEAR
      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.search,
          q_month_id: this.query_month_id ? this.query_month_id : month_at,
          q_year_id: this.query_year_id ? this.query_year_id : year_at,
        },
      })
      // this.show = 1
    },

    exportData() {
      const current = new Date()

      // MONTH
      let month_at = current.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      // YEAR
      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      let i_year =
        this.query_year_id === undefined ? year_at : this.query_year_id

      let i_month =
        this.query_month_id === undefined ? month_at : this.query_month_id

      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/admin/irradiation/export?q=${this.search}&q_month_id=${i_month}&q_year_id=${i_year}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Penyiraman.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },

    exportDataTemplate() {
      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/admin/template_irradiation/export?q=${this.search}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Template Penyinaran.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },

    upload(e) {
      // uploaded file
      let files = e.target.files[0]

      this.files = files
    },

    refreshData() {
      this.$router.push({
        name: 'erp_ho-data_warehouse-rna-irradiation',
        query: { q_month_id: month_at, q_year_id: year_at },
      })
    },

    async submitFileUpload() {
      this.show = 0
      const current = new Date()

      // Year
      let i_year_at = ''

      try {
        if (this.year_id.year_at === null) {
          i_year_at = ''
        } else if (this.year_id.year_at === undefined) {
          i_year_at = current.getFullYear()
        } else {
          i_year_at = this.year_id.year_at ? this.year_id.year_at : ''
        }
      } catch (err) {}

      let q_year = i_year_at === '' ? current.getFullYear() : i_year_at

      // Month
      let i_month_at = ''

      try {
        if (this.month_id.id === null) {
          i_month_at = ''
        } else if (this.month_id.id === undefined) {
          i_month_at = current.getMonth() + 1
        } else {
          i_month_at = this.month_id.id ? this.month_id.id : ''
        }
      } catch (err) {}

      let q_month = i_month_at === '' ? current.getMonth() + 1 : i_month_at

      // console.log(year_at)
      let formData = new FormData()
      formData.append('upload_file', this.files)

      await this.$axios
        .post(
          `/api/admin/irradiation?q_month_id=${i_month_at}&q_year_id=${i_year_at}`,
          formData
        )
        .then((response) => {
          this.show = 1

          this.$nuxt.refresh()
          this.files = null

          //sweet alert
          this.$swal.fire({
            title: 'BERHASIL!',
            text: 'Data Berhasil Disimpan!',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
          })

          this.$router.push({
            name: 'erp_ho-data_warehouse-rna-irradiation',
            query: { q_month_id: q_month, q_year_id: q_year },
          })
        })
        .catch((error) => {
          this.show = 1
          this.files = null

          this.$router.push({
            name: 'erp_ho-data_warehouse-rna-irradiation',
            query: { q_month_id: q_month, q_year_id: q_year },
          })

          this.$swal.fire({
            title: 'ERROR!',
            text: 'Data Gagal Disimpan!',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000,
          })

          //assign error to state "validation"
          // this.validation = error.response.data
          // this.files = null
        })
    },
  },

  mounted() {
    //GET DATA MONTH SAAT AWAL BUKA MENU
    const current = new Date()

    if (this.$route.query.q_month_id == null) {
      this.$axios
        .get(`/api/admin/lov_months?q_month_id=${current.getMonth() + 1}`)

        .then((response) => {
          this.f_month_id = response.data.data
        })
    } else {
      this.$axios
        .get(`/api/admin/lov_months?q_month_id=${this.$route.query.q_month_id}`)

        .then((response) => {
          this.f_month_id = response.data.data
        })
    }

    //GET DATA YEAR SAAT AWAL BUKA MENU
    if (this.$route.query.q_year_id == null) {
      this.$axios
        .get(`/api/admin/lov_years?q_year_id=${current.getFullYear()}`)

        .then((response) => {
          this.f_year_id = response.data.data
        })
    } else {
      this.$axios
        .get(`/api/admin/lov_years?q_year_id=${this.$route.query.q_year_id}`)

        .then((response) => {
          this.f_year_id = response.data.data
        })
    }
  },
}
</script>

<style scoped>
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}

.card-title {
  color: #504d8d;
}

.title-filter {
  font-size: 14px;
  margin-left: 8px;
}

.btn-modal {
  font-size: 16px;
  font-weight: bold;
}
.f_upload {
  background-color: rgba(82, 68, 190, 0.911);
  font-size: 14px;
  width: 150px;
  padding: 5px 0px 5px 0px;
  border-radius: 3px;
  color: white;
  box-shadow: 2px 3px #f7ebfd;
  border-style: solid;
  border-width: 0px 2px 2px 0px;
  border-color: rgb(57, 50, 106);
  text-align: center;
  margin-right: 2px;
  font-weight: bold;
}

.f_upload:hover {
  background-color: rgb(64, 51, 161);
  border-style: solid;
  border-width: 0px 2px 2px 0px;
  border-color: rgb(69, 61, 129);
}

#file-chosen {
  margin-left: 0.3rem;
  font-family: sans-serif;
}

.txt-2 {
  color: #be65e2;
  padding-top: 17%;
  font-family: 'Press Start 2P', cursive;
  text-align: center;
  font-size: 27px;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.148);
  font-weight: bold;
}

.img-logo {
  width: 160px;
  padding-top: 10px;
  padding-right: 20px;
}

p {
  margin-bottom: 0px;
}
</style>
