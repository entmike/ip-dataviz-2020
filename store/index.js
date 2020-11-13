// store/index.js
export const state = () => ({
  datasets: {
    points: [],
    calData: [],
  },
  radius: 1000,
  home: { lat: 37.774546, lng: -122.433523 },
  pegman: { lat: 37.774546, lng: -122.433523 },
  usePegman: false,
  neighborhoods: {},
  rightDrawer: false,
})

export const mutations = {
  setDatasets(state, datasets) {
    state.datasets = datasets
  },
  setRightDrawer(state, v) {
    state.rightDrawer = v
  },
  setUsePegman(state, val) {
    state.usePegman = val
  },
  setHome(state, home) {
    state.datasets = home
  },
  setPegman(state, val) {
    state.pegman = val
  },
  setNeighborhoods(state, val) {
    state.neighborhoods = val
  },
  setRadius(state, val) {
    state.radius = val
  },
}

export const getters = {
  getDatasets(state) {
    return state.datasets
  },
  getHome(state) {
    return state.home
  },
  getRightDrawer(state) {
    return state.rightDrawer
  },
  getPegman(state) {
    return state.pegman
  },
  getUsePegman(state) {
    return state.usePegman
  },
  getNeighborhoods(state) {
    return state.neighborhoods
  },
  getRadius(state) {
    return state.radius
  },
}
