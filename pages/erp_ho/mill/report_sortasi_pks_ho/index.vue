<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="mt-3 mx-2">
        <div v-if="show === 0">
          <b-img right src="/img/dsn_logo.png" alt="" class="img-logo"></b-img>
          <p class="txt-2">Loading</p>
          <div class="spinonediv-4"></div>
        </div>

        <div class="card card-outline card-info" v-if="show === 1">
          <div class="card-header">
            <h3 class="card-title">
              <i class="nav-icon fas fa-cog"></i> <b>Data Rekap Sortasi PKS</b>
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
                      <b-col cols="3" class="text-right">PKS</b-col>
                      <b-col cols="9">
                        <multiselect
                          v-model="pks_code"
                          :options="pksList"
                          label="code"
                          track-by="department_id"
                          :searchable="true"
                          :multiple="true"
                          placeholder="Pilih PKS"
                          :loading="isLoadingDropdown"
                        ></multiselect>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2 align-items-center">
                      <b-col cols="3" class="text-right">Tanggal</b-col>
                      <b-col cols="9">
                        <b-form-datepicker
                          v-model="selectedDate"
                          :dropup="false"
                          class="mb-2"
                          :date-format-options="{
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                          }"
                        ></b-form-datepicker>
                      </b-col>
                    </b-row>
                    <b-row class="mt-3 align-items-center">
                      <b-col cols="3" class="text-right">Tipe</b-col>
                      <b-col cols="9">
                        <b-form-select
                          v-model="selectedType"
                          :options="typeOptions"
                        ></b-form-select>
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
                      >Apply Filters</b-button
                    >
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
              :fields="fields"
              :items="posts"
              :tbody-tr-class="rowClass"
              small
              responsive
              bordered
              hover
              class="custom-table"
            >
              <template v-slot:thead-top>
                <tr class="header-brown text-center">
                  <th rowspan="2" class="align-middle border-dark">Mill</th>
                  <th rowspan="2" class="align-middle border-dark">Estate</th>
                  <th rowspan="2" class="align-middle border-dark">TGL</th>
                  <th class="border-dark align-middle" rowspan="2">
                    Selisih Jjg<br />(%)
                  </th>
                  <th class="border-dark">Buah Mentah</th>
                  <th class="border-dark">Buah Mengkal</th>
                  <th class="border-dark">Buah Matang</th>
                  <th class="border-dark">Lewat Matang</th>
                  <th class="border-dark">Tandan</th>
                  <th class="border-dark">Tangkai</th>
                  <th class="border-dark">Brondolan</th>
                  <th class="border-dark">Kotoran</th>

                  <th class="border-dark" rowspan="2">OER<br />%</th>
                  <th class="border-dark" rowspan="2">FFA<br />%</th>
                </tr>
                <tr class="header-brown text-center">
                  <th class="border-dark">Unripe</th>
                  <th class="border-dark">Underripe</th>
                  <th class="border-dark">Ripe</th>
                  <th class="border-dark">Overripe</th>
                  <th class="border-dark">Kosong (%)</th>
                  <th class="border-dark">Panjang (%)</th>
                  <th class="border-dark">(%)</th>
                  <th class="border-dark">(%)</th>
                </tr>

                <tr style="display: none"></tr>

                <tr class="header-yellow text-center text-sm">
                  <th colspan="3" class="text-right border-dark">Standar</th>
                  <th class="border-dark"></th>
                  <th class="border-dark" v-html="metadataHeaders[0]"></th>
                  <th class="border-dark" v-html="metadataHeaders[1]"></th>
                  <th class="border-dark" v-html="metadataHeaders[2]"></th>
                  <th class="border-dark" v-html="metadataHeaders[3]"></th>
                  <th class="border-dark" v-html="metadataHeaders[4]"></th>
                  <th class="border-dark" v-html="metadataHeaders[5]"></th>
                  <th class="border-dark" v-html="metadataHeaders[6]"></th>
                  <th class="border-dark" v-html="metadataHeaders[7]"></th>

                  <th class="border-dark"></th>
                  <th class="border-dark"></th>
                </tr>
              </template>

              <template #cell(display_pks)="data">
                <div
                  v-if="data.item.pksRowspan > 0"
                  :style="{
                    minHeight: data.item.pksRowspan * 30 + 'px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }"
                >
                  {{ data.value }}
                </div>
              </template>
              <template #cell(display_estate)="data">
                <div
                  v-if="data.item.estateRowspan > 0"
                  :style="{
                    minHeight: data.item.estateRowspan * 30 + 'px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }"
                >
                  {{ data.value }}
                </div>
              </template>
            </b-table>

            <b-row>
              <b-col class="text-right mt-2 text-muted font-weight-bold">
                Total: {{ rowcount }} baris data
              </b-col>
            </b-row>
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
    return { title: 'Report Sortasi PKS' }
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
      fields: [
        {
          key: 'display_pks',
          label: '',
          tdClass: 'align-middle text-center bg-white',
          tdAttr: (value, key, item) =>
            item.pksRowspan > 0
              ? { rowspan: item.pksRowspan }
              : { style: 'display:none' },
        },
        {
          key: 'display_estate',
          label: '',
          tdClass: 'align-middle text-center bg-white',
          tdAttr: (value, key, item) =>
            item.estateRowspan > 0
              ? { rowspan: item.estateRowspan }
              : { style: 'display:none' },
        },
        {
          key: 'display_tgl',
          label: '',
          tdClass: 'text-center font-weight-bold align-middle',
        },
        {
          key: 'percentage_qty',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
        {
          key: 'percentage_unripe',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
        {
          key: 'percentage_underripe',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
        {
          key: 'percentage_ripe',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
        {
          key: 'percentage_overripe',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
        {
          key: 'percentage_empty_bunch',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
        {
          key: 'percentage_long_stalk',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
        {
          key: 'percentage_fruit',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
        {
          key: 'percentage_garbage',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
        {
          key: 'oer',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
        {
          key: 'ffa',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center align-middle',
        },
      ],
      selectedDate: formatDate(yesterday),
      selectedType: 'HI',
      typeOptions: [
        { value: 'HI', text: 'HI' },
        { value: 'SHI', text: 'SHI' },
        { value: 'SBI', text: 'SBI' },
      ],
      // State untuk PKS
      pksList: [],
      pks_code: [], // Array karena multi-select
      isLoadingDropdown: false, // Loading indicator multiselect

      default_department_id: '',
      posts: [],
      // Menyiapkan 8 elemen default sementara menunggu API me-load
      metadataHeaders: [
        '0%',
        '< 2%',
        '≥ 95 %',
        '< 3 %',
        '0%',
        '0%',
        'Min 10',
        'Max 0.1',
      ],
      rowcount: 0,
      show: 1,
    }
  },

  async mounted() {
    await this.fetchPksDropdown()
    // await this.initDefaultState()
    // await this.fetchData()
  },

  methods: {
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.is_total) return 'row-total font-weight-bold text-dark'
      return 'row-data text-dark'
    },

    async fetchPksDropdown() {
      this.isLoadingDropdown = true
      try {
        // Panggil endpoint PKS khusus user yang sudah dibuat sebelumnya
        const response = await this.$axios.$get(
          '/api/admin/spot-cek-get_pks_dropdown-report'
        )
        this.pksList = response.data
      } catch (error) {
        console.error('Error fetching PKS dropdown:', error)
      } finally {
        this.isLoadingDropdown = false
      }
    },

    async initDefaultState() {
      const userDeptId = this.$auth?.user?.employee?.department_id
      if (userDeptId) {
        this.default_department_id = userDeptId
      }
    },

    async fetchData() {
      try {
        const params = {
          date: this.selectedDate,
          tipe_tanggal: this.selectedType,
          status: 'approved',
        }

        // Ambil ID dari multiselect (formatnya array of objects) -> ubah ke string koma
        if (this.pks_code && this.pks_code.length > 0) {
          params.department_id = this.pks_code
            .map((pks) => pks.department_id)
            .join(',')
        }

        const rawResponse = await this.$axios.$get(
          '/api/admin/report-sortasi-pks',
          { params }
        )

        let payload = rawResponse
        if (
          rawResponse.data &&
          !Array.isArray(rawResponse.data) &&
          rawResponse.data.data
        ) {
          payload = rawResponse.data
        }

        if (payload.metadata) {
          this.metadataHeaders = payload.metadata.split(',')
        }

        const dataArray = Array.isArray(payload.data) ? payload.data : []
        const factTotals = payload.fact_totals || {}

        this.posts = this.processDataWithTotals(
          dataArray,
          factTotals,
          this.selectedType
        )
        this.rowcount = payload.total || 0
      } catch (error) {
        console.error('Error in fetchData:', error)
      }
    },

    processDataWithTotals(rawData, factTotals, selectedType) {
      if (!rawData || rawData.length === 0) return []

      let groups = {}

      rawData.forEach((item) => {
        let pks = item.department_code || 'Unknown'
        if (!groups[pks]) groups[pks] = []
        groups[pks].push(item)
      })

      let finalData = []

      for (const [pks, items] of Object.entries(groups)) {
        let pksRowspanCount = 0
        let pksFirstItemIndex = finalData.length

        let estateRowspanCount = 0
        let estateFirstItemIndex = finalData.length

        // Variabel penampung untuk TOTAL GRAND ALL (Baris Paling Bawah)
        let grand_sum_unripe = 0,
          grand_sum_underripe = 0,
          grand_sum_ripe = 0,
          grand_sum_overripe = 0
        let grand_sum_empty = 0,
          grand_sum_long_stalk = 0,
          grand_sum_fruit = 0,
          grand_sum_garbage = 0
        let grand_sum_qty = 0
        let grand_jml_data = 0 // Total Pembagi Keseluruhan

        let sum_oer = 0,
          sum_ffa = 0
        let day_count = 0

        items.forEach((item) => {
          // Ambil SUM dan Count dari backend
          let sum_unripe = parseFloat(item.sum_perc_unripe || 0)
          let sum_underripe = parseFloat(item.sum_perc_underripe || 0)
          let sum_ripe = parseFloat(item.sum_perc_ripe || 0)
          let sum_overripe = parseFloat(item.sum_perc_overripe || 0)
          let sum_empty = parseFloat(item.sum_perc_empty_bunch || 0)
          let sum_long_stalk = parseFloat(item.sum_perc_long_stalk || 0)
          let sum_fruit = parseFloat(item.sum_perc_fruit || 0)
          let sum_garbage = parseFloat(item.sum_perc_garbage || 0)
          let sum_qty = parseFloat(item.sum_perc_qty || 0)

          let jml_data = parseInt(item.jml_data || 1) // Hindari pembagi 0

          let raw_oer = parseFloat(item.oer || 0)
          let raw_ffa = parseFloat(item.ffa || 0)

          let tglNum = ''
          if (item.transaction_date) {
            const dateObj = new Date(item.transaction_date)
            if (selectedType === 'SBI') {
              const monthNames = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'Mei',
                'Jun',
                'Jul',
                'Agt',
                'Sep',
                'Okt',
                'Nov',
                'Des',
              ]
              tglNum = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}`
            } else {
              tglNum = dateObj.getDate()
            }
          }

          // Push Baris Harian (Dibagi jml_data pada hari itu)
          finalData.push({
            display_pks: pks,
            display_estate: 'All',
            display_tgl: tglNum,
            percentage_unripe: sum_unripe / jml_data,
            percentage_underripe: sum_underripe / jml_data,
            percentage_ripe: sum_ripe / jml_data,
            percentage_overripe: sum_overripe / jml_data,
            percentage_empty_bunch: sum_empty / jml_data,
            percentage_long_stalk: sum_long_stalk / jml_data,
            percentage_fruit: sum_fruit / jml_data,
            percentage_garbage: sum_garbage / jml_data,
            percentage_qty: sum_qty / jml_data,
            oer: raw_oer,
            ffa: raw_ffa,
            is_total: false,
            pksRowspan: 0,
            estateRowspan: 0,
          })

          // Akumulasikan ke Grand Total
          grand_sum_unripe += sum_unripe
          grand_sum_underripe += sum_underripe
          grand_sum_ripe += sum_ripe
          grand_sum_overripe += sum_overripe
          grand_sum_empty += sum_empty
          grand_sum_long_stalk += sum_long_stalk
          grand_sum_fruit += sum_fruit
          grand_sum_garbage += sum_garbage
          grand_sum_qty += sum_qty

          grand_jml_data += jml_data // Tambahkan total pembaginya

          if (raw_oer > 0) sum_oer += raw_oer
          if (raw_ffa > 0) sum_ffa += raw_ffa
          day_count++

          pksRowspanCount++
          estateRowspanCount++
        })

        // Rata-rata OER & FFA (Tetap menggunakan day_count karena sumber awalnya sudah AVG per hari)
        let final_avr_oer = day_count > 0 ? sum_oer / day_count : 0
        let final_avr_ffa = day_count > 0 ? sum_ffa / day_count : 0

        if (['SHI', 'SBI'].includes(selectedType)) {
          const pksUpper = pks.toUpperCase()
          if (factTotals[pksUpper]) {
            final_avr_oer = factTotals[pksUpper].oer
            final_avr_ffa = factTotals[pksUpper].ffa
          }
        }

        // Push Baris AVR (Dibagi grand_jml_data agar menjadi rata-rata mutlak)
        finalData.push({
          display_pks: pks,
          display_estate: 'All',
          display_tgl: 'Avr',
          percentage_unripe:
            grand_jml_data > 0 ? grand_sum_unripe / grand_jml_data : 0,
          percentage_underripe:
            grand_jml_data > 0 ? grand_sum_underripe / grand_jml_data : 0,
          percentage_ripe:
            grand_jml_data > 0 ? grand_sum_ripe / grand_jml_data : 0,
          percentage_overripe:
            grand_jml_data > 0 ? grand_sum_overripe / grand_jml_data : 0,
          percentage_empty_bunch:
            grand_jml_data > 0 ? grand_sum_empty / grand_jml_data : 0,
          percentage_long_stalk:
            grand_jml_data > 0 ? grand_sum_long_stalk / grand_jml_data : 0,
          percentage_fruit:
            grand_jml_data > 0 ? grand_sum_fruit / grand_jml_data : 0,
          percentage_garbage:
            grand_jml_data > 0 ? grand_sum_garbage / grand_jml_data : 0,
          percentage_qty:
            grand_jml_data > 0 ? grand_sum_qty / grand_jml_data : 0,
          oer: final_avr_oer,
          ffa: final_avr_ffa,
          is_total: true,
          pksRowspan: 0,
          estateRowspan: 0,
        })

        pksRowspanCount++
        estateRowspanCount++

        finalData[pksFirstItemIndex].pksRowspan = pksRowspanCount
        finalData[estateFirstItemIndex].estateRowspan = estateRowspanCount
      }

      return finalData
    },
    formatToTwoDecimals(value) {
      return Number.isFinite(Number(value)) ? Number(value).toFixed(2) : '0.00'
    },

    async applyFilters() {
      this.show = 0
      try {
        await this.fetchData()
        this.show = 1
      } catch (error) {
        console.error('Error applying filters:', error)
        this.show = 1
      }
    },

    exportData() {
      try {
        this.show = 0
        const queryParams = new URLSearchParams()

        if (this.selectedDate) queryParams.append('date', this.selectedDate)
        if (this.selectedType)
          queryParams.append('tipe_tanggal', this.selectedType)
        if (this.default_department_id)
          queryParams.append('department_id', this.default_department_id)

        queryParams.append('status', 'approved')

        this.$axios({
          url: `/api/admin/report-sortasi-pks-export?${queryParams.toString()}`,
          method: 'GET',
          responseType: 'blob',
        })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'ReportSortasiPKS.xlsx')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            this.show = 1
          })
          .catch((error) => {
            console.error('Export Error:', error)
            this.show = 1
          })
      } catch (error) {
        this.show = 1
      }
    },
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
.text-sm {
  font-size: 0.85rem;
}
</style>

<style>
/* Header asli b-table akan kita biarkan disembunyikan jika masih mengganggu (opsional) */
.custom-table thead tr:not([class*='header-']) {
  display: none !important;
}

.header-brown th {
  background-color: #c07b36 !important;
  color: #fff !important;
}

.header-yellow th {
  background-color: #ffff99 !important;
  color: #000 !important;
  font-weight: bold;
}

.border-dark {
  border: 1px solid #333 !important;
}

.row-data td {
  background-color: #fff !important;
  border-color: #333 !important;
}

.row-total td {
  background-color: #d1f2eb !important;
  border-color: #333 !important;
  font-weight: bold;
}

.custom-table td,
.custom-table th {
  border: 1px solid #333 !important;
  vertical-align: middle !important;
}
</style>
