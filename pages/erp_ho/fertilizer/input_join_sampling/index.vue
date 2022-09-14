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
            <i class="nav-icon fas fa-file-contract"></i>
            <b>INPUT SAMPLING</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="storePost">
            <div class="form-group">
              <label>PO</label>
              <b-input-group class="">
                <input
                  type="text"
                  v-model="field.po"
                  placeholder="Masukkan Kode PO"
                  class="form-control"
                  v-on:keypress="isNumber($event)"
                  maxlength="10"
                  @keypress.enter="searchDataPO"
                />
                <b-input-group-append>
                  <button @click="searchDataPO" class="btn btn-info">
                    <i class="fa fa-search"></i>
                    CARI
                  </button>
                </b-input-group-append>
              </b-input-group>
              <div v-if="validation.po" class="mt-2">
                <b-alert show variant="danger">{{ validation.po }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Supplier</label>
              <input
                type="text"
                v-model="data_po.VENDOR"
                placeholder="Masukkan Kode Sample"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Jenis Pupuk</label>
              <input
                type="text"
                v-model="data_po.FERTILIZER_TYPE"
                placeholder="Masukkan Jenis Pupuk"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>QTY PO</label>
              <input
                type="text"
                v-model="data_po.QTY"
                placeholder="Masukkan QTY "
                class="form-control"
                readonly
                v-number="number"
              />
            </div>

            <div class="form-group">
              <label>Satuan</label>

              <input
                class="form-control"
                placeholder="Masukkan Satuan"
                v-model="data_po.UNIT"
                readonly
              />
            </div>

            <div class="form-group">
              <label>PT</label>

              <input
                type="text"
                v-model="data_po.COMPANY_CODE"
                placeholder="Masukkan Nama PT"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Estate</label>
              <input
                type="text"
                v-model="data_po.DEPARTMENT_CODE"
                placeholder="Masukkan Nama Department"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Tanggal GR</label>
              <b-form-datepicker
                v-model="data_po.GR_DATE"
                :date-format-options="{
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  weekday: 'short',
                }"
                :disabled="disabled"
              ></b-form-datepicker>
            </div>

            <div class="form-group">
              <label>QTY GR</label>
              <input
                type="text"
                v-model="data_po.GR_QTY"
                placeholder="Masukkan QTY GR"
                class="form-control"
                readonly
                v-number="number"
              />
            </div>

            <div class="form-group">
              <label>PO PRICE</label>
              <input
                type="text"
                v-model="data_po.PO_PRICE"
                placeholder="Masukkan PO Price"
                class="form-control"
                readonly
                v-number="number"
              />
            </div>

            <div class="form-group">
              <label>Tanggal Kedatangan</label>
              <b-form-datepicker
                placeholder="Choose a date"
                v-model="field.arrived_at"
                :date-format-options="{
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  weekday: 'short',
                }"
                reset-button
              ></b-form-datepicker>
            </div>
            <div v-if="validation.arrived_at" class="mt-2">
              <b-alert show variant="danger">{{
                validation.arrived_at[0]
              }}</b-alert>
            </div>

            <div class="form-group">
              <label>Join Sampling</label>
              <b-form-datepicker
                placeholder="Choose a date"
                v-model="field.join_sampling_at"
                :date-format-options="{
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  weekday: 'short',
                }"
                reset-button
              ></b-form-datepicker>
            </div>
            <div v-if="validation.join_sampling_at" class="mt-2">
              <b-alert show variant="danger">{{
                validation.join_sampling_at[0]
              }}</b-alert>
            </div>

            <div class="form-group">
              <label>Keterangan</label>

              <textarea
                v-model="field.description"
                class="form-control"
                rows="3"
                placeholder="Masukkan Deskripsi Singkat"
              ></textarea>
              <div v-if="validation.description" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.description[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <b-row>
                <b-col>
                  <label>Tanggal Buat </label>
                  <b-form-datepicker
                    v-model="field.created_at"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      weekday: 'short',
                    }"
                    :disabled="disabled"
                  ></b-form-datepicker>
                </b-col>
                <b-col
                  ><label>Pembuat</label>
                  <input
                    type="text"
                    v-model="field.created_by"
                    class="form-control"
                    readonly
                /></b-col>
              </b-row>
            </div>

            <div class="form-group">
              <b-row>
                <b-col
                  ><label>Tanggal Ubah </label>

                  <b-form-datepicker
                    v-model="field.updated_at"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      weekday: 'short',
                    }"
                    :disabled="disabled"
                  ></b-form-datepicker
                ></b-col>
                <b-col>
                  <label>Pengubah</label>
                  <input
                    type="text"
                    v-model="field.updated_by"
                    class="form-control"
                    readonly
                  />
                </b-col>
              </b-row>
            </div>

            <div class="form-group"></div>
            <div>
              <button
                v-if="statusPO === 1 || field.id !== ''"
                class="btn btn-info mr-1 btn-submit"
                type="submit"
              >
                <i class="fa fa-paper-plane"></i> SIMPAN
              </button>
              <button
                v-else
                title="Nilai GR QTY Masih Belum Memenuhi Standar"
                class="btn btn-info mr-1"
                disabled
              >
                <i class="fa fa-paper-plane"></i> SIMPAN
              </button>
              <button
                v-if="field.id !== ''"
                class="btn btn-warning btn-submit"
                @click="SubmitVerifikasi"
                type="submit"
              >
                <i class="fa fa-check-double"></i> <b>SUBMIT</b>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
/* import { VNumber  } from '@coders-tm/vue-number-format' */
/* import { number } from '@coders-tm/vue-number-format' */

export default {
  //layout
  layout: 'admin',

  //meta
  head() {
    return {
      title: 'Input Sampling',
    }
  },

  data() {
    return {
      state: 'disabled',
      number: {
        decimal: '.',
        separator: ',',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false,
      },
      field: {
        id: '',
        po: '',
        supplier: '',
        fertilizer_type_id: '',
        company_id: '',
        department_id: '',
        qty: '',
        arrived_at: '',
        join_sampling_at: '',
        description: '',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: '',
      },

      data_po: [],

      nilai: '',
      percentage: '',
      statusPO: '',

      //state validation
      validation: [],
      show: 1,
    }
  },

  mounted() {
    this.field.created_at = this.currentDate()
    this.field.updated_at = this.currentDate()
    this.field.created_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name
    this.field.updated_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name

    this.bind()

    this.$axios
      .get(`/api/admin/lov_percentage_input_sampling`)
      .then((response) => {
        this.nilai = response.data.data[0].value_1
      })
    // this.refreshNewForm()
  },

  methods: {
    isNumber(e) {
      let char = String.fromCharCode(e.keyCode)
      if (/^[0-9]+$/.test(char)) return true
      else e.preventDefault()
    },

    //searchData
    searchDataPO(e) {
      // this.$axios
      //   .get(`http://127.0.0.1:8000/api/PoFertilizer?PO_NO=${this.field.po}`)
      //   .then((response) => {
      //   this.po = response.data.data
      // }).prepend(
      const data_po = this.$axios
        .$get(`/api/admin/PoFertilizer?po=${this.field.po}`)
        // return po
        .then((response) => {
          if (response.data.CHECK === 0) {
            this.data_po = response.data

            this.percentage = (this.nilai / 100) * response.data.QTY

            if (response.data.GR_QTY >= this.percentage) {
              this.statusPO = 1
            } else {
              this.statusPO = 0
            }
          }
        })
        .catch((error) => {
          //assign error validasi
          this.validation = error.response.data
          console.log('valid')
          console.log(this.field.po)
        })

      e.preventDefault()
      // console.log(
      //   `http://127.0.0.1:8000/api/PoFertilizer?PO_NO=${this.field.po}`
      // )
    },

    back() {
      this.$router.push({
        name: 'erp_ho-fertilizer-join_sampling',
        params: { id: this.$route.params.id, r: 1 },
      })
    },

    currentDate() {
      const current = new Date()
      const date = `${current.getFullYear()}-${
        current.getMonth() + 1
      }-${current.getDate()}`

      return date
    },

    async storePost() {
      this.show = 0
      if (this.field.id != '') {
        //UPDATE
        this.$axios
          .put(`/api/admin/t_fertilizer_sample/${this.field.id}`, {
            po: this.field.po,
            company_id: this.data_po.COMPANY_ID,
            department_id: this.data_po.DEPARTMENT_ID,
            fertilizer_type_id: this.data_po.FERTILIZER_TYPE_ID,
            vendors_id: this.data_po.VENDOR_ID,
            unit_id: this.data_po.UNIT_ID,
            qty: this.data_po.QTY.replace(',', ''),
            arrived_at: this.field.arrived_at,
            join_sampling_at: this.field.join_sampling_at,
            request_status_id: 1,
            selected: 0,
            description: this.field.description,
            created_at: this.field.created_at,
            updated_at: this.field.updated_at,
            created_by: this.field.created_by,
            updated_by: this.field.updated_by,
          })
          .then(() => {
            //sweet alert
            this.$swal.fire({
              title: 'BERHASIL!',
              text: 'Data Berhasil Diupdate!',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            })
            //redirect ke route "post"
            this.$nuxt.refresh()
            this.bind()
            this.validationCelar()
            this.show = 1
          })
          .catch((error) => {
            //assign error validasi
            this.validation = error.response.data
          })
      } else {
        //INSERT
        //define formData
        let formData = new FormData()
        formData.append('po', this.field.po)
        formData.append(
          'company_id',
          this.data_po.COMPANY_ID ? this.data_po.COMPANY_ID : null
        )
        formData.append(
          'department_id',
          this.data_po.DEPARTMENT_ID ? this.data_po.DEPARTMENT_ID : null
        )
        formData.append(
          'fertilizer_type_id',
          this.data_po.FERTILIZER_TYPE_ID
            ? this.data_po.FERTILIZER_TYPE_ID
            : null
        )
        formData.append(
          'vendors_id',
          this.data_po.VENDOR_ID ? this.data_po.VENDOR_ID : null
        )
        formData.append(
          'unit_id',
          this.data_po.UNIT_ID ? this.data_po.UNIT_ID : null
        )
        formData.append(
          'qty',
          this.data_po.QTY ? this.data_po.QTY.replace(',', '') : null
        )
        formData.append('arrived_at', this.field.arrived_at)
        formData.append('join_sampling_at', this.field.join_sampling_at)
        formData.append('description', this.field.description)
        formData.append('request_status_id', 1)
        formData.append('selected', 0)

        formData.append('created_by', this.field.created_by)

        formData.append('updated_by', this.field.updated_by)
        // console.log('sada')
        //sending data to server
        await this.$axios
          .post('/api/admin/t_fertilizer_sample', formData)
          .then(() => {
            //sweet alert
            this.$swal.fire({
              title: 'BERHASIL!',
              text: 'Data Berhasil Disimpan!',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            })

            //redirect, if success store data
            this.$nuxt.refresh()
            this.bind()
            this.validationCelar()

            this.show = 1
          })
          .catch((error) => {
            this.show = 1

            //assign error to state "validation"
            this.validation = error.response.data
            console.log(error.response.data.message)
            this.$swal.fire({
              title: 'Error!',
              text: error.response.data.message,
              icon: 'error',
              showConfirmButton: true,
              // timer: 2000,
            })

            // this.show = 1
          })
      }
    },

    async SubmitVerifikasi(e) {
      // console.log('tes')

      var sample = []

      e.preventDefault()
      this.$swal
        .fire({
          title: 'APAKAH ANDA YAKIN ?',
          text: 'INGIN SUBMIT DATA INI !',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#05c46b',
          cancelButtonColor: '#d33',
          confirmButtonText: 'YA',
          cancelButtonText: 'TIDAK',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.show = 0

            this.checkId = this.field.id ? this.field.id : undefined
            sample.push([{ id: this.checkId, selected: 1, po: this.field.po }])

            this.$axios
              .post(`/api/admin/update_request_status_prc_approve`, sample)
              .then(() => {
                this.show = 1

                this.$swal.fire({
                  title: 'BERHASIL!',
                  text: 'Data Berhasil Disimpan!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 2000,
                })
                this.$nuxt.refresh()
                this.refreshNewForm()
              })
              .catch((error) => {
                this.show = 1

                //assign error to state "validation"
                this.validation = error.response.data
                alert(error.response.data)
              })
          }
        })
    },

    bind() {
      this.$axios.get(`/api/admin/input_join_sampling`).then((response) => {
        console.log(response.data.data)
        if (response.data.data != null) {
          this.field.id = response.data.data.id
          this.field.po = response.data.data.po
          this.field.vendors_id = response.data.data.vendors_id
          this.data_po.VENDOR = response.data.data.supplier
          this.field.fertilizer_type_id = response.data.data.fertilizer_type_id
          this.data_po.FERTILIZER_TYPE = response.data.data.fertilizer_type_code
          this.field.company_id = response.data.data.company_id
          this.data_po.COMPANY_CODE = response.data.data.company_code
          this.field.department_id = response.data.data.department_id
          this.data_po.DEPARTMENT_CODE = response.data.data.department_code
          this.field.unit_id = response.data.data.unit_id
          this.data_po.UNIT = response.data.data.unit_code
          this.data_po.QTY = response.data.data.qty
          this.data_po.PO_PRICE = response.data.data.po_price
          this.field.qty = response.data.data.gr_qty
          this.data_po.GR_QTY = response.data.data.gr_qty
          this.data_po.GR_DATE = response.data.data.gr_date
          this.field.arrived_at = response.data.data.arrived_at
            ? response.data.data.arrived_at
            : null
          this.field.join_sampling_at = response.data.data.join_sampling_at
            ? response.data.data.join_sampling_at
            : null
          this.field.description = response.data.data.description
          this.field.created_at = response.data.data.created_at
          this.field.created_by = response.data.data.created_by
          this.field.updated_at = response.data.data.updated_at
          this.field.updated_by = response.data.data.updated_by
        }
      })
    },

    refreshNewForm() {
      this.validationCelar
      this.$axios.get(`/api/admin/input_join_sampling`).then((response) => {
        //data yang diambil

        if (response.data.data === null) {
          this.field.id = ''
          this.field.po = ''
          this.field.vendors_id = ''
          this.data_po.VENDOR = ''
          this.field.fertilizer_type_id = ''
          this.data_po.FERTILIZER_TYPE = ''
          this.field.company_id = ''
          this.data_po.COMPANY_CODE = ''
          this.field.department_id = ''
          this.data_po.DEPARTMENT_CODE = ''
          this.field.unit_id = ''
          this.data_po.UNIT = ''
          this.data_po.QTY = ''
          this.field.qty = ''
          this.data_po.GR_QTY = ''
          this.data_po.GR_DATE = ''
          this.field.arrived_at = ''
          this.field.join_sampling_at = ''
          this.field.description = ''
          this.data_po.PO_PRICE = ''
        }
      })
    },

    validationCelar() {
      this.validation.po = ''
      this.validation.arrived_at = ''
      this.validation.join_sampling_at = ''
    },
  },

  computed: {
    disabled() {
      return this.state === 'disabled'
    },
    readonly() {
      return this.state === 'readonly'
    },
  },
}
</script>

<style>
.ck-editor__editable {
  min-height: 200px;
}
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
}
.img-logo {
  width: 160px;
  padding-top: 10px;
  padding-right: 20px;
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
</style>
