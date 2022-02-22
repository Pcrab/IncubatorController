<template>
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
      <div v-if="canEdit" id="refresh" class="btn" @click="refreshControl" style="cursor:pointer;">刷新</div>
      <div id="logout" class="btn" @click="logout" style="cursor:pointer;">登出</div>
    </div>
  </div>

  <div v-if="!canEdit">
    <div v-for="incubator in incubators" :key="incubator.id" class="incubatorGroup">
      <div v-for="(value, key) in incubator" :key="key">
        {{ incubatorWord[key][0] }}: &nbsp;
        {{ incubatorValue(key, value) }}
        {{ incubatorWord[key][1] }}
      </div>
    </div>
  </div>
  <div v-else>
    <div v-for="incubatorControl in incubatorControls" :key="incubatorControl.id" class="incubatorGroup">
      <div v-for="(value, key) in incubatorControl" :key="key">
        {{ incubatorControlWord[key][0] }}: &nbsp;
        <div v-if="key !== 'id' && key !== 'light' && key !== 'dust'"
             @click="changeValue(key, value, incubatorControl.id, '--')" class="opt double">--
        </div>
        <div v-if="key !== 'id'" @click="changeValue(key, value, incubatorControl.id, '-')" class="opt single">-</div>
        {{ incubatorControlValue(key, value) }}
        {{ incubatorControlWord[key][1] }}
        <div v-if="key !== 'id'" @click="changeValue(key, value, incubatorControl.id, '+')" class="opt single">+</div>
        <div v-if="key !== 'id' && key !== 'light' && key !== 'dust'"
             @click="changeValue(key, value, incubatorControl.id, '++')" class="opt double">++
        </div>
      </div>
    </div>
    <div class="btn submit" @click="submit">确认修改</div>
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
      incubatorWord: {
        "id": ["ID", ""],
        "mode": ["模式", ""],
        "temperature": ["温度", "°C"],
        "co2": ["二氧化碳", "ppm"],
        "dust": ["土壤湿度", ""],
        "light": ["光照强度", ""],
        "water": ["水量", ""],
        "pi": ["PI膜", ""],
        "fan1": ["风扇1", ""],
        "fan2": ["风扇2", ""],
        "pump": ["水泵", ""],
        "beep": ["蜂鸣器", ""],
        "led": ["灯光", ""],
      },
      incubatorControls: {},
      incubatorControlWord: {
        "id": ["ID", ""],
        "temperatureLow": ["最低温度", "°C", 0, 40, 1, 0.1],
        "temperatureHigh": ["最高温度", "°C", 0, 40, 1, 0.1],
        "light": ["光照强度阈值", "", 0, 1, "低", "高"],
        "dust": ["土壤湿度阈值", "", 0, 1, "低", "高"],
      },
      clk: 0,
    }
  },
  emits: ["redirect"],
  methods: {
    incubatorValue(key, value) {
      if (key === "mode") {
        if (value === 0) {
          return "水培"
        } else {
          return "土培"
        }
      } else if (value === false) {
        return "关闭"
      } else if (value === true) {
        return "开启"
      }
      return value
    },
    incubatorControlValue(key, value) {
      if (key === "light" || key === "dust") {
        return this.incubatorControlWord[key][value + 4]
      }
      return value
    },
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
    refreshControl() {
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
      let incubatorControlGroup = {serialNumber: this.serialNumber, incubatorControls: this.incubatorControls}
      this.incubatorControls.forEach(incubatorControl => {
        if (incubatorControl.temperatureHigh < incubatorControl.temperatureLow ||
            incubatorControl.temperatureLow < 0 ||
            incubatorControl.temperatureHigh > 40) {
          throw new Error("")
        }
        if (incubatorControl.dust < 0 || incubatorControl.dust > 1 ||
            incubatorControl.light < 0 || incubatorControl.light > 1) {
          throw new Error("")
        }
      })
      console.log(incubatorControlGroup)
      fetch(this.$uri + "/user/incubatorControl", {
        method: "POST", mode: "cors", credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }, body: JSON.stringify(incubatorControlGroup)
      })
    },
    changeValue(key, value, id, operator) {
      let tmp = this.incubatorControls[id][key]
      if (key !== "light" && key !== "dust") {
        if (operator === '++') {
          tmp += this.incubatorControlWord[key][4]
        } else if (operator === '+') {
          tmp += this.incubatorControlWord[key][5]
        } else if (operator === '-') {
          tmp -= this.incubatorControlWord[key][5]
        } else if (operator === '--') {
          tmp -= this.incubatorControlWord[key][4]
        }
      } else {
        if (operator === '+') {
          tmp += 1;
        } else if (operator === '-') {
          tmp -= 1;
        }
      }

      if (tmp < this.incubatorControlWord[key][2]) {
        tmp = this.incubatorControlWord[key][2]
      } else if (tmp > this.incubatorControlWord[key][3]) {
        tmp = this.incubatorControlWord[key][3]
      }

      this.incubatorControls[id][key] = parseFloat(tmp.toFixed(1))
    }
  },
  created() {
    this.refresh()
    this.refreshControl()
    this.clk = self.setInterval(this.refresh, 3_000)
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

.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
  margin-left: 0;
}

.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
  right: 0;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
  }
}

@media (min-width: 768px) {
  .toolbar {
    flex-direction: row;
  }
}

.toolbar {
  display: flex;
  margin: 20px 0;
}

.toolbar > div {
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

.switch > div {
  margin-right: 0.5em;
}

.blank {
  flex: 1;
}

.btn:hover {
  background-color: #000000;
}

.incubatorGroup {
  display: flex;
  flex-direction: column;
}

.incubatorGroup > div {
  display: flex;
  height: 2em;
  line-height: 2em;
  margin-bottom: 0.5em;
}

.opt {
  margin: 0 0.3em;
  border-radius: 10px;
  border: 1px solid #000000;
  font-weight: bold;
}

.single {
  width: 1.2em;
}

.double {
  width: 1.8em;
}

.submit {
  width: 50%;
}

</style>
