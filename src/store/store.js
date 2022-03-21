import { createStore } from "vuex";

import userStore from "./user"

const store = createStore({
    modules: {
        user: userStore
    }
})

export default store