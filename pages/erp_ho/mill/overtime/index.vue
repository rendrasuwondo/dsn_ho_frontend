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
            <i class="nav-icon fas fa-stopwatch"></i> <b>OVERTIME</b>
          </h3>
          <div class="card-tools"></div>
        </div>

        <div class="card-body">
          <b-row>
            <b-col cols="8"
              ><b-card
                border-variant="primary"
                header="Filter"
                header-bg-variant="info"
                header-text-variant="white"
              >
                <b-card-text>
                  <!-- <b-container class="bv-example-row mb-3"> -->
                  <b-form-group
                    label="Tahun"
                    label-for="nested-street"
                    label-cols-sm="6"
                    label-align-sm="left"
                  >
                    <multiselect
                      v-model="f_year_id"
                      :options="years"
                      label="year_at"
                      track-by="id"
                      :searchable="true"
                      @input="onChangeFilterYear"
                    ></multiselect>
                  </b-form-group>
                  <b-form-group
                    label="PKS"
                    label-for="nested-street"
                    label-cols-sm="6"
                    label-align-sm="left"
                  >
                    <multiselect
                      v-model="mill_select"
                      :options="mill"
                      label="code"
                      track-by="id"
                      :searchable="true"
                      @input="onChangeFilter"
                    ></multiselect>
                  </b-form-group>
                  <b-form-group
                    label="Kapasitas"
                    label-for="nested-street"
                    label-cols-sm="6"
                    label-align-sm="left"
                  >
                    <b-form-input
                      id="nested-street"
                      v-model="throughput"
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="Mill Performance & Maintenance"
                    label-for="nested-street"
                    label-cols-sm="6"
                    label-align-sm="left"
                  >
                    <b-form-input
                      id="nested-street"
                      v-model="mill_pm"
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="Mill Head"
                    label-for="nested-street"
                    label-cols-sm="6"
                    label-align-sm="left"
                  >
                    <b-form-input
                      id="nested-street"
                      v-model="mill_head"
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="Jumlah Man Power"
                    label-for="nested-street"
                    label-cols-sm="6"
                    label-align-sm="left"
                  >
                    <b-form-input
                      id="nested-street"
                      v-model="man_power"
                    ></b-form-input>
                  </b-form-group>
                  <!-- </b-container> -->
                </b-card-text>
              </b-card></b-col
            >
            <b-col></b-col>
          </b-row>

          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <button
                  title="Upload File"
                  class="btn btn-info"
                  @click="showModal"
                >
                  <i class="fa fa-file-upload"></i>
                </button>

                <button
                  title="Export To Excel"
                  class="btn btn-info"
                  @click="exportData"
                >
                  <i class="fa fa-file-excel"></i>
                </button>

                <button
                  title="Download Template Excel"
                  class="btn btn-info"
                  @click="exportDataTemplate"
                  v-if="show === 0"
                >
                  <i class="fa fa-file-alt"></i>
                </button>

                <nuxt-link
                  title="History Upload File"
                  class="btn btn-info"
                  :to="{
                    name: 'erp_ho-data_warehouse-rna-detail_upload',
                    query: {
                      url: 'erp_ho-data_warehouse-rna-oil_content',
                      tab_header: 'OIL CONTENT',
                      account: 'Oil Content',
                      q_month_id: this.period_month,
                      q_year_id: this.period_year,
                    },
                  }"
                  v-if="show === 0"
                >
                  <i class="fa fa-info-circle"></i>
                </nuxt-link>

                <b-modal ref="my-modal" hide-footer title="Form Upload File">
                  <div class="form-group">
                    <b-container fluid>
                      <b-row class="my-1">
                        <b-col sm="3">
                          <label for="input-small">Tahun :</label>
                        </b-col>
                        <b-col sm="9">
                          <multiselect
                            v-model="year_id"
                            :options="years"
                            label="year_at"
                            track-by="id"
                            :searchable="true"
                          ></multiselect>
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                  <div class="form-group">
                    <b-container fluid>
                      <b-row class="my-1">
                        <b-col sm="3">
                          <label for="input-small">Bulan :</label>
                        </b-col>
                        <b-col sm="9">
                          <multiselect
                            v-model="month_id"
                            :options="months"
                            label="name"
                            track-by="id"
                            :searchable="true"
                          ></multiselect>
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                  <div class="form-group">
                    <b-container class="bv-example-row">
                      <b-row>
                        <b-col sm="3">
                          <label class="mr-1">Pilih File :</label>
                        </b-col>
                        <b-col sm="9">
                          <p class="selected float-left">
                            <!-- <br /> -->
                            <input
                              type="file"
                              name="file"
                              @change="upload"
                              id="actual-btn"
                              hidden
                            />

                            <!-- our custom upload button -->
                            <label for="actual-btn" class="f_upload">
                              Choose File
                            </label>
                          </p>
                        </b-col>
                      </b-row>
                      <b-row class="pb-2">
                        <b-col sm="3"></b-col>
                        <b-col sm="9">
                          {{ files ? files.name : 'No File Chosen' }}
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                  <div class="form-group">
                    <b-container class="bv-example-row">
                      <b-row>
                        <b-col>
                          <b-button
                            :disabled="files == null"
                            class="btn btn-info mr-1 btn-modal"
                            block
                            @click="submitFileUpload"
                          >
                            <i class="fa fa-upload"></i> UPLOAD
                          </b-button>
                        </b-col>
                        <b-col>
                          <b-button
                            class="btn btn-warning btn-modal"
                            block
                            @click="hideModal"
                          >
                            <i class="fa fa-redo"></i> BATAL
                          </b-button>
                        </b-col>
                      </b-row>
                    </b-container>
                  </div>
                </b-modal>
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
          <div>
            <b-card no-body no-border>
              <b-tabs card>
                <b-tab title="OVERTIME PERFORMANCE" bg-variant="primary" active>
                  <b-card-text>
                    <b-table
                      small
                      responsive
                      striped
                      bordered
                      hover
                      :items="posts"
                      :fields="fields"
                      show-empty
                      class="table-oil"
                    >
                    </b-table>
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
          <!-- pagination -->
          <b-row v-show="">
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

          <div>
            <b-card no-body no-border>
              <b-tabs card>
                <b-tab
                  title="THROUGHPUT PERFORMANCE"
                  bg-variant="primary"
                  active
                >
                  <b-card-text
                    ><b-table
                      small
                      responsive
                      striped
                      bordered
                      hover
                      :items="posts_throughput"
                      :fields="fields_throughput"
                      show-empty
                      class="table-oil"
                    >
                    </b-table
                  ></b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>

          <!-- Overtime Per Station -->
          <div>
            <b-card no-body no-border>
              <b-tabs card>
                <b-tab
                  title="OVERTIME STATION PERFORMANCE"
                  bg-variant="primary"
                  active
                >
                  <b-card-text
                    ><b-table
                      small
                      responsive
                      striped
                      bordered
                      hover
                      :items="posts_station"
                      :fields="fields_station"
                      show-empty
                      class="table-oil"
                    >
                      <template v-slot:cell(station_code)="row">
                        <b-button
                        @click="test(row.item.station_code )"
                          variant="link"
                          size="sm"
                          title="Edit"
                        >
                          {{ row.item.station_code }}
                        </b-button>
                      </template>
                    </b-table></b-card-text
                  >
                </b-tab>
              </b-tabs>
            </b-card>
          </div>

          <!-- Overtime Per Personal -->
          <div>
            <b-card no-body no-border>
              <b-tabs card>
                <b-tab
                  title="OVERTIME PERSONAL PERFORMANCE"
                  bg-variant="primary"
                  active
                >
                  <b-card-text
                    ><b-table
                      small
                      responsive
                      striped
                      bordered
                      hover
                      :items="posts_personal"
                      :fields="fields_personal"
                      show-empty
                      class="table-oil"
                    >
                    </b-table
                  ></b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
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
    return {
      title: 'Overtime',
    }
  },

  data() {
    return {
      throughput: '',
      mill_pm: '',
      mill_head: '',
      man_power: '',
      f_year_id: this.$route.query.q_year_id,
      f_month_id: this.$route.query.q_month_id,
      mill_select: '',
      query_year_id: '',
      query_month_id: '',

      files: null,

      year_id: '',
      month_id: '',

      month_code: '',

      period_year: this.$route.query.q_year_id
        ? this.$route.query.q_year_id
        : this.currentYear(),
      period_month: this.$route.query.q_month_id
        ? this.$route.query.q_month_id
        : this.currentMonth(),

      years: [],
      months: [],
      mill: [],
      show: 1,

      fields: [
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Bulan',
          key: 'period',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Jumlah HK',
          key: 'man_power',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US')
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Jam Kerja Standard',
          key: 'hour_standard',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US')
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Jam Aktual',
          key: 'hour_actual',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Jam Lembur Dunia',
          key: 'ot',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Jam Lembur Konversi',
          key: 'ot_conversion',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Estimasi Rp Lembur Standard',
          key: 'ot_estimation_standard',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'EStimasi Rp Lembur',
          key: 'ot_estimation',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
      ],
      fields_throughput: [
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Bulan',
          key: 'period',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Throughput STD',
          key: 'throughput_standard',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US')
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Jam Olah / Hari STD',
          key: 'running_hour_standard',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Man Power STD',
          key: 'man_power_standard',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'TBS Proses (Ton) STD',
          key: 'ffb_process_standard',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Throughput',
          key: 'throughput',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Jam Olah / Hari',
          key: 'running_hour',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'TBS Proses',
          key: 'ffb_process',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
      ],
      fields_station: [
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Station',
          key: 'station_code',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Jan (jam)',
          key: 'ot_jan',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Feb (jam)',
          key: 'ot_feb',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Mar (Jam)',
          key: 'ot_mar',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Apr (jam)',
          key: 'ot_apr',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'May (jam)',
          key: 'ot_may',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Jan Konversi (jam)',
          key: 'ot_conversion_jan',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Feb Konversi (jam)',
          key: 'ot_conversion_feb',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center  nameOfTheClass',
          label: 'Mar Konversi (jam)',
          key: 'ot_conversion_mar',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center  nameOfTheClass',
          label: 'Apr Konversi (jam)',
          key: 'ot_conversion_apr',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center  nameOfTheClass',
          label: 'May Konversi (jam)',
          key: 'ot_conversion_may',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
      ],
      fields_personal: [
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'nama',
          key: 'employee_name',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center text-nowrap nameOfTheClass',
          label: 'Station',
          key: 'station_code',
          tdClass: 'align-middle text-center text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Jan (jam)',
          key: 'ot_jan',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Feb (jam)',
          key: 'ot_feb',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Mar (Jam)',
          key: 'ot_mar',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Apr (jam)',
          key: 'ot_apr',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'May (jam)',
          key: 'ot_may',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Jan Konversi (jam)',
          key: 'ot_conversion_jan',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center nameOfTheClass',
          label: 'Feb Konversi (jam)',
          key: 'ot_conversion_feb',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center  nameOfTheClass',
          label: 'Mar Konversi (jam)',
          key: 'ot_conversion_mar',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center  nameOfTheClass',
          label: 'Apr Konversi (jam)',
          key: 'ot_conversion_apr',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center  nameOfTheClass',
          label: 'May Konversi (jam)',
          key: 'ot_conversion_may',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center  nameOfTheClass',
          label: 'Total (jam)',
          key: 'ot_total',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
        {
          thClass: 'align-middle text-center  nameOfTheClass',
          label: 'Total Konversi (jam)',
          key: 'ot_conversion_total',
          formatter: (value, key, item) => {
            let formatter = new Intl.NumberFormat('es-US', {
              maximumFractionDigits: 0,
            })
            return formatter.format(value)
          },
          tdClass: 'align-middle text-right text-nowrap nameOfTheClass',
        },
      ],
      sweet_alert: {
        title: '',
        icon: '',
      },
    }
  },
  watchQuery: ['q', 'page', 'q_year_id', 'q_month_id'],

  async asyncData({ $axios, query }) {
    // DEFAULT MONTH AND YEAR
    const current = new Date()
    let month_at = current.getMonth() + 1

    let year_at = current.getFullYear()

    let year_list = await $axios.$get(`/api/admin/lov_years`)

    let month_list = await $axios.$get(`/api/admin/lov_months`)

    let lov_mill = await $axios.$get(`/api/admin/lov_pks_list`)

    // console.log('daaaa')
    // console.log(month_list.data)
    //FILTER PADA TABLE
    //MONTH

    let q_mill_code = query.q_mill_code ? query.q_mill_code : 'PKS99'

    let q_month_id = query.q_month_id ? query.q_month_id : month_at

    let f_month_id = []

    if (query.q_month_id) {
      // console.log('rendra')
      $axios
        .get(`/api/admin/lov_months?q_month_id=${q_month_id}`)
        .then((response) => {
          f_month_id = response.data.data
        })
    } else {
      f_month_id = []

      q_month_id = month_at
    }

    if (q_month_id == undefined || q_month_id == '') {
      q_month_id = month_at
    }

    //YEAR
    let q_year_id = query.q_year_id ? query.q_year_id : year_at

    let f_year_id = []

    if (query.q_year_id) {
      $axios
        .get(`/api/admin/lov_years?q_year_id=${q_year_id}`)
        .then((response) => {
          f_year_id = response.data.data
        })
    } else {
      f_year_id = []

      q_year_id = year_at
    }

    if (q_year_id == undefined || q_year_id == '') {
      q_year_id = year_at
    }

    //MODAL
    //GET YEAR
    let year_id = []

    $axios.get(`/api/admin/lov_years?q_year_id=${year_at}`).then((response) => {
      year_id = response.data.data
    })

    // GET MONTH
    let month_id = []

    $axios
      .get(`/api/admin/lov_months?q_month_id=${month_at}`)
      .then((response) => {
        month_id = response.data.data
      })

    //page
    let page = query.page ? parseInt(query.page) : ''

    //search
    let search = query.q ? query.q : ''

    //fetching posts
    // const posts = await $axios.$get(
    //   `/api/admin/oil_content?q=${search}&page=${page}&q_month_id=${q_month_id}&q_year_id=${q_year_id}`
    // )
    // console.log('test')
    const posts = await $axios.$get(
      // `/api/peoplehub/overtime?q=${search}&page=${page}&q_month_id=${q_month_id}&q_year_id=${q_year_id}`
      `/api/admin/OvertimePerformance?department_code=${q_mill_code}&year=2024`
    )

    const posts_throughput = await $axios.$get(
      `/api/admin/ThroughputPerformance?department_code=${q_mill_code}&year=2024`
    )

    const posts_station = await $axios.$get(
      `/api/admin/OvertimeStationPerformance?department_code=${q_mill_code}&year=2024`
      // `/api/admin/ThroughputPerformance?department_code=PKS6&year=2024`
    )

    const posts_personal = await $axios.$get(
      `/api/admin/OvertimeEmployeePerformance?department_code=${q_mill_code}&year=2024&station_code=`
      // `/api/admin/OvertimeStationPerformance?department_code=${q_mill_code}&year=2024`
    )

    // console.log('posts_station',posts_station.data)

    return {
      posts: posts.data.data,
      posts_throughput: posts_throughput.data.data,
      posts_station: posts_station.data,
      posts_personal: posts_personal.data,
      pagination: posts.data,
      search: search,
      rowcount: posts.data.total,
      year_id: year_id,
      month_id: month_id,
      f_month_id: f_month_id,
      f_year_id: f_year_id,
      years: year_list.data,
      months: month_list.data,
      mill: lov_mill.data,
    }
  },

  methods: {
    onChangeFilterYear() {
      let vmill_id, vmill_code, vthroughput, vmill_pm, vmill_head, vman_power

      try {
        vmill_id = this.mill_select[0].id
        vmill_code = this.mill_select[0].code
        vthroughput = this.throughput
        vmill_pm = this.mill_pm
        vmill_head = this.mill_head
        vman_power = this.man_power
      } catch (err) {
        vmill_id = -99
        vmill_code = ''
        vthroughput = ''
        vmill_pm = ''
        vmill_head = ''
        vman_power = ''
      }
      console.log(
        vmill_id,
        vmill_code,
        vthroughput,
        vmill_pm,
        vmill_head,
        vman_power
      )

      const current = new Date()
      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      this.$router.push(
        {
          path: this.$route.path,
          query: {
            q: this.search,
            q_mill_id: vmill_id,
            q_mill_code: vmill_code,
            q_throughput: vthroughput,
            q_mill_pm: vmill_pm,
            q_mill_head: vmill_head,
            q_man_power: vman_power,
            q_year_id: this.query_year_id ? this.query_year_id : year_at,
          },
        },
        () => {
          this.$router.go(0)
        }
      )
    },
    onChangeFilter() {
      //   this.searchData()
      //alert(this.mill_select)
      // console.log('mill_select', this.mill_select.id)
      const current = new Date()
      let vthroughput = ''

      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      // this.isLoading = true
      this.$axios
        .get(`api/admin/MillProfile?department_id=${this.mill_select.id}`)
        .then((response) => {
          this.throughput = response.data.data.data[0].throughput
          this.mill_pm = response.data.data.data[0].mill_pm
          this.mill_head = response.data.data.data[0].mill_head
          this.man_power = response.data.data.data[0].man_power
          vthroughput = response.data.data.data[0].throughput

          this.$router.push(
            {
              path: this.$route.path,
              query: {
                q: this.search,
                q_mill_id: this.mill_select.id,
                q_mill_code: this.mill_select.code,
                q_throughput: vthroughput,
                q_mill_pm: response.data.data.data[0].mill_pm,
                q_mill_head: response.data.data.data[0].mill_head,
                q_man_power: response.data.data.data[0].man_power,
                q_year_id: this.query_year_id ? this.query_year_id : year_at,
              },
            },
            () => {
              this.$router.go(0)
            }
          )
        }) // this.$axios
    },
    currentMonth() {
      const current = new Date()
      const date = `${current.getMonth() + 1}`
      return date
    },

    currentYear() {
      const current = new Date()
      const date = `${current.getFullYear()}`

      return date
    },

    showModal() {
      this.$refs['my-modal'].show()
    },

    hideModal() {
      this.$refs['my-modal'].hide()
    },

    changePage(page) {
      const current = new Date()

      // MONTH
      let month_at = current.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      // YEAR
      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.$route.query.q,
          page: page,
          q_month_id: this.query_month_id ? this.query_month_id : month_at,
          q_year_id: this.query_year_id ? this.query_year_id : year_at,
        },
      })
    },
    //searchData
    searchData() {
      this.show = 0
      const current = new Date()

      // MONTH
      let month_at = current.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      // YEAR
      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      this.$router.push(
        {
          path: this.$route.path,
          query: {
            q: this.search,
            q_month_id: this.query_month_id ? this.query_month_id : month_at,
            q_year_id: this.query_year_id ? this.query_year_id : year_at,
          },
        },
        () => {
          this.$router.go(0)
        }
      )

      // this.show = 1
    },

    exportData() {
      const current = new Date()

      // MONTH
      let month_at = current.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      // YEAR
      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      let i_year =
        this.query_year_id === undefined ? year_at : this.query_year_id

      let i_month =
        this.query_month_id === undefined ? month_at : this.query_month_id

      const headers = {
        'Content-Type': 'application/json',
      }

      this.$axios({
        url: `/api/peoplehub/overtime2/export?q=${this.search}&q_month_id=${i_month}&q_year_id=${i_year}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Overtime.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },

    async exportDataTemplate() {
      const current = new Date()

      // MONTH
      let month_at = current.getMonth() + 1

      try {
        if (this.f_month_id.id === null) {
          this.query_month_id = ''
        } else if (this.f_month_id.id === undefined) {
          this.query_month_id = this.$route.query.q_month_id
        } else {
          this.query_month_id = this.f_month_id.id ? this.f_month_id.id : ''
        }
      } catch (err) {}

      // YEAR
      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      let i_year =
        this.query_year_id === undefined ? year_at : this.query_year_id

      let i_month =
        this.query_month_id === undefined ? month_at : this.query_month_id

      await this.$axios
        .get(`/api/admin/lov_months?q_month_id=${i_month}`)
        .then((response) => {
          this.month_code = response.data.data
        })

      let month_code = this.month_code[0].name

      const headers = {
        'Content-Type': 'application/json',
      }

      await this.$axios({
        url: `/api/admin/template_oil_content/export?q=${this.search}`,
        method: 'GET',
        responseType: 'blob',
        headers: headers, // important
      }).then((response) => {
        this.isLoading = false
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        var fileName = 'Oil_Content_' + month_code + '_' + i_year + '.xlsx'
        link.setAttribute('download', fileName) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
    },

    upload(e) {
      // uploaded file
      let files = e.target.files[0]

      this.files = files
    },

    refreshData() {
      this.$router.push({
        name: 'erp_ho-data_warehouse-rna-oil_content',
        query: { q_month_id: month_at, q_year_id: year_at },
      })
    },

    async submitFileUpload() {
      this.show = 0
      const current = new Date()

      // Year
      let i_year_at = ''

      try {
        if (this.year_id.year_at === null) {
          i_year_at = ''
        } else if (this.year_id.year_at === undefined) {
          i_year_at = current.getFullYear()
        } else {
          i_year_at = this.year_id.year_at ? this.year_id.year_at : ''
        }
      } catch (err) {}

      let q_year = i_year_at === '' ? current.getFullYear() : i_year_at

      // Month
      let i_month_at = ''

      try {
        if (this.month_id.id === null) {
          i_month_at = ''
        } else if (this.month_id.id === undefined) {
          i_month_at = current.getMonth() + 1
        } else {
          i_month_at = this.month_id.id ? this.month_id.id : ''
        }
      } catch (err) {}

      let q_month = i_month_at === '' ? current.getMonth() + 1 : i_month_at

      await this.$axios
        .get(`/api/admin/lov_months?q_month_id=${i_month_at}`)
        .then((response) => {
          this.month_code = response.data.data
        })

      let monthCode =
        this.month_id.name !== null &&
        this.month_id.name !== '' &&
        this.month_id.name !== undefined
          ? this.month_id.name
          : this.month_code[0].name
      // console.log(this.files.name)

      let formData = new FormData()
      formData.append('upload_file', this.files)

      await this.$axios
        .post(
          `/api/peoplehub/overtime?q_month_id=${i_month_at}&q_year_id=${i_year_at}`,
          formData
        )
        .then((response) => {
          this.show = 1

          this.$nuxt.refresh()
          this.files = null

          //sweet alert
          this.$swal.fire({
            title: 'BERHASIL!',
            text: 'Data Berhasil Disimpan!',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
          })

          this.$router.push({
            name: 'erp_ho-peoplehub-overtime',
            query: { q_month_id: i_month_at, q_year_id: i_year_at },
          })
        })
        .catch((error) => {
          this.show = 1
          this.files = null

          this.$router.push({
            name: 'erp_ho-peoplehub-overtime',
            query: { q_month_id: i_month_at, q_year_id: i_year_at },
          })

          this.$swal.fire({
            title: 'ERROR!',
            text: 'Data Gagal Disimpan!',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000,
          })

          //assign error to state "validation"
          // this.validation = error.response.data
          // this.files = null
        })
    },

    formatDateAssigned(value) {
      const date = new Date(value)

      // Get year, month, and day part from the date
      const year = date.toLocaleString('default', { year: 'numeric' })
      const month = date.toLocaleString('default', { month: 'short' })
      const day = date.toLocaleString('default', { day: '2-digit' })

      return `${day}-${month}-${year}`
    },

    test(X) {
      // alert(X)
      // console.log(X, this.$route.query.q_mill_id)

      const current = new Date()
      let year_at = current.getFullYear()

      try {
        if (this.f_year_id.year_at === null) {
          this.query_year_id = ''
        } else if (this.f_year_id.year_at === undefined) {
          this.query_year_id = this.$route.query.q_year_id
        } else {
          this.query_year_id = this.f_year_id.year_at
            ? this.f_year_id.year_at
            : ''
        }
      } catch (err) {}

      this.$router.push(
        {
          path: this.$route.path,
          query: {
            q: this.search,
            q_mill_id: this.$route.query.q_mill_id,
            q_mill_code: this.$route.query.q_mill_code,
            q_throughput: this.$route.query.q_throughput,
            q_mill_pm: this.$route.query.q_mill_pm,
            q_mill_head: this.$route.query.q_mill_head,
            q_man_power: this.$route.query.q_man_power,
            q_year_id: this.query_year_id ? this.query_year_id : year_at,
            q_station_code : X,
          },
        },
        () => {
          this.$router.go(0)
        }
      )
    }
  }, //Method

  mounted() {
    console.log('mounted')
    if (this.$route.query.q_mill_id != null) {
      this.$axios
        .get(`/api/admin/lov_pks_list?id=${this.$route.query.q_mill_id}`)

        .then((response) => {
          this.mill_select = response.data.data
        })
    }

    this.throughput = this.$route.query.q_throughput
    this.mill_pm = this.$route.query.q_mill_pm
    this.mill_head = this.$route.query.q_mill_head
    this.man_power = this.$route.query.q_man_power

    //GET DATA MONTH SAAT AWAL BUKA MENU
    const current = new Date()

    if (this.$route.query.q_month_id == null) {
      this.$axios
        .get(`/api/admin/lov_months?q_month_id=${current.getMonth() + 1}`)

        .then((response) => {
          this.f_month_id = response.data.data
        })
    } else {
      this.$axios
        .get(`/api/admin/lov_months?q_month_id=${this.$route.query.q_month_id}`)

        .then((response) => {
          this.f_month_id = response.data.data
        })
    }

    //GET DATA YEAR SAAT AWAL BUKA MENU
    if (this.$route.query.q_year_id == null) {
      this.$axios
        .get(`/api/admin/lov_years?q_year_id=${current.getFullYear()}`)

        .then((response) => {
          this.f_year_id = response.data.data
        })
    } else {
      this.$axios
        .get(`/api/admin/lov_years?q_year_id=${this.$route.query.q_year_id}`)

        .then((response) => {
          this.f_year_id = response.data.data
        })
    }
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

.title-filter {
  font-size: 14px;
  margin-left: 8px;
}

.btn-modal {
  font-size: 16px;
  font-weight: bold;
}
.f_upload {
  background-color: rgba(82, 68, 190, 0.911);
  font-size: 14px;
  width: 150px;
  padding: 5px 0px 5px 0px;
  border-radius: 3px;
  color: white;
  box-shadow: 2px 3px #f7ebfd;
  border-style: solid;
  border-width: 0px 2px 2px 0px;
  border-color: rgb(57, 50, 106);
  text-align: center;
  margin-right: 2px;
  font-weight: bold;
}

.f_upload:hover {
  background-color: rgb(64, 51, 161);
  border-style: solid;
  border-width: 0px 2px 2px 0px;
  border-color: rgb(69, 61, 129);
}

#file-chosen {
  margin-left: 0.3rem;
  font-family: sans-serif;
}

.table-oil {
  font-size: 14px;
}

.txt-2 {
  color: #be65e2;
  padding-top: 17%;
  font-family: 'Press Start 2P', cursive;
  text-align: center;
  font-size: 27px;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.148);
  font-weight: bold;
}

.img-logo {
  width: 160px;
  padding-top: 10px;
  padding-right: 20px;
}

p {
  margin-bottom: 0px;
}
</style>
