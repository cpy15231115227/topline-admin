<template>
  <div class="login-wrap">
    <!-- 给组件加 class ，会把这个 class 作用到根元素上 -->
    <div class="form-wrap">
      <div class="form-head">
        <img src="../../assets/logo_index.png" alt="黑马头条号">
      </div>
    <!--
        配置校验规则
          rules 规则对象配置到 el-form 上
          rules 规则对象配置到 el-form 上, rules 中配置的校验字段必须和表单数据对象保持一致
          prop  校验字段配置到 el-form-item 上
        JavaScript 触发验证
          给 el-form 添加 ref
          调用 this.$refs['ref名字'].validate(valid => {}) 触发验证
    -->
    <el-form
    class="form-content"
    ref="form"
    :model="form"
    :rules="rules">
      <el-form-item prop="mobile">
        <el-input v-model="form.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <!-- el-col 栅格布局，一共 24 列，:span 用来指定占用的大小，:offset 用来指定偏移量 -->
        <el-col :span="14">
        <el-input v-model="form.code" placeholder="验证码"></el-input>
        </el-col>
        <el-col :offset="1" :span="9">
          <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
          <el-button
          @click="handleSendCode"
          :disabled="!!codeTimer"
          >{{ codeTimer ? `剩余${codeTimeSeconds}秒` : '获取验证码' }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item prop="agree">
          <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
          <span class="agree-text">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
        </el-form-item>
      <el-form-item>
        <el-button class="btn-login" type="primary" @click="headleLogin">登陆</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt.js' // 引入极验 Javascript SDK 文件，通过 window.initGeetest 使用
const initCodeTimeSeconds = 5

export default {
  name: 'AppLogin',
  data () {
    return {
      form: { // 表单数据对象
        mobile: '15231115227',
        code: ''
      },
      rules: { // 验证规则
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { len:11, message: '长度必须为11位', trigger: 'blur' }
          { pattern: /\d{11}/, message: '请输入有效的手机号码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          // { len:6, message: '长度必须为6位', trigger: 'blur' }
          { pattern: /\d{6}/, message: '请输入有效的验证码', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议' },
          // { len:6, message: '长度必须为6位', trigger: 'blur' }
          { pattern: /true/, message: '请同意用户协议' }
        ]
      },
      codeTimer: null, // 倒计时定时器
      codeTimeSeconds: initCodeTimeSeconds // 倒计时时间
    }
  },

  methods: {
    headleLogin () {
      // console.log('headleLogin')
      // 使用 form 组件的 validate 方法触发校验，获取校验的状态
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录请求
        this.submitLogin()
      })
    },

    submitLogin () {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => { // >=200 && < 400 的状态码会进入 then 成功
        console.log(res.data)
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      })
        .catch((e) => {
          this.$message.error('登陆失败，手机号或验证错误')
        }) // >= 400 的状态码都会进入这里
    },

    handleSendCode () {
      // 验证手机号是否有效
      this.$refs['form'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }

        // 验证码通过 ，初始化验证码
        this.showGeetest()
      })
    },

    showGeetest () {
      // 任何函数（如：普通函数，箭头函数）中的 function 函数内部的 this 指向 widow
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // console.log(res.data)
        const { data } = res.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏，直接弹出式
        }, captchaObj => {
          // console.log(captchas)
          // 验证对象   这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(() => {
            // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify() // 弹出验证码内容框
          }).onSuccess(() => {
            // your code
            // 这个数据用于短信验证码，发短信用的
            // 人机交互验证通过
            // console.log(captchaObj.getValidate())
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate
            } = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {
              // 发送短信成功，开始倒计时
              // console.log(res.data)
              this.codeCountDown()
            })
          }).onError(function () {
            // your code
          })

          // 在这里注册 “发送验证码” 按钮的点击事件，然后验证用户是否输入手机号以及手机号格式是否正确，没有问题
          // captchaObj.verify
        })
      })
    },

    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        if (this.codeTimeSeconds <= 0) {
          // 清楚定时器
          window.clearInterval(this.codeTimer)
          // 让倒计时的时候回归初始状态
          this.codeTimerSeconds = initCodeTimeSeconds
          // 将存储定时器引用的变量重新赋值为 null
          this.codeTimer = null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
  .login-wrap {
      height: 100%;
      background-image: url(../../assets/1560911791630.jpg);
      background-repeat: no-repeat;
      // background-size有两个值，背景图的width和height，可以用像素（px）、百分比（%）或是auto，还可以是cover和contain
      // 图片大小不是按背景图片大小的百分数来计算的，而是装载背景图的元素的百分比来计算。
      // background-size:50% 100%;
      // background-size:100px 100px;
      // 保持图像的宽高比例，将图片缩放到宽或者高正好适应定义背景的区域，但背景仍在定义的区域之内，被包含
      // background-size:contain;
      // 保持图像的宽高比例，将图片缩放到正好完全覆盖定义的背景区域，其中有一边和背景相同
      background-size:cover;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .form-head {
        display: flex;
        justify-content: center;
        align-content: center;
        margin-bottom: 10px;
        img {
          width: 200px;
        }
      }
      .form-wrap {
        width: 400px;
        background-color: #FDF8C0;
        padding: 20px;
        border-radius: 10px;
        .agree-checkbox {
          margin-right: 10px;
        }
        .agree-text {
          font-size: 16px;
          color: #999;
        }
        .btn-login {
          width: 100px;
        }
      }
  }
</style>
