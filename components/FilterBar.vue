<template>
  <div>
    <ClientOnly>
      <b-card
        border-variant="primary"
        header="Filter"
        header-bg-variant="info"
        header-text-variant="white"
        class="mb-4 ml-2 mr-2"
      >
        <b-card-text>
          <b-container class="bv-example-row mb-1">
            <b-row>
              <b-col cols="2">
                <div class="form-group">
                  <multiselect
                    v-model="companyId"
                    :options="companyState"
                    label="code"
                    track-by="id"
                    :searchable="true"
                    placeholder="PT"
                  ></multiselect></div
              ></b-col>
              <b-col cols="2">
                <div class="form-group">
                  <multiselect
                    v-model="departmentId"
                    :options="departmentState"
                    label="code"
                    track-by="id"
                    :searchable="true"
                    placeholder="Estate"
                  ></multiselect></div
              ></b-col>
              <b-col cols="2">
                <div class="form-group">
                  <multiselect
                    v-model="afdelingId"
                    :options="afdelingState"
                    label="id"
                    track-by="code"
                    :searchable="true"
                    placeholder="Afdeling"
                  ></multiselect></div
              ></b-col>
              <b-col cols="3">
                <b-input-group>
                  <b-form-datepicker
                    v-model="dateStart"
                    :max="dateEndState"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      weekday: 'short',
                    }"
                    placeholder="Start Date"
                  ></b-form-datepicker>
                  <template #append>
                    <b-btn size="sm" @click="dateStart = ''"
                      ><i class="fa fa-trash"></i
                    ></b-btn>
                  </template>
                </b-input-group>
              </b-col>
              <b-col cols="3">
                <b-input-group>
                  <b-form-datepicker
                    v-show="true"
                    v-model="dateEnd"
                    :min="dateStartState"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      weekday: 'short',
                    }"
                    placeholder="End Date"
                  ></b-form-datepicker>
                  <template #append>
                    <b-btn size="sm" @click="dateEnd = ''" v-show="true"
                      ><i class="fa fa-trash"></i
                    ></b-btn>
                  </template>
                </b-input-group>
              </b-col>
            </b-row>
          </b-container>

          <b-container class="bv-example-row row justify-content-end p-0">
            <div class="input-group-append">
              <button @click="searchData" class="btn btn-info">
                <i class="fa fa-search"></i>
                CARI
              </button>
            </div>
          </b-container>
        </b-card-text>
      </b-card>
    </ClientOnly>
  </div>
</template>

<script>

export default {
  methods: {
    updateDashboardState() {
      this.$store.commit('updateDashboardState', { query: 'New state' })
    },
    //searchData
    searchData() {
      this.$router.push({
        path: this.$route.path,
        query: {
          q: this.search,
        },
      })
    },
  },
  computed: {
    afdelingId: {
      get() {
        return this.$store.state.afdelingId
      },
      set(value) {
        this.$store.commit('updateAfdelingIdState', value)
      },
    },
    departmentId: {
      get() {
        return this.$store.state.departmentId
      },
      set(value) {
        this.$store.commit('updateDepartmentIdState', value)
      },
    },
    companyId: {
      get() {
        return this.$store.state.companyId
      },
      set(value) {
        this.$store.commit('updateCompanyIdState', value)
      },
    },
    dateStart: {
      get() {
        return this.$store.state.dateStart
      },
      set(value) {
        this.$store.commit('updateDateStartState', value)
      },
    },
    dateEnd: {
      get() {
        return this.$store.state.dateEnd
      },
      set(value) {
        this.$store.commit('updateDateEndState', value)
      },
    },
    queryStringState() {
      return this.$store.state.queryString
    },
    afdelingState() {
      return this.$store.state.afdeling
    },
    departmentState() {
      return this.$store.state.department
    },
    companyState() {
      return this.$store.state.company
    },
    afdelingIdState() {
      return this.$store.state.afdelingId
    },
    departmentIdState() {
      return this.$store.state.departmentId
    },
    companyIdState() {
      return this.$store.state.companyId
    },
    dateStartState() {
      return this.$store.state.dateStart
    },
    dateEndState() {
      return this.$store.state.dateEnd
    },
  },
}
</script>

<style>
.nuxt-logo {
  height: 180px;
}
</style>
