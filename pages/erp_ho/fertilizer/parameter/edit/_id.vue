<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>
    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-list-alt"></i>
            <b>EDIT PARAMETER</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="update">
            <div class="form-group">
              <label>Nama Parameter</label>
              <multiselect
                v-model="field.parameter_id"
                :options="parameter"
                label="name"
                track-by="id"
                :searchable="true"
              ></multiselect>
              <div v-if="validation.parameter_id" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.parameter_id[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>SNI</label>
              <!-- <money
                v-model="field.sni"
                precision="1"
                class="form-control"
              ></money> -->
              <input
                v-model.number="field.sni"
                class="form-control"
                v-on:keypress="NumbersOnly"
                placeholder="Masukkan Nilai Standar"
              />
              <!-- <number
                class="form-control"
                placeholder="Masukkan Nilai Standar"
                v-model="field.sni"
                prefix=""
              ></number> -->
            </div>

            <div class="form-group">
              <label>Aktif?</label>
              <b-form-select v-model="field.is_active" :options="options">
              </b-form-select>
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
      title: 'Edit Parameter',
    }
  },

  data() {
    return {
      options: [
        { value: 'Y', text: 'Ya' },
        { value: 'N', text: 'Tidak' },
      ],
      state: 'disabled',

      props: {
        value: {
          type: Number,
        },
      },

      field: {
        parameter_id: '',
        fertilizer_type_id: '',
        sni: '',
        is_active: 'Y',
        description: '',
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
      },

      fertilizer_type_id: '',

      parameter: [],

      //state validation
      validation: [],
    }
  },

  mounted() {
    //get data field by ID
    this.$axios
      .get(`/api/admin/fertilizer_type_parameter/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil
        this.field.parameter_id = response.data.data.parameter
        this.field.fertilizer_type_id = response.data.data.fertilizer_type_id
        this.field.sni = response.data.data.sni
        console.log('da')
        console.log(this.field.sni)
        console.log(response.data.data.sni)
        this.field.is_active = response.data.data.is_active
        this.field.description = response.data.data.description
        this.field.created_at = response.data.data.created_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by
        // this.$refs.code.focus()
      })

    //Data Users
    this.$axios
      .get('/api/admin/lov_parameter')

      .then((response) => {
        this.parameter = response.data.data
      })
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-fertilizer-parameter-id',
        params: { id: this.field.fertilizer_type_id, r: 1 },
      })
    },

    // update method
    async update(e) {
      e.preventDefault()

      //send data ke Rest API untuk update
      await this.$axios
        .put(`api/admin/fertilizer_type_parameter/${this.$route.params.id}`, {
          //data yang dikirim
          fertilizer_type_id: this.field.fertilizer_type_id,
          parameter_id: this.field.parameter_id
            ? this.field.parameter_id.id
            : '',
          sni: this.field.sni,
          is_active: this.field.is_active,
          description: this.field.description,
          created_at: this.field.created_at,
          created_by: this.field.description,
          updated_at: this.field.updated_at,
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

    NumbersOnly(evt) {
      evt = evt ? evt : window.event
      var charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault()
      } else {
        return true
      }
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
