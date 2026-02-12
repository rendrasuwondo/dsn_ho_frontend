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
                <strong>{{ data.item.employee ? data.item.name : '-' }}</strong
                ><br />
                <small class="text-muted">{{
                  data.item.employee ? data.item.email : '-'
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
        <b-form-group label="PKS" label-for="department-input">
          <multiselect
            id="department-input"
            v-model="selectedDepartmentObj"
            :options="departmentOptions"
            :loading="isLoadingDepartment"
            :searchable="true"
            :clear-on-select="false"
            :close-on-select="true"
            placeholder="Pilih Department..."
            track-by="id"
            label="code"
            @input="onDepartmentChange"
            @search-change="asyncFindDepartment"
          >
            <template slot="noResult">Data tidak ditemukan</template>
          </multiselect>
        </b-form-group>
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
                  ><strong>{{
                    `${props.option.name} (${props.option.nik})`
                  }}</strong></span
                >
                <br />
                <span>
                  <strong>{{ props.option.department_code }}</strong>
                </span>
                <br />
                <small
                  v-if="props.option.email"
                  class="text-info"
                  style="font-size: 12px; color: white"
                  >{{ props.option.email }}</small
                >
              </div>
            </template>

            <template slot="noResult">Data tidak ditemukan</template>
          </multiselect>
          <input type="hidden" v-model="form.employee_id" required />
        </b-form-group>

        <!-- <b-form-group label="Location" label-for="location-input">
          <b-form-select
            id="location-input"
            v-model="form.location"
            :options="['HO', 'SITE']"
            required
          >
            <template #first>
              <b-form-select-option :value="null" disabled
                >-- Pilih Lokasi --</b-form-select-option
              >
            </template>
          </b-form-select>
        </b-form-group> -->

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

      // Department Data
      selectedDepartmentObj: null,
      departmentOptions: [],
      isLoadingDepartment: false,

      searchTimer: null,
      searchTimerDepartment: null,

      form: {
        employee_id: null,
        location: 'admin',
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
        { key: 'name', label: 'Employee', sortable: false },
        { key: 'department_code', label: 'PKS' },
        { key: 'department_code_employee', label: 'Department' },
        // { key: 'location', label: 'Location', tdClass: 'text-center' },
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
    // Update form.department_id saat selectedDepartmentObj berubah
    selectedDepartmentObj(newVal) {
      if (newVal) {
        this.form.department_id = newVal.id
      } else {
        this.form.department_id = null
      }
    },
    // Watcher ini akan otomatis mengisi form.employee_id saat selectedEmployeeObj berubah
    selectedEmployeeObj(newVal) {
      if (newVal) {
        this.form.employee_id = newVal.id
      } else {
        this.form.employee_id = null
      }
    },
  },

  mounted() {
    this.fetchData()
    this.fetchEmployees()
    this.fetchDepartments()
  },

  methods: {
    async fetchData() {
      this.isTableLoading = true

      // Ambil parameter dari URL browser ($route.query)
      let page = this.$route.query.page ? parseInt(this.$route.query.page) : 1
      let search = this.$route.query.q ? this.$route.query.q : ''

      // Sync local variable (opsional, biar input search tetap terisi saat refresh)
      this.search = search

      try {
        const response = await this.$axios.$get(
          `/api/admin/email-grading?q=${search}&page=${page}&per_page=10&is_admin=1`
        )

        console.log('DEBUG API RESPONSE:', response) // Cek Console Browser

        this.posts = response.data.data
        this.pagination = response.data
        this.rowcount = response.data.total
      } catch (e) {
        console.error('DEBUG API ERROR:', e) // Cek Console Browser (Merah)
        console.log('Detail Error:', e.response) // Cek response error detail

        this.posts = []
        this.rowcount = 0

        // Opsional: Tampilkan alert jika error
        this.$swal.fire('Error', 'Gagal mengambil data tabel', 'error')
      } finally {
        this.isTableLoading = false
      }
    },
    async fetchDepartments() {
      this.isLoadingDepartment = true
      try {
        const response = await this.$axios.$get(
          '/api/admin/email-grading-department-options'
        )
        // Gunakan || [] untuk mencegah error jika response null
        this.departmentOptions = response.data || []
      } catch (error) {
        console.error('Gagal load department', error)
        this.departmentOptions = []
      } finally {
        this.isLoadingDepartment = false
      }
    },
    onDepartmentChange(newVal) {
      // Reset selected employee saat department berubah
    },
    async fetchEmployees() {
      try {
        const response = await this.$axios.$get(
          '/api/admin/email-grading-employee-options',
          {
            params: { is_admin: 1 },
          }
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
    async showModalAdd() {
      this.fetchEmployees()
      this.fetchDepartments()
      this.editMode = false // Set mode Tambah
      this.selectedId = null
      this.selectedEmployeeObj = null // Reset Multiselect
      this.selectedDepartmentObj = null
      this.form = {
        employee_id: null,
        location: 'admin',
        is_active: 'Y',
        description: '',
        department_id: null,
      }
      this.$bvModal.show('modal-form')
    },

    // 2. NEW: Method untuk Menampilkan Modal Edit
    showModalEdit(item) {
      this.editMode = true
      this.selectedId = item.id

      this.form = {
        employee_id: item.employee_id,
        location: item.location,
        is_active: item.is_active,
        description: item.description,
        department_id: item.department_id,
      }

      // 1. SETUP EMPLOYEE
      let empObj = null

      empObj = {
        id: item.employee_id,
        name: item.name,
        nik: item.nik || '-',
        email: item.email,
        department_code: item.department_code_employee,
      }

      if (empObj) {
        empObj.name_info = `${empObj.name} - ${empObj.department_code_employee} - ${empObj.nik}`

        this.employeeOptions = [empObj]

        this.selectedEmployeeObj = empObj
      }

      // 2. SETUP DEPARTMENT (Perbaikan Utama)
      let deptObj = null

      // Cek apakah department sudah ada di dalam list options yang terload dari API
      if (
        Array.isArray(this.departmentOptions) &&
        this.departmentOptions.length > 0
      ) {
        deptObj = this.departmentOptions.find((d) => d.id == item.department_id)
      }

      if (item.department_id) {
        deptObj = {
          id: item.department_id,
          code: item.department_code || 'Unknown Dept',
          name: item.department_name || '',
        }
        this.departmentOptions.push(deptObj)
      }

      this.selectedDepartmentObj = deptObj

      this.$bvModal.show('modal-form')
    },

    // 3. MODIFIED: Submit Form menangani Add (POST) dan Edit (PUT)
    async submitForm(bvModalEvent) {
      bvModalEvent.preventDefault()

      if (!this.form.department_id) {
        this.$swal.fire('Error', 'Pilih Department terlebih dahulu', 'error')
        return
      }

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
          await this.fetchData()
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
              .then(async (response) => {
                this.$nuxt.refresh()
                this.$swal.fire(
                  'BERHASIL',
                  'Status berhasil diperbarui',
                  'success'
                )
                await this.fetchData()
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
                this.fetchData()
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
            params: { q: query, is_admin: 1 },
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
    asyncFindDepartment(query) {
      this.isLoadingDepartment = true
      if (this.searchTimerDepartment) clearTimeout(this.searchTimerDepartment)

      this.searchTimerDepartment = setTimeout(() => {
        this.$axios
          .$get('/api/admin/email-grading-department-options', {
            params: { q: query, is_admin: 1 },
          })
          .then((response) => {
            this.departmentOptions = response.data
            this.isLoadingDepartment = false
          })
          .catch((error) => {
            console.error(error)
            this.isLoadingDepartment = false
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

/* --- TAMBAHKAN INI --- */

/* Memaksa teks menjadi putih saat item di-hover/dipilih */
::v-deep .multiselect__option--highlight .text-info,
::v-deep .multiselect__option--highlight .text-muted,
::v-deep .multiselect__option--highlight strong {
  color: #fff !important;
}

/* Opsional: Membuat warna email sedikit lebih terang saat tidak di-hover agar lebih mudah dibaca */
.text-info {
  color: #17a2b8; /* Atau ganti dengan warna lain jika perlu */
}
</style>
