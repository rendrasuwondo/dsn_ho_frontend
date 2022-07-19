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
            <b>CREATE JOINT SAMPLING</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="storePost">
            <div class="form-group">
              <label>PO</label>
              <b-row>
                <b-col cos="9">
                  <input
                    type="text"
                    v-model="field.po"
                    placeholder="Masukkan Kode PO"
                    class="form-control"
                    @keypress.enter="searchDataPO"
                  />
                </b-col>
                <b-col>
                  <button @click="searchDataPO" class="btn btn-info">
                    <i class="fa fa-search"></i>
                    CARI
                  </button>
                </b-col>
              </b-row>
              <!-- <div v-if="validation.po" class="mt-2">
                <b-alert show variant="danger">{{ validation.po[0] }}</b-alert>
              </div> -->
            </div>

            <div class="form-group">
              <label>Jenis Pupuk</label>

              <input
                type="text"
                v-model="data_po.FERTILIZER_TYPE"
                placeholder="Jenis Pupuk"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>PT</label>

              <input
                type="text"
                v-model="data_po.COMPANY_CODE"
                placeholder="PT"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Departemen</label>
              <input
                type="text"
                v-model="data_po.DEPARTMENT_CODE"
                placeholder="Department"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>QTY</label>

              <input
                class="form-control"
                placeholder="Masukkan Jumlah Volume"
                v-model="data_po.QTY"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Tanggal Kedatangan</label>
              <b-form-datepicker
                v-model="field.tgl_kedatangan"
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
                v-model="field.joint_sampling"
                :date-format-options="{
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  weekday: 'short',
                }"
              ></b-form-datepicker>
            </div>

            <div class="form-group">
              <label>Tanggal Terima</label>
              <b-form-datepicker
                v-model="field.tgl_terima"
                :date-format-options="{
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  weekday: 'short',
                }"
              ></b-form-datepicker>
            </div>

            <div class="form-group">
              <label>Kode Sampel</label>
              <input
                type="text"
                v-model="data_po.VENDOR"
                placeholder="Masukkan Kode Sample"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Kirim Ke Lab</label>
              <b-form-datepicker
                v-model="field.kirim_lab"
                :date-format-options="{
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  weekday: 'short',
                }"
              ></b-form-datepicker>
            </div>

            <div class="form-group">
              <label>Terima Lab</label>
              <b-form-datepicker
                v-model="field.terima_lab"
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
              v-on:click="back()"
              class="btn btn-warning btn-reset"
              type="reset"
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
      title: 'Tambah Joint Sampling',
    }
  },

  data() {
    return {
      state: 'disabled',

      field: {
        po: '',
        supplier: '',
        fertilizer_type_id: '',
        company_id: '',
        department_id: '',
        qty: '',
        tgl_kedatangan: '',
        joint_sampling: '',
        tgl_terima: '',
        kode_sampel: '',
        kirim_lab: '',
        terima_lab: '',
        description: '',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: '',
      },

      company: [],

      department: [],

      fertilizer_type: [],
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

    this.field.tgl_kedatangan = this.currentDate()
    this.field.joint_sampling = this.currentDate()
    this.field.tgl_terima = this.currentDate()
    this.field.kirim_lab = this.currentDate()
    this.field.terima_lab = this.currentDate()

    // this.$refs.po.focus()

    //Data company
    // this.$axios
    //   .get('/api/admin/lov_company_table')

    //   .then((response) => {
    //     // console.log(response.data.data[0])
    //     this.company = response.data.data
    //   })

    // //Data department
    // this.$axios
    //   .get('/api/admin/lov_department')

    //   .then((response) => {
    //     this.department = response.data.data
    //   })

    // //Data location
    // this.$axios
    //   .get('/api/admin/lov_fertilizer_type')

    //   .then((response) => {
    //     this.fertilizer_type = response.data.data
    //   })
  },

  methods: {
    //searchData
    searchDataPO() {
      // this.$axios
      //   .get(`http://127.0.0.1:8000/api/PoFertilizer?PO_NO=${this.field.po}`)
      //   .then((response) => {
      //   this.po = response.data.data
      // }).prepend(
      const data_po = this.$axios
        .$get(`http://127.0.0.1:8000/api/PoFertilizer?PO_NO=${this.field.po}`)
        // return po
        .then((response) => {
          this.data_po = response.data
          console.log('data')
          console.log(this.field.po)
          console.log(this.response.data)
        })
      // console.log(
      //   `http://127.0.0.1:8000/api/PoFertilizer?PO_NO=${this.field.po}`
      // )
    },

    back() {
      this.$router.push({
        name: 'erp_ho-admin-t_fertilizer_sample',
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
      //define formData
      let formData = new FormData()

      formData.append(
        'company_id',
        this.field.company_id ? this.field.company_id.id : ''
      )
      formData.append(
        'department_id',
        this.field.department_id ? this.field.department_id.id : ''
      )
      formData.append(
        'fertilizer_type_id',
        this.field.fertilizer_type_id ? this.field.fertilizer_type_id.id : ''
      )
      formData.append('qty', this.field.qty)
      formData.append('tgl_kedatangan', this.field.tgl_kedatangan)
      formData.append('joint_sampling', this.field.joint_sampling)
      formData.append('tgl_terima', this.field.tgl_terima)
      formData.append('kode_sampel', this.field.kode_sampel)
      formData.append('kirim_lab', this.field.kirim_lab)
      formData.append('terima_lab', this.field.terima_lab)
      formData.append('description', this.field.description)
      formData.append('created_at', this.field.created_at)
      formData.append('created_by', this.field.created_by)
      formData.append('updated_at', this.field.update_at)
      formData.append('udpated_by', this.field.udpate_by)

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
          this.$router.push({
            name: 'erp_ho-admin-t_fertilizer_sample',
          })
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
