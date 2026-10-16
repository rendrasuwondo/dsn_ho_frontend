<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>

    <section class="content">
      <div class="card card-outline card-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="nav-icon fas fa-project-diagram"></i>
            <b>Map Loss Station</b>
          </h3>
          <div class="card-tools"></div>
        </div>
        <div class="card-body">
          <b-tabs v-model="activeTab" class="mb-3" @input="changeTab">
            <b-tab
              v-for="tab in tabs"
              :key="tab.dim_product_id"
              :title="tab.title"
            ></b-tab>
          </b-tabs>

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
              placeholder="Cari Code / Name / Product Group..."
            />
            <div class="input-group-append">
              <button @click="searchData" class="btn btn-info">
                <i class="fa fa-search"></i> CARI
              </button>
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
      :title="`${editMode ? 'Edit' : 'Tambah'} ${currentTab.title}`"
      @ok="submitForm"
      ok-title="Simpan"
      cancel-title="Batal"
      size="lg"
    >
      <form @submit.stop.prevent="submitForm">
        <b-row>
          <b-col md="6">
            <b-form-group
              label="Code (SEQNO)"
              label-for="seqno-input"
              :invalid-feedback="errors.seqno ? errors.seqno[0] : ''"
              :state="errors.seqno ? false : null"
            >
              <multiselect
                id="seqno-input"
                v-model="form.seqno"
                :options="seqnoOptions"
                :custom-label="seqnoLabel"
                track-by="SEQNO"
                :searchable="true"
                :loading="isLoadingSeqno"
                placeholder="Pilih SEQNO"
              ></multiselect>
            </b-form-group>

            <b-form-group
              label="Fossnir Product Group"
              label-for="product-group-input"
              :invalid-feedback="
                errors.fossnir_product_groups_id
                  ? errors.fossnir_product_groups_id[0]
                  : ''
              "
              :state="errors.fossnir_product_groups_id ? false : null"
            >
              <multiselect
                id="product-group-input"
                v-model="form.fossnir_product_groups_id"
                :options="productGroupOptions"
                label="name"
                track-by="id"
                :searchable="true"
                placeholder="Pilih Product Group"
              ></multiselect>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group
              label="Aktif"
              label-for="is_active-input"
              :invalid-feedback="errors.is_active ? errors.is_active[0] : ''"
              :state="errors.is_active ? false : null"
            >
              <b-form-select
                id="is_active-input"
                v-model="form.is_active"
                :options="[
                  { text: 'YA', value: 'Y' },
                  { text: 'TIDAK', value: 'N' },
                ]"
                :state="errors.is_active ? false : null"
              ></b-form-select>
            </b-form-group>

            <b-form-group label="Deskripsi" label-for="description-input">
              <b-form-textarea
                id="description-input"
                v-model="form.description"
                rows="3"
              ></b-form-textarea>
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
    return { title: 'Mill - Map Loss Station' }
  },
  data() {
    return {
      // Tab kategori: dim_product_id sesuai DS_DIM_PRODUCT
      tabs: [
        { title: 'Oil Losses', dim_product_id: 2 },
        { title: 'Kernel Losses', dim_product_id: 3 },
        { title: 'KCP Losses', dim_product_id: 4 },
      ],
      activeTab: 0,

      search: '',
      posts: [],
      loading: false,
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
      },
      rowcount: 0,

      seqnoOptionsByProduct: {},
      productGroupOptions: [],
      isLoadingSeqno: false,

      // Modal State
      editMode: false,
      selectedId: null,
      errors: {},

      form: {
        seqno: null,
        fossnir_product_groups_id: null,
        is_active: 'Y',
        description: '',
      },

      fields: [
        {
          key: 'actions',
          label: 'Aksi',
          thClass: 'text-center',
          tdClass: 'text-center text-nowrap',
        },
        {
          key: 'index',
          label: 'No',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'seqno',
          label: 'Code',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        { key: 'PRODUCT_NAME', label: 'Name' },
        { key: 'product_groups_name', label: 'Fossnir Product Group' },
        {
          key: 'is_active_code',
          label: 'Aktif',
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        { key: 'description', label: 'Deskripsi' },
      ],
    }
  },
  computed: {
    currentTab() {
      return this.tabs[this.activeTab] || this.tabs[0]
    },
    seqnoOptions() {
      return this.seqnoOptionsByProduct[this.currentTab.dim_product_id] || []
    },
  },
  watch: {
    '$route.query': {
      handler: 'fetchPosts',
      immediate: false,
    },
  },
  async mounted() {
    this.loadProductGroups()
    this.loadSeqno()

    if (Object.keys(this.$route.query).length > 0) {
      try {
        await this.$router.replace({ path: this.$route.path, query: {} })
      } catch (err) {}
    }

    this.fetchPosts()
  },
  methods: {
    seqnoLabel(option) {
      return option.txt ? `${option.SEQNO} - ${option.txt}` : `${option.SEQNO}`
    },
    async loadProductGroups() {
      try {
        const response = await this.$axios.$get(
          '/api/admin/loss_station_map/lov_product_groups'
        )
        this.productGroupOptions = response.data || []
      } catch (error) {
        console.error('Error loading product group dropdown', error)
      }
    },
    async loadSeqno() {
      const dimProductId = this.currentTab.dim_product_id
      if (this.seqnoOptionsByProduct[dimProductId]) return

      this.isLoadingSeqno = true
      try {
        const response = await this.$axios.$get(
          `/api/admin/loss_station_map/lov_seqno?dim_product_id=${dimProductId}`
        )
        this.$set(this.seqnoOptionsByProduct, dimProductId, response.data || [])
      } catch (error) {
        console.error('Error loading SEQNO dropdown', error)
      } finally {
        this.isLoadingSeqno = false
      }
    },
    async fetchPosts() {
      this.loading = true
      let page = this.$route.query.page ? parseInt(this.$route.query.page) : 1
      let search = this.$route.query.q ? this.$route.query.q : ''
      this.search = search

      let url = `/api/admin/loss_station_map?dim_product_id=${this.currentTab.dim_product_id}&q=${search}&page=${page}`

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

    changeTab() {
      this.loadSeqno()
      if (Object.keys(this.$route.query).length > 0) {
        // fetchPosts dipanggil oleh watcher $route.query
        this.$router.push({ path: this.$route.path, query: {} })
      } else {
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
      this.errors = {}
      if (isEdit) {
        this.selectedId = item.id
        this.form = {
          seqno: this.seqnoOptions.find((s) => s.SEQNO == item.seqno) || {
            SEQNO: item.seqno,
            txt: '',
          },
          fossnir_product_groups_id:
            this.productGroupOptions.find(
              (g) => g.id == item.fossnir_product_groups_id
            ) || null,
          is_active: item.is_active,
          description: item.description,
        }
      } else {
        this.selectedId = null
        this.form = {
          seqno: null,
          fossnir_product_groups_id: null,
          is_active: 'Y',
          description: '',
        }
      }
      this.$bvModal.show('modal-form')
    },
    async submitForm(e) {
      e.preventDefault()
      this.errors = {}
      try {
        const payload = {
          dim_product_id: this.currentTab.dim_product_id,
          seqno: this.form.seqno ? this.form.seqno.SEQNO : null,
          fossnir_product_groups_id: this.form.fossnir_product_groups_id
            ? this.form.fossnir_product_groups_id.id
            : null,
          is_active: this.form.is_active,
          description: this.form.description,
        }

        let response
        if (this.editMode) {
          response = await this.$axios.put(
            `/api/admin/loss_station_map/${this.selectedId}`,
            payload
          )
        } else {
          response = await this.$axios.post(
            '/api/admin/loss_station_map',
            payload
          )
        }

        if (response.data && response.data.success === false) {
          this.$swal.fire(
            'GAGAL!',
            response.data.message || 'Data gagal disimpan.',
            'error'
          )
          return
        }

        this.$swal.fire({
          title: 'BERHASIL!',
          text: this.editMode
            ? 'Data berhasil diupdate.'
            : 'Data berhasil ditambah.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        })
        this.$bvModal.hide('modal-form')
        this.fetchPosts()
      } catch (err) {
        if (err.response && err.response.status === 422) {
          this.errors = err.response.data || {}
          this.$swal.fire(
            'GAGAL!',
            'Silakan periksa kembali form Anda.',
            'error'
          )
        } else {
          this.$swal.fire(
            'GAGAL!',
            err.response?.data?.message || 'Terjadi kesalahan',
            'error'
          )
        }
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
              .delete(`/api/admin/loss_station_map/${id}`)
              .then((response) => {
                this.fetchPosts()
                if (response.data && response.data.success === false) {
                  this.$swal.fire(
                    'GAGAL!',
                    response.data.message || 'Gagal menghapus data.',
                    'error'
                  )
                } else {
                  this.$swal.fire({
                    title: 'BERHASIL!',
                    text: 'Data berhasil dihapus.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                  })
                }
              })
              .catch(() => {
                this.$swal.fire('GAGAL!', 'Gagal menghapus data.', 'error')
              })
          }
        })
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
</style>
