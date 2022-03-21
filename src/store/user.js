export default {
    state() {
        return {
            userAddress: "",
            characterName: ""
        }
    },
    getters: {
        storeUserAddress(state) {
            return state.userAddress
        },
        characterName(state) {
            return state.characterName
        }
    },
    mutations: {
        setUserAddress(state, payload) {
            state.userAddress = payload
        },
        setCharacterName(state, payload) {
            state.characterName = payload
        }
    },
    actions: {
        setUserAddress(context, payload) {
            context.commit("setUserAddress", payload)
        }
    }
}