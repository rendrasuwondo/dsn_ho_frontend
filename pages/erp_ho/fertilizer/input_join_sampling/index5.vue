<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-file-contract"></i>
            <b>INPUT JOIN SAMPLING</b>
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
                <b-alert show variant="danger">{{ validation.po[0] }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Supplier</label>
              <input
                v-if="field.id === null"
                type="text"
                v-model="data_po.VENDOR"
                placeholder="Masukkan Kode Sample"
                class="form-control"
                readonly
              />
              <input
                v-else
                type="text"
                v-model="field.supplier"
                placeholder="Masukkan Kode Sample"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Jenis Pupuk</label>
              <input
                v-if="field.id === null"
                type="text"
                v-model="data_po.FERTILIZER_TYPE"
                placeholder="Jenis Pupuk"
                class="form-control"
                readonly
              />
              <input
                v-else
                type="text"
                v-model="field.fertilizer_type_code"
                placeholder="Jenis Pupuk"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>QTY PO</label>

              <input
                v-if="field.id === null"
                class="form-control"
                placeholder="Jumlah Volume"
                v-model="data_po.QTY"
                readonly
              />
              <input
                v-else
                class="form-control"
                placeholder="Jumlah Volume"
                v-model="field.qty"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Satuan</label>

              <input
                v-if="field.id === null"
                class="form-control"
                placeholder="Jumlah Volume"
                v-model="data_po.UNIT"
                readonly
              />
              <input
                v-else
                class="form-control"
                placeholder="Jumlah Volume"
                v-model="field.unit_code"
                readonly
              />
            </div>

            <div class="form-group">
              <label>PT</label>

              <input
                v-if="field.id === null"
                type="text"
                v-model="data_po.COMPANY_CODE"
                placeholder="PT"
                class="form-control"
                readonly
              />
              <input
                v-else
                type="text"
                v-model="field.company_code"
                placeholder="PT"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Estate</label>
              <input
                v-if="field.id === null"
                type="text"
                v-model="data_po.DEPARTMENT_CODE"
                placeholder="Department"
                class="form-control"
                readonly
              />
              <input
                v-else
                type="text"
                v-model="field.department_code"
                placeholder="Department"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Tanggal GR</label>
              <b-form-datepicker
                v-if="field.id === null"
                v-model="data_po.GR_DATE"
                :date-format-options="{
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  weekday: 'short',
                }"
                :disabled="disabled"
              ></b-form-datepicker>
              <b-form-datepicker
                v-else
                v-model="field.gr_date"
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
                v-if="field.id === null"
                class="form-control"
                placeholder="Jumlah QTY GR"
                v-model="data_po.GR_QTY"
                readonly
              />
              <input
                v-else
                class="form-control"
                placeholder="Jumlah QTY GR"
                v-model="field.gr_qty"
                readonly
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
              ></b-form-datepicker>
            </div>

            <div class="form-group">
              <label>Joint Sampling</label>
              <b-form-datepicker
                placeholder="Choose a date"
                v-model="field.join_sampling_at"
                :date-format-options="{
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  weekday: 'short',
                }"
              ></b-form-datepicker>
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

            <button class="btn btn-info mr-1 btn-submit" type="submit">
              <i class="fa fa-paper-plane"></i> SIMPAN
            </button>
            <button
              @click="VerifikasiData"
              class="btn btn-warning"
              type="submit"
            >
              <i class="fa fa-redo"></i> BATAL
            </button>
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
      title: 'Input Join Sampling',
    }
  },

  data() {
    return {
      state: 'disabled',

      field: {
        id: '',
        po: '',
        vendors_id: '',
        supplier: '',
        fertilizer_type_id: '',
        fertilizer_type_code: '',
        company_id: '',
        company_code: '',
        department_id: '',
        department_code: '',
        unit_id: '',
        unit_code: '',
        qty: '',
        arrived_at: '',
        join_sampling_at: '',
        description: '',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: '',
        gr_date: '',
        gr_qty: '',
      },

      data_po: [],
      //state validation
      validation: [],
    }
  },

  mounted() {
    this.field.created_at = this.currentDate()
    this.field.updated_at = this.currentDate()
    this.field.created_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name
    this.field.updated_by =
      this.$auth.user.employee.nik + '-' + this.$auth.user.employee.name

    this.$axios.get(`/api/admin/input_join_sampling`).then((response) => {
      //data yang diambil
      if (response.data.data === null) {
        this.field.id = null
        this.field.po = null
        this.field.vendors_id = null
        this.field.fertilizer_type_id = null
        this.field.company_id = null
        this.field.unit_id = null
        this.field.qty = null
        this.field.gr_qty = null
        this.field.gr_date = null
        this.field.arrived_at = null
        this.field.join_sampling_at = null
        this.field.description = null
      } else {
        console.log('data')
        console.log(response.data.data)
        this.field.id = response.data.data.id
        this.field.po = response.data.data.po
        this.field.vendors_id = response.data.data.vendors_id
        this.field.supplier = response.data.data.supplier
        this.field.fertilizer_type_id = response.data.data.fertilizer_type_id
        this.field.fertilizer_type_code =
          response.data.data.fertilizer_type_code
        this.field.company_id = response.data.data.company_id
        this.field.company_code = response.data.data.company_code
        this.field.department_id = response.data.data.department_id
        this.field.department_code = response.data.data.department_code
        this.field.department_code_sap = response.data.data.department_code_sap
        this.field.unit_id = response.data.data.unit_id
        this.field.unit_code = response.data.data.unit_code
        this.field.qty = response.data.data.qty
        this.field.gr_qty = response.data.data.gr_qty
        this.field.gr_date = response.data.data.gr_date
        this.field.arrived_at = response.data.data.arrived_at
          ? response.data.data.arrived_at
          : null
        this.field.join_sampling = response.data.data.join_sampling
          ? response.data.data.join_sampling
          : null
        this.field.description = response.data.data.description
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by
      }
    })
  },

  methods: {
    //searchData
    searchDataPO(e) {
      const data_po = this.$axios
        .$get(
          `http://127.0.0.1:8000/api/admin/PoFertilizer?PO_NO=${this.field.po}`
        )
        // return po
        .then((response) => {
          this.data_po = response.data
          this.field.supplier = this.data_po.VENDOR
          this.field.vendors_id = this.data_po.VENDOR_ID
          this.field.company_id = this.data_po.COMPANY_ID
          this.field.company_code = this.data_po.COMPANY_CODE
          this.field.qty = this.data_po.QTY
          this.field.department_id = this.data_po.DEPARTMENT_ID
          this.field.department_code = this.data_po.DEPARTMENT_CODE
          this.field.unit_id = this.data_po.UNIT_ID
          this.field.unit_code = this.data_po.UNIT
          this.field.fertilizer_type_id = this.data_po.FERTILIZER_TYPE_ID
          this.field.fertilizer_type_code = this.data_po.FERTILIZER_TYPE
          this.field.gr_qty = this.data_po.GR_QTY
          this.field.gr_date = this.data_po.GR_DATE
        })

      e.preventDefault()
    },

    // back() {
    //   this.$router.push({
    //     name: 'erp_ho-fertilizer-join_sampling',
    //     params: { id: this.$route.params.id, r: 1 },
    //   })
    // },

    currentDate() {
      const current = new Date()
      const date = `${current.getFullYear()}-${
        current.getMonth() + 1
      }-${current.getDate()}`

      return date
    },

    async storePost() {
      //define formData
      console.log('test')
      console.log(this.field.join_sampling_at)
      console.log(this.field.arrived_at)
      let formData = new FormData()
      formData.append('po', this.field.po)
      formData.append('company_id', this.data_po.COMPANY_ID)
      formData.append('department_id', this.data_po.DEPARTMENT_ID)
      formData.append('fertilizer_type_id', this.data_po.FERTILIZER_TYPE_ID)
      formData.append('vendors_id', this.data_po.VENDOR_ID)
      formData.append('unit_id', this.data_po.UNIT_ID)
      formData.append('qty', this.data_po.QTY)
      formData.append('arrived_at', this.field.arrived_at)
      formData.append('joint_sampling_at', this.field.join_sampling_at)
      formData.append('description', this.field.description)
      // formData.append('created_at', this.field.created_at)
      // formData.append('created_by', this.field.created_by)
      // formData.append('updated_at', this.field.update_at)
      // formData.append('udpated_by', this.field.udpate_by)

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
        })
        .catch((error) => {
          //assign error to state "validation"
          this.validation = error.response.data
        })
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
</style>
