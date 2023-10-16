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
              <i class="nav-icon fas fa-book-open"></i> <b>TAMBAH COMPANY</b>
            </h3>
            <div class="card-tools"></div>
          </div>
          <div class="card-body">
            <form @submit.prevent="storePost">
              <div class="form-group">
                <label>Nama PT</label>
                <multiselect
                  v-model="field.company_id"
                  :options="company"
                  label="code"
                  track-by="id"
                  :searchable="true"
                ></multiselect>
                <div v-if="validation.company_id" class="mt-2">
                  <b-alert show variant="danger">{{
                    validation.company_id[0]
                  }}</b-alert>
                </div>
              </div>
              <div class="form-group">
                <label>Aktif?</label>
                <b-form-select v-model="field.is_active" :options="options">
                </b-form-select>
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
  export default {
    //layout
    layout: 'admin',
  
    //meta
    head() {
      return {
        title: 'Tambah PT',
      }
    },
  
  
    data() {
      return {
        options: [
          { value: 'Y', text: 'Ya' },
          { value: 'N', text: 'Tidak' },
        ],
  
        state: 'disabled',
        value: undefined,
  
        field: {
          users_id: '',
          company_id: '',
          is_active: 'Y',
          description: '',
          created_at: '',
          updated_at: '',
          created_by: '',
          updated_by: '',
        },
  
        users_id: '',
        show: 1,
  
        company: [],
  
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

        
      this.$axios
        .get(`/api/admin/master/users/${this.$route.params.id}`)
  
        .then((response) => {
          this.users_id = response.data.data.id
  
          this.$nuxt.$loading.start()
        })
  
      //Data Users
      this.$axios
        .get('/api/admin/lov_company')
  
        .then((response) => {
          this.company = response.data.data
        })
    },
  
    methods: {
      currentDate() {
        const current = new Date()
        const date = `${current.getFullYear()}-${
          current.getMonth() + 1
        }-${current.getDate()}`
  
        return date
      },
  
      back() {
        this.$router.push({
          name: 'erp_ho-system-user_company-id',
          params: { id: this.$route.params.id, r: 1 },
        })
      },
  
      async storePost() {
        this.show = 0
  
        //define formData
        let formData = new FormData()
  
        formData.append(
          'company_id',
          this.field.company_id ? this.field.company_id.id : ''
        )
        formData.append('users_id', this.$route.params.id)
        formData.append('is_active', this.field.is_active)
        formData.append('description', this.field.description)
        formData.append('created_at', this.field.created_at)
        formData.append('created_by', this.field.created_by)
        formData.append('update_at', this.field.update_at)
        formData.append('udpate_by', this.field.udpate_by)
  
        await this.$axios
          .post('/api/admin/user_company', formData)
          .then(() => {
            this.show = 1
  
            //sweet alert
            this.$swal.fire({
              title: 'BERHASIL!',
              text: 'Data Berhasil Disimpan!',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            })
            this.back()
          })
          .catch((error) => {
            this.show = 1

  
            this.$swal.fire({
              title: 'ERROR!',
              text: error.response.data.message,
              icon: 'error',
              showConfirmButton: true,
            })
  
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
  .card-title .nav-link {
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
  