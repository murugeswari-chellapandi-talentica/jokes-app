<template>
    <q-dialog v-model="showPopup">
        <q-card style="width: 600px;" class="bg-white">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Add New Joke</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="showPopup = false" />
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="q-pa-md" style="max-width: 400px">

                    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                        <q-select color="orange" outlined  v-model="selectedCategory" :options="categories" label="Category" />
                        <q-input filled v-model="setup" label="Setup" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please type something']" />

                        <q-input filled v-model="punchLine" lazy-rules label="Punchline"
                            :rules="[val => val && val.length > 0 || 'Please type something']" />

                        <div>
                            <q-btn rounded label="Submit" type="submit" class="bg-custom-yellow text-black" />
                            <q-btn rounded label="Reset" type="reset" class="bg-custom-yellow text-black q-ml-sm"
                                flat />
                        </div>
                    </q-form>

                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script>
import constants from '@/constants';
import axios from 'axios';
import {
    QBtn, QCard, QDialog, QCardSection, QCardActions, QForm, QInput, QSelect, Notify, QSpace
} from 'quasar';
export default {
    name: "AddJoke.vue",
    props: {
        category: {
            type: String,
            default: ""
        }
    },
    components: {
        QBtn, QCard, QDialog, QCardSection, QCardActions, QForm, QInput, QSelect, QSpace
    },
    data() {
        return {
            categories: [],
            showPopup: false,
            setup: null,
            punchLine: null,
            selectedCategory: null
        }
    },
    created() {
        this.showPopup = true;
        if (this.category) {
            this.selectedCategory = this.category
        }
        else this.getAllCategories();
    },
    methods: {
        /* 
        Method to get all categories from api
        @params: none
        */
        async getAllCategories() {
            const apiURL = constants.BASE_URL + constants.api.types
            try {
                const response = await axios.get(apiURL);
                this.categories = response.data.map(item => ({
                    label: item,
                    value: item
                }))
            } catch (error) {
                // Error handler
            }
        },
        /* 
        Method to emit event to close popup
        @params: none
        */
        closePopup() {
            this.$emit("closePopup")
        },
        /* 
        Method to call api on adding a joke
        @params: none
        */
        async onSubmit() {
            const apiURL = constants.BASE_URL + constants.api.addJoke
            const reqParams = {
                type: this.selectedCategory?.value || this.selectedCategory,
                setup: this.setup,
                punchline: this.punchLine
            }
            this.loadingResults = true
            try {
                const response = await axios.post(apiURL, reqParams);
                this.$emit("closePopup", response?.data?.joke)
                Notify.create({
                    color: 'positive',
                    textColor: 'white',
                    icon: 'done',
                    position: 'top-right',
                    message: 'Your joke has been added successfully'
                })

            } catch (error) {
                Notify.create({
                    color: 'negative',
                    textColor: 'white',
                    position: 'top-right',
                    message: 'There was an unexpected error. Please try adding again.'
                })
            } finally {
                this.loadingResults = false;
                this.closePopup();
            }
        },
        /* 
        Method to reset add joke form
        @params: none
        */
        onReset() {
            this.setup = null
            this.punchLine = null
        },
    },
    watch: {
        showPopup(val) {
            if (!val) {
                if (!val) this.closePopup()
            }
        }
    }
}
</script>
<style lang="scss">
.api-endpoints {
    text-decoration: underline;
    color: #009688;
    cursor: pointer;
}
</style>