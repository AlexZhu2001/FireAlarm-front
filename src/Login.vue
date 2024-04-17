<script setup>
import { ref } from 'vue';
import axios, { isCancel, AxiosError } from 'axios';
import jsSHA from 'jssha';

const requests = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 1000 * 30,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

const loginData = ref({
    username: "",
    password: ""
});

const resetAll = () => {
    loginData.value = {
        username: "",
        password: ""
    };
};

const showError = ref(false);
const errMsg = ref(false);

const submit = () => {
    const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
    var name = loginData.value.username;
    var pwd = loginData.value.password;
    var hash_pwd = shaObj.update(pwd).getHash('HEX');
    requests.post("/login",
        {
            "name": name,
            "hash_pwd": hash_pwd
        })
        .then((response) => {
            if (response.data.code == 0) {
                window.location="/";
            } else {
                errMsg.value = response.data.status;
                showError.value = true;
                setTimeout(() => { showError.value = false; }, 3000);
            }
        }).catch(function (error) {
            console.log(error);
        });
};

</script>

<template>
    <div class="container">
        <el-card class="login-box">
            <div style="text-align: center;">
                <h2>Login</h2>
                <el-divider />
            </div>
            <el-form label-width="auto" label-position="right">
                <el-form-item label="Username">
                    <el-input class="input" placeholder="Please input username" v-model="loginData.username" />
                </el-form-item>
                <el-form-item label="Password">
                    <el-input class="input" type="password" placeholder="Please input password" show-password
                        v-model="loginData.password" />
                </el-form-item>
                <div class="btn-box">
                    <el-button type="primary" @click="submit">Submit</el-button>
                    <el-button @click="resetAll">Reset</el-button>
                </div>
            </el-form>
        </el-card>
    </div>
    <div class="alert-error" v-if="showError">
        <el-alert title="Login error" type="error" :description="errMsg" effect="dark" :closable="false"/>
    </div>
</template>

<style scoped>
.container {
    width: 100vw;
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-box {
    width: 40%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.input {
    width: 240px;
}

.btn-box {
    width: 100%;
    display: flex;
    justify-content: center !important;
}

.alert-error {
    position: fixed;
    top: 5vh;
    left: 38%;
    width:24%;
}
</style>