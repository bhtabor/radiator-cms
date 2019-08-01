import restNetwork from '~/api/rest/networks'
import network from '~/api/queries/network.gql'
import networks from '~/api/queries/networks.gql'

export const state = () => ({
  activeNetwork: null,
  networks: [],
  networksCollaborators: []
})

export const mutations = {
  set_active_network(store, data) {
    store.activeNetwork = data
  },
  set_networks(store, data) {
    store.networks = data
  },
  set_networks_collaborators(store, data) {
    store.networksCollaborators = data
  }
}

export const getters = {
  activeNetwork: state => state.activeNetwork,
  networks: state => state.networks,
  networksCollaborators: state => state.networksCollaborators
}

export const actions = {
  /**
   * Creates a new network.
   * After successful creation:
   * saves the response as network in store,
   * dispatches action to get all networks.
   */
  create: async function create({ dispatch, commit }, data) {
    data.token = this.$apolloHelpers.getToken()
    try {
      const res = await restNetwork.create(data).then(data => {
        return data && data.data
      })
      await commit('set_active_network', res)
      await dispatch('getNetworks', {
        token: this.$apolloHelpers.getToken()
      })
    } catch (e) {
      throw Error(e)
    }
  },
  deleteNetwork: async function deleteNetwork({ dispatch }, data) {
    data.token = this.$apolloHelpers.getToken()
    try {
      await restNetwork.delete(data).then(data => {
        return data && data.data
      })
      await dispatch('getNetworks', {
        token: this.$apolloHelpers.getToken()
      })
    } catch (e) {
      throw Error(e)
    }
  },
  /**
   * Gets a network by id.
   * After successful request saves the network in store.
   */
  getNetwork: async function getNetwork({ commit }, data) {
    const client = this.app.apolloProvider.defaultClient
    try {
      const res = await client
        .query({
          query: network,
          variables: {
            id: data.id
          }
        })
        .then(({ data }) => data && data.network)
      await commit('set_active_network', res)
    } catch (e) {
      throw Error(e)
    }
  },
  /**
   * Gets all networks and saves them in store.
   */
  getNetworks: async function getNetworks({ commit, state }) {
    const client = this.app.apolloProvider.defaultClient
    try {
      const res = await client
        .query({
          query: networks
        })
        .then(({ data }) => data && data.networks)
      await commit('set_networks', res)
    } catch (e) {
      throw Error(e)
    }
  },
  update: async function update({ dispatch, commit }, data) {
    data.token = this.$apolloHelpers.getToken()
    try {
      const res = await restNetwork.update(data).then(data => {
        return data && data.data
      })
      await commit('set_active_network', res)
      await dispatch('getNetworks', {
        token: this.$apolloHelpers.getToken()
      })
    } catch (e) {
      throw Error(e)
    }
  }
}
