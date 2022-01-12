<template>
  <div id="titlebar">
    <img alt="Incubator Controller Logo" src="./assets/holly.svg">
    <span>植物培育箱{{ hyphen }}{{ title }}</span>
  </div>

  <User v-if="title === '登录'" @redirect="redirect"/>
  <Incubators v-else-if="title === '控制台'" @redirect="redirect"/>
  <Homepage v-else @redirect="redirect"/>
</template>

<script>
import Homepage from "@/components/Homepage";
import Incubators from "@/components/Incubators";
import User from "@/components/User";

export default {
  name: 'App',
  components: {User, Incubators, Homepage},
  data() {
    return {
      title: ""
    }
  },
  computed: {
    hyphen() {
      return this.title === "" ? "" : " - "
    }
  },
  methods: {
    redirect(title) {
      console.log(this.$uri)
      console.log("redirect to " + title)
      this.title = title
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400;500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@100;300;400;500;700;900&display=swap');

*{
  padding:0;
  margin:0;
  box-sizing: border-box;
}

body {
  font-family: "Noto Sans SC", "Noto Serif SC", sans, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100%;
  width: 80%;
}

#titlebar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3.5em;
  margin-top: 5%;
}

#titlebar > img {
  position: absolute;
  left: 3%;
  top: 0;
  height: 100%;
  aspect-ratio: 1;
}

#titlebar > span {
  font-size: 2.5em;
  line-height: 3.5em;
}

</style>
