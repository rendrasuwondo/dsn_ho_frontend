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
            <i class="nav-icon fas fa-folder"></i> <b>EDIT GLOBAL PARAM</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="update">
            <div class="form-group">
              <label>Kode</label>
              <input
                type="text"
                v-model="field.code"
                placeholder=""
                class="form-control"
                ref="code"
              />
              <div v-if="validation.code" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.code[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Value 1</label>
              <input
                type="text"
                v-model="field.value_1"
                placeholder=""
                class="form-control"
              />
              <div v-if="validation.value_1" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.value_1[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Value 2</label>
              <input
                type="text"
                v-model="field.value_2"
                placeholder=""
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Keterangan</label>
              <textarea
                v-model="field.description"
                class="form-control"
                rows="3"
                placeholder=""
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
                <b-col>
                  <label>Tanggal Ubah </label>
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
      title: 'Edit Global Param',
    }
  },

  data() {
    return {
      state: 'disabled',
      field: {
        code: '',
        name: '',
        is_active: '',
        description: '',
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
      },

      //state validation
      validation: [],
      show: 1,
    }
  },

  mounted() {
    //get data field by ID
    this.$axios
      .get(`/api/admin/global_param/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil
        this.field.code = response.data.data.code
        this.field.value_1 = response.data.data.value_1
        this.field.value_2 = response.data.data.value_2
        this.field.description = response.data.data.description
        this.field.created_at = response.data.data.created_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by
      })
    this.$refs.code.focus()
  },

  methods: {
    back() {
      this.$router.push({
        name: 'erp_ho-system-global_param',
        params: { id: this.$route.params.id, r: 1 },
      })
    },

    // update method
    async update(e) {
      e.preventDefault()
      this.show = 0

      //send data ke Rest API untuk update
      await this.$axios
        .put(`/api/admin/global_param/${this.$route.params.id}`, {
          //data yang dikirim
          code: this.field.code,
          value_1: this.field.value_1,
          value_2: this.field.value_2,
          description: this.field.description,
          created_at: this.field.created_at,
          updated_at: this.field.updated_at,
          created_by: this.field.created_by,
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
          //redirect ke route "post"
          this.$router.push({
            name: 'erp_ho-system-global_param',
          })
        })
        .catch((error) => {
          this.show = 1

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
