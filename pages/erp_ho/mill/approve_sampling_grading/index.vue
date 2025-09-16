<template>
  <div class="content-wrapper mb-5">
    <section class="content-header">
      <div class="container-fluid"></div>
    </section>
    <section class="content">
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
    </section>
  </div>
</template>

<script>
import InternalSection from '~/components/admin/mill/approve_sampling_grading/InternalSection.vue'
import ExternalSection from '~/components/admin/mill/approve_sampling_grading/ExternalSection.vue'

export default {
  layout: 'admin',

  head() {
    return {
      title: 'Approve Sampling Grading',
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
