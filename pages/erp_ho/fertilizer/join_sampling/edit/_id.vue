<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-file-contract"></i>
            <b>EDIT JOIN SAMPLING</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="update">
            <div class="form-group">
              <label>PO</label>
              <b-input-group class="mt-3">
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
                class="form-control"
                placeholder="Jumlah Volume"
                v-model="field.qty"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Satuan</label>

              <input
                class="form-control"
                placeholder="Jumlah Volume"
                v-model="field.unit_code"
                readonly
              />
            </div>

            <div class="form-group">
              <label>PT</label>

              <input
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
                placeholder="Choose a date"
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
export default {
  //layout
  layout: 'admin',

  //meta
  head() {
    return {
      title: 'Edit Join Sampling',
    }
  },

  data() {
    return {
      options: [
        { value: 'Y', text: 'Ya' },
        { value: 'N', text: 'Tidak' },
      ],

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
        tgl_kedatangan: '',
        joint_sampling: '',
        description: '',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: '',
        gr_date: '',
        gr_qty: '',
      },

      data_po: [],
      data_table: [],
      //state validation
      validation: [],
    }
  },

  mounted() {
    //get data field by ID
    this.$axios
      .get(`/api/admin/t_fertilizer_sample/${this.$route.params.id}`)
      .then((response) => {
        console.log('aida')
        console.log(response)
        //data yang diambil
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
        this.field.join_sampling = response.data.data.join_sampling
        this.field.description = response.data.data.description
        this.field.created_at = response.data.data.created_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by
      })
    // this.$refs.code.focus()
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-fertilizer-join_sampling',
        params: { id: this.$route.params.id, r: 1 },
      })
    },

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

      console.log('data')
      console.log(this.data_po.VENDOR)

      e.preventDefault()
    },

    // update method
    async update(e) {
      e.preventDefault()

      //send data ke Rest API untuk update
      await this.$axios
        .put(`/api/admin/t_fertilizer_sample/${this.$route.params.id}`, {
          //data yang dikirim
          // kode_sampel:
          //   this.$route.params.id +
          //   '-' +
          //   this.field.company_id +
          //   '-' +
          //   this.field.department_code_sap +
          //   '-' +
          //   this.field.fertilizer_type_id,

          po: this.field.po,
          company_id: this.field.company_id,
          department_id: this.field.department_id,
          fertilizer_type_id: this.field.fertilizer_type_id,
          vendors_id: this.field.vendors_id,
          unit_id: this.field.unit_id,
          qty: this.field.qty,
          tgl_kedatangan: this.field.tgl_kedatangan,
          joint_sampling: this.field.joint_sampling,
          //   kode_sampel: this.field.kode_sampel,
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
          this.$router.push({
            name: 'erp_ho-fertilizer-join_sampling',
          })
        })
        .catch((error) => {
          //assign error validasi
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
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
}
</style>
