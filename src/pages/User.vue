<template>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="Login" name="login">
            <Login />
        </el-tab-pane>
        <el-tab-pane label="Signup" name="signup">
            <Signup @signup="activeName = 'login'" />
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from "element-plus";
import Login from "../components/user/Login.vue";
import Signup from "../components/user/Signup.vue";

const activeName = ref('login')

const handleClick = (tab: TabsPaneContext, event: Event) => {
    // console.log(tab, event)
}
</script>

<style>
.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
</style>