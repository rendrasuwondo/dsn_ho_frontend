<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-tablet-alt"></i>
            <b>IN MONITOR</b>
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
              <b-container class="bv-example-row mb-3">
                <b-row>
                  <b-col cols="1">Tahun</b-col>
                  <b-col cols="3">
                    <multiselect
                      v-model="year_id"
                      :options="years"
                      label="year_at"
                      track-by="year_at"
                      :searchable="true"
                    ></multiselect>
                  </b-col>
                </b-row>
              </b-container>
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
            class="table-1"
          >
            <template v-slot:cell(actions)="row">
              <b-button
                :to="{
                  name: 'erp_ho-fertilizer-input_sampel-edit-id',
                  params: { id: row.item.id },
                }"
                variant="link"
                size="sm"
                title="Edit"
              >
                <i class="fa fa-pencil-alt"></i>
              </b-button>
            </template>
            <template #cell(detail)="row">
              <b-button class="btn-info" size="sm" @click="row.toggleDetails">
                {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
              </b-button>
            </template>

            <template v-slot:cell(detail_hap)="row">
              <b-button
                :to="{
                  name: 'erp_ho-fertilizer-detail_hap-id',
                  params: { id: row.item.id },
                  query: {
                    input_sample_id: row.item.id,
                    fertilizer_type_id: row.item.fertilizer_type_id,
                  },
                }"
                variant="link"
                size=""
                title="Status"
                class="table-1"
              >
                {{ row.item.status }}
              </b-button>
            </template>

            <template #row-details="row">
              <b-card>
                <b-container class="bv-example-row">
                  <b-row>
                    <b-col>Supplier : {{ row.item.supplier }}</b-col>
                    <b-col>PT : {{ row.item.company_name }}</b-col>
                    <b-col>Department : {{ row.item.department_name }}</b-col>
                  </b-row>
                  <b-row></b-row>
                  <b-row>
                    <b-col>
                      Joint Sampling : {{ row.item.f_joint_sampling }}
                    </b-col>
                    <b-col>
                      Jenis Pupuk : {{ row.item.fertilizer_type_code }}
                    </b-col>
                    <b-col>Parameter : {{ row.item.parameter }}</b-col>
                  </b-row>
                  <b-row></b-row>
                  <b-row>
                    <b-col>Satuan : {{ row.item.unit_code }}</b-col>
                    <b-col>QTY PO : {{ row.item.qty }}</b-col>
                    <b-col></b-col>
                  </b-row>
                </b-container>
              </b-card>
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
              >
              </b-pagination>
            </b-col>
            <b-col class="text-right" align-self="center">
              {{ rowcount }} data
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
    return {
      title: 'In Monitor',
    }
  },
  data() {
    return {
      allSelected: false,
      show_submit: true,

      years: [],

      fields: [
        {
          label: 'NO. PO',
          key: 'po',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Supplier',
          key: 'supplier',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Kode Sampel',
          key: 'sample_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Jenis Pupuk',
          key: 'fertilizer_type_code',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Tgl Kedatangan',
          key: 'k_arrived_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Join Sampling',
          key: 'k_join_sampling_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Tgl Terima',
          key: 'k_receipt_sampling_at',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Status Wf',
          key: 'request_status_name',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Status HAP',
          key: 'detail_hap',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Klaim Mutu Pupuk',
          key: 'fertilizer_analysis_calculation',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-IN')
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
      ],

      sweet_alert: {
        title: '',
        icon: '',
      },

      year_id: this.$route.query.q_year_id,
      query_year_id: '',
    }
  },
  watchQuery: ['q', 'page', 'q_year_id'],

  async asyncData({ $axios, query }) {
    function currentDate() {
      const current = new Date()
      current.setDate(current.getDate())
      const date = `${current.getFullYear()}`

      return date
    }

    //page
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    let q_year_id = query.q_year_id ? query.q_year_id : ''

    let year_id = []

    const year_list = await $axios.$get(`/api/admin/lov_years`)

    if (query.q_year_id) {
      //Mandor
      $axios
        .get(`/api/admin/lov_years?q_year_id=${q_year_id}`)
        .then((response) => {
          year_id = response.data.data
        })
    } else {
      year_id = []

      q_year_id = year_id.year_at
    }

    if (q_year_id == undefined) {
      q_year_id = query.q_year_id ? query.q_year_id : currentDate()
      // q_year_id = ''
    }

    console.log('cek')
    console.log(
      `/api/admin/input_sampel?q=${search}&page=${page}&q_year_id=${q_year_id}`
    )
    //fetching posts
    const posts = await $axios.$get(
      `/api/admin/input_sampel?q=${search}&page=${page}&q_year_id=${q_year_id}`
    )

    return {
      posts: posts.data.data,
      pagination: posts.data,
      search: search,
      rowcount: posts.data.total,
      years: year_list.data,
      year_id: year_id,
    }
  },

  mounted() {
    this.year_id = [
      {
        year_at: this.currentDate(),
      },
    ]
    //Data years
    // this.$axios
    //   .get('/api/admin/lov_years')
    //   .then((response) => {
    //     this.years = response.data.data
    //   })
  },

  methods: {
    currentDate() {
      const current = new Date()
      current.setDate(current.getDate())
      const date = `${current.getFullYear()}`
      return date
    },

    changePage(page) {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.$route.query.q,
          page: page,
          q_year_id: this.$route.query.q_year_id
            ? this.$route.query.q_year_id
            : this.currentDate(),
        },
      })
    },

    //searchData
    searchData() {
      try {
        if (this.year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.year_id.year_at ? this.year_id.year_at : ''
        }
      } catch (err) {}

      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.search,
          q_year_id: this.query_year_id,
        },
      })
    },

    exportData() {
      const headers = {
        'Content-Type': 'application/json',
      }

      try {
        if (this.year_id.year_at === null) {
          this.query_year_id = this.currentDate()
        } else if (this.year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
            ? this.$route.query.q_year_id
            : this.currentDate()
        } else {
          this.query_year_id = this.year_id.year_at
            ? this.year_id.year_at
            : this.currentDate()
        }
      } catch (err) {}

      this.$axios({
        url: `/api/admin/in_monitor/export?q=${this.search}&q_year_id=${this.query_year_id}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'In Monitor.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
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
.table-1 {
  font-size: 14px;
}
</style>
