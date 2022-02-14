<template>
  <div class="incubators">
    <div>{{ result }}</div>

    <div class="toolbar">
      <div id="info">序列号: {{ serialNumber }}</div>
      <div class="blank"></div>
      <div class="switch">
        <div>编辑</div>
        <div class="onoffswitch">
          <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" v-model="canEdit"/>
          <label class="onoffswitch-label" for="myonoffswitch">
            <span class="onoffswitch-inner"></span>
            <span class="onoffswitch-switch"></span>
          </label>
        </div>

        <div class="blank"></div>
<!--        <div id="refresh" class="btn" @click="refresh" style="cursor:pointer;">刷新</div>-->
        <div id="logout" class="btn" @click="logout" style="cursor:pointer;">登出</div>
      </div>
    </div>

    <div v-if="!canEdit" id="group">
      <div v-for="incubator in incubators" :key="incubator.id">
        <div v-for="(item, key) in incubator" :key="key">{{item}}</div>
      </div>
    </div>
    <div v-else>
      <div v-for="incubatorControl in incubatorControls" :key="incubatorControl.id">
        <div v-for="(item, key) in incubatorControl" :key="key">{{item}}</div>
        {{ incubatorControl }}
      </div>
      <div @click="submit">确认修改</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Incubators',
  data() {
    return {
      result: "",
      canEdit: false,
      serialNumber: "",
      incubators: {},
      incubatorControls: {},
      clk: 0,
    }
  },
  emits: ["redirect"],
  methods: {
    refresh() {
      fetch(this.$uri + "/user/incubator", {
        method: "GET", mode: "cors", credentials: "include"
      }).then(response => {
        if (response.ok) {
          response.json().then(json => {
            this.serialNumber = json.serialNumber
            this.incubators = json.incubators
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
          this.$emit("redirect", "登录")
        } else {
          response.text().then(text => {
            this.result = text
          })
        }
      })
    },
    submit() {

    }
  },
  created() {
    this.refresh()
    this.clk = self.setInterval(this.refresh, 10_000)
    fetch(this.$uri + "/user/incubatorControl", {
      method: "GET", mode: "cors", credentials: "include"
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          this.incubatorControls = json.incubatorControls
          console.log(json.incubatorControls)
        })
      } else {
        response.text().then(text => {
          console.log(text)
        })
      }
    })
  },
  beforeUnmount() {
    window.clearInterval(this.clk)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.onoffswitch {
  position: relative;
  width: 10%;
  min-width: 65px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.onoffswitch-checkbox {
  display: none;
}

.onoffswitch-label {
  display: block;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #999999;
  border-radius: 5px;
}

.onoffswitch-inner {
  display: block;
  width: 200%;
  margin-left: -100%;
  transition: margin 0.3s ease-in 0s;
}

.onoffswitch-inner:before,
.onoffswitch-inner:after {
  display: block;
  float: left;
  width: 50%;
  height: 30px;
  padding: 0;
  line-height: 30px;
  font-size: 0.8em;
  color: white;
  font-family: Trebuchet, Arial, sans-serif;
  font-weight: bold;
  box-sizing: border-box;
}

.onoffswitch-inner:before {
  content: "ON";
  padding-left: 8px;
  background-color: #4FACDB;
  color: #FFFFFF;
  text-align: left;
}

.onoffswitch-inner:after {
  content: "OFF";
  padding-right: 8px;
  background-color: #F50E4C;
  color: #FAFAFA;
  text-align: right;
}

.onoffswitch-switch {
  display: block;
  width: 15%;
  min-width: 10px;
  margin: 4px 5px;
  background: #FFFFFF;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 68%;
  border: 2px solid #999999;
  border-radius: 3px;
  transition: all 0.3s ease-in 0s;
}

.onoffswitch-checkbox:checked+.onoffswitch-label .onoffswitch-inner {
  margin-left: 0;
}

.onoffswitch-checkbox:checked+.onoffswitch-label .onoffswitch-switch {
  right: 0;
}

@media (max-width: 768px){
  .toolbar{
    flex-direction: column;
  }
}
@media (min-width: 768px){
  .toolbar{
    flex-direction: row;
  }
}

.toolbar {
  display: flex;
  margin: 20px 0;
}

.toolbar>div {
  font-size: 1.1em;
  line-height: 34px;
  margin: 0 10px;
  text-align: left;
}

#info {
  text-align: left;
}

.switch {
  display: flex;
}

.switch>div {
  margin-right: 0.5em;
}

.blank {
  flex: 1;
}

</style>
