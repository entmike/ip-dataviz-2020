<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          IP Vizathon 2020 - San Francisco Crime
        </v-card-title>
        <v-card-text>
          <p>Some fancy description</p>
          <p>
            For more information on data used, visit these links:
            <li>
              <a
                href="https://vuetifyjs.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                San Francisco Incidents Dataset
              </a>
            </li>
            <li>
              <a
                href="https://vuetifyjs.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                San Francisco Incidents Dataset 2
              </a>
            </li>
          </p>

          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/entmike/ip-dataviz-2020/issues"
              target="_blank"
              rel="noopener noreferrer"
              title="issues"
            >
              issue board </a
            >.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/inspire"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo,
  },
}
</script>
