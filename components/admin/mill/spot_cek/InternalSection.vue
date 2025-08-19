<template>
  <div class="">
    <div v-if="show === 0">
      <b-img right src="\img/dsn_logo.png" alt="" class="img-logo"></b-img>
      <p class="txt-2">Loading</p>
      <div class="spinonediv-4"></div>
    </div>

    <section class="content" v-if="show === 1">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-cog"></i> <b>Data Spot Cek Internal</b>
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
                <!-- Left Section -->
                <b-col cols="6">
                  <b-row class="mt-2">
                    <b-col cols="3">Tanggal</b-col>
                    <b-col cols="9">
                      <b-form-datepicker
                        v-model="dateStart"
                        placeholder="Pilih tanggal awal"
                        class="mb-2"
                        :date-format-options="{
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          weekday: 'short',
                        }"
                      ></b-form-datepicker>
                      <b-form-datepicker
                        v-model="dateEnd"
                        placeholder="Pilih tanggal akhir"
                        :date-format-options="{
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          weekday: 'short',
                        }"
                      ></b-form-datepicker>
                    </b-col>
                  </b-row>

                  <b-row class="mt-3">
                    <b-col cols="6">Tampilkan Buah Sakit?</b-col>
                    <b-col cols="6">
                      <b-form-checkbox v-model="showSickFruit" switch>
                        Ya
                      </b-form-checkbox>
                    </b-col>
                  </b-row>
                </b-col>

                <!-- Right Section -->
                <b-col cols="6">
                  <b-row class="mt-2">
                    <b-col cols="3">PT</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="pt_id"
                        :options="pts"
                        label="company_code_plantation"
                        track-by="company_code_plantation"
                        :searchable="true"
                        :multiple="true"
                        placeholder="Pilih PT"
                        :loading="isLoadingDropdown"
                      ></multiselect>
                    </b-col>
                  </b-row>

                  <b-row class="mt-3">
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

                  <b-row class="mt-3">
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

              <!-- Apply Filters Button -->
              <b-row class="mt-3">
                <b-col class="text-center">
                  <b-button
                    class="btn btn-info"
                    variant="primary"
                    @click="applyFilters"
                  >
                    Apply Filters
                  </b-button>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>

          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <button
                  title="Export To Excel"
                  class="btn btn-info"
                  @click="exportData"
                >
                  <i class="fa fa-file-excel"></i>
                </button>
              </div>
            </div>
          </div>
          <!-- table -->
          <b-table
            :fields="filteredFields"
            :items="posts"
            small
            responsive
            striped
            bordered
            hover
          >
            <!-- Custom grouped header -->
            <template v-slot:thead-top>
              <tr>
                <!-- <th rowspan="2">No</th> -->
                <th rowspan="2">Tanggal</th>
                <th rowspan="2">PT</th>
                <th rowspan="2">Estate</th>
                <th rowspan="2">Afd</th>
                <th rowspan="2">Driver</th>
                <th rowspan="2">Tonase Timbang</th>
                <th colspan="4" class="text-center">Total Janjang</th>
                <th rowspan="2">BJR</th>
                <th colspan="10" class="text-center">Kriteria TBS Normal</th>
                <th v-if="showSickFruit" colspan="6" class="text-center">
                  Kriteria TBS Abnormal
                </th>
                <th v-if="showSickFruit" rowspan="2">Tangkai Panjang</th>
                <th colspan="5" class="text-center">Berondolan</th>
                <th rowspan="2">Hutang Berondol(Kg)</th>
                <th colspan="2">Bayar Berondolan</th>
                <th colspan="2">Sampah</th>
                <th rowspan="2">Batu(Kg)</th>
                <th rowspan="2">No. NPB</th>
              </tr>
              <tr>
                <th>SPB</th>
                <th>Aktual</th>
                <th>Var(Jjg)</th>
                <th>Var(%)</th>

                <th>Unripe</th>
                <th>%</th>
                <th>Under</th>
                <th>%</th>
                <th>Ripe</th>
                <th>%</th>
                <th>Over</th>
                <th>%</th>
                <th>Jangkos</th>
                <th>%</th>

                <th v-if="showSickFruit">Ptherno</th>
                <th v-if="showSickFruit">%</th>
                <th v-if="showSickFruit">Hard B.</th>
                <th v-if="showSickFruit">%</th>
                <th v-if="showSickFruit">Unripe Brd</th>
                <th v-if="showSickFruit">%</th>

                <th>SPB</th>
                <th>Aktual</th>
                <th>Aktual(%)</th>
                <th>Var(Kg)</th>
                <th>Var(%)</th>

                <th>Bayar</th>
                <th>Setelah (%)</th>

                <th>Kg</th>
                <th>%</th>
              </tr>
            </template>
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
      title: 'Spot Cek',
    }
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
        // { key: 'no', label: '' }, // No label as custom header is used
        { key: 'transaction_date', label: '', formatter: this.formatDate },
        { key: 'company_code_plantation', label: '' },
        { key: 'department_code_plantation', label: '' },
        { key: 'afdeling_code', label: '' },
        { key: 'driver', label: '' },
        { key: 'tonase', label: '', formatter: this.formatToThousand },

        { key: 'qty_npb', label: '', formatter: this.formatToZeroDecimals },
        { key: 'total_qty', label: '', formatter: this.formatToZeroDecimals },
        { key: 'var_qty', label: '', formatter: this.formatToZeroDecimals },
        { key: 'percentage_qty', label: '', formatter: this.formatToThousand },

        { key: 'bjr', label: '', formatter: this.formatToTwoDecimals },

        { key: 'qty_unripe', label: '', formatter: this.formatToZeroDecimals },
        {
          key: 'percentage_unripe',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'qty_underripe',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_underripe',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        { key: 'qty_ripe', label: '', formatter: this.formatToZeroDecimals },
        {
          key: 'percentage_ripe',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'qty_overripe',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_overripe',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'qty_empty_bunch',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_empty_bunch',
          label: '',
          formatter: this.formatToTwoDecimals,
        },

        {
          key: 'qty_parthenocarpy',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_parthenocarpy',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'qty_hard_bunch',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_hard_bunch',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'qty_unripe_fruit_fall',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_unripe_fruit_fall',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'percentage_unripe_fruit_fall',
          label: '',
          formatter: this.formatToTwoDecimals,
        },

        {
          key: 'qty_long_stalk',
          label: '',
          formatter: this.formatToTwoDecimals,
        },

        { key: 'loose_fruit_npb', label: '', formatter: this.formatToThousand },
        { key: 'loose_fruit', label: '', formatter: this.formatToThousand },
        {
          key: 'percentage_fruit',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'var_loose_fruit',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'var_loose_fruit_percentage',
          label: '',
          formatter: this.formatToTwoDecimals,
        },

        {
          key: 'loose_fruit_debt_expectation',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        {
          key: 'loose_fruit_debt',
          label: '',
          formatter: this.formatToZeroDecimals,
        },
        {
          key: 'percentage_fruit_after',
          label: '',
          formatter: this.formatToTwoDecimals,
        },

        // { key: 'qty_abnormal', label: '' },
        // { key: 'percentage_abnormal', label: '', formatter: this.formatToTwoDecimals  },

        { key: 'qty_garbage', label: '' },
        {
          key: 'percentage_garbage',
          label: '',
          formatter: this.formatToTwoDecimals,
        },
        { key: 'rock', label: '', formatter: this.formatToTwoDecimals },
        { key: 'npb', label: '' },
      ],
      dateStart: formatDate(yesterday), // Default to yesterday
      dateEnd: formatDate(yesterday), // Default to today
      showSickFruit: false,
      pt_id: [],
      pts: [],
      estate_id: [],
      estates: [],
      afdeling_id: [],
      afdelings: [],
      posts: [], // Data for the table
      pagination: {}, // Pagination data
      rowcount: 0,
      show: 1,
      isLoadingDropdown: true, // Loading state for dropdowns
    }
  },

  watchQuery: ['q', 'page'],

  computed: {
    filteredFields() {
      return this.showSickFruit
        ? this.fields
        : this.fields.filter(
            (field) =>
              field.key !== 'qty_parthenocarpy' &&
              field.key !== 'percentage_parthenocarpy' &&
              field.key !== 'qty_hard_bunch' &&
              field.key !== 'percentage_hard_bunch' &&
              field.key !== 'qty_unripe_fruit_fall' &&
              field.key !== 'percentage_unripe_fruit_fall' &&
              field.key !== 'qty_long_stalk'
          )
    },
  },

  async mounted() {
    await this.fetchData()
  },

  methods: {
    async fetchData() {
      try {
        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)

        const formatDate = (date) =>
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            '0'
          )}-${String(date.getDate()).padStart(2, '0')}`

        const query = this.$route.query
        const dateStart = query.dateStart || formatDate(yesterday)
        const dateEnd = query.dateEnd || formatDate(yesterday)

        const params = {
          ...(query.page && { page: query.page }),
          ...(dateStart && { dateStart }),
          ...(dateEnd && { dateEnd }),
          ...(query.company_code_plantation && {
            company_code_plantation: query.company_code_plantation,
          }),
          ...(query.department_code_plantation && {
            department_code_plantation: query.department_code_plantation,
          }),
          ...(query.afdeling_code && { afdeling_code: query.afdeling_code }),
          status: 'approved',
          ffb_source: 'internal',
        }

        const posts = await this.$axios.$get('/api/admin/spot-cek', { params })

        const list_pt = await this.$axios.$get(`/api/admin/spot-cek-list-pt`)
        const list_estate = await this.$axios.$get(
          `/api/admin/spot-cek-list-estate`
        )
        const list_afdeling = await this.$axios.$get(
          `/api/admin/spot-cek-list-afdeling`
        )

        this.posts = posts.data.data
        this.pagination = posts.data
        this.rowcount = posts.data.total
        this.pts = list_pt.data
        this.estates = list_estate.data
        this.afdelings = list_afdeling.data
        this.dateStart = dateStart
        this.dateEnd = dateEnd
        this.showSickFruit = query.showSickFruit === 'true'

        this.pt_id = query.company_code_plantation
          ? query.company_code_plantation
              .split(',')
              .filter(Boolean)
              .map((code) => ({
                company_code_plantation: code,
              }))
          : []

        this.estate_id = query.department_code_plantation
          ? query.department_code_plantation
              .split(',')
              .filter(Boolean)
              .map((code) => ({
                department_code_plantation: code,
              }))
          : []

        this.afdeling_id = query.afdeling_code
          ? query.afdeling_code
              .split(',')
              .filter(Boolean)
              .map((code) => ({
                afdeling_code: code,
              }))
          : []
        this.isLoadingDropdown = false // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    formatToThousand(value) {
      if (!value) return '0' // Return 0 for empty or null values
      return new Intl.NumberFormat('id-ID').format(value)
    },
    formatToTwoDecimals(value) {
      if (!value) return '0.00' // Return 0.00 for empty values
      return parseFloat(value).toFixed(2)
    },
    formatToZeroDecimals(value) {
      if (!value) return '0' // Return 0.00 for empty values
      return parseFloat(value).toFixed(0)
    },
    formatDate(value) {
      if (!value) return ''
      const date = new Date(value)

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
      const month = monthNames[date.getMonth()]
      const year = date.getFullYear()

      return `${day}-${month}-${year}`
    },

    changePage(page) {
      const query = {
        page,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      }

      if (this.pt_id && this.pt_id.length > 0) {
        query.company_code_plantation = this.pt_id
          .map((pt) => pt.company_code_plantation)
          .join(',')
      }
      if (this.estate_id && this.estate_id.length > 0) {
        query.department_code_plantation = this.estate_id
          .map((estate) => estate.department_code_plantation)
          .join(',')
      }
      if (this.afdeling_id && this.afdeling_id.length > 0) {
        query.afdeling_code = this.afdeling_id
          .map((afdeling) => afdeling.afdeling_code)
          .join(',')
      }

      this.$router.push({ path: this.$route.path, query })
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

    async applyFilters() {
      this.show = 0

      try {
        const query = {}

        // Dynamically add non-empty filters to the query
        if (this.dateStart) query.dateStart = this.dateStart
        if (this.dateEnd) query.dateEnd = this.dateEnd
        if (this.pt_id && this.pt_id.length > 0) {
          query.company_code_plantation = this.pt_id
            .map((pt) => pt.company_code_plantation)
            .join(',')
        }
        if (this.estate_id && this.estate_id.length > 0) {
          query.department_code_plantation = this.estate_id
            .map((estate) => estate.department_code_plantation)
            .join(',')
        }
        if (this.afdeling_id && this.afdeling_id.length > 0) {
          query.afdeling_code = this.afdeling_id
            .map((afdeling) => afdeling.afdeling_code)
            .join(',')
        }
        if (this.search) query.search = this.search

        query.page = this.pagination.current_page || 1

        // Update the URL query dynamically
        this.$router.push({ path: this.$route.path, query })
        query.status = 'approved'

        query.ffb_source = 'internal'

        // Fetch the filtered data
        const response = await this.$axios.$get('/api/admin/spot-cek', {
          params: query,
        })

        // Update table and pagination data
        this.posts = response.data.data
        this.pagination = response.data
        this.rowcount = response.data.total
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

        // Add filters dynamically if they exist
        if (this.dateStart) queryParams.append('dateStart', this.dateStart)
        if (this.dateEnd) queryParams.append('dateEnd', this.dateEnd)
        if (this.pt_id && this.pt_id.length > 0) {
          queryParams.append(
            'company_code_plantation',
            this.pt_id.map((pt) => pt.company_code_plantation).join(',')
          )
        }
        if (this.estate_id && this.estate_id.length > 0) {
          queryParams.append(
            'department_code_plantation',
            this.estate_id
              .map((estate) => estate.department_code_plantation)
              .join(',')
          )
        }
        if (this.afdeling_id && this.afdeling_id.length > 0) {
          queryParams.append(
            'afdeling_code',
            this.afdeling_id.map((afdeling) => afdeling.afdeling_code).join(',')
          )
        }
        if (this.search) queryParams.append('search', this.search)
        queryParams.append('status', 'approved')

        // Perform the export request
        this.$axios({
          url: `/api/admin/spot-cek-export?${queryParams.toString()}`,
          method: 'GET',
          responseType: 'blob', // Ensures the response is treated as a binary file
        })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            const fileName = 'SpotCek.xlsx' // You can customize the filename
            link.setAttribute('download', fileName) // Set the file name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) // Clean up the DOM
            this.show = 1
          })
          .catch((error) => {
            console.error('Error exporting data:', error)
            this.show = 1
          })
      } catch (error) {
        console.error('Error constructing export URL:', error)
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
</style>

<style>
.b-table thead tr:nth-child(3) {
  display: none;
}
.b-table td:nth-child(7),
.b-table td:nth-child(9),
.b-table td:nth-child(10),
.b-table td:nth-child(11),
.b-table td:nth-child(12),
.b-table td:nth-child(13),
.b-table td:nth-child(14),
.b-table td:nth-child(15),
.b-table td:nth-child(16),
.b-table td:nth-child(17),
.b-table td:nth-child(18),
.b-table td:nth-child(19),
.b-table td:nth-child(20),
.b-table td:nth-child(21),
.b-table td:nth-child(22),
.b-table td:nth-child(23),
.b-table td:nth-child(24),
.b-table td:nth-child(25),
.b-table td:nth-child(26),
.b-table td:nth-child(27),
.b-table td:nth-child(28),
.b-table td:nth-child(29),
.b-table td:nth-child(30) {
  text-align: end;
}
</style>
