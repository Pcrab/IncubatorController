<template>
  <div id="titlebar">
    <img alt="Incubator Controller Logo" src="./assets/holly.svg" />
    <span>植物培育箱{{ hyphen }}{{ title }}</span>
  </div>

  <User v-if="title === '登录'" @redirect="redirect" />
  <Incubators v-else-if="title === '控制台'" @redirect="redirect" />
  <Homepage v-else @redirect="redirect" />
</template>

<script>
import Homepage from "@/components/Homepage";
import Incubators from "@/components/Incubators";
import User from "@/components/User";

export default {
  name: "App",
  components: { User, Incubators, Homepage },
  data() {
    return {
      // title: "登录",
      title: "",
    };
  },
  computed: {
    hyphen() {
      return this.title === "" ? "" : " - ";
    },
  },
  methods: {
    redirect(title) {
      console.log(this.$uri);
      console.log("redirect to " + title);
      this.title = title;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400;500;700;900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@100;300;400;500;700;900&display=swap");

@media (max-width: 499px) {
  #app {
    width: 95%;
  }

  #titlebar {
    flex-direction: column;
    font-size: 1.7em;
    margin: 5% auto 0;
  }
  #titlebar > img {
    width: 40%;
    max-width: 80px;
  }
}

@media (min-width: 500px) {
  #app {
    width: 80%;
  }

  #titlebar {
    flex-direction: row;
    font-size: 2em;
    height: 2em;
    margin: 5% auto 0;
  }
  #titlebar > img {
    height: 100%;
  }
  #titlebar > span {
    margin-left: 1em;
  }
}

* {
  padding: 0;
  margin: 0;
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
  margin: auto;
}

#titlebar {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#titlebar > img {
  aspect-ratio: 1;
}
</style>
