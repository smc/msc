import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        user: null,
        isAuthenticated: false,
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        setIsAuthenticated(state, payload) {
            state.isAuthenticated = payload;
        },
    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined;
        }
    }
});