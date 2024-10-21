<template>
    <div>
        <q-dialog v-model="showRatingCard">
            <q-card style="width: 700px;" class="my-card text-black text-white bg-white"
            :backdrop-filter="backdropFilter"
            >
                <q-card-section class="rate-labels" v-if="!showEmojiAnimation">
                    <div class="col text-h6 ellipsis">
                        Rate us!
                    </div>
                    <p>How would you love this Joke?</p>
                    <q-rating v-model="stars" color="yellow" :max="5" size="3.5em" />
                    <q-btn class="q-mt-md" rounded flat label="No Thanks!" @click="showRatingCard = false" />
                </q-card-section>
                <q-card-actions v-if="!showEmojiAnimation" align="right">
                    <q-btn size="md" rounded class="bg-custom-yellow text-black" label="Submit"
                        @click="onSubmitRating" />
                </q-card-actions>
                <q-card-section v-if="jokeReply" class="joke-reply bg-custom-orange text-white" style="height: 100px">
                    <div class="text-h6">{{ jokeReply }}</div>
                </q-card-section>
            </q-card>
        </q-dialog>
        <EmojiAnimation v-if="showEmojiAnimation" />
    </div>
</template>
<script>
import EmojiAnimation from '@/components/EmojiAnimation.vue';
import constants from '@/constants';
import axios from 'axios';
import {
    QBtn, QSpace, QCard, QDialog, QCardSection, QRating, QCardActions
} from 'quasar';
export default {
    name: "RateJoke.vue",
    components: {
        EmojiAnimation,
        QBtn, QSpace, QCard, QDialog, QCardSection, QRating, QCardActions
    },
    props: {
        currentJoke: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            showRatingCard: true,
            stars: 0,
            showEmojiAnimation: false,
            jokeReplies: constants.configs.ratingReplies,
            jokeReply: ""
        }
    },
    watch: {
        showRatingCard(val) {
            if (!val) this.$emit("closeRatingCard")
        }
    },
    computed: {
        backdropFilter(){
            this.jokeReply ? 'blur(4px)' : ''
        }
    },
    methods: {
        /* 
        Method to call rating api
        @params: none
        */
        async onSubmitRating() {
            const apiURL = constants.BASE_URL + constants.api.addRating
            const reqParams = {
                id: this.currentJoke.id,
                rating: this.stars
            }
            this.loadingResults = true
            try {
                const response = await axios.post(apiURL, reqParams);
                if (this.stars < 4) {
                    this.$emit("closeRatingCard", response.data.joke)
                }
                else {
                    this.jokeReply = this.jokeReplies[Math.floor(Math.random() * this.jokeReplies.length)]
                    this.showEmojiAnimation = true;
                    setTimeout(() => {
                        this.showEmojiAnimation = false;
                        this.$emit("closeRatingCard", response.data.joke)
                    }, 2000);
                }
            } catch {
                this.showRatingCard = false;
            }
        },
    }
}
</script>
<style lang="scss">
.rate-labels {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.joke-reply {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>