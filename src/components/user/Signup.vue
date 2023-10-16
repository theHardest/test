<template>
    Signup
    <el-form ref="formRef" :model="signupForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="User Name" prop="username">
            <el-input v-model="signupForm.username" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
            <el-input v-model="signupForm.password" type="text" autocomplete="off" />
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

const formRef = ref<FormInstance>()

const signupForm = reactive({
    username: '',
    password: '',
})


const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            console.log('submit!')
            const { data } = await axios.post("http://localhost:8888/user/signup", signupForm).catch(error => error);
            // emit("signup");
            console.log(data);
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