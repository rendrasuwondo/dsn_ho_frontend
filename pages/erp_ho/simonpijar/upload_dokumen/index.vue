<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <div v-if="show === 0">
      <b-img right src="\img\dsn_logo.png" alt="" class="img-logo"></b-img>
      <p class="txt-2">Loading</p>
      <div class="spinonediv-4"></div>
    </div>

    <section class="content" v-if="show === 1">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-file-alt"></i> <b>UPLOAD DOKUMEN</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <b-tabs v-model="tabIndex" class="px-3 pt-2">
          <b-tab
            title="AP"
            @click="changeTab('AP')"
            :active="activeTab === 'AP'"
          ></b-tab>
          <b-tab
            title="Direct"
            @click="changeTab('Direct')"
            :active="activeTab === 'Direct'"
          ></b-tab>
        </b-tabs>
        <div class="card-body">
          <b-card
            border-variant="primary"
            header="Filter"
            header-bg-variant="info"
            header-text-variant="white"
          >
            <b-card-text>
              <b-row>
                <b-col cols="1">Bulan :</b-col>
                <b-col cols="4">
                  <multiselect
                    v-model="f_month_id"
                    :options="months"
                    label="name"
                    track-by="id"
                    :searchable="true"
                    @input="onChangeFiler"
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
                    @input="onChangeFiler"
                  ></multiselect>
                </b-col>
              </b-row>
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

                <nuxt-link
                  title="History Upload File"
                  class="btn btn-info"
                  :to="{
                    name: 'erp_ho-data_warehouse-rna-detail_upload',
                    query: {
                      url: 'erp_ho-simonpijar-upload_dokumen',
                      tab_header:
                        'UPLOAD DOKUMEN (' + (this.activeTab || 'AP') + ')',
                      account: 'Upload Dokumen ' + (this.activeTab || 'AP'),
                      q_month_id: this.period_month,
                      q_year_id: this.period_year,
                    },
                  }"
                >
                  <i class="fa fa-info-circle"></i>
                </nuxt-link>

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
                            <input
                              type="file"
                              name="file"
                              @change="upload"
                              id="actual-btn"
                              hidden
                            />
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
            class="table-dokumen"
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
              >{{ formatPrice(rowcount) }} data</b-col
            >
          </b-row>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { formatPrice } from '~/utils/formatters'

export default {
  layout: 'admin',

  head() {
    return {
      title: 'Upload Dokumen',
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

      month_code: '',

      period_year: this.$route.query.q_year_id
        ? this.$route.query.q_year_id
        : this.currentYear(),
      period_month: this.$route.query.q_month_id
        ? this.$route.query.q_month_id
        : this.currentMonth(),

      years: [],
      months: [],

      activeTab: this.$route.query.q_type ? this.$route.query.q_type : 'AP',
      tabIndex: this.$route.query.q_type === 'Direct' ? 1 : 0,

      show: 1,

      fields: [
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'No Dokumen',
          key: 'no_dokumen',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Nama PT',
          key: 'nama_pt',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Bulan',
          key: 'bulan',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Tahun',
          key: 'tahun',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Lokasi',
          key: 'lokasi',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Description',
          key: 'description',
          tdClass: 'align-middle text-left nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Status',
          key: 'status',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Stock',
          key: 'stock',
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
  watchQuery: ['q', 'page', 'q_year_id', 'q_month_id', 'q_type'],

  async asyncData({ $axios, query }) {
    const current = new Date()
    const prevDate = new Date(current.getFullYear(), current.getMonth() - 1, 1)
    let month_at = prevDate.getMonth() + 1
    let year_at = prevDate.getFullYear()

    let q_month_id = query.q_month_id ? query.q_month_id : month_at
    let q_year_id = query.q_year_id ? query.q_year_id : year_at
    let q_type = query.q_type ? query.q_type : 'AP'
    let page = query.page ? parseInt(query.page) : ''
    let search = query.q ? query.q : ''

    let year_list = { data: [] }
    let month_list = { data: [] }
    let postsResult = null
    let fetchError = null

    try {
      const [yearsRes, monthsRes, postsRes] = await Promise.all([
        $axios.$get(`/api/admin/lov_years`),
        $axios.$get(`/api/admin/lov_months`),
        $axios.$get(
          `/api/admin/simonpijar?q=${search}&page=${page}&q_month_id=${q_month_id}&q_year_id=${q_year_id}&q_type=${q_type}`
        ),
      ])
      year_list = yearsRes
      month_list = monthsRes
      postsResult = postsRes.data
    } catch (err) {
      console.log(err?.response, 'ERROR fetching data')
      fetchError = err
    }

    const years = year_list?.data || []
    const months = month_list?.data || []

    const f_month_id =
      months.find((m) => m.id == q_month_id) || months[0] || null
    const f_year_id =
      years.find((y) => y.year_at == q_year_id || y.id == q_year_id) ||
      years[0] ||
      null

    const asyncErrorMessage = fetchError
      ? fetchError?.response?.data?.message ||
        fetchError?.message ||
        'Gagal mengambil data dari server.'
      : null

    return {
      posts: postsResult?.data || [],
      pagination: postsResult || { total: 0, data: [] },
      search: search,
      rowcount: postsResult?.total || 0,
      year_id: f_year_id,
      month_id: f_month_id,
      f_month_id: f_month_id,
      f_year_id: f_year_id,
      years: years,
      months: months,
      activeTab: q_type,
      tabIndex: q_type === 'Direct' ? 1 : 0,
      asyncErrorMessage: asyncErrorMessage,
    }
  },

  methods: {
    formatPrice,

    showErrorToast(error, defaultTitle = 'Error') {
      let message = ''
      if (typeof error === 'string') {
        message = error
      } else {
        message =
          error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          'Terjadi kesalahan saat mengambil/memproses data.'
      }

      if (this.$bvToast) {
        this.$bvToast.toast(message, {
          title: defaultTitle,
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
          appendToast: true,
        })
      } else if (this.$swal) {
        this.$swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: defaultTitle,
          text: message,
          showConfirmButton: false,
          timer: 4000,
        })
      }
    },

    onChangeFiler() {
      this.searchData()
    },
    currentMonth() {
      const current = new Date()
      const prevDate = new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1
      )
      const date = `${prevDate.getMonth() + 1}`
      return date
    },

    currentYear() {
      const current = new Date()
      const prevDate = new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1
      )
      const date = `${prevDate.getFullYear()}`

      return date
    },

    showModal() {
      if (this.f_month_id) {
        this.month_id = this.f_month_id
      }
      if (this.f_year_id) {
        this.year_id = this.f_year_id
      }
      this.$refs['my-modal'].show()
    },

    hideModal() {
      this.$refs['my-modal'].hide()
    },

    changeTab(type) {
      if (this.activeTab === type) return
      this.activeTab = type
      this.tabIndex = type === 'Direct' ? 1 : 0

      const current = new Date()
      const prevDate = new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1
      )

      let month_at = prevDate.getMonth() + 1
      let year_at = prevDate.getFullYear()

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

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
          page: 1,
          q_month_id: this.query_month_id ? this.query_month_id : month_at,
          q_year_id: this.query_year_id ? this.query_year_id : year_at,
          q_type: type,
        },
      })
    },

    changePage(page) {
      const current = new Date()
      const prevDate = new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1
      )

      let month_at = prevDate.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      let year_at = prevDate.getFullYear()

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
          q_type: this.activeTab || 'AP',
        },
      })
    },

    searchData() {
      const current = new Date()
      const prevDate = new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1
      )

      let month_at = prevDate.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      let year_at = prevDate.getFullYear()

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
          q_type: this.activeTab || 'AP',
        },
      })
    },

    async exportData() {
      const current = new Date()
      const prevDate = new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1
      )

      let month_at = prevDate.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

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
        this.query_year_id === undefined || this.query_year_id === ''
          ? year_at
          : this.query_year_id

      let i_month =
        this.query_month_id === undefined || this.query_month_id === ''
          ? month_at
          : this.query_month_id

      let month_name = ''
      if (this.f_month_id && this.f_month_id.name) {
        month_name = this.f_month_id.name
      } else {
        const found = this.months.find((m) => m.id == i_month)
        if (found && found.name) {
          month_name = found.name
        } else {
          try {
            const res = await this.$axios.get(
              `/api/admin/lov_months?q_month_id=${i_month}`
            )
            const data = Array.isArray(res.data.data)
              ? res.data.data[0]
              : res.data.data
            month_name = data ? data.name : ''
          } catch (e) {}
        }
      }

      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/admin/simonpijar/export?q=${
          this.search
        }&q_month_id=${i_month}&q_year_id=${i_year}&q_type=${
          this.activeTab || 'AP'
        }`,
        method: 'GET',
        responseType: 'blob',
        headers: headers,
      })
        .then((response) => {
          this.isLoading = false
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          var fileName = month_name
            ? `Upload Dokumen ${
                this.activeTab || 'AP'
              } ${i_year} ${month_name}.xlsx`
            : `Upload Dokumen ${this.activeTab || 'AP'} ${i_year}.xlsx`
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
        })
        .catch((error) => {
          this.isLoading = false
          this.showErrorToast(error, 'Gagal Export Data')
        })
    },

    async exportDataTemplate() {
      const current = new Date()
      const prevDate = new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1
      )

      let month_at = prevDate.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      let year_at = prevDate.getFullYear()

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

      try {
        const response = await this.$axios.get(
          `/api/admin/lov_months?q_month_id=${i_month}`
        )
        this.month_code = response.data.data
      } catch (error) {
        this.showErrorToast(error, 'Gagal Memuat Data Bulan')
        return
      }

      if (!this.month_code || !this.month_code[0]) {
        this.showErrorToast(
          'Data bulan tidak ditemukan.',
          'Gagal Export Template'
        )
        return
      }

      let month_code = this.month_code[0].name

      const headers = {
        'Content-Type': 'application/json',
      }

      try {
        const response = await this.$axios({
          url: `/api/admin/template_simonpijar/export?q=${this.search}`,
          method: 'GET',
          responseType: 'blob',
          headers: headers,
        })
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName =
          'Upload_Dokumen_' +
          (this.activeTab || 'AP') +
          '_' +
          month_code +
          '_' +
          i_year +
          '.xlsx'
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      } catch (error) {
        this.isLoading = false
        this.showErrorToast(error, 'Gagal Export Template')
      }
    },

    upload(e) {
      let files = e.target.files[0]

      this.files = files
    },

    async submitFileUpload() {
      this.show = 0
      const current = new Date()
      const prevDate = new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1
      )
      const prevMonth = prevDate.getMonth() + 1
      const prevYear = prevDate.getFullYear()

      let i_year_at = ''

      try {
        if (this.year_id.year_at === null) {
          i_year_at = ''
        } else if (this.year_id.year_at === undefined) {
          i_year_at = prevYear
        } else {
          i_year_at = this.year_id.year_at ? this.year_id.year_at : ''
        }
      } catch (err) {}

      let q_year = i_year_at === '' ? prevYear : i_year_at

      let i_month_at = ''

      try {
        if (this.month_id.id === null) {
          i_month_at = ''
        } else if (this.month_id.id === undefined) {
          i_month_at = prevMonth
        } else {
          i_month_at = this.month_id.id ? this.month_id.id : ''
        }
      } catch (err) {}

      let q_month = i_month_at === '' ? prevMonth : i_month_at

      let monthCode =
        this.month_id && this.month_id.name
          ? this.month_id.name
          : (this.months || []).find((m) => m.id == i_month_at)?.name

      if (!monthCode) {
        try {
          const response = await this.$axios.get(
            `/api/admin/lov_months?q_month_id=${i_month_at}`
          )
          this.month_code = response.data.data
          monthCode =
            this.month_code && this.month_code[0] ? this.month_code[0].name : ''
        } catch (error) {
          this.show = 1
          this.showErrorToast(error, 'Gagal Validasi Bulan')
          return
        }
      }

      if (!monthCode) {
        this.show = 1
        this.showErrorToast('Data bulan tidak ditemukan.', 'Gagal Upload File')
        return
      }

      let checkFile1 =
        'Upload_Dokumen_' +
        (this.activeTab || 'AP') +
        '_' +
        monthCode +
        '_' +
        i_year_at +
        '.xlsx'
      let checkFile2 = 'Upload_Dokumen_' + monthCode + '_' + i_year_at + '.xlsx'

      if (this.files.name === checkFile1 || this.files.name === checkFile2) {
        let formData = new FormData()
        formData.append('upload_file', this.files)

        await this.$axios
          .post(
            `/api/admin/simonpijar?q_month_id=${i_month_at}&q_year_id=${i_year_at}&q_type=${
              this.activeTab || 'AP'
            }`,
            formData
          )
          .then((response) => {
            this.show = 1

            this.$nuxt.refresh()
            this.files = null

            this.$swal.fire({
              title: 'BERHASIL!',
              text: 'Data Berhasil Disimpan!',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            })

            this.$router.push({
              name: 'erp_ho-simonpijar-upload_dokumen',
              query: {
                q_month_id: i_month_at,
                q_year_id: i_year_at,
                q_type: this.activeTab || 'AP',
              },
            })
          })
          .catch((error) => {
            this.show = 1
            this.files = null

            this.$router.push({
              name: 'erp_ho-simonpijar-upload_dokumen',
              query: {
                q_month_id: i_month_at,
                q_year_id: i_year_at,
                q_type: this.activeTab || 'AP',
              },
            })

            this.showErrorToast(error, 'Data Gagal Disimpan!')

            this.$swal.fire({
              title: 'ERROR!',
              text: error?.response?.data?.message || 'Data Gagal Disimpan!',
              icon: 'error',
              showConfirmButton: false,
              timer: 2000,
            })
          })
      } else {
        this.show = 1
        this.files = null

        this.$router.push({
          name: 'erp_ho-simonpijar-upload_dokumen',
          query: { q_month_id: q_month, q_year_id: q_year },
        })

        const errMsg =
          'Data Yang Anda Upload Tidak Sesuai Dengan Bulan Yang Ditentukan. Harap Cek Kembali!'
        this.showErrorToast(errMsg, 'File Tidak Sesuai')

        this.$swal.fire({
          title: 'ERROR!',
          text: errMsg,
          icon: 'error',
          showConfirmButton: false,
          timer: 3500,
        })
      }
    },
  },

  mounted() {
    if (this.asyncErrorMessage) {
      this.showErrorToast(this.asyncErrorMessage, 'Gagal Memuat Data')
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

.table-dokumen {
  font-size: 14px;
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
