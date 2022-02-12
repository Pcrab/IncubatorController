<template>
  <div class="incubators">
    Incubators
    <div @click="refresh">获取</div>
    <div @click="logout">登出</div>
    <div>{{ result }}</div>
  </div>
</template>

<script>
export default {
  name: 'Incubators',
  data() {
    return {
      result: "",
    }
  },
  methods: {
    refresh() {
      fetch(this.$uri + "/user/incubator", {
        method: "GET", mode: "cors", credentials: "include"
      }).then(response => {
        if (response.ok) {
          response.json().then(json => {
            console.log(json.incubators)
          })
        } else {
          response.text().then(text => {
            console.log(text)
          })
        }
          })
    },
    logout() {
      fetch(this.$uri + "/user/logout", {
        method: "GET", mode: "cors", credentials: "include"
      }).then(response => {
        if (response.ok) {
          console.log("Logout succeeded")
          location.reload()
        } else {
          response.text().then(text => {
            this.result = text
          })
        }
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
