<template>
  <q-layout view="lHh Lpr lFf" container style="height: 100vh" class="shadow-2 rounded-borders">
    <q-header class="bg-custom-orange" elevated>
      <q-toolbar class="text-white shadow-2 rounded-borders">
        <q-btn @click="reloadHomePage" flat label="Homepage" />
        <q-space />
        <q-tabs v-model="tab" shrink stretch>
          <q-tab name="tab2" label="Contact" />
        </q-tabs>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page padding>
        <LandingPage :reload="reload" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import LandingPage from './components/LandingPage.vue';
import {
  QLayout, QPageContainer, QPage,
  QHeader, QTabs, QTab, QToolbar, QBtn, 
  QSpace
} from 'quasar';
export default {
  components: {
    LandingPage,
    QLayout, QPageContainer, QPage,
    QHeader,
    QTabs,
    QTab,
    QToolbar, QBtn, QSpace
  },
  data() {
    return {
      reload: false,
      tab: ""
    }
  },
  methods: {
    /* 
    Method to go back to Home page
    @params: none
    */
    reloadHomePage() {
      this.reload = true;
      this.$nextTick(() => this.reload = false)
    }
  }
}
</script>
<style scoped>
.close-icon {
  display: flex;
  justify-content: flex-end;
}

.rate-img {
  height: 320px;
}

.router-view {
  height: 86vh;
}
</style>
