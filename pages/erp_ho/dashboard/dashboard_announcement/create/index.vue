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
              <i class="nav-icon fas fa-megaphone"></i> TAMBAH DATA
            </h3>
            <div class="card-tools"></div>
          </div>
          <div class="card-body">
            <form @submit.prevent="storePost">
              <div class="form-group">
                <label>Urutan</label>
                <input
                  type="text"
                  v-model="field.sort"
                  placeholder="Masukkan Urutan "
                  class="form-control"
                  ref="sort"
                />
              </div>
  
              <div class="form-group">
                <label>Aktif?</label>
                <b-form-select v-model="field.is_active" :options="options">
                </b-form-select>
              </div>
 
              <div class="form-group">
                <label>Pengumuman</label>
  
                <textarea
                  v-model="field.pengumuman"
                  class="form-control"
                  rows="3"
                  placeholder="Masukkan Deskripsi Singkat"
                ></textarea>
                <div v-if="validation.pengumuman" class="mt-2">
                  <b-alert show variant="danger">{{
                    validation.pengumuman[0]
                  }}</b-alert>
                </div>
              </div>

              <div class="form-group">
                <label>Baru?</label>
                <b-form-select v-model="field.is_new" :options="options">
                </b-form-select>
                <div v-if="validation.is_new" class="mt-2">
                  <b-alert show variant="danger">{{
                    validation.is_new[0]
                  }}</b-alert>
                </div>
              </div>

              <div class="form-group">
              <label>Berlaku Dari</label>
              <b-form-datepicker
                v-model="field.date_start"
                :date-format-options="{
                    year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      weekday: 'short',
                    }">
                  </b-form-datepicker>
                  <div v-if="validation.date_start" class="mt-2">
                  <b-alert show variant="danger">{{
                    validation.date_start[0]
                  }}</b-alert>
                </div>
            </div>

              <div class="form-group">
              <label>Sampai</label>
              <b-form-datepicker
                v-model="field.date_end"
                :date-format-options="{
                    year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      weekday: 'short',
                    }">
                  </b-form-datepicker>
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
        title: 'Tambah Data',
      }
    },
  
    data() {
      return {
        date_end: " ",
        is_active: { value: 'Y', text: 'Ya' },
        options: [
          { value: 'Y', text: 'Ya' },
          { value: 'N', text: 'Tidak' },
        ],
        state: 'disabled',
  
        field: {
          pengumuman: '',
          sort: '',
          is_new: '',
          is_active: 'Y',
          created_at: '',
          updated_at: '',
          created_by: '',
          updated_by: '',
          date_start: '',
          date_end: '',
        },
  
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
  
      this.$refs.sort.focus()
    },
  
    methods: {
      back() {
        this.$router.push({
          name: 'erp_ho-dashboard-dashboard_announcement',
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
  
        //define formData
        let formData = new FormData()
  
        formData.append('sort', this.field.sort)
        formData.append('is_new', this.field.is_new)
        formData.append('is_active', this.field.is_active)
        formData.append('pengumuman', this.field.pengumuman)
        formData.append('date_start', this.field.date_start)
        formData.append('date_end', this.field.date_end)
        formData.append('created_at', this.field.created_at)
        formData.append('created_by', this.field.created_by)
        formData.append('updated_at', this.field.updated_at)
        formData.append('updated_by', this.field.updated_by)
  
        //sending data to server
        await this.$axios
          .post('/api/admin/dashboard_announcement', formData)
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
  
            //redirect, if success store data
            this.$router.push({
              name: 'erp_ho-dashboard-dashboard_announcement',
            })
          })
          .catch((error) => {
            this.show = 1
  
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
  