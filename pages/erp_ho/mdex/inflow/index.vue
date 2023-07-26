<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>
    <section class="content">
      <div class="card card-outline card-info">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <!-- <button class="nav-link active" @click="changeTab('ACTUAL')" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" >ACTUAL INFLOW</button> -->
              </li>
              <li class="nav-item" role="presentation">
                <!-- <button class="nav-link" @click ="changeTab('PLAN')" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" >PLAN INFLOW</button> -->
              </li>
            </ul>
        <b-tabs 
        style="padding: 8px;">
          <b-tab 
          ref="ACTUAL"
          title="ACTUAL INFLOW"
          @click="changeTab('ACTUAL')" 
          active>
          </b-tab>
          <b-tab 
          ref="PLAN"
          title="PLAN INFLOW "
          @click="changeTab('PLAN')"> 
          </b-tab>
          <b-tab 
          ref="GRAFIK"
          title="GRAFIK INFLOW "
          @click="changeTab('GRAFIK')"> 
          </b-tab>
        </b-tabs>
        <!-- Tab Plan & Actual -->
        <div class="card-body" ref="tabel">
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <nuxt-link
                  :to="{ name: 'erp_ho-mdex-inflow-create-status',
                        params: { status: tab } 
                        }"
                  class="btn btn-info btn-sm"
                  style="padding-top: 8px"
                  title="Tambah"
                  ><i class="fa fa-plus-circle"></i>
                </nuxt-link>
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
          >
            <template v-slot:cell(actions)="row">
              <b-button
                :to="{
                  name: 'erp_ho-mdex-inflow-edit-id',
                  params: { id: row.item.id },
                }"
                variant="link"
                size="sm"
                title="Edit"
              >
                <i class="fa fa-pencil-alt"></i>
              </b-button>
              <b-button
                variant="link"
                size="sm"
                @click="deletePost(row.item.id)"
                title="Hapus"
                ><i class="fa fa-trash"></i
              ></b-button>
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
        <!-- END Tab Plan & Actual -->
        <!-- Tab Grafik -->
        <div class="card-body" ref="grafik">
          <client-only placeholder="Loading...">
            <DoughnutChart
              :chart-data="doughChartData"
              :chart-options="doughChartOptions"
              :height="430"
            />
          </client-only>
        </div>
        <!-- END Tab Grafik -->
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'admin',

  head() {
    return {
      title: 'Inflow',
    }
  },
  data() {
    return {
      value1: true,
      value2: false,
      plugins: [
        { src: '~/plugins/chart.js', mode: 'client' },
        { src: '~/plugins/axios.js' }
      ],

      fields: [
        {
          label: 'Actions',
          key: 'actions',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        // {
        //   label: 'ID',
        //   key: 'id',
        //   tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        // },
        {
          label: 'Product',
          key: 'product_id',
          formatter:(value, key, item)=>{
            if (value == 2){
              return ("FFB")
            }else if (value == 3){
              return ("CPO")
            }else if (value == 4){
              return ("PK")
            }else if (value == 5){
              return ("PKO")
            }else{
              return "1"
            };
          },
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Inflow Date',
          key: 'inflow_date',
          formatter: (value, key, item) => {
            let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
            let date = new Date(value)
            let day  = date.getDate()
            let month = monthNames[date.getMonth()+1]
            let year  = date.getFullYear()
            if (day < 10) {
              day = '0' + day;
            }
            let format = `${day}-${month}-${year}`;
            return format
            // return new Intl.DateTimeFormat('es-US',options).format(value)
          },
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Account Status',
          key: 'account_status',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
        {
          label: 'Inflow',
          key: 'inflow',
          tdClass: 'align-middle text-left text-nowrap nameOfTheClass',
        },
      ],
      sweet_alert: {
        title: '',
        icon: '',
      },
      product:[],
      doughChartData: {
        labels: ['NuVue', 'VueJit', 'IftShi', 'KoinVi', 'MegsWear', 'Millgh'],
        datasets: [
          {
            label: 'Visualization',
            data: [72, 131, 12, 3, 4, 55],
            backgroundColor: [
              'rgba(20, 255, 0, 0.85)',
              'rgba(200, 5, 0, 0.85)',
              'rgba(10, 220, 0, 0.85)',
              'rgba(2, 100, 0, 0.85)',
              'rgba(20, 55, 0, 0.85)',
              'rgba(120, 155, 0, 0.85)'
            ],
            borderColor: 'rgba(100, 155, 0, 1)',
            borderWidth: 0
          }
        ]
      },
      doughChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        offset: 8,
        radius: 160,
        spacing: 4,
        hoverOffset: 32,
        hoverBorderWidth: 1,
        weight: 0
      },
    }
  },
  watchQuery: ['q', 'page', 'tab'],

  async asyncData({ $axios, query }) {
    //page
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    //tab
    let tab = query.tab ? query.tab : 'ACTUAL'

    //fetching posts
    const posts = await $axios.$get(
      `/api/admin/inflow?q=${search}&page=${page}&tab=${tab}`
    )
    return {
      posts: posts.data.data,
      pagination: posts.data,
      search: search,
      rowcount: posts.data.total,
      tab: tab,
    }
  },

  methods: {
    changePage(page) {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.$route.query.q,
          page: page,
        },
      })
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

    //FilterData
    changeTab(tab){
      if(tab == 'GRAFIK'){
        this.$router.push({
        path: this.$route.path,
        query: {
          q: this.$route.query.q,
          tab: tab,
          },
        })
        this.$refs['tabel'].style.display = "none"
        this.$refs['grafik'].style.display = ""
        // this.$refs['GRAFIK'].$event.active
      }else{
        this.$router.push({
        path: this.$route.path,
        query: {
          q: this.$route.query.q,
          tab: tab,
          },
        })
        this.$refs['tabel'].style.display = ""
        this.$refs['grafik'].style.display = "none"
        // if(tab == 'PLAN'){
        //   this.$refs['PLAN'].active
        // }else{
        //   this.$refs['ACTUAL'].active
        // }
      }
    },

    //deletePost method
    deletePost(id) {
      this.$swal
        .fire({
          title: 'APAKAH ANDA YAKIN ?',
          text: 'INGIN MENGHAPUS DATA INI !',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'YA, HAPUS!',
          cancelButtonText: 'TIDAK',
        })
        .then((result) => {
          if (result.isConfirmed) {
            //delete tag from server

            this.$axios.delete(`/api/admin/inflow/${id}`).then((response) => {
              //feresh data
              this.$nuxt.refresh()
              if (response.data.success == true) {
                this.sweet_alert.title = 'BERHASIL!'
                this.sweet_alert.icon = 'success'
              } else {
                this.sweet_alert.title = 'GAGAL!'
                this.sweet_alert.icon = 'error'
              }

              //alert
              this.$swal.fire({
                title: this.sweet_alert.title,
                text: response.data.message,
                icon: this.sweet_alert.icon,
                showConfirmButton: false,
                timer: 2000,
              })
            })
          }
        })
    },

    exportData() {
      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/admin/inflow/export`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Inflow.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },
  },
}
</script>

<style>
.card-info.card-outline.nav-link.nav-item {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
}
</style>
