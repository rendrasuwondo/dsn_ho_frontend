<template>
  <div class="">
    <div v-if="show === 0">
      <b-img right src="/img/dsn_logo.png" alt="" class="img-logo"></b-img>
      <p class="txt-2">Loading</p>
      <div class="spinonediv-4"></div>
    </div>

    <section class="content" v-if="show === 1">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-cog"></i> <b>Data Harian Sortasi</b>
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
                        v-model="dateStart"
                        dropup="false"
                        class="mb-2"
                        :date-format-options="{
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                        }"
                      ></b-form-datepicker>
                      <b-form-datepicker
                        v-model="dateEnd"
                        :dropup="false"
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
                <th>0%</th>
                <th>&lt; 2%</th>
                <th>&ge; 95 %</th>
                <th>&lt; 3 %</th>
                <th>0%</th>
                <th>0%</th>
                <th>Min 10</th>
                <th>0%</th>
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
    return { title: 'Report Sortasi Harian' }
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
          key: 'display_date',
          label: '',
          tdClass: 'align-middle text-center text-nowrap',
        },
        {
          key: 'display_pks',
          label: '',
          tdClass: 'align-middle text-center text-nowrap',
        },
        {
          key: 'display_estate',
          label: '',
          tdClass:
            'text-center font-weight-bold align-middle bg-light-blue text-nowrap',
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
      dateStart: formatDate(yesterday),
      dateEnd: formatDate(yesterday),
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
    }
  },

  async mounted() {
    // Urutan Eksekusi Diperbaiki: Load Dropdown -> Set Filter dari URL -> Fetch Data
    await this.loadDropdownData()
    this.loadFiltersFromUrl()
    await this.fetchData()
  },

  methods: {
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

    loadFiltersFromUrl() {
      const query = this.$route.query
      if (query.dateStart) this.dateStart = query.dateStart
      if (query.dateEnd) this.dateEnd = query.dateEnd

      if (query.department_id) {
        const ids = query.department_id.split(',').filter(Boolean)
        this.pks_code = this.pksList.filter((p) =>
          ids.includes(p.department_id.toString())
        )
      }
      if (query.department_code_plantation) {
        const codes = query.department_code_plantation
          .split(',')
          .filter(Boolean)
        this.estate_id = this.estates.filter((e) =>
          codes.includes(e.department_code_plantation)
        )
      }
      if (query.afdeling_code) {
        const codes = query.afdeling_code.split(',').filter(Boolean)
        this.afdeling_id = this.afdelings.filter((a) =>
          codes.includes(a.afdeling_code)
        )
      }
    },

    async fetchData() {
      try {
        // PERBAIKAN: API Params diambil murni dari v-model State (Form), BUKAN dari URL
        const params = {
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
          status: 'approved',
          ffb_source: 'internal',
        }

        if (this.pks_code.length)
          params.department_id = this.pks_code
            .map((p) => p.department_id)
            .join(',')
        if (this.estate_id.length)
          params.department_code_plantation = this.estate_id
            .map((e) => e.department_code_plantation)
            .join(',')
        if (this.afdeling_id.length)
          params.afdeling_code = this.afdeling_id
            .map((a) => a.afdeling_code)
            .join(',')

        const rawResponse = await this.$axios.$get(
          '/api/admin/report-sortasi',
          { params }
        )

        this.posts = this.processDataWithTotals(rawResponse.data.data)
        this.rowcount = rawResponse.data.total
      } catch (error) {
        console.error(error)
      }
    },

    processDataWithTotals(rawData) {
      if (!rawData || rawData.length === 0) return []

      let groups = []
      let currentGroupKey = null

      rawData.forEach((item) => {
        let date = item.transaction_date
          ? item.transaction_date.split(' ')[0]
          : 'Unknown'
        let pks = item.department_code || 'Unknown'
        let estate = item.department_code_plantation || 'Unknown'
        let key = `${date}|${pks}|${estate}`

        if (currentGroupKey !== key) {
          groups.push({ key, date, pks, estate, items: [] })
          currentGroupKey = key
        }
        groups[groups.length - 1].items.push(item)
      })

      let finalData = []
      let lastSeenDate = null
      let lastSeenPks = null

      groups.forEach((group) => {
        let sum_unripe = 0,
          sum_underripe = 0,
          sum_ripe = 0,
          sum_overripe = 0
        let sum_empty = 0,
          sum_long_stalk = 0,
          sum_fruit = 0,
          sum_garbage = 0

        group.items.forEach((item, index) => {
          item.percentage_unripe = parseFloat(item.percentage_unripe || 0)
          item.percentage_underripe = parseFloat(item.percentage_underripe || 0)
          item.percentage_ripe = parseFloat(item.percentage_ripe || 0)
          item.percentage_overripe = parseFloat(item.percentage_overripe || 0)
          item.percentage_empty_bunch = parseFloat(
            item.percentage_empty_bunch || 0
          )
          item.percentage_long_stalk = parseFloat(
            item.percentage_long_stalk || 0
          )
          item.percentage_fruit = parseFloat(item.percentage_fruit || 0)
          item.percentage_garbage = parseFloat(item.percentage_garbage || 0)

          let displayDate = this.formatDateStr(group.date)
          item.display_date = displayDate === lastSeenDate ? '' : displayDate
          lastSeenDate = displayDate

          item.display_pks =
            group.pks === lastSeenPks && item.display_date === ''
              ? ''
              : group.pks
          lastSeenPks = group.pks

          item.display_estate = index === 0 ? group.estate : ''
          item.is_total = false

          finalData.push(item)

          sum_unripe += item.percentage_unripe
          sum_underripe += item.percentage_underripe
          sum_ripe += item.percentage_ripe
          sum_overripe += item.percentage_overripe
          sum_empty += item.percentage_empty_bunch
          sum_long_stalk += item.percentage_long_stalk
          sum_fruit += item.percentage_fruit
          sum_garbage += item.percentage_garbage
        })

        finalData.push({
          is_total: true,
          display_date: '',
          display_pks: '',
          display_estate: '',
          afdeling_code: 'TOTAL',
          percentage_unripe: sum_unripe,
          percentage_underripe: sum_underripe,
          percentage_ripe: sum_ripe,
          percentage_overripe: sum_overripe,
          percentage_empty_bunch: sum_empty,
          percentage_long_stalk: sum_long_stalk,
          percentage_fruit: sum_fruit,
          percentage_garbage: sum_garbage,
        })
      })

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
        const query = { dateStart: this.dateStart, dateEnd: this.dateEnd }
        if (this.estate_id.length)
          query.department_code_plantation = this.estate_id
            .map((e) => e.department_code_plantation)
            .join(',')
        if (this.afdeling_id.length)
          query.afdeling_code = this.afdeling_id
            .map((a) => a.afdeling_code)
            .join(',')
        if (this.pks_code.length)
          query.department_id = this.pks_code
            .map((p) => p.department_id)
            .join(',')

        // Prevent redundant navigation error from Vue Router
        if (JSON.stringify(this.$route.query) !== JSON.stringify(query)) {
          await this.$router
            .push({ path: this.$route.path, query })
            .catch(() => {})
        }

        await this.fetchData()
        this.show = 1
      } catch (error) {
        this.show = 1
      }
    },

    exportData() {
      try {
        this.show = 0
        const queryParams = new URLSearchParams()
        if (this.dateStart) queryParams.append('dateStart', this.dateStart)
        if (this.dateEnd) queryParams.append('dateEnd', this.dateEnd)
        if (this.estate_id.length)
          queryParams.append(
            'department_code_plantation',
            this.estate_id.map((e) => e.department_code_plantation).join(',')
          )
        if (this.afdeling_id.length)
          queryParams.append(
            'afdeling_code',
            this.afdeling_id.map((a) => a.afdeling_code).join(',')
          )
        if (this.pks_code.length)
          queryParams.append(
            'department_id',
            this.pks_code.map((p) => p.department_id).join(',')
          )

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
            console.error(error)
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
.custom-table thead tr:nth-child(3) {
  display: none !important;
}

/* Custom CSS Warna Tabel */
.header-yellow th {
  background-color: #ffff99 !important;
  color: #000 !important;
  border-color: #333 !important;
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
}
</style>
