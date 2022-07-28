<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>
    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-th"></i> <b>EDIT HASIL ANALISA</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="update">
            <div class="form-group">
              <label>Nama Parameter</label>
              <input
                type="text"
                v-model="field.parameter_code"
                placeholder=""
                class="form-control"
                readonly
              />
              <!-- <multiselect
                v-model="field.fertilizer_type_parameter_id"
                :options="parameter"
                label="parameter_code"
                track-by="id"
                :searchable="true"
              ></multiselect> -->
            </div>

            <div class="form-group">
              <label>Hasil Analisa</label>
              <money
                v-model="field.value"
                v-bind="money"
                precision="1"
                class="form-control"
              ></money>
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
      title: 'Edit Menu',
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
        fertilizer_type_parameter_id: '',
        t_fertilizer_sampel_id: '',
        parameter_code: '',
        value: '',
        description: '',
        is_active: '',
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
      },

      fertilizer_type_parameter_id: this.$route.query.input_sampel_id,
      fertilizer_type_id: this.$route.query.fertilizer_type_id,

      parameter: [],

      //state validation
      validation: [],
    }
  },

  mounted() {
    //get data field by ID
    this.$axios
      .get(`/api/admin/input_hasil/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil
        this.field.parameter_code = response.data.data.parameter_code
        this.field.fertilizer_type_parameter_id =
          response.data.data.fertilizer_type_parameter_id
        this.field.t_fertilizer_sampel_id =
          response.data.data.t_fertilizer_sampel_id
        this.field.value = response.data.data.value
        this.field.description = response.data.data.description
        this.field.created_at = response.data.data.created_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by
      })

    console.log('cek data')
    console.log(this.field.fertilizer_type_id)
    // this.$refs.code.focus()
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-fertilizer-input_hasil_analisa-id',
        params: { id: this.$route.query.input_sampel_id, r: 1 },
        query: {
          input_sampel_id: this.$route.query.input_sampel_id,
          fertilizer_type_id: this.$route.query.fertilizer_type_id,
        },
      })
    },

    // update method
    async update(e) {
      e.preventDefault()
      console.log('da')
      console.log(this.field.fertilizer_type_parameter_id.id)
      //send data ke Rest API untuk update
      await this.$axios
        .put(`/api/admin/input_hasil/${this.$route.params.id}`, {
          //data yang dikirim

          fertilizer_type_parameter_id: this.field.fertilizer_type_parameter_id,
          t_fertilizer_sampel_id: this.field.t_fertilizer_sampel_id,
          value: this.field.value,
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
          this.back()
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
