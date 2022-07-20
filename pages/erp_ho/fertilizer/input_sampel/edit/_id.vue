<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-file-signature"></i>
            <b>EDIT INPUT SAMPEL</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="update">
            <div class="form-group">
              <label>PO</label>

              <input
                type="text"
                v-model="field.po"
                placeholder="Masukkan Kode PO"
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Tanggal Terima</label>
              <b-form-datepicker
                placeholder="Choose a date"
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
              <label>Lab Analisa</label>
              <multiselect
                v-model="field.laboratory_id"
                :options="laboratory"
                label="code"
                track-by="id"
                :searchable="true"
              ></multiselect>

              <div v-if="validation.laboratory_id" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.laboratory_id[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Kirim Ke Lab</label>
              <b-form-datepicker
                placeholder="Choose a date"
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
                placeholder="Choose a date"
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
      title: 'Edit Input Sampel',
    }
  },

  data() {
    return {
      state: 'disabled',
      field: {
        po: '',
        vendors_id: '',
        fertilizer_type_id: '',
        company_id: '',
        department_id: '',
        unit_id: '',
        qty: '',
        tgl_kedatangan: '',
        joint_sampling: '',
        laboratory_id: '',
        tgl_terima: '',
        kirim_lab: '',
        terima_lab: '',
        description: '',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: '',
      },

      laboratory: [],

      //state validation
      validation: [],
    }
  },

  mounted() {
    //get data field by ID
    this.$axios
      .get(`/api/admin/input_sampel/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil
        this.field.po = response.data.data.po
        this.field.vendors_id = response.data.data.vendors_id
        this.field.fertilizer_type_id = response.data.data.fertilizer_type_id
        this.field.company_id = response.data.data.company_id
        this.field.department_id = response.data.data.department_id
        this.field.unit_id = response.data.data.unit_id
        this.field.qty = response.data.data.qty
        this.field.tgl_kedatangan = response.data.data.tgl_kedatangan
        this.field.joint_sampling = response.data.data.joint_sampling
        this.field.laboratory_id = response.data.data.laboratory
        this.field.tgl_terima = response.data.data.tgl_terima
        this.field.kirim_lab = response.data.data.kirim_lab
        this.field.terima_lab = response.data.data.terima_lab
        this.field.description = response.data.data.description
        this.field.created_at = response.data.data.created_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by
      })
    // this.$refs.code.focus()

    this.$axios
      .get('/api/admin/lov_laboratory')

      .then((response) => {
        this.laboratory = response.data.data
      })
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-fertilizer-input_sampel',
        params: { id: this.$route.params.id, r: 1 },
      })
    },

    // update method
    async update(e) {
      e.preventDefault()

      //send data ke Rest API untuk update
      await this.$axios
        .put(`/api/admin/input_sampel/${this.$route.params.id}`, {
          po: this.field.po,
          company_id: this.field.company_id,
          department_id: this.field.department_id,
          fertilizer_type_id: this.field.fertilizer_type_id,
          vendors_id: this.field.vendors_id,
          unit_id: this.field.unit_id,
          qty: this.field.qty,
          tgl_kedatangan: this.field.tgl_kedatangan,
          joint_sampling: this.field.joint_sampling,
          laboratory_id: this.field.laboratory_id
            ? this.field.laboratory_id.id
            : '',
          tgl_terima: this.field.tgl_terima,
          kirim_lab: this.field.kirim_lab,
          terima_lab: this.field.terima_lab,
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
            name: 'erp_ho-fertilizer-input_sampel',
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
