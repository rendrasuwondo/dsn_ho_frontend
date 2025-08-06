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
                </b-col>

                <!-- <b-col cols="6">
                  <b-row class="mt-2">
                    <b-col cols="3">Supplier</b-col>
                    <b-col cols="9">
                      <multiselect
                        v-model="pt_id"
                        :options="pts"
                        label="supplier"
                        track-by="supplier"
                        :searchable="true"
                        placeholder="Pilih Supplier"
                      ></multiselect>
                    </b-col>
                  </b-row>
                </b-col> -->
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
            :items="posts"
            :fields="tableFields"
            responsive
            bordered
            hover
            small
          >
            <!-- Custom Header for Grouped Layout -->
            <template v-slot:thead-top>
              <tr>
                <th rowspan="2">Tanggal</th>
                <th rowspan="2">Rit</th>
                <th colspan="2" class="text-center">Netto (Ton)</th>
                <th colspan="2" class="text-center">Sortasi (Ton)</th>
                <th colspan="2" class="text-center">Bruto (Ton)</th>
                <!-- <th colspan="2" class="text-center">Dikembalikan (Ton)</th> -->
                <th colspan="2" class="text-center">Total (Ton)</th>
                <th rowspan="2" class="text-center">% Sortasi</th>
              </tr>
              <tr>
                <!-- Netto -->
                <th>Ton</th>
                <th>Ton/Rit</th>

                <!-- Sortasi  -->
                <th>Ton</th>
                <th>Ton/Rit</th>

                <!-- Bruto  -->
                <th>Ton</th>
                <th>Ton/Rit</th>

                <!-- Total  -->
                <th>Ton</th>
                <th>Ton/Rit</th>
              </tr>
            </template>

            <!-- Row Rendering -->
            <!-- <template #cell(no)="data">
              {{ data.index + 1 }}
            </template> -->
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
      title: 'Rekap Harian TBS External',
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
      // Fields for the table
      tableFields: [
        // { key: 'no', label: '' },
        { key: 'transaction_date', label: '' },
        { key: 'unit', label: '' },
        { key: 'netto', label: '' },
        { key: 'nettoPerRit', label: '' },
        { key: 'sortasi', label: '' },
        { key: 'sortasiPerRit', label: '' },
        { key: 'bruto', label: '' },
        { key: 'brutoPerRit', label: '' },
        { key: 'total', label: '' },
        { key: 'totalPerRit', label: '' },
        { key: 'percentSortasi', label: '' },
      ],
      // Dummy Data

      dateStart: formatDate(yesterday), // Default to yesterday
      dateEnd: formatDate(yesterday), // Default to today
      pt_id: [],
      pts: [],
      posts: [], // Data for the table
      pagination: {}, // Pagination data
      rowcount: 0,
      show: 1,
    }
  },

  watchQuery: ['q', 'page'],

  async asyncData({ $axios, query }) {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const formatDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`

    // Set default dates
    const dateStart = query.dateStart || formatDate(yesterday)
    const dateEnd = query.dateEnd || formatDate(yesterday)

    // Initialize params object dynamically
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
      ...(query.supplier && {
        supplier: query.supplier.lifnr,
      }),
      ffb_source: 'external',
    }

    // Fetching posts with filters
    const posts = await $axios.$get('/api/admin/rekap_harian_tbs_external', {
      params,
    })

    // Fetching dropdown options
    const list_pt = await $axios.$get(`/api/admin/spot-cek-list-supplier`)

    return {
      posts: posts.data.data,
      pagination: posts.data,
      search: query.search || '',
      rowcount: posts.data.total,
      pts: list_pt.data,
      dateStart,
      dateEnd,
      pt_id: query.supplier
        ? query.supplier
            .split(',')
            .filter(Boolean)
            .map((code) => ({ supplier: code }))
        : [],
    }
  },

  mounted() {
    this.applyFilters()
  },

  methods: {
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
        query.supplier = this.pt_id
          .map((pt) => pt.company_code_plantation)
          .join(',')
      }

      this.$router.push({ path: this.$route.path, query })
    },

    //*searchData
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

        // Fetch the filtered data
        const response = await this.$axios.$get(
          '/api/admin/rekap_harian_tbs_external',
          {
            params: query,
          }
        )

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

        const start = this.dateStart || 'awal'
        const end = this.dateEnd || 'akhir'
        const fileName = `Rekap_Harian_Tbs_External_${start}_sd_${end}.xlsx`
        // Perform the export request
        this.$axios({
          url: `/api/admin/rekap_harian_tbs_external_export?${queryParams.toString()}`,
          method: 'GET',
          responseType: 'blob', // Ensures the response is treated as a binary file
        })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
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
.table th {
  text-align: left; /* Align header to the left */
  vertical-align: middle; /* Center vertically */
}

.table td {
  vertical-align: middle; /* Center vertically */
}
</style>
