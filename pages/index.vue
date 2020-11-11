<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-img height="300" src="images/header.jpg"></v-img>
        <v-card-title class="headline">
          IP Vizathon 2020 - San Francisco Crime
        </v-card-title>
        <v-card-text>
          <p>A Quick and Dirty Visualization Application written in Nuxt.</p>
          <p>
            For more information on data used, visit these links:
            <li>
              <a
                href="https://data.sfgov.org/Public-Safety/Police-Department-Incident-Reports-2018-to-Present/wg3w-h783"
                target="_blank"
                rel="noopener noreferrer"
              >
                Police Department Incident Reports: 2018 to Present
              </a>
            </li>
            <li>
              <a
                href="https://data.sfgov.org/Public-Safety/Police-Department-Calls-for-Service/hz9m-tj6z"
                target="_blank"
                rel="noopener noreferrer"
              >
                Police Department Calls for Service
              </a>
            </li>
          </p>
          <p>
            Team:
            <li>Torbir Dhaliwal</li>
            <li>Vincent Dibella</li>
            <li>Reed Evans</li>
            <li>Bodan Kasich</li>
            <li>Mike Howles</li>
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
          <v-btn color="primary" nuxt to="/geo"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  components: {},
}
</script>
