<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <div v-if="show === 0">
      <b-img right src="/img/dsn_logo.png" alt="" class="img-logo"></b-img>
      <p class="txt-2">Loading</p>
      <div class="spinonediv-4"></div>
    </div>

    <section class="content" v-if="show === 1">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-chart-bar"></i>
            <b>Rekap Penerimaan TBS Eksternal & Sortasi</b>
          </h3>
        </div>
        <div class="card-body">
          <b-card
            border-variant="primary"
            header="Filter"
            header-bg-variant="info"
            header-text-variant="white"
          >
            <b-card-text>
              <b-row class="justify-content-center">
                <b-col cols="8">
                  <b-row class="mt-2 align-items-center">
                    <b-col cols="3" class="text-right">Periode Tanggal</b-col>
                    <b-col cols="9">
                      <b-row>
                        <b-col>
                          <b-form-datepicker
                            v-model="dateStart"
                            placeholder="Dari"
                            class="mb-2"
                            :date-format-options="{
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                            }"
                          ></b-form-datepicker>
                        </b-col>
                        <b-col>
                          <b-form-datepicker
                            v-model="dateEnd"
                            placeholder="Sampai"
                            class="mb-2"
                            :date-format-options="{
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                            }"
                          ></b-form-datepicker>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <b-row class="mt-3">
                <b-col class="text-center">
                  <b-button
                    class="btn btn-info px-4"
                    variant="primary"
                    @click="applyFilters"
                  >
                    Apply Filters
                  </b-button>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>

          <div class="form-group mt-3">
            <button
              title="Export To Excel"
              class="btn btn-info"
              @click="exportData"
            >
              <i class="fa fa-file-excel"></i>
            </button>
          </div>

          <b-table
            :items="posts"
            :fields="tableFields"
            responsive
            bordered
            hover
            small
            class="custom-table"
          >
            <template v-slot:thead-top>
              <tr class="header-yellow text-center align-middle">
                <th rowspan="2" class="align-middle border-dark">TANGGAL</th>
                <th rowspan="2" class="align-middle border-dark">RITASE</th>
                <th colspan="2" class="border-dark">
                  TONASE SETELAH POTONGAN {{ defaultPotongan }}% (TON)
                </th>
                <th colspan="2" class="border-dark">
                  TONASE POTONGAN {{ defaultPotongan }}% (TON)
                </th>
                <th colspan="3" class="border-dark">NETTO TIMBANGAN (TON)</th>
                <th colspan="3" class="border-dark">DIKEMBALIKAN (TON)</th>
                <th colspan="3" class="border-dark">TOTAL (TON)</th>
                <th rowspan="2" class="align-middle border-dark">
                  POTONGAN {{ defaultPotongan }}%
                </th>
                <th colspan="2" class="border-dark">% DIKEMBALIKAN</th>
              </tr>
              <tr class="header-yellow text-center">
                <th class="border-dark">TON</th>
                <th class="border-dark">TON/RIT</th>
                <th class="border-dark">TON</th>
                <th class="border-dark">TON/RIT</th>
                <th class="border-dark">JJG</th>
                <th class="border-dark">TON</th>
                <th class="border-dark">TON/RIT</th>
                <th class="border-dark">JJG</th>
                <th class="border-dark">TON</th>
                <th class="border-dark">TON/RIT</th>
                <th class="border-dark">JJG</th>
                <th class="border-dark">TON</th>
                <th class="border-dark">TON/RIT</th>
                <th class="border-dark">JJG</th>
                <th class="border-dark">TON</th>
              </tr>
              <tr style="display: none"></tr>
            </template>
          </b-table>

          <b-row>
            <b-col>
              <b-pagination
                v-model="pagination.current_page"
                :total-rows="pagination.total"
                :per-page="pagination.per_page"
                @change="changePage"
                align="left"
                class="mt-1"
              ></b-pagination>
            </b-col>
            <b-col class="text-right mt-2 text-muted font-weight-bold">
              Total: {{ rowcount }} data
            </b-col>
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
    return { title: 'Rekap Penerimaan TBS Eksternal & Sortasi' }
  },

  data() {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

    const formatDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`

    return {
      tableFields: [
        {
          key: 'tanggal',
          label: '',
          tdClass: 'align-middle text-center font-weight-bold',
        },
        { key: 'ritase', label: '', tdClass: 'align-middle text-center' },

        {
          key: 'setelah_potongan_ton',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },
        {
          key: 'setelah_potongan_ton_rit',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },

        {
          key: 'tonase_potongan_ton',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },
        {
          key: 'tonase_potongan_ton_rit',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },

        // NETTO TIMBANGAN (TON) -> Semuanya Format Number 2 Desimal
        {
          key: 'netto_jjg',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right bg-light',
        },
        {
          key: 'netto_ton',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right bg-light',
        },
        {
          key: 'netto_ton_rit',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right bg-light',
        },

        // DIKEMBALIKAN (TON)
        {
          key: 'dikembalikan_jjg',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },
        {
          key: 'dikembalikan_ton',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },
        {
          key: 'dikembalikan_ton_rit',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },

        // TOTAL (TON)
        {
          key: 'total_jjg',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right bg-light',
        },
        {
          key: 'total_ton',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right bg-light',
        },
        {
          key: 'total_ton_rit',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right bg-light',
        },

        // POTONGAN %
        {
          key: 'potongan_persen',
          label: '',
          tdClass: 'align-middle text-center',
        },

        // % DIKEMBALIKAN
        {
          key: 'perc_kembali_jjg',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right text-muted',
        },
        {
          key: 'perc_kembali_ton',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right text-muted',
        },
      ],
      dateStart: formatDate(firstDay),
      dateEnd: formatDate(today),
      posts: [],
      pagination: { current_page: 1, per_page: 50, total: 0 },
      isPaginating: false, // Menandakan sedang berganti page via pagination
      rowcount: 0,
      show: 0,
      defaultPotongan: 3,
    }
  },

  async mounted() {
    this.loadFiltersFromUrl()
    await this.fetchData()
  },

  methods: {
    formatNumber(value) {
      return Number.isFinite(Number(value)) ? Number(value).toFixed(2) : '0.00'
    },

    loadFiltersFromUrl() {
      const query = this.$route.query
      if (query.dateStart) this.dateStart = query.dateStart
      if (query.dateEnd) this.dateEnd = query.dateEnd
      if (query.page) this.pagination.current_page = parseInt(query.page)
    },

    async fetchData() {
      this.show = 0
      try {
        const params = {
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
          page: this.pagination.current_page || 1,
        }

        const response = await this.$axios.$get(
          '/api/admin/rekap_penerimaan_external_sortasi',
          { params }
        )

        this.posts = response.data.data || []
        this.pagination = response.data
        this.rowcount = response.data.total

        if (response.potongan_persen !== undefined) {
          this.defaultPotongan = response.potongan_persen
        }

        this.show = 1
      } catch (error) {
        console.error('Error in fetchData:', error)
        this.show = 1
      }
    },

    async applyFilters() {
      // 1. Reset ke halaman pertama HANYA jika yang di-klik adalah tombol filter
      if (this.pagination.current_page > 1 && !this.isPaginating) {
        this.pagination.current_page = 1
      }
      this.isPaginating = false

      const query = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        page: this.pagination.current_page,
      }

      // 2. Update URL dengan Error Handling (Mencegah "NavigationDuplicated")
      const currentQueryStr = JSON.stringify(this.$route.query)
      const newQueryStr = JSON.stringify(query)

      if (currentQueryStr !== newQueryStr) {
        try {
          await this.$router.push({ path: this.$route.path, query: query })
        } catch (err) {
          if (err.name !== 'NavigationDuplicated') {
            console.error(err)
          }
        }
      }

      await this.fetchData()
    },

    changePage(page) {
      this.isPaginating = true
      this.pagination.current_page = page
      this.applyFilters()
    },

    exportData() {
      const queryParams = new URLSearchParams()
      this.show = 0

      if (this.dateStart) queryParams.append('dateStart', this.dateStart)
      if (this.dateEnd) queryParams.append('dateEnd', this.dateEnd)

      // if (this.supplier_id && this.supplier_id.length > 0) {
      //   queryParams.append(
      //     'supplier',
      //     this.supplier_id.map((s) => s.supplier).join(',')
      //   )
      // }

      const fileName = `Rekap_Penerimaan_Tbs_External_Sortasi_${this.dateStart}_sd_${this.dateEnd}.xlsx`

      this.$axios({
        url: `/api/admin/rekap_penerimaan_external_sortasi_export?${queryParams.toString()}`,
        method: 'GET',
        responseType: 'blob',
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.show = 1
        })
        .catch((error) => {
          console.error('Export Error:', error)
          this.show = 1
        })
    },
  },
}
</script>

<style scoped>
.card-info.card-outline {
  border-top: 5px solid #ffb300;
}
.card-title {
  color: #333;
}
</style>

<style>
/* CSS UNTUK MENYEMBUNYIKAN THEAD DEFAULT BOOTSTRAP VUE */
.custom-table thead tr:not([class*='header-']) {
  display: none !important;
}

.header-yellow th {
  background-color: #ffb300 !important; /* Warna Oranye-Kuning seperti Mockup */
  color: #000 !important;
  font-weight: bold;
}

.border-dark {
  border: 1px solid #333 !important;
}

.custom-table td,
.custom-table th {
  border: 1px solid #dee2e6 !important;
  vertical-align: middle !important;
}
</style>
