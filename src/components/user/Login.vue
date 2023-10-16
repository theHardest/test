<template>
    Login
    <el-form ref="formRef" :model="loginForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="User Name" prop="username" :rules="usernameRule">
            <el-input v-model="loginForm.username" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Password" prop="password" :rules="passwordRule">
            <el-input v-model="loginForm.password" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
            <el-button @click="resetForm(formRef)">Reset</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import axios from "axios";
import type { FormInstance } from "element-plus";
import { useUserStore } from "../../stores";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const formRef = ref<FormInstance>()

const loginForm = reactive({
    username: '',
    password: '',
})

const usernameRule = [
    { required: true, message: 'username is required' },
    { type: 'string', message: 'username must be a string' },
]
const passwordRule = [
    { required: true, message: 'password is required' },
    { type: 'string', message: 'password must be a string' },
]

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            console.log('submit!')
            const { data } = await axios.post("http://localhost:8888/user/login", loginForm).catch(error => error);
            userStore.token = data;

            router.push({ name: "Beer" });
        } else {
            console.log('error submit!')
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>