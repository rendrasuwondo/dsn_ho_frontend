<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fab fa-whatsapp"></i> <b>WA Grading</b>
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
                placeholder="Cari Department / WA Number..."
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
            :busy="isTableLoading"
          >
            <template #cell(index)="data">
              {{
                data.index +
                1 +
                (pagination.current_page - 1) * pagination.per_page
              }}
            </template>

            <template #cell(department)="data">
              <strong>{{ data.item.department_code || '-' }}</strong>
            </template>

            <template #cell(grading_type_info)="data">
              <span
                v-if="data.item.grading_type === 'I'"
                class="text-primary font-weight-bold"
                >INTERNAL</span
              >
              <span v-else class="text-success font-weight-bold">EXTERNAL</span>
            </template>

            <template #cell(is_active)="data">
              <b-badge
                :variant="data.item.is_active == 'Y' ? 'success' : 'danger'"
              >
                {{ data.item.is_active_code }}
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
      :title="editMode ? 'Edit WA Grading' : 'Tambah WA Grading'"
      @ok="submitForm"
      ok-title="Simpan"
      cancel-title="Batal"
    >
      <form ref="form" @submit.stop.prevent="submitForm">
        <b-form-group label="PKS" label-for="department-input">
          <multiselect
            id="department-input"
            v-model="selectedDeptObj"
            :options="departmentOptions"
            :loading="isLoadingDept"
            :internal-search="false"
            :clear-on-select="false"
            :close-on-select="true"
            :options-limit="20"
            placeholder="Ketik Kode PKS..."
            track-by="id"
            label="code"
            @search-change="asyncFindDept"
          >
            <template slot="option" slot-scope="props">
              <div class="option__desc">
                <span class="option__title">
                  <strong>{{ props.option.code }}</strong>
                </span>
                <br />
                <small class="text-muted" style="font-size: 12px">{{
                  props.option.name
                }}</small>
              </div>
            </template>
            <template slot="noResult">Data tidak ditemukan</template>
          </multiselect>
        </b-form-group>

        <b-form-group label="WA Number" label-for="wa-input">
          <b-form-input
            id="wa-input"
            v-model="form.wa_number"
            :formatter="formatWaNumber"
            placeholder="Contoh: 08123456789"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Grading Type" label-for="type-input">
          <b-form-select
            id="type-input"
            v-model="form.grading_type"
            :options="[
              { text: 'INTERNAL', value: 'I' },
              { text: 'EXTERNAL', value: 'E' },
            ]"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group label="Description" label-for="desc-input">
          <b-form-textarea
            id="desc-input"
            v-model="form.description"
            rows="3"
            placeholder="Keterangan opsional..."
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
    return { title: 'WA Grading' }
  },
  data() {
    return {
      search: '',
      posts: [],
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
      },
      rowcount: 0,
      isTableLoading: false,

      editMode: false,
      selectedId: null,

      selectedDeptObj: null,
      departmentOptions: [],
      isLoadingDept: false,
      searchTimer: null,

      form: {
        department_id: null,
        wa_number: '',
        grading_type: 'I',
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
        { key: 'department', label: 'PKS' },
        { key: 'wa_number', label: 'WA Number' },
        { key: 'grading_type_info', label: 'Type' },
        { key: 'description', label: 'Description' },
        {
          key: 'is_active',
          label: 'Status',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
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
  watch: {
    selectedDeptObj(newVal) {
      if (newVal) {
        this.form.department_id = newVal.id
      } else {
        this.form.department_id = null
      }
    },
  },
  mounted() {
    this.fetchData()
    this.fetchDepartments()
  },
  methods: {
    async fetchData() {
      this.isTableLoading = true
      try {
        // Sesuaikan endpoint API dengan route Anda
        const response = await this.$axios.$get('/api/admin/wa-grading', {
          params: {
            q: this.search,
            page: this.pagination.current_page,
            per_page: this.pagination.per_page,
          },
        })

        this.posts = response.data.data
        this.pagination.total = response.data.total
        this.pagination.current_page = response.data.current_page
        this.pagination.per_page = response.data.per_page
        this.rowcount = response.data.total
      } catch (e) {
        console.error('Error fetching data:', e)
        this.$swal.fire('Error', 'Gagal mengambil data tabel', 'error')
      } finally {
        this.isTableLoading = false
      }
    },

    async fetchDepartments() {
      try {
        const response = await this.$axios.$get(
          '/api/admin/wa-grading/department-options'
        )
        this.departmentOptions = response.data
      } catch (error) {
        console.error('Gagal load department', error)
      }
    },

    changePage(page) {
      this.pagination.current_page = page
      this.fetchData()
    },

    searchData() {
      this.pagination.current_page = 1
      this.fetchData()
    },

    showModalAdd() {
      this.editMode = false
      this.selectedId = null
      this.selectedDeptObj = null
      this.form = {
        department_id: null,
        wa_number: '',
        grading_type: 'I',
        description: '',
      }
      this.fetchDepartments()
      this.$bvModal.show('modal-form')
    },

    showModalEdit(item) {
      this.editMode = true
      this.selectedId = item.id

      this.form = {
        department_id: item.department_id,
        wa_number: item.wa_number,
        grading_type: item.grading_type,
        description: item.description,
      }

      // Set multiselect initial value
      let deptObj = {
        id: item.department_id,
        code: item.department_code,
        name: '',
      }
      this.departmentOptions = [deptObj]
      this.selectedDeptObj = deptObj

      this.$bvModal.show('modal-form')
    },

    async submitForm(bvModalEvent) {
      bvModalEvent.preventDefault()

      if (!this.form.department_id) {
        this.$swal.fire('Error', 'Pilih Department terlebih dahulu', 'error')
        return
      }

      try {
        if (this.editMode) {
          await this.$axios.put(
            `/api/admin/wa-grading/${this.selectedId}`,
            this.form
          )
          this.$swal.fire('Berhasil', 'Data berhasil diperbarui', 'success')
        } else {
          await this.$axios.post('/api/admin/wa-grading', this.form)
          this.$swal.fire('Berhasil', 'Data berhasil disimpan', 'success')
        }

        this.$bvModal.hide('modal-form')
        this.fetchData()
      } catch (error) {
        let msg = error.response?.data?.message || 'Gagal memproses data'
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
              .put(`/api/admin/wa-grading/${id}`, { is_active: newStatus })
              .then(() => {
                this.$swal.fire(
                  'BERHASIL',
                  'Status berhasil diperbarui',
                  'success'
                )
                this.fetchData()
              })
              .catch(() => {
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
              .delete(`/api/admin/wa-grading/${id}`)
              .then(() => {
                this.$swal.fire('BERHASIL!', 'Data Berhasil Dihapus', 'success')
                this.fetchData()
              })
              .catch(() => {
                this.$swal.fire(
                  'GAGAL!',
                  'Terjadi kesalahan saat menghapus',
                  'error'
                )
              })
          }
        })
    },

    asyncFindDept(query) {
      this.isLoadingDept = true
      if (this.searchTimer) clearTimeout(this.searchTimer)

      this.searchTimer = setTimeout(() => {
        this.$axios
          .$get('/api/admin/wa-grading/department-options', {
            params: { q: query },
          })
          .then((response) => {
            this.departmentOptions = response.data
            this.isLoadingDept = false
          })
          .catch((error) => {
            console.error(error)
            this.isLoadingDept = false
          })
      }, 500)
    },

    formatWaNumber(value) {
      // Pastikan value adalah string, lalu hapus semua selain angka
      return String(value).replace(/\D/g, '')
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

::v-deep .multiselect__option--highlight .text-muted,
::v-deep .multiselect__option--highlight strong {
  color: #fff !important;
}
</style>
