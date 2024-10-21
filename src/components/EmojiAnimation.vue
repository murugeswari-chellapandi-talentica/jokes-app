<template>
  <div class="emoji-container">
    <transition-group name="fade" mode="out-in">
      <span v-for="(emoji, index) in visibleEmojis" :key="index" class="emoji" :style="getEmojiStyle(index)">
        {{ emoji }}
      </span>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emojis: ['😂', '😄', '😆', '😜', '🤣', '😹', '😇', '😁'],
      visibleEmojis: [],
    };
  },
  mounted() {
    this.throwEmojis();
  },
  methods: {
    /* 
    Method to select emojis
    @params: none
    */
    throwEmojis() {
      const totalEmojis = 30;
      for (let i = 0; i < totalEmojis; i++) {
        const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        this.visibleEmojis.push(randomEmoji);
        setTimeout(() => {
          this.visibleEmojis.splice(0, 1);
        }, 3000);
      }
    },
    /* 
    Method to get style for each emoji
    @params: none
   */
    getEmojiStyle() {
      const x = Math.random() * 100; // Random horizontal position
      const duration = Math.random() * 2 + 2; // Random duration between 2-4 seconds
      const rotation = Math.random() * 360; // Random rotation angle
      return {
        left: `${x}vw`,
        transform: `rotate(${rotation}deg)`,
        animation: `fall ${duration}s forwards`,
        opacity: 1,
      };
    },
  },
};
</script>

<style>
.emoji-container {
  position: fixed;
  bottom: 100%;
  /* Start above the viewport */
  width: 100%;
  pointer-events: none;
  /* Prevent pointer events on emojis */
}

.emoji {
  font-size: 3rem;
  /* Adjust size as needed */
  position: absolute;
  animation-fill-mode: forwards;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@keyframes fall {
  0% {
    transform: translateY(0);
    opacity: 3;
  }

  100% {
    transform: translateY(100vh);
    opacity: 0;
    /* Fade out */
  }
}
</style>