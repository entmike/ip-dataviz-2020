// store/index.js
export const state = () => ({
  datasets: {
    points: [],
    calData: [],
  },
  home: { lat: 37.774546, lng: -122.433523 },
  pegman: { lat: 37.774546, lng: -122.433523 },
  usePegman: false,
})

export const mutations = {
  setDatasets(state, datasets) {
    console.log(datasets)
    state.datasets = datasets
  },
  setUsePegman(state, val) {
    console.log(val)
    state.usePegman = val
  },
  setHome(state, home) {
    console.log(home)
    state.datasets = home
  },
  setPegman(state, val) {
    console.log(val)
    state.pegman = val
  },
}

export const getters = {
  getDatasets(state) {
    return state.datasets
  },
  getHome(state) {
    return state.home
  },
  getPegman(state) {
    return state.pegman
  },
  getUsePegman(state) {
    return state.usePegman
  },
}
