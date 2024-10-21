<template>
  <div @scroll="pageScroll" ref="scrollContainer" class="list-jokes" :class="loadingResults ? 'loader-section' : ''">
    <div v-if="!loadingResults" class="q-pa-md">
      <div class="btns-section q-pa-md">
        <div class="category-msg">
          You are viewing jokes from <strong>{{ endpoint }}</strong> category
        </div>
        <div class="flex">
          <q-btn rounded class="bg-custom-orange text-white" label="Want to share a Joke?"
            @click="showAddJokePopup = true" />
          <q-select class="sort-dd" color="orange" outlined v-model="selectedSortBy" :options="sortOptions"
            @update:model-value="onSortSelection" label="Sort by" />
        </div>
      </div>


      <div class="q-pa-md items-center q-gutter-md" v-for="(joke, ind) in jokesList" :key="joke.id">

        <q-card class="text-black joke-card gutter">
          <q-card-section class="flex column items-center justify-center">
            <div class="close-icon">

              <div v-if="joke.rating" class="flex items-center">
                <span class="rating q-mr-sm">{{ joke.rating }}</span>
                <q-rating v-model="joke.rating" max="5" size="2em" class="text-custom-orange" icon="star_border"
                  icon-selected="star" icon-half="star_half" no-dimming readonly />
                <span class="rating">({{ joke.ratedBy }})</span>
              </div>

              <q-btn rounded class="bg-custom-orange text-white q-ml-md" label="Rate Joke"
                @click="addRating(joke, ind)" />
            </div>

            <p class="text-h6">{{ joke.setup }}</p>
            <p class="text-h6">{{ joke.punchline }}</p>
          </q-card-section>
        </q-card>

      </div>

    </div>
    <div class="content-loader" v-else>
      <q-spinner-box class="bg-custom-orange" size="5.5em" />
    </div>
  </div>
  <RateJoke v-if="showRatingCard" :currentJoke="currentJoke" @closeRatingCard="closeRatingCard" />
  <AddJoke v-if="showAddJokePopup" :category="endpoint" @closePopup="closeAddJokePopup" />
</template>
<script>

import {
  QIcon, QSpinnerBox, QCard, QCardSection, QSeparator, QCardActions, QBtn,
  QItem, QItemLabel, QItemSection, QList, QSpace,
  QSpinnerDots, QRating, QSelect, QScrollArea
} from 'quasar';
import axios from "axios";
import constants from '@/constants';
import RateJoke from './RateJoke.vue';
import AddJoke from './AddJoke.vue';

export default {
  name: "ListJokes.vue",
  props: {
    endpoint: {
      type: String,
      default: ""
    }
  },
  components: {
    AddJoke,
    QSelect,
    RateJoke,
    QRating,
    QSpinnerDots,
    QIcon,
    QSpinnerBox,
    QCard, QCardSection,
    QSeparator, QCardActions,
    QBtn,
    QItem, QItemLabel, QItemSection, QList,
    QSpace,
    QScrollArea
  },
  data() {
    return {
      jokesList: [],
      loadingResults: false,
      ratingModel: 3,
      icons: [
        'sentiment_very_dissatisfied',
        'sentiment_dissatisfied',
        'sentiment_satisfied',
        'sentiment_satisfied_alt',
        'sentiment_very_satisfied'
      ],
      jokesCount: 5,
      fetchJokes: true,
      showRatingCard: false,
      currentJoke: {},
      currentJokeIndex: null,
      selectedSortBy: {
        label: "Latest to old",
        value: "Latest to old"
      },
      showAddJokePopup: false,
      scrollTargetRef: null
    }
  },
  created() {
    this.getAllJokes("init");
  },
  mouned() {
    this.$refs.scrollContainer.addEventListener('scroll', this.pageScroll);
  },
  computed: {
    sortOptions() {
      let options = ["Latest to old", "Old to latest", "Rating (High to low)", "Rating(Low to high)"]
      return options.map(option => ({
        label: option,
        value: option
      }))
    }
  },
  methods: {
    /* 
    Method to get jokes of a category
    @params: level - string - indicating initial load / other pages
    */
    async getAllJokes(level) {
      let apiURL = constants.BASE_URL + constants.api.categories;
      apiURL = apiURL.replace("category", this.endpoint).replace("skip", this.jokesList.length).replace("count", this.jokesCount)
      if (level === "init") this.loadingResults = true
      try {
        const response = await axios.get(apiURL);
        if (response.data.length) {
          this.jokesList.push(...response.data)
          this.onSortSelection(this.selectedSortBy)
        }
        else
          this.fetchJokes = false

      } catch {
        // Error handler
      } finally {
        this.loadingResults = false;
      }
    },
    /* 
    Method to add rating for a joke
    @params: joke - object
    @params: index - number
    */
    addRating(joke, index) {
      this.currentJokeIndex = index;
      this.currentJoke = { ...joke };
      this.showRatingCard = true;
    },
    /* 
    Method to close rating dialog box
    @params: val- object - rated joke obj
    */
    closeRatingCard(val = null) {
      if (val) {
        this.jokesList[this.currentJokeIndex] = val
        this.jokesList = [...this.jokesList]
      }
      this.currentJokeIndex = null;
      this.showRatingCard = false;
      this.currentJoke = {};
    },
    /* 
    Method to sort jokes
    @params: val-string
    */
    onSortSelection(val) {
      if (val.value === "Latest to old") {
        this.jokesList = this.jokesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
      else if (val.value === "Old to latest") {
        this.jokesList = this.jokesList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      }
      else if (val.value === "Rating (High to low)") {
        this.jokesList = this.jokesList.sort((a, b) => new Date(b.rating) - new Date(a.rating))
      } else {
        this.jokesList = this.jokesList.sort((a, b) => new Date(a.rating) - new Date(b.rating))
      }
    },
    /* 
    Method called on scroll to fetch more jokes
    @params: none
    */
    pageScroll() {
      try {
        const scrollHeight = this.$refs.scrollContainer.scrollHeight;
        const scrollTop = this.$refs.scrollContainer.scrollTop;
        const clientHeight = this.$refs.scrollContainer.clientHeight;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
          this.getAllJokes("");
        }
      }
      catch {
        // Scroll error handler
      }
    },
    /* 
    Method to close add joke dialogbox
    @params: joke - object - newly added joke object
    */
    closeAddJokePopup(joke = null) {
      this.showAddJokePopup = false;
      if (joke) {
        this.jokesList.unshift(joke)
      }
    }
  },
}
</script>
<style lang="scss">
.list-jokes {
  height: 85vh;
  /* Adjust height as needed */
  overflow-y: auto;

  .content-loader {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .close-icon {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .btns-section {
    align-items: center;
    display: flex;
    justify-content: space-between;

    .category-msg {
      font-size: 18px;
      padding: 10px 20px;
      border-radius: 15px;
    }
  }

  .sort-dd {
    width: 300px;
    margin-left: 10px;
  }

  .rating {
    margin-left: 5px;
    font-size: 16px;
    font-weight: 500;
  }
}

.loader-section {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>