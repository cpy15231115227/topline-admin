<template>
  <div class="login-wrap">
    <!-- 给组件加 class ，会把这个 class 作用到根元素上 -->
    <div class="form-wrap">
      <div class="form-head">
        <img src="../../assets/logo_index.png" alt="黑马头条号">
      </div>
    <el-form class="form-content" ref="form" :model="form">
      <el-form-item>
        <el-input v-model="form.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- el-col 栅格布局，一共 24 列，:span 用来指定占用的大小，:offset 用来指定偏移量 -->
        <el-col :span="14">
        <el-input v-model="form.code" placeholder="验证码"></el-input>
        </el-col>
        <el-col :offset="1" :span="9">
          <el-button @click="handleSendCode">获取验证码</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-login" type="primary" @click="onSubmit">登陆</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt.js' // 引入极验 Javascript SDK 文件，通过 window.initGeetest 使用

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '15231115227',
        code: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleSendCode () {
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
        }, function (captchaObj) {
          // console.log(captchas)
          // 验证对象   这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(function () {
            // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify() // 弹出验证码内容框
          }).onSuccess(function () {
            // your code
            // 这个数据用于短信验证码，发短信用的
            // 人机交换验证通过
            console.log(captchaObj.getValidate())
          }).onError(function () {
            // your code
          })

          // 在这里注册 “发送验证码” 按钮的点击事件，然后验证用户是否输入手机号以及手机号格式是否正确，没有问题
          // captchaObj.verify
        })
      })
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
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        .btn-login {
          width: 100px;
        }
      }
  }
</style>
