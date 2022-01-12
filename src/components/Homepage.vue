<template>
  <div class="homepage">
    Homepage
    <div id="redirect" @click="redirect">登入控制台</div>
  </div>
</template>

<script>
export default {
  name: 'Homepage',
  created() {
  },
  emits: ["redirect"],
  methods: {
    redirect() {
      fetch(this.$uri + "/user/hello", {method: 'GET', mode: 'cors', credentials: 'include'})
          .then((response) => {
            if (response.ok) {
              this.$emit("redirect", "控制台")
            } else {
              this.$emit("redirect", "登录")
            }
          })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#redirect {
  margin: 5% auto;
  padding: 5px;
  font-size: 1.3em;
  border-radius: 10px;
  border: 1px solid #000000;
}
</style>
