<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-envelope"></i> <b>Email Grading</b>
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
                  @click="showModalAdd"
                >
                  <i class="fa fa-plus-circle"></i> Tambah
                </button>
              </div>
              <input
                type="text"
                class="form-control"
                v-model="search"
                @keypress.enter="searchData"
                placeholder="Cari Nama / NIK / Email..."
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
            empty-text="Tidak ada data"
          >
            <template #cell(index)="data">
              {{
                data.index +
                1 +
                (pagination.current_page - 1) * pagination.per_page
              }}
            </template>

            <template #cell(employee)="data">
              <div>
                <strong>{{
                  data.item.employee ? data.item.employee.name : '-'
                }}</strong
                ><br />
                <small class="text-muted">{{
                  data.item.employee ? data.item.employee.email : '-'
                }}</small>
              </div>
            </template>

            <template #cell(is_active)="data">
              <b-badge
                :variant="data.item.is_active == 'Y' ? 'success' : 'danger'"
              >
                {{ data.item.is_active == 'Y' ? 'Active' : 'Inactive' }}
              </b-badge>
            </template>

            <template #cell(actions)="data">
              <button
                class="btn btn-primary btn-sm mr-1"
                title="Edit Data"
                @click="showModalEdit(data.item)"
              >
                <i class="fa fa-pencil-alt"></i>
              </button>

              <button
                class="btn btn-sm mr-1"
                :class="
                  data.item.is_active == 'Y' ? 'btn-warning' : 'btn-success'
                "
                :title="data.item.is_active == 'Y' ? 'Nonaktifkan' : 'Aktifkan'"
                @click="updateStatus(data.item.id, data.item.is_active)"
              >
                <i
                  class="fa"
                  :class="
                    data.item.is_active == 'Y'
                      ? 'fa-times-circle'
                      : 'fa-check-circle'
                  "
                ></i>
              </button>

              <button
                class="btn btn-danger btn-sm"
                title="Hapus Data"
                @click="deleteData(data.item.id)"
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

    <b-modal
      id="modal-form"
      :title="editMode ? 'Edit Email Grading' : 'Tambah Email Grading'"
      @ok="submitForm"
      ok-title="Simpan"
      cancel-title="Batal"
    >
      <form ref="form" @submit.stop.prevent="submitForm">
        <b-form-group label="Employee" label-for="employee-input">
          <multiselect
            id="employee-input"
            v-model="selectedEmployeeObj"
            :options="employeeOptions"
            :loading="isLoadingEmployee"
            :internal-search="false"
            :clear-on-select="false"
            :close-on-select="true"
            :options-limit="20"
            placeholder="Ketik Nama atau NIK..."
            track-by="id"
            label="name"
            @search-change="asyncFind"
          >
            <template slot="option" slot-scope="props">
              <div class="option__desc">
                <span class="option__title"
                  ><strong>{{ props.option.name }}</strong></span
                >
                <span class="option__small text-muted">
                  ({{ props.option.nik }})</span
                >
                <br />
                <small v-if="props.option.email" class="text-info">{{
                  props.option.email
                }}</small>
              </div>
            </template>

            <template slot="noResult">Data tidak ditemukan</template>
          </multiselect>
          <input type="hidden" v-model="form.employee_id" required />
        </b-form-group>

        <b-form-group label="Location" label-for="location-input">
          <b-form-input
            id="location-input"
            v-model="form.location"
            disabled
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Description" label-for="desc-input">
          <b-form-textarea
            id="desc-input"
            v-model="form.description"
          ></b-form-textarea>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  head() {
    return { title: 'Email Grading' }
  },

  data() {
    return {
      search: '',
      posts: [],
      employeeOptions: [],
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
      },
      rowcount: 0,

      // State Edit Mode
      editMode: false,
      selectedId: null,

      // Form Data
      selectedEmployeeObj: null,
      employeeOptions: [],
      isLoadingEmployee: false,
      searchTimer: null,
      form: {
        employee_id: null,
        location: 'SITE',
        is_active: 'Y',
        description: '',
        department_id: null,
      },

      fields: [
        {
          key: 'index',
          label: 'No',
          thClass: 'text-center',
          tdClass: 'text-center',
          width: '50px',
        },
        { key: 'employee', label: 'Employee', sortable: false },
        { key: 'department.name', label: 'Department' },
        { key: 'location', label: 'Location', tdClass: 'text-center' },
        { key: 'description', label: 'Description' },
        { key: 'is_active', label: 'Status', tdClass: 'text-center' },
        {
          key: 'actions',
          label: 'Aksi',
          thClass: 'text-center',
          tdClass: 'text-center',
          width: '150px',
        },
      ],
    }
  },

  watchQuery: ['q', 'page'],

  watch: {
    // Watcher ini akan otomatis mengisi form.employee_id saat selectedEmployeeObj berubah
    selectedEmployeeObj(newVal) {
      if (newVal) {
        this.form.employee_id = newVal.id
        // Pastikan department_id diambil, jika tidak ada di objek employee, set null
        this.form.department_id = newVal.department_id || null
      } else {
        this.form.employee_id = null
        this.form.department_id = null
      }
    },
  },

  async asyncData({ $axios, query }) {
    let page = query.page ? parseInt(query.page) : 1
    let search = query.q ? query.q : ''

    try {
      const response = await $axios.$get(
        `/api/admin/email-grading?q=${search}&page=${page}&per_page=10`
      )
      return {
        posts: response.data.data,
        pagination: response.data,
        search: search,
        rowcount: response.data.total,
      }
    } catch (e) {
      console.error(e)
      return { posts: [], rowcount: 0 }
    }
  },

  mounted() {
    this.fetchEmployees()
  },

  methods: {
    async fetchEmployees() {
      try {
        const response = await this.$axios.$get(
          '/api/admin/email-grading-employee-options'
        )
        this.employeeOptions = response.data.map((emp) => ({
          ...emp,
          name_info: `${emp.name} - ${emp.nik}`,
        }))
      } catch (error) {
        console.error('Gagal load employee', error)
      }
    },

    changePage(page) {
      this.$router.push({
        path: this.$route.path,
        query: { q: this.search, page: page },
      })
    },

    searchData() {
      this.$router.push({
        path: this.$route.path,
        query: { q: this.search, page: 1 },
      })
    },

    // 1. MODIFIED: showModalAdd untuk Reset State
    showModalAdd() {
      this.editMode = false // Set mode Tambah
      this.selectedId = null
      this.selectedEmployeeObj = null // Reset Multiselect
      this.form = {
        employee_id: null,
        location: 'SITE',
        is_active: 'Y',
        description: '',
        department_id: null,
      }
      this.$bvModal.show('modal-form')
    },

    // 2. NEW: Method untuk Menampilkan Modal Edit
    showModalEdit(item) {
      this.editMode = true // Set mode Edit
      this.selectedId = item.id

      // Isi form dengan data yang ada
      this.form = {
        employee_id: item.employee_id,
        location: item.location,
        is_active: item.is_active,
        description: item.description,
        department_id: item.department_id,
      }

      // PENTING: Set object employee untuk Multiselect
      // Kita ambil data employee dari item row tabel
      if (item.employee) {
        this.selectedEmployeeObj = {
          id: item.employee.id,
          name: item.employee.name,
          nik: item.employee.nik,
          email: item.employee.email,
          department_id: item.department_id, // Pastikan ini ada agar tidak hilang
        }
      }

      this.$bvModal.show('modal-form')
    },

    // 3. MODIFIED: Submit Form menangani Add (POST) dan Edit (PUT)
    async submitForm(bvModalEvent) {
      bvModalEvent.preventDefault()

      if (!this.form.employee_id) {
        this.$swal.fire('Error', 'Pilih Employee terlebih dahulu', 'error')
        return
      }

      let payload = { ...this.form }

      // Fallback department ID jika belum terisi
      if (!payload.department_id && this.selectedEmployeeObj) {
        payload.department_id = this.selectedEmployeeObj.department_id || 1
      }

      try {
        if (this.editMode) {
          // LOGIKA EDIT (PUT)
          await this.$axios.put(
            `/api/admin/email-grading/${this.selectedId}`,
            payload
          )
          this.$swal.fire('Berhasil', 'Data berhasil diperbarui', 'success')
        } else {
          // LOGIKA TAMBAH (POST)
          await this.$axios.post('/api/admin/email-grading', payload)
          this.$swal.fire('Berhasil', 'Data berhasil disimpan', 'success')
        }

        this.$bvModal.hide('modal-form')
        this.$nuxt.refresh()
      } catch (error) {
        let msg =
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Gagal memproses data'
        this.$swal.fire('Gagal', msg, 'error')
      }
    },

    updateStatus(id, currentStatus) {
      const newStatus = currentStatus === 'Y' ? 'N' : 'Y'
      const actionName = newStatus === 'Y' ? 'MENGAKTIFKAN' : 'MENONAKTIFKAN'

      this.$swal
        .fire({
          title: 'KONFIRMASI',
          text: `ANDA YAKIN INGIN ${actionName} DATA INI?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: newStatus === 'Y' ? '#28a745' : '#ffc107',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'YA, PROSES!',
          cancelButtonText: 'BATAL',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$axios
              .put(`/api/admin/email-grading/${id}`, {
                is_active: newStatus,
              })
              .then((response) => {
                this.$nuxt.refresh()
                this.$swal.fire(
                  'BERHASIL',
                  'Status berhasil diperbarui',
                  'success'
                )
              })
              .catch((error) => {
                this.$swal.fire('GAGAL!', 'Gagal memperbarui status', 'error')
              })
          }
        })
    },

    deleteData(id) {
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
              .delete(`/api/admin/email-grading/${id}`)
              .then((response) => {
                this.$nuxt.refresh()
                this.$swal.fire('BERHASIL!', 'Data Berhasil Dihapus', 'success')
              })
              .catch((error) => {
                this.$swal.fire('GAGAL!', 'Terjadi kesalahan', 'error')
              })
          }
        })
    },

    asyncFind(query) {
      this.isLoadingEmployee = true
      if (this.searchTimer) clearTimeout(this.searchTimer)

      this.searchTimer = setTimeout(() => {
        this.$axios
          .$get('/api/admin/email-grading-employee-options', {
            params: { q: query },
          })
          .then((response) => {
            this.employeeOptions = response.data
            this.isLoadingEmployee = false
          })
          .catch((error) => {
            console.error(error)
            this.isLoadingEmployee = false
          })
      }, 500)
    },
  },
}
</script>

<style scoped>
.card-info.card-outline {
  border-top: 5px solid #504d8d;
}
.card-title {
  color: #504d8d;
}
.multiselect__tags {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  min-height: 38px;
}
.multiselect__placeholder {
  margin-bottom: 0;
  padding-top: 2px;
}
</style>
