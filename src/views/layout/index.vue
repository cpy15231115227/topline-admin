<template>
    <el-container>
      <el-aside width="200px">
          <!-- 侧边栏 -->
          <AppAside/>
      </el-aside>
      <el-container>
          <!-- 头部 -->
        <el-header>
            <AppHeader/>
        </el-header>
        <!-- 内容 -->
        <el-main>
          <!-- Home \ 发布文章 、文章类表、 评论 、 。。。。都显示在这里  -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'

export default {
  name: 'AppLayout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
  .el-container {
      height: 100%;
  }
  .el-aside {
    background-color: #343a46;
  }
  .el-container {
    background-color: #aec0d1;
  }
  .el-main {
  background-color: #e8eff4;
  }
</style>
