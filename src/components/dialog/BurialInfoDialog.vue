<template>
  <q-dialog v-model="showBurialInfoDialog">
    <q-card class="my-card">
      <q-img src="~assets/burrial.jpg" />

      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="place"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            {{currentBurial.person}}
          </div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            250 ft
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">
          {{currentBurial.birthDate}} - {{currentBurial.deathDate}}
        </div>
        <div class="text-caption text-grey">
          {{currentBurial.description}}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-close-popup flat color="primary" label="Закрыть" @click="onClickClose"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'burialInfoDialog',
  components: {},
  data () {
    return {
    }
  },
  computed: {
    showBurialInfoDialog () {
      return this.$store.getters.burialInfoDialogVisible
    },
    currentBurial () {
      return this.$store.getters.currentCemeteryBurial
    }
  },
  mounted () {
  },
  methods: {
    onClickClose () {
      this.$store.dispatch('hideBurialInfoDialog')
    }
  }
}
</script>

<style>

</style>
