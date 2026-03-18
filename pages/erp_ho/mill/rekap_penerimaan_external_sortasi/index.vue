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
            <b-col class="text-right mt-2 text-muted font-weight-bold">
              Total: {{ posts.length }} baris data
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

        {
          key: 'netto_jjg',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },
        {
          key: 'netto_ton',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },
        {
          key: 'netto_ton_rit',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },

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

        {
          key: 'total_jjg',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },
        {
          key: 'total_ton',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },
        {
          key: 'total_ton_rit',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },

        {
          key: 'potongan_persen',
          label: '',
          tdClass: 'align-middle text-center',
        },

        {
          key: 'perc_kembali_jjg',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },
        {
          key: 'perc_kembali_ton',
          label: '',
          formatter: this.formatNumber,
          tdClass: 'align-middle text-right',
        },
      ],
      dateStart: formatDate(firstDay),
      dateEnd: formatDate(today),
      posts: [],
      show: 0,
      defaultPotongan: 3, // Diupdate dinamis dari response API nanti
    }
  },

  async mounted() {
    await this.fetchData()
  },

  methods: {
    formatNumber(value) {
      return Number.isFinite(Number(value)) ? Number(value).toFixed(2) : '0.00'
    },

    async fetchData() {
      this.show = 0
      try {
        const params = {
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
        }

        const response = await this.$axios.$get(
          '/api/admin/rekap_penerimaan_external_sortasi',
          { params }
        )

        this.posts = response.data || []
        if (response.potongan_persen) {
          this.defaultPotongan = response.potongan_persen
        }

        this.show = 1
      } catch (error) {
        console.error('Error in fetchData:', error)
        this.show = 1
      }
    },

    async applyFilters() {
      await this.fetchData()
    },

    exportData() {
      // Export logic goes here if requested in future. You can copy the usual Axios export pattern.
      alert('Fitur export sedang disiapkan')
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
