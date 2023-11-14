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
            <i class="nav-icon fas fa-th"></i> <b>EDIT SUB MENU</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <form @submit.prevent="updateData">
            <div class="form-group">
              <label>Kode</label>
              <input
                type="text"
                v-model="field.code"
                placeholder="Masukkan Kode Menu"
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
              <label>Nama</label>
              <input
                type="text"
                v-model="field.title"
                placeholder="Masukkan Nama Menu"
                class="form-control"
              />
              <div v-if="validation.title" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.title[0]
                }}</b-alert>
              </div>
            </div>

            <div class="form-group">
              <label>Icon</label>
              <input
                v-model="field.class"
                class="form-control"
                rows="3"
                placeholder="Masukkan Kode Icon"
              />
            </div>

            <div class="form-group">
              <label>Link Menu</label>
              <input
                v-model="field.path_file_name"
                class="form-control"
                rows="3"
                placeholder="Masukkan Link Menu"
              />
              <div v-if="validation.path_file_name" class="mt-2">
                <b-alert show variant="danger">{{
                  validation.path_file_name[0]
                }}</b-alert>
              </div>
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
      title: 'Edit Sub Menu',
    }
  },

  components: {
    'ckeditor-nuxt': () => {
      if (process.client) {
        return import('@blowstack/ckeditor-nuxt')
      }
    },
  },

  data() {
    return {
      options: [
        { value: 'Y', text: 'Ya' },
        { value: 'N', text: 'Tidak' },
      ],

      user_id: { id: '', name: '' },

      state: 'disabled',
      value: undefined,

      field: {
        code: '',
        title: '',
        class: '',
        link: '',
        is_parent: '',
        parent_id: '',
        path_file_name: '',
        description: '',
        is_active: '',
        created_at: '',
        created_by: '',
        updated_at: '',
        updated_by: '',
      },

      parent_id: '',

      users: [],

      //state validation
      validation: [],
      show: 1,

      //config CKEDITOR
      editorConfig: {
        removePlugins: ['Title'],
        simpleUpload: {
          uploadUrl: 'http://localhost:8000/api/web/posts/storeImage',
        },
      },
    }
  },

  mounted() {
    this.$axios
      .get(`/api/admin/master/menu/${this.$route.params.id}`)

      .then((response) => {
        //  console.log(response.data.data.afdeling_id)
        this.parent_id = response.data.data.id

      })

    this.$axios
      .get(`/api/admin/sub_menu/${this.$route.params.id}`)
      .then((response) => {
        //data yang diambil
        this.field.code = response.data.data.code
        this.field.title = response.data.data.title
        this.field.class = response.data.data.class
        this.field.link = response.data.data.link
        this.field.is_parent = response.data.data.is_parent
        this.field.parent_id = response.data.data.parent_id
        this.field.path_file_name = response.data.data.path_file_name
        this.field.is_active = response.data.data.is_active
        this.field.description = response.data.data.description
        this.field.created_at = response.data.data.created_at
        this.field.created_by = response.data.data.created_by
        this.field.updated_at = response.data.data.updated_at
        this.field.updated_by = response.data.data.updated_by

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
        name: 'erp_ho-system-sub_menu-id',
        params: { id: this.field.parent_id, r: 1 },
        query: { menu_id: this.field.parent_id },
      })
    },

    // update method
    async updateData(e) {
      e.preventDefault()
      this.show = 0

      //send data ke Rest API untuk update
      await this.$axios
        .put(`api/admin/sub_menu/${this.$route.params.id}`, {
          //data yang dikirim
          code: this.field.code,
          title: this.field.title,
          class: this.field.class,
          link: this.field.link,
          is_parent: this.field.is_parent,
          parent_id: this.field.parent_id,
          path_file_name: this.field.path_file_name,
          is_active: this.field.is_active,
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
          //redirect ke route "menu"
          this.back()
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
