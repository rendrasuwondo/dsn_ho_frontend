<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-percentage"></i>
            <b>Potongan TBS External</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <button
                  class="btn btn-info btn-sm"
                  style="padding-top: 8px"
                  title="Tambah"
                  @click="showModal(false)"
                >
                  <i class="fa fa-plus-circle"></i> Tambah
                </button>
              </div>
              <input
                type="text"
                class="form-control"
                v-model="search"
                @keypress.enter="searchData"
                placeholder="Cari Ring..."
              />
              <div class="input-group-append">
                <button @click="searchData" class="btn btn-info">
                  <i class="fa fa-search"></i> CARI
                </button>
              </div>
            </div>
          </div>

          <b-table
            small
            responsive
            striped
            bordered
            hover
            :items="posts"
            :fields="fields"
            show-empty
            :busy="loading"
          >
            <template #cell(index)="data">
              {{
                data.index +
                1 +
                (pagination.current_page - 1) * pagination.per_page
              }}
            </template>

            <template #cell(actions)="data">
              <button
                class="btn btn-primary btn-sm mr-1"
                title="Edit Data"
                @click="showModal(true, data.item)"
              >
                <i class="fa fa-pencil-alt"></i>
              </button>
              <button
                class="btn btn-danger btn-sm"
                title="Hapus Data"
                @click="deletePost(data.item.id)"
              >
                <i class="fa fa-trash"></i>
              </button>
            </template>
          </b-table>

          <b-row>
            <b-col>
              <b-pagination
                v-model="pagination.current_page"
                :total-rows="pagination.total"
                :per-page="pagination.per_page"
                @change="changePage"
                align="left"
                class="mt-1"
              ></b-pagination>
            </b-col>
            <b-col class="text-right" align-self="center">
              {{ rowcount }} data
            </b-col>
          </b-row>
        </div>
      </div>
    </section>

    <!-- Modal Form -->
    <b-modal
      id="modal-form"
      :title="
        editMode ? 'Edit Potongan TBS External' : 'Tambah Potongan TBS External'
      "
      @ok="submitForm"
      ok-title="Simpan"
      cancel-title="Batal"
      size="lg"
    >
      <form @submit.stop.prevent="submitForm">
        <b-row>
          <b-col md="6">
            <b-form-group label="PKS" label-for="department-input">
              <multiselect
                id="department-input"
                v-model="form.department_id"
                :options="departmentOptions"
                label="code"
                track-by="department_id"
                :searchable="true"
                placeholder="Pilih PKS"
                required
              ></multiselect>
            </b-form-group>

            <b-form-group label="Ring" label-for="ring-input">
              <b-form-input
                id="ring-input"
                v-model="form.ring"
                required
                placeholder="Contoh: Ring 1"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Tanggal Aktif" label-for="active_at-input">
              <b-form-datepicker
                id="active_at-input"
                v-model="form.active_at"
                required
                :date-format-options="{
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  weekday: 'short',
                }"
              ></b-form-datepicker>
            </b-form-group>

            <b-form-group label="Deskripsi" label-for="description-input">
              <b-form-textarea
                id="description-input"
                v-model="form.description"
                rows="2"
              ></b-form-textarea>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="BM (%)" label-for="bm-input">
              <b-form-input
                id="bm-input"
                type="number"
                step="0.01"
                v-model="form.bm"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group label="BLM (%)" label-for="blm-input">
              <b-form-input
                id="blm-input"
                type="number"
                step="0.01"
                v-model="form.blm"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group label="TK (%)" label-for="tk-input">
              <b-form-input
                id="tk-input"
                type="number"
                step="0.01"
                v-model="form.tk"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group label="TP (%)" label-for="tp-input">
              <b-form-input
                id="tp-input"
                type="number"
                step="0.01"
                v-model="form.tp"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  head() {
    return { title: 'Potongan TBS External' }
  },
  data() {
    return {
      search: '',
      posts: [],
      loading: false,
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
      },
      rowcount: 0,

      // Modal State
      editMode: false,
      selectedId: null,
      departmentOptions: [],
      isMatchedPks: false,

      form: {
        department_id: null,
        ring: '',
        bm: '',
        blm: '',
        tk: '',
        tp: '',
        active_at: '',
        description: '',
      },

      fields: [
        {
          key: 'index',
          label: 'No',
          thClass: 'text-center',
          tdClass: 'text-center',
          width: '50px',
        },
        { key: 'department_code', label: 'PKS' },
        {
          key: 'ring',
          label: 'Ring',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'bm',
          label: 'BM',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'blm',
          label: 'BLM',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'tk',
          label: 'TK',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'tp',
          label: 'TP',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'active_at',
          label: 'Tanggal Aktif',
          formatter: 'formatDate',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'actions',
          label: 'Aksi',
          thClass: 'text-center',
          tdClass: 'text-center',
          width: '100px',
        },
      ],
    }
  },
  watch: {
    '$route.query': {
      handler: 'fetchPosts',
      immediate: false,
    },
  },
  mounted() {
    console.log('department_code:', this.$auth.user.employee.department_code)
    this.fetchDepartments()
  },
  methods: {
    formatDate(value) {
      if (!value) return '-'
      const date = new Date(value)
      if (isNaN(date.getTime())) return value

      const day = String(date.getDate()).padStart(2, '0')
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      const month = monthNames[date.getMonth()]
      const year = date.getFullYear()

      return `${day} ${month} ${year}`
    },
    async fetchPosts() {
      this.loading = true
      let page = this.$route.query.page ? parseInt(this.$route.query.page) : 1
      let search = this.$route.query.q ? this.$route.query.q : ''
      this.search = search

      let url = `/api/admin/potongan_tbs_external?q=${search}&page=${page}`
      if (this.isMatchedPks) {
        url += `&department_code=${this.$auth.user.employee.department_code}`
      }

      try {
        const posts = await this.$axios.$get(url)
        this.posts = posts.data.data
        this.pagination = posts.data
        this.rowcount = posts.data.total
      } catch (error) {
        this.posts = []
        this.pagination = { current_page: 1, per_page: 10, total: 0 }
        this.rowcount = 0
      } finally {
        this.loading = false
      }
    },
    async fetchDepartments() {
      try {
        const response = await this.$axios.$get(
          `/api/admin/spot-cek-get_pks_dropdown-report`
        )
        const allPks = response.data
        const userDeptCode = this.$auth.user.employee?.department_code

        const matchedPks = allPks.find((pks) => pks.code === userDeptCode)
        if (matchedPks) {
          this.departmentOptions = [matchedPks]
          this.isMatchedPks = true
        } else {
          this.departmentOptions = allPks
          this.isMatchedPks = false
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.fetchPosts()
      }
    },
    changePage(page) {
      this.$router.push({
        path: this.$route.path,
        query: { q: this.$route.query.q, page: page },
      })
    },
    searchData() {
      this.$router.push({
        path: this.$route.path,
        query: { q: this.search },
      })
    },
    showModal(isEdit, item = null) {
      this.editMode = isEdit
      if (isEdit) {
        this.selectedId = item.id
        this.form = {
          department_id: item.department_id
            ? {
                department_id: item.department_id,
                name: item.department_name,
                code: item.department_code,
              }
            : null,
          ring: item.ring,
          bm: item.bm,
          blm: item.blm,
          tk: item.tk,
          tp: item.tp,
          active_at: item.active_at ? item.active_at.substring(0, 10) : '',
          description: item.description,
        }
      } else {
        this.selectedId = null
        this.form = {
          department_id: null,
          ring: '',
          bm: '',
          blm: '',
          tk: '',
          tp: '',
          active_at: '',
          description: '',
        }
      }
      this.$bvModal.show('modal-form')
    },
    async submitForm(e) {
      e.preventDefault()
      try {
        const payload = {
          department_id: this.form.department_id
            ? this.form.department_id.department_id
            : null,
          ring: this.form.ring,
          bm: this.form.bm,
          blm: this.form.blm,
          tk: this.form.tk,
          tp: this.form.tp,
          active_at: this.form.active_at,
          description: this.form.description,
        }

        if (this.editMode) {
          await this.$axios.put(
            `/api/admin/potongan_tbs_external/${this.selectedId}`,
            payload
          )
          this.$swal.fire('BERHASIL!', 'Data berhasil diupdate.', 'success')
        } else {
          await this.$axios.post('/api/admin/potongan_tbs_external', payload)
          this.$swal.fire('BERHASIL!', 'Data berhasil ditambah.', 'success')
        }
        this.$bvModal.hide('modal-form')
        this.fetchPosts()
      } catch (err) {
        this.$swal.fire(
          'GAGAL!',
          err.response?.data?.message || 'Terjadi kesalahan',
          'error'
        )
      }
    },
    deletePost(id) {
      this.$swal
        .fire({
          title: 'APAKAH ANDA YAKIN?',
          text: 'INGIN MENGHAPUS DATA INI!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'YA, HAPUS!',
          cancelButtonText: 'TIDAK',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$axios
              .delete(`/api/admin/potongan_tbs_external/${id}`)
              .then((response) => {
                this.fetchPosts()
                if (
                  response.data &&
                  response.data.success !== undefined &&
                  !response.data.success
                ) {
                  this.$swal.fire('GAGAL!', 'Gagal menghapus data.', 'error')
                } else {
                  this.$swal.fire(
                    'BERHASIL!',
                    'Data berhasil dihapus.',
                    'success'
                  )
                }
              })
              .catch((err) => {
                this.$swal.fire('GAGAL!', 'Gagal menghapus data.', 'error')
              })
          }
        })
    },
    exportData() {
      this.$axios({
        url: `/api/admin/potongan_tbs_external/export`,
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'Potongan_TBS_External.xlsx')
        document.body.appendChild(link)
        link.click()
      })
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
