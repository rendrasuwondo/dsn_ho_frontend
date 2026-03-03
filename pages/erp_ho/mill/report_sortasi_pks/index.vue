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
                      <b-col cols="3" class="text-right">Tanggal</b-col>
                      <b-col cols="9">
                        <b-form-datepicker
                          v-model="selectedDate"
                          dropup="false"
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
                <tr class="header-yellow text-center text-sm">
                  <th colspan="3" class="text-right border-dark">Standar</th>
                  <th class="border-dark">0%</th>
                  <th class="border-dark">&lt; 2%</th>
                  <th class="border-dark">&ge; 95 %</th>
                  <th class="border-dark">&lt; 3 %</th>
                  <th class="border-dark">0%</th>
                  <th class="border-dark">0%</th>
                  <th class="border-dark">Min 10</th>
                  <th class="border-dark">Max 0.1</th>
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
      default_department_id: '',
      posts: [],
      rowcount: 0,
      show: 1,
    }
  },

  async mounted() {
    await this.initDefaultState()
    await this.fetchData()
  },

  methods: {
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.is_total) return 'row-total font-weight-bold text-dark'
      return 'row-data text-dark'
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
          plant_type: 'NUCLEUS',
        }

        if (this.default_department_id) {
          params.department_id = this.default_department_id
        }

        const rawResponse = await this.$axios.$get(
          '/api/admin/report-sortasi-pks',
          { params }
        )

        this.posts = this.processDataWithTotals(rawResponse.data.data)
        this.rowcount = rawResponse.data.total
      } catch (error) {
        console.error('Error in fetchData:', error)
      }
    },

    processDataWithTotals(rawData) {
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

        // Di PKS ini hanya ada 1 grup Estate yaitu "All"
        let estateRowspanCount = 0
        let estateFirstItemIndex = finalData.length

        let sum_unripe = 0,
          sum_underripe = 0,
          sum_ripe = 0,
          sum_overripe = 0
        let sum_empty = 0,
          sum_long_stalk = 0,
          sum_fruit = 0,
          sum_garbage = 0
        let sum_qty_npb = 0,
          sum_tonase = 0

        let sum_oer = 0,
          sum_ffa = 0
        let day_count = 0

        items.forEach((item) => {
          let raw_qty_npb = parseFloat(item.qty_npb || 0)
          let raw_tonase = parseFloat(item.tonase || 0)

          let raw_unripe = parseFloat(item.qty_unripe || 0)
          let raw_underripe = parseFloat(item.qty_underripe || 0)
          let raw_ripe = parseFloat(item.qty_ripe || 0)
          let raw_overripe = parseFloat(item.qty_overripe || 0)
          let raw_empty = parseFloat(item.qty_empty_bunch || 0)
          let raw_long_stalk = parseFloat(item.qty_long_stalk || 0)
          let raw_fruit = parseFloat(item.loose_fruit || 0)
          let raw_garbage = parseFloat(item.qty_garbage || 0)

          let raw_oer = parseFloat(item.oer || 0)
          let raw_ffa = parseFloat(item.ffa || 0)
          let perc_oer = raw_oer
          let perc_ffa = raw_ffa

          let tglNum = item.transaction_date
            ? new Date(item.transaction_date).getDate()
            : ''

          finalData.push({
            display_pks: pks,
            display_estate: 'All',
            display_tgl: tglNum,
            percentage_unripe:
              raw_qty_npb > 0 ? (raw_unripe / raw_qty_npb) * 100 : 0,
            percentage_underripe:
              raw_qty_npb > 0 ? (raw_underripe / raw_qty_npb) * 100 : 0,
            percentage_ripe:
              raw_qty_npb > 0 ? (raw_ripe / raw_qty_npb) * 100 : 0,
            percentage_overripe:
              raw_qty_npb > 0 ? (raw_overripe / raw_qty_npb) * 100 : 0,
            percentage_empty_bunch:
              raw_qty_npb > 0 ? (raw_empty / raw_qty_npb) * 100 : 0,
            percentage_long_stalk:
              raw_qty_npb > 0 ? (raw_long_stalk / raw_qty_npb) * 100 : 0,
            percentage_fruit:
              raw_tonase > 0 ? (raw_fruit / raw_tonase) * 100 : 0,
            percentage_garbage:
              raw_qty_npb > 0 ? (raw_garbage / raw_qty_npb) * 100 : 0,
            oer: perc_oer,
            ffa: perc_ffa,
            is_total: false,
            pksRowspan: 0,
            estateRowspan: 0,
          })

          sum_unripe += raw_unripe
          sum_underripe += raw_underripe
          sum_ripe += raw_ripe
          sum_overripe += raw_overripe
          sum_empty += raw_empty
          sum_long_stalk += raw_long_stalk
          sum_fruit += raw_fruit
          sum_garbage += raw_garbage
          sum_qty_npb += raw_qty_npb
          sum_tonase += raw_tonase

          sum_oer += perc_oer
          sum_ffa += perc_ffa
          day_count++

          pksRowspanCount++
          estateRowspanCount++
        })

        // Baris Rata-rata (Avr)
        finalData.push({
          display_pks: pks,
          display_estate: 'All',
          display_tgl: 'Avr',
          percentage_unripe:
            sum_qty_npb > 0 ? (sum_unripe / sum_qty_npb) * 100 : 0,
          percentage_underripe:
            sum_qty_npb > 0 ? (sum_underripe / sum_qty_npb) * 100 : 0,
          percentage_ripe: sum_qty_npb > 0 ? (sum_ripe / sum_qty_npb) * 100 : 0,
          percentage_overripe:
            sum_qty_npb > 0 ? (sum_overripe / sum_qty_npb) * 100 : 0,
          percentage_empty_bunch:
            sum_qty_npb > 0 ? (sum_empty / sum_qty_npb) * 100 : 0,
          percentage_long_stalk:
            sum_qty_npb > 0 ? (sum_long_stalk / sum_qty_npb) * 100 : 0,
          percentage_fruit: sum_tonase > 0 ? (sum_fruit / sum_tonase) * 100 : 0,
          percentage_garbage:
            sum_qty_npb > 0 ? (sum_garbage / sum_qty_npb) * 100 : 0,
          oer: day_count > 0 ? sum_oer / day_count : 0,
          ffa: day_count > 0 ? sum_ffa / day_count : 0,
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
.custom-table thead tr:nth-child(4) {
  display: none !important;
}

.header-brown th {
  background-color: #c07b36 !important;
  color: #fff !important;
}
.header-yellow th {
  background-color: #ffff99 !important;
  color: #000 !important;
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
}
.custom-table td,
.custom-table th {
  border: 1px solid #333 !important;
}
</style>
