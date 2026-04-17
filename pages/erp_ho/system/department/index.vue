<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid">
        <h1 class="m-0 text-dark">Master Department</h1>
      </div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-body">
          <b-tabs content-class="mt-3">
            <b-tab title="Data Department" active>
              <div class="form-group">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <button
                      class="btn btn-info btn-sm"
                      @click="showModalDept(false)"
                    >
                      <i class="fa fa-plus-circle"></i> Tambah Dept
                    </button>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchDept"
                    @keypress.enter="fetchDept"
                    placeholder="Cari Kode / Nama Department..."
                  />
                  <div class="input-group-append">
                    <button @click="fetchDept" class="btn btn-info">
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
                :items="postsDept"
                :fields="fieldsDept"
                :busy="loadingDept"
              >
                <template #cell(index)="data">{{
                  data.index + 1 + (pageDept - 1) * perPageDept
                }}</template>
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
                    @click="showModalDept(true, data.item)"
                  >
                    <i class="fa fa-pencil-alt"></i>
                  </button>

                  <button
                    class="btn btn-sm mr-1"
                    :class="
                      data.item.is_active == 'Y' ? 'btn-warning' : 'btn-success'
                    "
                    :title="
                      data.item.is_active == 'Y' ? 'Nonaktifkan' : 'Aktifkan'
                    "
                    @click="toggleStatusDept(data.item.id, data.item.is_active)"
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
                    @click="deleteDept(data.item.id)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </template>
              </b-table>

              <b-pagination
                v-model="pageDept"
                :total-rows="totalDept"
                :per-page="perPageDept"
                @change="changePageDept"
                class="mt-2"
              ></b-pagination>
            </b-tab>

            <b-tab title="Data Department Type">
              <div class="form-group">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <button
                      class="btn btn-info btn-sm"
                      @click="showModalType(false)"
                    >
                      <i class="fa fa-plus-circle"></i> Tambah Type
                    </button>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchType"
                    @keypress.enter="fetchType"
                    placeholder="Cari Kode / Nama Type..."
                  />
                  <div class="input-group-append">
                    <button @click="fetchType" class="btn btn-info">
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
                :items="postsType"
                :fields="fieldsType"
                :busy="loadingType"
              >
                <template #cell(index)="data">{{
                  data.index + 1 + (pageType - 1) * perPageType
                }}</template>
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
                    @click="showModalType(true, data.item)"
                  >
                    <i class="fa fa-pencil-alt"></i>
                  </button>

                  <button
                    class="btn btn-sm mr-1"
                    :class="
                      data.item.is_active == 'Y' ? 'btn-warning' : 'btn-success'
                    "
                    :title="
                      data.item.is_active == 'Y' ? 'Nonaktifkan' : 'Aktifkan'
                    "
                    @click="toggleStatusType(data.item.id, data.item.is_active)"
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
                    @click="deleteType(data.item.id)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </template>
              </b-table>

              <b-pagination
                v-model="pageType"
                :total-rows="totalType"
                :per-page="perPageType"
                @change="changePageType"
                class="mt-2"
              ></b-pagination>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </section>

    <b-modal
      id="modal-dept"
      :title="editModeDept ? 'Edit Department' : 'Tambah Department'"
      @ok="submitDept"
      ok-title="Simpan"
      cancel-title="Batal"
      size="lg"
    >
      <form @submit.stop.prevent="submitDept">
        <b-row>
          <b-col md="6">
            <b-form-group label="Tipe Department" label-for="dept-type">
              <b-form-select
                id="dept-type"
                v-model="formDept.department_type_id"
                :options="optDeptTypes"
                value-field="id"
                text-field="name"
                required
              >
                <template #first
                  ><b-form-select-option :value="null" disabled
                    >-- Pilih Tipe --</b-form-select-option
                  ></template
                >
              </b-form-select>
            </b-form-group>

            <b-form-group label="Kode Department" label-for="dept-code">
              <b-form-input
                id="dept-code"
                v-model="formDept.code"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Nama Department" label-for="dept-name">
              <b-form-input
                id="dept-name"
                v-model="formDept.name"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Kode SAP" label-for="dept-sap">
              <b-form-input
                id="dept-sap"
                v-model="formDept.code_sap"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Level" label-for="dept-lvl">
              <b-form-select
                id="dept-lvl"
                v-model="formDept.lvl"
                :options="optLevel"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group label="Parent Department" label-for="dept-parent">
              <multiselect
                v-model="selectedParent"
                :options="optParents"
                :loading="loadingParent"
                placeholder="Ketik nama parent..."
                track-by="id"
                label="name"
                @search-change="searchParent"
                :internal-search="false"
                :clear-on-select="false"
              ></multiselect>
            </b-form-group>

            <b-form-group label="Status Active" label-for="dept-active">
              <b-form-select
                id="dept-active"
                v-model="formDept.is_active"
                :options="[
                  { text: 'Ya', value: 'Y' },
                  { text: 'Tidak', value: 'N' },
                ]"
                required
              ></b-form-select>
            </b-form-group>

            <b-row>
              <b-col>
                <b-form-checkbox
                  v-model="formDept.is_mill"
                  value="Y"
                  unchecked-value="N"
                >
                  Is Mill?
                </b-form-checkbox>
              </b-col>

              <b-col>
                <b-form-checkbox
                  v-model="formDept.is_harvest_system"
                  value="Y"
                  :unchecked-value="null"
                >
                  Is Harvest System?
                </b-form-checkbox>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-form-group label="Deskripsi">
          <b-form-textarea
            v-model="formDept.description"
            rows="2"
          ></b-form-textarea>
        </b-form-group>
      </form>
    </b-modal>

    <b-modal
      id="modal-type"
      :title="editModeType ? 'Edit Department Type' : 'Tambah Department Type'"
      @ok="submitType"
      ok-title="Simpan"
      cancel-title="Batal"
    >
      <form @submit.stop.prevent="submitType">
        <b-form-group label="Kode Type">
          <b-form-input v-model="formType.code" required></b-form-input>
        </b-form-group>
        <b-form-group label="Nama Type">
          <b-form-input v-model="formType.name" required></b-form-input>
        </b-form-group>
        <b-form-group label="FO (O/F)">
          <b-form-select
            v-model="formType.fo"
            :options="[
              { text: 'O (Operating)', value: 'O' },
              { text: 'F (Functional)', value: 'F' },
            ]"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group label="Status Active">
          <b-form-select
            v-model="formType.is_active"
            :options="[
              { text: 'Ya', value: 'Y' },
              { text: 'Tidak', value: 'N' },
            ]"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group label="Deskripsi">
          <b-form-textarea
            v-model="formType.description"
            rows="2"
          ></b-form-textarea>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      // Data Department
      searchDept: '',
      postsDept: [],
      loadingDept: false,
      pageDept: 1,
      perPageDept: 10,
      totalDept: 0,
      editModeDept: false,
      selectedIdDept: null,
      formDept: {
        department_type_id: null,
        code: '',
        name: '',
        code_sap: '',
        lvl: 'D',
        parent_id: null,
        is_active: 'Y',
        is_mill: 'N',
        is_harvest_system: 'N',
        description: '',
      },
      optLevel: [
        { text: 'D - Department', value: 'D' },
        { text: 'P - Plantation', value: 'P' },
        { text: 'R - Region', value: 'R' },
        { text: 'V - Division', value: 'V' }, // Sesuaikan deskripsinya jika perlu
      ],
      optDeptTypes: [],
      selectedParent: null,
      optParents: [],
      loadingParent: false,
      timerParent: null,
      fieldsDept: [
        {
          key: 'index',
          label: 'No',
          thClass: 'text-center',
          tdClass: 'text-center',
          width: '50px',
        },
        { key: 'code', label: 'Kode' },
        { key: 'name', label: 'Nama Department' },
        { key: 'parent_name', label: 'Parent Dept' },
        { key: 'lvl_code', label: 'Level', tdClass: 'text-center' },
        { key: 'code_sap', label: 'SAP' },
        { key: 'is_active', label: 'Status', tdClass: 'text-center' },
        {
          key: 'actions',
          label: 'Aksi',
          thClass: 'text-center',
          tdClass: 'text-center',
          width: '100px',
        },
      ],

      // Data Department Type
      searchType: '',
      postsType: [],
      loadingType: false,
      pageType: 1,
      perPageType: 10,
      totalType: 0,
      editModeType: false,
      selectedIdType: null,
      formType: {
        code: '',
        name: '',
        fo: 'O',
        is_active: 'Y',
        description: '',
      },
      fieldsType: [
        {
          key: 'index',
          label: 'No',
          thClass: 'text-center',
          tdClass: 'text-center',
          width: '50px',
        },
        { key: 'code', label: 'Kode' },
        { key: 'name', label: 'Nama Type' },
        { key: 'fo', label: 'FO', tdClass: 'text-center' },
        { key: 'is_active', label: 'Status', tdClass: 'text-center' },
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
    selectedParent(newVal) {
      this.formDept.parent_id = newVal ? newVal.id : null
    },
  },
  mounted() {
    this.fetchDept()
    this.fetchType()
    this.loadDropdowns()
  },
  methods: {
    // ==========================================
    // LOGIC DEPARTMENT
    // ==========================================
    async fetchDept() {
      this.loadingDept = true
      try {
        const res = await this.$axios.$get('/api/admin/department', {
          params: {
            q: this.searchDept,
            page: this.pageDept,
            per_page: this.perPageDept,
          },
        })
        this.postsDept = res.data.data
        this.totalDept = res.data.total
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingDept = false
      }
    },
    changePageDept(page) {
      this.pageDept = page
      this.fetchDept()
    },

    showModalDept(isEdit, item = null) {
      this.editModeDept = isEdit
      if (isEdit) {
        this.selectedIdDept = item.id
        this.formDept = {
          department_type_id: item.department_type_id,
          code: item.code,
          name: item.name,
          code_sap: item.code_sap,
          lvl: item.lvl,
          parent_id: item.parent_id,
          is_active: item.is_active,
          is_mill: item.is_mill || 'N',
          is_harvest_system: item.is_harvest_system || 'N',
          description: item.description,
        }

        if (item.parent_id && item.parent_name) {
          // 1. Buat object berdasarkan data dari API
          this.selectedParent = {
            id: item.parent_id,
            name: item.parent_name,
          }
          // 2. Wajib dimasukkan ke optParents agar Vue-Multiselect bisa membaca namanya
          this.optParents = [this.selectedParent]
        } else {
          this.selectedParent = null
          this.optParents = []
        }
      } else {
        this.selectedIdDept = null
        this.formDept = {
          department_type_id: null,
          code: '',
          name: '',
          code_sap: '',
          lvl: 'D',
          parent_id: null,
          is_active: 'Y',
          is_mill: 'N',
          is_harvest_system: 'N',
          description: '',
        }

        // Reset parent
        this.selectedParent = null
        this.optParents = []
      }
      this.$bvModal.show('modal-dept')
    },

    async submitDept(e) {
      e.preventDefault()
      try {
        if (this.editModeDept) {
          await this.$axios.put(
            `/api/admin/department/${this.selectedIdDept}`,
            this.formDept
          )
          this.$swal.fire('Berhasil', 'Data Department diupdate', 'success')
        } else {
          await this.$axios.post('/api/admin/department', this.formDept)
          this.$swal.fire('Berhasil', 'Data Department ditambah', 'success')
        }
        this.$bvModal.hide('modal-dept')
        this.fetchDept()
      } catch (err) {
        this.$swal.fire(
          'Gagal',
          err.response?.data?.message || 'Terjadi kesalahan',
          'error'
        )
      }
    },

    deleteDept(id) {
      this.$swal
        .fire({ title: 'Hapus Data?', icon: 'warning', showCancelButton: true })
        .then((res) => {
          if (res.isConfirmed) {
            this.$axios.delete(`/api/admin/department/${id}`).then(() => {
              this.$swal.fire('Terhapus', '', 'success')
              this.fetchDept()
            })
          }
        })
    },

    // ==========================================
    // LOGIC DEPARTMENT TYPE
    // ==========================================
    async fetchType() {
      this.loadingType = true
      try {
        const res = await this.$axios.$get('/api/admin/department-type', {
          params: {
            q: this.searchType,
            page: this.pageType,
            per_page: this.perPageType,
          },
        })
        this.postsType = res.data.data
        this.totalType = res.data.total
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingType = false
      }
    },
    changePageType(page) {
      this.pageType = page
      this.fetchType()
    },

    showModalType(isEdit, item = null) {
      this.editModeType = isEdit
      if (isEdit) {
        this.selectedIdType = item.id
        this.formType = {
          code: item.code,
          name: item.name,
          fo: item.fo,
          is_active: item.is_active,
          description: item.description,
        }
      } else {
        this.selectedIdType = null
        this.formType = {
          code: '',
          name: '',
          fo: 'O',
          is_active: 'Y',
          description: '',
        }
      }
      this.$bvModal.show('modal-type')
    },

    async submitType(e) {
      e.preventDefault()
      try {
        if (this.editModeType) {
          await this.$axios.put(
            `/api/admin/department-type/${this.selectedIdType}`,
            this.formType
          )
          this.$swal.fire('Berhasil', 'Type diupdate', 'success')
        } else {
          await this.$axios.post('/api/admin/department-type', this.formType)
          this.$swal.fire('Berhasil', 'Type ditambah', 'success')
        }
        this.$bvModal.hide('modal-type')
        this.fetchType()
        this.loadDropdowns() // Refresh dropdown karena data type nambah
      } catch (err) {
        this.$swal.fire(
          'Gagal',
          err.response?.data?.message || 'Terjadi kesalahan',
          'error'
        )
      }
    },

    deleteType(id) {
      this.$swal
        .fire({ title: 'Hapus Type?', icon: 'warning', showCancelButton: true })
        .then((res) => {
          if (res.isConfirmed) {
            this.$axios.delete(`/api/admin/department-type/${id}`).then(() => {
              this.$swal.fire('Terhapus', '', 'success')
              this.fetchType()
            })
          }
        })
    },

    // ==========================================
    // DROPDOWNS API
    // ==========================================
    async loadDropdowns() {
      try {
        const res = await this.$axios.$get('/api/admin/department-type-options')
        this.optDeptTypes = res.data
      } catch (e) {
        console.error(e)
      }
    },

    searchParent(query) {
      this.loadingParent = true
      if (this.timerParent) clearTimeout(this.timerParent)
      this.timerParent = setTimeout(async () => {
        try {
          const res = await this.$axios.$get(
            '/api/admin/department-parent-options',
            { params: { q: query } }
          )
          this.optParents = res.data
        } catch (e) {}
        this.loadingParent = false
      }, 500)
    },
    // ==========================================
    // FUNGSI TOGGLE STATUS
    // ==========================================

    // Toggle untuk Department
    toggleStatusDept(id, currentStatus) {
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
            // Hanya mengirim field is_active ke backend
            this.$axios
              .put(`/api/admin/department/${id}`, { is_active: newStatus })
              .then(() => {
                this.$swal.fire(
                  'BERHASIL',
                  'Status berhasil diperbarui',
                  'success'
                )
                this.fetchDept() // Refresh tabel
              })
              .catch((err) => {
                let msg =
                  err.response?.data?.message || 'Gagal memperbarui status'
                this.$swal.fire('GAGAL!', msg, 'error')
              })
          }
        })
    },

    // Toggle untuk Department Type
    toggleStatusType(id, currentStatus) {
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
            // Hanya mengirim field is_active ke backend
            this.$axios
              .put(`/api/admin/department-type/${id}`, { is_active: newStatus })
              .then(() => {
                this.$swal.fire(
                  'BERHASIL',
                  'Status berhasil diperbarui',
                  'success'
                )
                this.fetchType() // Refresh tabel
                this.loadDropdowns() // Refresh dropdown jika type dipakai di tempat lain
              })
              .catch((err) => {
                let msg =
                  err.response?.data?.message || 'Gagal memperbarui status'
                this.$swal.fire('GAGAL!', msg, 'error')
              })
          }
        })
    },
  },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
