<template>
  <div class="content-wrapper mb-5">
    <div class="mt-5 mx-2">
      <b-tabs content-class="mt-4 " fill>
        <b-tab title="Internal" lazy active>
          <InternalSection />
        </b-tab>
        <b-tab title="External" lazy>
          <ExternalSection />
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import InternalSection from '~/components/admin/mill/spot_cek/InternalSection.vue'
import ExternalSection from '~/components/admin/mill/spot_cek/ExternalSection.vue'
export default {
  layout: 'admin',

  head() {
    return {
      title: 'Spot Cek',
    }
  },

  components: {
    InternalSection,
    ExternalSection,
  },

  data() {
    return {}
  },

  computed: {},

  mounted() {},

  methods: {},
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

<style>
.b-table thead tr:nth-child(3) {
  display: none;
}
.b-table td:nth-child(7),
.b-table td:nth-child(9),
.b-table td:nth-child(10),
.b-table td:nth-child(11),
.b-table td:nth-child(12),
.b-table td:nth-child(13),
.b-table td:nth-child(14),
.b-table td:nth-child(15),
.b-table td:nth-child(16),
.b-table td:nth-child(17),
.b-table td:nth-child(18),
.b-table td:nth-child(19),
.b-table td:nth-child(20),
.b-table td:nth-child(21),
.b-table td:nth-child(22),
.b-table td:nth-child(23),
.b-table td:nth-child(24),
.b-table td:nth-child(25),
.b-table td:nth-child(26),
.b-table td:nth-child(27),
.b-table td:nth-child(28),
.b-table td:nth-child(29),
.b-table td:nth-child(30) {
  text-align: end;
}
</style>
