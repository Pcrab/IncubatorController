<template>
  <div>{{ result }}</div>

  <div class="toolbar">
    <div id="info">序列号: {{ serialNumber }}</div>
    <div class="blank"></div>
    <div class="switch">
      <div v-if="canEdit" id="refresh" class="btn" @click="refreshControl">刷新</div>
      <div>编辑</div>
      <div class="onoffswitch">
        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" v-model="canEdit"/>
        <label class="onoffswitch-label" for="myonoffswitch">
          <span class="onoffswitch-inner"></span>
          <span class="onoffswitch-switch"></span>
        </label>
      </div>

      <div class="blank"></div>
      <div id="logout" class="btn" @click="logout">登出</div>
    </div>
  </div>

  <div v-if="!canEdit">
    <div v-for="incubator in incubators" :key="incubator.id" class="incubatorGroup">
      <div v-for="(value, key) in incubator" :key="key"
           v-show="(incubator.mode === 0 && key !== 'dust') || (incubator.mode === 1 && key !== 'water')">
        {{ incubatorWord[key][0] }}: &nbsp;
        {{ incubatorValue(key, value) }}
        {{ incubatorWord[key][1] }}
      </div>
    </div>
  </div>
  <div v-else>
    <div v-for="incubatorControl in incubatorControls" :key="incubatorControl.id" class="incubatorGroup control">
      <div v-for="(value, key) in incubatorControl" :key="key"
           v-show="!(incubators[parseInt(incubatorControl.id)].mode === 0 && key === 'dust')">
        {{ incubatorControlWord[key][0] }}: &nbsp;
        <div v-if="key !== 'id' && key !== 'light' && key !== 'dust'"
             @click="changeValue(key, value, incubatorControl.id, '--')" class="opt double">--
        </div>
        <div v-else-if="key !== 'id'" class="double blankopt"></div>
        <div v-if="key !== 'id'" @click="changeValue(key, value, incubatorControl.id, '-')" class="opt single">-</div>
        <div>
          {{ incubatorControlValue(key, value) }}
          {{ incubatorControlWord[key][1] }}
        </div>
        <div v-if="key !== 'id'" @click="changeValue(key, value, incubatorControl.id, '+')" class="opt single">+</div>
        <div v-if="key !== 'id' && key !== 'light' && key !== 'dust'"
             @click="changeValue(key, value, incubatorControl.id, '++')" class="opt double">++
        </div>
        <div v-else-if="key !== 'id'" class="double blankopt"></div>
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
        "water": ["水位", ""],
        "pi": ["PI膜", ""],
        "fan1": ["风扇1", ""],
        "fan2": ["风扇2", ""],
        "pump": ["水泵", ""],
        "beep": ["蜂鸣器", ""],
        "led": ["灯光", ""],
        "time": ["开始时间", ""],
      },
      incubatorControls: {},
      incubatorControlWord: {
        "id": ["ID", ""],
        "temperatureLow": ["最低温度", "°C", 0, 40, 1, 0.1],
        "temperatureHigh": ["最高温度", "°C", 0, 40, 1, 0.1],
        "light": ["光照强度", "", 0, 1, "低", "高"],
        "dust": ["土壤湿度", "", 0, 1, "低", "高"],
        "days": ["培养天数", "天", 0, 1, "7", "10"],
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
      } else if (key === "light") {
        if (value === false) {
          return "明亮"
        } else {
          return "昏暗"
        }
      } else if (key === "dust") {
        if (value === false) {
          return "湿润"
        } else {
          return "干燥"
        }
      } else if (key === "water") {
        if (value === 0) {
          return "缺水"
        } else if (value === 1) {
          return "适宜"
        } else if (value === 11) {
          return "水满"
        }
      } else if (value === false) {
        return "关闭"
      } else if (value === true) {
        return "开启"
      }
      return value
    },
    incubatorControlValue(key, value) {
      if (key === "light" || key === "dust" || key === "days") {
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
            incubatorControl.light < 0 || incubatorControl.light > 1 ||
            incubatorControl.days < 0 || incubatorControl.days > 1) {
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
  background-color: #85B8CB;
  color: #FFFFFF;
  text-align: left;
}

.onoffswitch-inner:after {
  content: "OFF";
  padding-right: 8px;
  background-color: #FE7773;
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
  }

  .incubatorGroup {
    height: 20em;
  }

}

@media (min-width: 768px) {
  .toolbar {
    flex-direction: row;
  }

  .incubatorGroup {
    height: 13em;
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

.btn {
  cursor: pointer;
  border-radius: 10px;
  padding: 0 0.5em;
  transition: all 0.2s ease-in 0s;
}

.btn:hover {
  background-color: #D1DDDB;
}

.incubatorGroup {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 0.5em 2em 0.1em 2em;
  margin-bottom: 1em;
  border: 2px solid #283B42;
  border-radius: 20px;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07),
  0 2px 4px rgba(0, 0, 0, 0.07),
  0 4px 8px rgba(0, 0, 0, 0.07),
  0 8px 16px rgba(0, 0, 0, 0.07),
  0 16px 32px rgba(0, 0, 0, 0.07),
  0 32px 64px rgba(0, 0, 0, 0.07);
}

.control {
  height: 16em;
}

.incubatorGroup > div {
  display: flex;
  height: 2em;
  line-height: 2em;
  margin-bottom: 0.5em;
}

.opt {
  margin: 0 0.3em;
  border-radius: 5px;
  border: 1px solid #000000;
  font-weight: bold;
  width: 2em;
  line-height: calc(2em - 2px);
}

.blankopt {
  width: 2em;
  margin: 0 0.3em;
  border: 1px solid #ffffff;
}

.double + .single + div {
  width: 5em;
  text-align: center;
}

.submit {
  margin: 1em auto auto;
  padding: 0.5em 1em;
  width: 10em;
}
</style>
