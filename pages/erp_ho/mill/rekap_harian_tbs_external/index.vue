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
            <i class="nav-icon fas fa-cog"></i> <b>Rekap Harian TBS External</b>
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
              <b-row>
                <b-col cols="6">
                  <b-row class="mt-2">
                    <b-col cols="3">Periode Tanggal</b-col>
                    <b-col cols="9">
                      <b-form-datepicker
                        v-model="dateStart"
                        placeholder="Pilih tanggal awal"
                        class="mb-2"
                        :date-format-options="{
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                        }"
                      ></b-form-datepicker>
                      <b-form-datepicker
                        v-model="dateEnd"
                        placeholder="Pilih tanggal akhir"
                        :date-format-options="{
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                        }"
                      ></b-form-datepicker>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col cols="6">
                  <b-row class="mt-2 align-items-center">
                    <b-col cols="3">Supplier</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="supplier_id"
                        :options="suppliers"
                        label="supplier"
                        track-by="lifnr"
                        :searchable="true"
                        :multiple="true"
                        placeholder="Pilih Supplier"
                        :loading="isLoadingDropdown"
                      ></multiselect>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <b-row class="mt-4">
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
              <tr class="header-yellow text-center text-sm align-middle">
                <th rowspan="2" class="align-middle border-dark">TANGGAL</th>
                <th rowspan="2" class="align-middle border-dark">SUPPLIER</th>
                <th rowspan="2" class="align-middle border-dark">DRIVER</th>
                <th rowspan="2" class="align-middle border-dark">JUMLAH JJG</th>
                <th rowspan="2" class="align-middle border-dark">
                  NO TIKET TIMBANG (NPB)
                </th>
                <th rowspan="2" class="align-middle border-dark">NO SPTBS</th>
                <th rowspan="2" class="align-middle border-dark">
                  TIMBANG MASUK
                </th>
                <th rowspan="2" class="align-middle border-dark">
                  TIMBANG KELUAR
                </th>
                <th rowspan="2" class="align-middle border-dark">
                  TONASE BERSIH
                </th>
                <th colspan="12" class="border-dark">
                  POTONGAN BERDASARKAN KATEGORI TBS
                </th>
                <th colspan="2" class="border-dark">TOTAL POTONGAN SORTASI</th>
                <th rowspan="2" class="align-middle border-dark">NETTO</th>
                <th colspan="3" class="border-dark">JJG KEMBALI</th>
              </tr>
              <tr class="header-yellow text-center text-sm">
                <th class="border-dark">%</th>
                <th class="border-dark">KG</th>
                <th class="border-dark">%</th>
                <th class="border-dark">KG</th>
                <th class="border-dark">%</th>
                <th class="border-dark">KG</th>
                <th class="border-dark">%</th>
                <th class="border-dark">KG</th>
                <th class="border-dark">%</th>
                <th class="border-dark">KG</th>
                <th class="border-dark">%</th>
                <th class="border-dark">KG</th>

                <th class="border-dark">%</th>
                <th class="border-dark">KG</th>

                <th class="border-dark">JJG</th>
                <th class="border-dark">BJR</th>
                <th class="border-dark">TON</th>
              </tr>
            </template>
          </b-table>

          <b-row>
            <b-col class="text-right mt-2 text-muted font-weight-bold">
              Total: {{ rowcount }} baris data
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
    return { title: 'Rekap Harian TBS External' }
  },

  data() {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const formatDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`

    return {
      tableFields: [
        { key: 'tanggal', label: '', tdClass: 'align-middle text-center' },
        { key: 'supplier', label: '', tdClass: 'align-middle' },
        { key: 'driver', label: '', tdClass: 'align-middle' },
        { key: 'jumlah_jjg', label: '', tdClass: 'align-middle text-center' },
        { key: 'npb', label: '', tdClass: 'align-middle text-center' },
        { key: 'spb', label: '', tdClass: 'align-middle text-center' },
        { key: 'timbang_masuk', label: '', tdClass: 'align-middle text-right' },
        {
          key: 'timbang_keluar',
          label: '',
          tdClass: 'align-middle text-right',
        },
        {
          key: 'tonase',
          label: '',
          tdClass: 'align-middle text-right font-weight-bold',
        },

        { key: 'bm_perc', label: '', tdClass: 'align-middle text-center' },
        { key: 'bm_kg', label: '', tdClass: 'align-middle text-right' },

        { key: 'blm_perc', label: '', tdClass: 'align-middle text-center' },
        { key: 'blm_kg', label: '', tdClass: 'align-middle text-right' },

        { key: 'tp_perc', label: '', tdClass: 'align-middle text-center' },
        { key: 'tp_kg', label: '', tdClass: 'align-middle text-right' },

        { key: 'tk_perc', label: '', tdClass: 'align-middle text-center' },
        { key: 'tk_kg', label: '', tdClass: 'align-middle text-right' },

        { key: 'brd_perc', label: '', tdClass: 'align-middle text-center' },
        { key: 'brd_kg', label: '', tdClass: 'align-middle text-right' },

        { key: 'kotoran_perc', label: '', tdClass: 'align-middle text-center' },
        { key: 'kotoran_kg', label: '', tdClass: 'align-middle text-right' },

        {
          key: 'tot_potongan_perc',
          label: '',
          tdClass: 'align-middle text-center font-weight-bold',
        },
        {
          key: 'tot_potongan_kg',
          label: '',
          tdClass: 'align-middle text-right font-weight-bold',
        },

        {
          key: 'netto',
          label: '',
          tdClass: 'align-middle text-right font-weight-bold text-success',
        },

        { key: 'jjg_kembali', label: '', tdClass: 'align-middle text-center' },
        { key: 'bjr', label: '', tdClass: 'align-middle text-center' },
        { key: 'ton_kembali', label: '', tdClass: 'align-middle text-right' },
      ],
      dateStart: formatDate(yesterday),
      dateEnd: formatDate(yesterday),
      supplier_id: [],
      suppliers: [],
      posts: [],
      rowcount: 0,
      show: 0,
      isLoadingDropdown: true,
    }
  },

  async mounted() {
    await this.loadDropdownData()
    this.loadFiltersFromUrl()
    await this.fetchData()
  },

  methods: {
    async loadDropdownData() {
      try {
        const response = await this.$axios.$get(
          '/api/admin/rekap_harian_tbs_external_get_supplier_dropdown'
        )
        this.suppliers = response.data || []
        this.isLoadingDropdown = false
      } catch (error) {
        console.error('Error loading dropdowns', error)
        this.isLoadingDropdown = false
      }
    },

    loadFiltersFromUrl() {
      const query = this.$route.query
      if (query.dateStart) this.dateStart = query.dateStart
      if (query.dateEnd) this.dateEnd = query.dateEnd

      if (query.supplier) {
        const lifnrs = query.supplier.split(',')
        this.supplier_id = this.suppliers.filter((s) =>
          lifnrs.includes(s.lifnr)
        )
      }
    },

    async fetchData() {
      this.show = 0
      try {
        const params = {
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
        }

        if (this.supplier_id && this.supplier_id.length > 0) {
          params.supplier = this.supplier_id.map((s) => s.supplier).join(',')
        }

        const response = await this.$axios.$get(
          '/api/admin/rekap_harian_tbs_external',
          { params }
        )

        this.posts = response.data || []
        this.rowcount = this.posts.length

        this.show = 1
      } catch (error) {
        console.error('Error in fetchData:', error)
        this.show = 1
      }
    },

    async applyFilters() {
      const query = {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      }

      if (this.supplier_id && this.supplier_id.length > 0) {
        query.supplier = this.supplier_id.map((s) => s.lifnr).join(',')
      }

      if (JSON.stringify(this.$route.query) !== JSON.stringify(query)) {
        await this.$router
          .push({ path: this.$route.path, query })
          .catch(() => {})
      }

      await this.fetchData()
    },

    exportData() {
      const queryParams = new URLSearchParams()

      if (this.dateStart) queryParams.append('dateStart', this.dateStart)
      if (this.dateEnd) queryParams.append('dateEnd', this.dateEnd)

      if (this.supplier_id && this.supplier_id.length > 0) {
        queryParams.append(
          'supplier',
          this.supplier_id.map((s) => s.supplier).join(',')
        )
      }

      const fileName = `Rekap_Harian_Tbs_External_${this.dateStart}_sd_${this.dateEnd}.xlsx`

      this.$axios({
        url: `/api/admin/rekap_harian_tbs_external_export?${queryParams.toString()}`,
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
        })
        .catch((error) => {
          console.error('Export Error:', error)
        })
    },
  },
}
</script>

<style scoped>
.card-info.card-outline {
  border-top: 5px solid #ffc107;
}
.card-title {
  color: #333;
}
.text-sm {
  font-size: 0.8rem;
}
</style>

<style>
/* CSS UNTUK MENYEMBUNYIKAN THEAD DEFAULT BOOTSTRAP VUE */
.custom-table thead tr:not([class*='header-']) {
  display: none !important;
}

.header-yellow th {
  background-color: #ffc107 !important; /* Warna Kuning seperti Mockup */
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
