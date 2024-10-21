<template>
  <main>
    <EmojiAnimation />
    <LandingPage v-show="showLandingPage" />
  </main>
</template>
<script>
import LandingPage from '../components/LandingPage.vue';
import EmojiAnimation from '@/components/EmojiAnimation.vue';
export default {
  name: "HomeView",
  components: {
    LandingPage,
    EmojiAnimation
  },
  data() {
    return {
      showLandingPage: false
    }
  },
  created() {
    setTimeout(() => {
      this.showLandingPage = true;
    }, 2000);
  }
}
</script>
