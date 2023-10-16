import { ref } from "vue";
import { defineStore } from "pinia";
export default defineStore(
    "user",
    () => {
        const token = ref<string>("");

        return {
            token,
        }
    },
    {
        persist: true,
    },
);