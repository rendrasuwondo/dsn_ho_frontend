<template>
  <div class="content-wrapper">
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
            <i class="nav-icon fas fa-network-wired"></i>
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
              <input
                v-model.number="field.sni"
                class="form-control"
                v-on:keypress="NumbersOnly"
                placeholder="Masukkan Nilai Standar"
              />
            </div>

            <div class="form-group">
              <label>Minimal Nilai</label>
              <input
                v-model.number="field.min_value"
                class="form-control"
                v-on:keypress="NumbersOnly"
                placeholder="Masukkan Nilai Minimal"
              />
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
        min_value: '',
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
      show: 1,
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
        this.field.min_value = response.data.data.min_value
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
        query: { fertilizer_type_id: this.field.fertilizer_type_id },
      })
    },

    // update method
    async update(e) {
      e.preventDefault()
      this.show = 0

      //send data ke Rest API untuk update
      await this.$axios
        .put(`api/admin/fertilizer_type_parameter/${this.$route.params.id}`, {
          //data yang dikirim
          fertilizer_type_id: this.field.fertilizer_type_id,
          parameter_id: this.field.parameter_id
            ? this.field.parameter_id.id
            : '',
          sni: this.field.sni,
          min_value: this.field.min_value,
          is_active: this.field.is_active,
          description: this.field.description,
          created_at: this.field.created_at,
          created_by: this.field.description,
          updated_at: this.field.updated_at,
          updated_by: this.field.updated_by,
        })
        .then(() => {
          this.show = 1

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
          this.show = 1

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
