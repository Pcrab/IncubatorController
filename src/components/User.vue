<template>
  <div class="user">
    <div class="outer">
      <div class="input_box">
        <input v-model="username" type="text" id="username" required/>
        <label for="username">用户名</label>
      </div>

      <div class="input_box">
        <input v-model="pwd1" :type="inputType" id="password" @blur="checkpwd" required/>
        <label for="password">密码</label>
        <img alt="toggle password visibility" id="hover" @mouseenter="enter" @mouseleave="leave" :src="srcUrl"/>
      </div>

      <div class="input_box" v-if="register">
        <input v-model="pwd2" :type="inputType" id="password-repeat" @blur="checkpwd" required/>
        <label for="password-repeat">重复密码</label>
      </div>

      <div class="input_box" v-if="register">
        <input v-model="serialNumber" type="text" id="serialNumber" @blur="checkSerialNumber($event)" required/>
        <label for="serialNumber">序列号</label>
      </div>

      <div v-if="errorContent !== ''" class="errorContent">{{ errorContent }}</div>
      <div id="login" @click="btnClick">{{ btnContent }}</div>
      <div>
        <span>{{ linkPrefix }}</span>
        <a href="javascript:void(0)" @click="toggleregister">{{ linkSuffix }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import jsSHA from "jssha"
import show from "../assets/eye_show.svg"
import hide from "../assets/eye_hide.svg"

const user = {
  name: 'User',
  data() {
    return {
      register: false,
      srcUrl: hide,
      inputType: "password",
      errorContent: "",
      username: "",
      pwd1: "",
      pwd2: "",
      serialNumber: "",
    }
  },
  emits: ["redirect"],
  computed: {
    btnContent() {
      return this.register ? "注册" : "登录"
    },
    linkPrefix() {
      return this.register ? "已有账号？" : "没有账号？"
    },
    linkSuffix() {
      return this.register ? "返回登录" : "点击注册"
    },
  },
  methods: {
    enter() {
      this.srcUrl = show
      this.inputType = "text"
    },
    leave() {
      this.srcUrl = hide
      this.inputType = "password"
    },
    checkpwd() {
      let hasError = true
      if (this.pwd1 === "" && this.pwd2 === "") {
        chPwdSyntax(false)
        this.errorContent = ""
        return
      }
      if (this.register) {
        hasError = this.pwd1 !== this.pwd2
        chPwdSyntax(hasError)
        this.errorContent = hasError ? "两次密码不一致" : ""
        if (hasError) return
      }
      hasError = !isValidPassword(this.pwd1)
      chPwdSyntax(hasError)
      this.errorContent = hasError ? "密码格式有误" : ""
    },
    checkSerialNumber(e) {
      // let serialNumber = document.getElementById("serialNumber")
      if (!isValidSerialNumber(this.serialNumber) && this.serialNumber !== "") {
        this.errorContent = "序列号格式错误"
        e.currentTarget.style.color = "red"
      } else {
        e.currentTarget.style.color = "black"
      }
    }
    ,
    toggleregister() {
      this.register = !this.register
    }
    ,
    btnClick() {
      console.log("clicked!")
      if (this.register) {
        if (!isValidUsername(this.username) || !isValidPassword(this.pwd1) || this.pwd1 !== this.pwd2 || !isValidSerialNumber(this.serialNumber)) {
          return
        }
        let user = {username: this.username, password: this.encrypt(this.pwd1), serialNumber: this.serialNumber}
        fetch(this.$uri + "/user/create", {
          credentials: "include",
          method: "POST",
          mode: "cors", headers: {
            "Content-Type": "application/json",
          }, body: JSON.stringify(user)
        })
            .then(response => {
              if (response.ok) {
                this.register = false
              } else {
                response.text().then(errorMsg => {
                  this.errorContent = errorMsg
                })
              }
            })
      } else {
        if (!isValidUsername(this.username) || !isValidPassword(this.pwd1)) {
          return
        }
        let user = {username: this.username, password: this.encrypt(this.pwd1)}
        fetch(this.$uri + "/user/login", {
          credentials: 'include',
          method: 'POST', mode: 'cors', headers: {
            'Content-Type': 'application/json',
          }, body: JSON.stringify(user)
        }).then(response => {
          if (response.ok) {
            console.log(this.$uri)
            this.$emit("redirect", "控制台")
          } else {
            console.log("not ok!")
            response.text().then(errorMsg => {
              this.errorContent = errorMsg
            })
          }
        })
      }
    },
    encrypt(string) {
      const shaObj = new jsSHA("SHA3-512", "TEXT", {encoding: "UTF8"})
      shaObj.update(string)
      const result = shaObj.getHash("HEX")
      console.log(result)
      return result
    }
  }
}
export default user

function chPwdSyntax(hasError) {
  let pwd1 = document.getElementById("password")
  let pwd2 = document.getElementById("password-repeat")
  let style = hasError ? "red" : "black"
  pwd1.style.color = style
  if (pwd2 !== null) {
    pwd2.style.color = style
  }
}

function isValidUsername(username) {
  if (username.length <= 0) {
    return false
  }
  for (const c in username) {
    const char = username[c]
    if (!char.match(/[0-9]/) && !char.match(/[a-z]/i)) {
      return false
    }
  }
  return true
}

function isValidPassword(password) {
  if (password.length <= 0) {
    return false
  }
  let hasDigit = false
  let hasLetter = false
  for (const c in password) {
    const char = password[c]
    if (char.match(/[0-9]/)) {
      hasDigit = true
    } else if (char.match(/[a-z]/i)) {
      hasLetter = true
    }
  }
  return hasDigit && hasLetter
}

function isValidSerialNumber(serialNumber) {
  return serialNumber.match(/\d{4}-\d{4}-\d{4}-\d{4}/)
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#hover {
  width: 1em;
}

.outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid black;
  border-radius: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07),
  0 2px 4px rgba(0, 0, 0, 0.07),
  0 4px 8px rgba(0, 0, 0, 0.07),
  0 8px 16px rgba(0, 0, 0, 0.07),
  0 16px 32px rgba(0, 0, 0, 0.07),
  0 32px 64px rgba(0, 0, 0, 0.07);
  margin: 5% 10% 0 10%;
  padding: 8% 18%;
}

.outer .input_box {
  position: relative;
  /*margin-bottom: 5%;*/
  width: 100%;
}

.outer .input_box input {
  outline: none;
  border: none;
  padding: 10px 0;
  width: 100%;
  font-size: 16px;
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
}

.outer .input_box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  pointer-events: none;
  transition: all 0.3s;
}

.outer .input_box img {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px 0;
  /*pointer-events: none;*/
  transition: all 0.3s;
}

.outer .input_box input:focus + label,
.outer .input_box input:valid + label {
  top: -20px;
  font-size: 12px;
}

.outer .input_box input:focus ~ img,
.outer .input_box input:valid ~ img {
  right: -1em;
}

#login {
  position: relative;
  border: black solid 2px;
  width: 80%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  transition: all 0.2s;
}

#login:hover {
  border-radius: 5px;
  box-shadow: 0 0 4px;
}

.errorContent {
  margin-bottom: 5%;
}

#login + div {
  margin-top: 5%;
}

#login + div >>> a {
  text-decoration: none;
  color: #003E19;
  font-weight: bold;
}
</style>
