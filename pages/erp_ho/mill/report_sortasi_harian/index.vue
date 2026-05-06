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
      <div class="card card-outline card-info mx-2 mt-3">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-cog"></i>
            <b>Data Harian Sortasi</b>
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
              <b-row>
                <b-col cols="6">
                  <b-row class="mt-2 align-items-center">
                    <b-col cols="3">Tanggal</b-col>
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
                    <b-col cols="3">Tipe</b-col>
                    <b-col cols="9">
                      <b-form-select
                        v-model="selectedType"
                        :options="typeOptions"
                      ></b-form-select>
                    </b-col>
                  </b-row>

                  <b-row class="mt-3 align-items-center">
                    <b-col cols="3">Kategori</b-col>
                    <b-col cols="9">
                      <b-form-select
                        v-model="selectedStatus"
                        :options="statusOptions"
                      ></b-form-select>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col cols="6">
                  <b-row class="mt-2 align-items-center">
                    <b-col cols="3">PKS</b-col>
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
                  <b-row class="mt-3 align-items-center">
                    <b-col cols="3">Estate</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="estate_id"
                        :options="estates"
                        label="department_code_plantation"
                        track-by="department_code_plantation"
                        :searchable="true"
                        :multiple="true"
                        placeholder="Pilih Estate"
                        :loading="isLoadingDropdown"
                      ></multiselect>
                    </b-col>
                  </b-row>
                  <b-row class="mt-3 align-items-center">
                    <b-col cols="3">Afdeling</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="afdeling_id"
                        :options="afdelings"
                        label="afdeling_code"
                        track-by="afdeling_code"
                        :searchable="true"
                        :multiple="true"
                        placeholder="Pilih Afdeling"
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
              <tr class="header-yellow text-center">
                <th rowspan="2" class="align-middle bg-white border-0">
                  Tanggal
                </th>
                <th rowspan="2" class="align-middle bg-white border-0">PKS</th>
                <th rowspan="2" class="align-middle bg-white border-0">
                  Estate
                </th>
                <th rowspan="2" class="align-middle">Afdeling</th>
                <th>Un Ripe</th>
                <th>Under Ripe</th>
                <th>Ripe</th>
                <th>Over Ripe</th>
                <th>Janjang Kosong</th>
                <th>Tangkai Panjang</th>
                <th>Brondolan</th>
                <th>Total Sampah</th>
              </tr>
              <tr class="header-yellow text-center text-sm">
                <th
                  v-for="(head, idx) in headersData"
                  :key="idx"
                  v-html="head"
                ></th>
              </tr>
              <tr style="display: none"></tr>
            </template>

            <template #cell(display_date)="data">
              <div
                v-if="data.item.dateRowspan > 0"
                :style="{
                  minHeight: data.item.dateRowspan * 30 + 'px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }"
              >
                {{ data.value }}
              </div>
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
                <!-- <span
                  v-if="data.item.plant_type === 'PLASMA'"
                  class="badge badge-warning ml-1"
                  >Plasma</span
                > -->
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
    </section>
  </div>
</template>

<script>
import menuAccessLog from '~/mixins/menuAccessLog'

export default {
  layout: 'admin',
  head() {
    return { title: 'Report Sortasi Harian' }
  },
  mixins: [menuAccessLog],
  data() {
    const today = new Date()
    let defaultDate = new Date()

    if (today.getDay() === 1) defaultDate.setDate(today.getDate() - 2)
    else defaultDate.setDate(today.getDate() - 1)

    const formatDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`

    return {
      fields: [
        {
          key: 'display_date',
          label: '',
          tdClass: 'align-middle text-center text-nowrap bg-white',
          tdAttr: (v, k, i) =>
            i.dateRowspan > 0
              ? { rowspan: i.dateRowspan }
              : { style: 'display:none' },
        },
        {
          key: 'display_pks',
          label: '',
          tdClass: 'align-middle text-center text-nowrap bg-white',
          tdAttr: (v, k, i) =>
            i.pksRowspan > 0
              ? { rowspan: i.pksRowspan }
              : { style: 'display:none' },
        },
        {
          key: 'display_estate',
          label: '',
          tdClass:
            'text-center font-weight-bold align-middle bg-light-blue text-nowrap',
          tdAttr: (v, k, i) =>
            i.estateRowspan > 0
              ? { rowspan: i.estateRowspan }
              : { style: 'display:none' },
        },
        {
          key: 'afdeling_code',
          label: '',
          tdClass: 'text-center font-weight-bold',
        },
        {
          key: 'percentage_unripe',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center',
        },
        {
          key: 'percentage_underripe',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center',
        },
        {
          key: 'percentage_ripe',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center',
        },
        {
          key: 'percentage_overripe',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center',
        },
        {
          key: 'percentage_empty_bunch',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center',
        },
        {
          key: 'percentage_long_stalk',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center',
        },
        {
          key: 'percentage_fruit',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center',
        },
        {
          key: 'percentage_garbage',
          label: '',
          formatter: this.formatToTwoDecimals,
          tdClass: 'text-center',
        },
      ],
      selectedDate: formatDate(defaultDate),
      selectedType: 'HI',
      typeOptions: [
        { value: 'HI', text: 'HI' },
        { value: 'SHI', text: 'SHI' },
        { value: 'SBI', text: 'SBI' },
      ],
      selectedStatus: '', // Default kosong = Semua Kategori
      statusOptions: [
        { value: '', text: 'Semua Kategori' },
        { value: 'NUCLEUS', text: 'NUCLEUS' },
        { value: 'PLASMA', text: 'PLASMA' },
      ],
      estate_id: [],
      estates: [],
      afdeling_id: [],
      afdelings: [],
      pks_code: [],
      pksList: [],
      posts: [],
      rowcount: 0,
      show: 1,
      isLoadingDropdown: true,
      headersData: [
        '0%',
        '&lt; 2%',
        '&ge; 95 %',
        '&lt; 3 %',
        '0%',
        '0%',
        'Min 10',
        '0%',
      ],
    }
  },

  async mounted() {
    this.recordMenuLog('Report Sortasi Harian') // Catat akses menu
    await this.loadDropdownData()
    await this.initDefaultState()
    await this.fetchData()
  },

  methods: {
    getDefaultDate() {
      const today = new Date()
      let d = new Date()
      if (today.getDay() === 1) d.setDate(today.getDate() - 2)
      else d.setDate(today.getDate() - 1)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(d.getDate()).padStart(2, '0')}`
    },

    async initDefaultState() {
      if (Object.keys(this.$route.query).length > 0) {
        await this.$router
          .replace({ path: this.$route.path, query: {} })
          .catch(() => {})
      }
      this.selectedDate = this.getDefaultDate()
      this.selectedType = 'HI'
      this.selectedStatus = ''
      this.estate_id = []
      this.afdeling_id = []

      const userDeptCode = this.$auth?.user?.employee?.department_code
      if (userDeptCode) {
        const defaultPks = this.pksList.find((p) => p.code === userDeptCode)
        this.pks_code = defaultPks ? [defaultPks] : []
      } else {
        this.pks_code = []
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.is_total) return 'row-total font-weight-bold text-dark'
      return 'row-data text-dark'
    },

    async loadDropdownData() {
      try {
        const [pksRes, estateRes, afdRes] = await Promise.all([
          this.$axios.$get(`/api/admin/report-sortasi-pks-dropdown`),
          this.$axios.$get(`/api/admin/report-sortasi-estate-dropdown`),
          this.$axios.$get(`/api/admin/report-sortasi-afdeling-dropdown`),
        ])
        this.pksList = pksRes.data || []
        this.estates = estateRes.data || []
        this.afdelings = afdRes.data || []
        this.isLoadingDropdown = false
      } catch (error) {
        console.error('Error loading dropdowns', error)
      }
    },

    async fetchData() {
      try {
        const params = {
          date: this.selectedDate,
          tipe_tanggal: this.selectedType,
          status: 'approved',
        }

        if (this.selectedStatus !== '') {
          params.plant_type = this.selectedStatus
        }

        if (this.pks_code && this.pks_code.length > 0) {
          params.department_id = this.pks_code
            .map((p) => p.department_id)
            .join(',')
        }
        if (this.estate_id && this.estate_id.length > 0) {
          params.department_code_plantation = this.estate_id
            .map((e) => e.department_code_plantation)
            .join(',')
        }
        if (this.afdeling_id && this.afdeling_id.length > 0) {
          params.afdeling_code = this.afdeling_id
            .map((a) => a.afdeling_code)
            .join(',')
        }

        const rawResponse = await this.$axios.$get(
          '/api/admin/report-sortasi',
          { params }
        )
        let payload = rawResponse.data ? rawResponse.data : rawResponse

        this.posts = this.processDataWithTotals(payload.data, this.selectedType)
        this.rowcount = payload.total

        if (payload.metadata) {
          this.headersData = payload.metadata.split(',')
        }
      } catch (error) {
        console.error('Error in fetchData:', error)
      }
    },

    processDataWithTotals(rawData, selectedType) {
      if (!rawData || rawData.length === 0) return []

      let groupedData = {}

      // 1. Grouping Data dengan hierarki: Date -> PKS -> PlantType -> Estate
      rawData.forEach((item) => {
        let date = item.transaction_date || 'Unknown'
        if (selectedType === 'HI' && date !== 'Unknown') {
          date = date.split(' ')[0]
        }

        let pks = item.department_code || 'Unknown'
        let estate = item.department_code_plantation || 'Unknown'
        let afdeling = item.afdeling_code || 'Unknown'
        let plantType = item.plant_type || 'NUCLEUS'

        // Logika Plasma (Ubah Estate menjadi "KL")
        if (plantType === 'PLASMA' && estate.length >= 2) {
          afdeling = estate
          estate = estate.substring(0, 2).toUpperCase()
        }

        if (!groupedData[date]) groupedData[date] = {}
        if (!groupedData[date][pks])
          groupedData[date][pks] = { NUCLEUS: {}, PLASMA: {} }
        if (!groupedData[date][pks][plantType][estate])
          groupedData[date][pks][plantType][estate] = []

        item.mapped_afdeling = afdeling
        groupedData[date][pks][plantType][estate].push(item)
      })

      let finalData = []
      const plantOrder = ['NUCLEUS', 'PLASMA']

      // 2. Iterasi & Set Rowspan
      for (const [date, pksGroups] of Object.entries(groupedData)) {
        let dateRowspanCount = 0
        let dateFirstItemIndex = finalData.length

        for (const [pks, plantTypes] of Object.entries(pksGroups)) {
          let pksRowspanCount = 0
          let pksFirstItemIndex = finalData.length

          // Loop Plant Type (Pastikan NUCLEUS dulu baru PLASMA)
          plantOrder.forEach((pType) => {
            let estateGroups = plantTypes[pType]
            if (!estateGroups) return

            for (const [estate, items] of Object.entries(estateGroups)) {
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

              let estateRowspanCount = 0
              let estateFirstItemIndex = finalData.length

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

                let formattedDate =
                  selectedType === 'HI' ? this.formatDateStr(date) : date

                finalData.push({
                  display_date: formattedDate,
                  display_pks: pks,
                  display_estate: estate,
                  afdeling_code: item.mapped_afdeling,
                  plant_type: pType,
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
                  is_total: false,
                  dateRowspan: 0,
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

                dateRowspanCount++
                pksRowspanCount++
                estateRowspanCount++
              })

              // Baris Total per Estate
              finalData.push({
                display_date:
                  selectedType === 'HI' ? this.formatDateStr(date) : date,
                display_pks: pks,
                display_estate: estate,
                afdeling_code: 'TOTAL',
                plant_type: pType,
                percentage_unripe:
                  sum_qty_npb > 0 ? (sum_unripe / sum_qty_npb) * 100 : 0,
                percentage_underripe:
                  sum_qty_npb > 0 ? (sum_underripe / sum_qty_npb) * 100 : 0,
                percentage_ripe:
                  sum_qty_npb > 0 ? (sum_ripe / sum_qty_npb) * 100 : 0,
                percentage_overripe:
                  sum_qty_npb > 0 ? (sum_overripe / sum_qty_npb) * 100 : 0,
                percentage_empty_bunch:
                  sum_qty_npb > 0 ? (sum_empty / sum_qty_npb) * 100 : 0,
                percentage_long_stalk:
                  sum_qty_npb > 0 ? (sum_long_stalk / sum_qty_npb) * 100 : 0,
                percentage_fruit:
                  sum_tonase > 0 ? (sum_fruit / sum_tonase) * 100 : 0,
                percentage_garbage:
                  sum_qty_npb > 0 ? (sum_garbage / sum_qty_npb) * 100 : 0,
                is_total: true,
                dateRowspan: 0,
                pksRowspan: 0,
                estateRowspan: 0,
              })

              dateRowspanCount++
              pksRowspanCount++
              estateRowspanCount++

              finalData[estateFirstItemIndex].estateRowspan = estateRowspanCount
            }
          })

          // Set rowspan untuk PKS SETELAH semua plantType (Nucleus & Plasma) digabung
          if (finalData[pksFirstItemIndex]) {
            finalData[pksFirstItemIndex].pksRowspan = pksRowspanCount
          }
        }

        if (finalData[dateFirstItemIndex]) {
          finalData[dateFirstItemIndex].dateRowspan = dateRowspanCount
        }
      }

      return finalData
    },

    formatToTwoDecimals(value) {
      return Number.isFinite(Number(value)) ? Number(value).toFixed(2) : '0.00'
    },

    formatDateStr(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      return `${day}-${monthNames[date.getMonth()]}-${date.getFullYear()}`
    },

    async applyFilters() {
      this.show = 0
      try {
        const query = {
          date: this.selectedDate,
          tipe_tanggal: this.selectedType,
        }

        if (this.selectedStatus !== '') {
          query.plant_type = this.selectedStatus
        }

        if (this.estate_id && this.estate_id.length > 0) {
          query.department_code_plantation = this.estate_id
            .map((e) => e.department_code_plantation)
            .join(',')
        }
        if (this.afdeling_id && this.afdeling_id.length > 0) {
          query.afdeling_code = this.afdeling_id
            .map((a) => a.afdeling_code)
            .join(',')
        }
        if (this.pks_code && this.pks_code.length > 0) {
          query.department_id = this.pks_code
            .map((p) => p.department_id)
            .join(',')
        }

        await this.fetchData()

        if (JSON.stringify(this.$route.query) !== JSON.stringify(query)) {
          this.$router.push({ path: this.$route.path, query }).catch(() => {})
        }

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
        if (this.selectedType) {
          queryParams.append('tipe_tanggal', this.selectedType)
        }

        if (this.selectedStatus !== '') {
          queryParams.append('plant_type', this.selectedStatus)
        }
        if (this.estate_id && this.estate_id.length > 0) {
          queryParams.append(
            'department_code_plantation',
            this.estate_id.map((e) => e.department_code_plantation).join(',')
          )
        }
        if (this.afdeling_id && this.afdeling_id.length > 0) {
          queryParams.append(
            'afdeling_code',
            this.afdeling_id.map((a) => a.afdeling_code).join(',')
          )
        }
        if (this.pks_code && this.pks_code.length > 0) {
          queryParams.append(
            'department_id',
            this.pks_code.map((p) => p.department_id).join(',')
          )
        }

        queryParams.append('status', 'approved')
        queryParams.append('ffb_source', 'internal')

        this.$axios({
          url: `/api/admin/report-sortasi-export?${queryParams.toString()}`,
          method: 'GET',
          responseType: 'blob',
        })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'ReportSortasiHarian.xlsx')
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
.custom-table thead tr:not([class*='header-']) {
  display: none !important;
}

/* Custom CSS Warna Tabel */
.header-yellow th {
  background-color: #ffff99 !important;
  color: #000 !important;
  border-color: #333 !important;
  font-weight: bold;
}
.row-data td {
  background-color: #ccffff !important;
  border-color: #333 !important;
}
.row-total td {
  background-color: #d9d9d9 !important;
  border-color: #333 !important;
}
.bg-light-blue {
  background-color: #e0f7fa !important;
}
.custom-table td,
.custom-table th {
  border: 1px solid #333 !important;
  vertical-align: middle !important;
}
</style>
