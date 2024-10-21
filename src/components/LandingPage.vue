<template>
    <div class="full-height full-width">
        <div v-show="!showJokesList">
            <div class="joke-random">
                <div class="text-h3 q-my-lg">Joke of the day!!</div>
                <q-card rounded style="width: 80%" class="my-card joke-card bg-custom-yellow text-black">
                    <q-card-section class="flex items-center justify-center">
                        <p class="text-h6">{{ randomJoke.setup }}</p>
                    </q-card-section>
                    <q-card-section class="flex items-center justify-center">
                        <p class="text-h6">{{ randomJoke.punchline }}</p>
                    </q-card-section>
                </q-card>
            </div>
            <div class="flex justify-center q-mt-lg">
                <q-btn rounded class="bg-custom-yellow text-black" label="Want to share a Joke?"
                    @click="showAddJokePopup = true" />
            </div>
            <div v-if="categories.length" class="joke-random q-mt-md">
                <div class="text-h3">Jokes by Category</div>
                <div class="q-pa-md q-gutter-sm">
                    <q-btn rounded v-for="type in categories" :key="type" class="bg-custom-yellow text-black"
                        :label="type" @click="getCategoryJokes(type)" />
                </div>
            </div>
        </div>
        <div v-if="showJokesList">
            <ListJokes :endpoint="endpoint" />
        </div>
    </div>
    <AddJoke v-if="showAddJokePopup" @closePopup="showAddJokePopup = false" />
</template>
<script>
import ListJokes from './ListJokes.vue';
import AddJoke from './AddJoke.vue';
import axios from 'axios';
import { QCard, QCardSection, QSeparator, QCardActions, QBtn } from 'quasar';
import constants from "../../src/constants"
export default {
    name: "LandingPage.vue",
    props: {
        reload: {
            type: Boolean,
            default: false
        }
    },
    components: {
        ListJokes,
        AddJoke,
        QCard, 
        QCardSection, QSeparator, QCardActions, QBtn,
    },
    data() {
        return {
            randomJoke: {},
            endpoint: "",
            showJokesList: false,
            categories: [],
            showAddJokePopup: false
        }
    },
    created() {
        this.getAllCategories();
        this.getRandomJoke();
    },
    methods: {
        /* 
        Method to get a random joke from api
        @params: none
        */
        async getRandomJoke() {
            const apiURL = constants.BASE_URL + constants.api.random
            this.loadingResults = true
            try {
                const response = await axios.get(apiURL);
                this.randomJoke = response.data

            } catch {
                // Error handler
            } finally {
                this.loadingResults = false;
            }
        },
        /* 
        Method to get all categories from api
        @params: none
        */
        async getAllCategories() {
            const apiURL = constants.BASE_URL + constants.api.types
            try {
                const response = await axios.get(apiURL);
                this.categories = response.data
            } catch (error) {
                console.error(error);
            }
        },
        /* 
        Method called on button click of a category
        @params: type - string - category
        */
        getCategoryJokes(type) {
            this.endpoint = type;
            this.showJokesList = true;
        }
    },
    watch: {
        reload(val) {
            if (val) this.showJokesList = false;
        }
    }
}
</script>
<style lang="scss">
.joke-random {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
}

.punchline {
    font-size: 16px
}
</style>