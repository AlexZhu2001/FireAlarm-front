<script lang="js" setup>
import AlarmTab from './components/AlarmTab.vue';
import Condition from './components/Condition.vue';
import { ref } from "vue"
import axios, { isCancel, AxiosError } from 'axios';

const tableData = ref([]);
const showErrorMsg = ref(false);
const errorMsg = ref("");
const loading = ref(false);
const requests = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});
const username = ref('');

var current_conditons = null;

const getAlarmsFromServer = (params) => {
  loading.value = true;
  requests.get(
    '/alarm/',
    {
      params: params
    })
    .then(function (response) {
      tableData.value = response.data.alarms;
    })
    .catch(function (error) {
      showErrorMsg.value = true;
      errorMsg.value = `Cannot get data from api server, error: ${error.message}`;
      setTimeout(() => {
        showErrorMsg.value = false;
      }, 4000);
    })
    .finally(function () {
      loading.value = false;
    });
};

const deleteAlarmsFromServer = (ids) => {
  loading.value = true;
  requests.delete(
    '/alarm/',
    {
      data: ids
    })
    .catch(function (error) {
      showErrorMsg.value = true;
      errorMsg.value = `Cannot send data to api server, error: ${error.message}`;
      setTimeout(() => {
        showErrorMsg.value = false;
      }, 4000);
    })
    .finally(function () {
      loading.value = false;
      getAlarmsFromServer(current_conditons);
    });
};

const clearAlarmsFromServer = (ids) => {
  loading.value = true;
  requests.post('/alarm/clear/', ids)
    .catch(function (error) {
      showErrorMsg.value = true;
      errorMsg.value = `Cannot send data to api server, error: ${error.message}`;
      setTimeout(() => {
        showErrorMsg.value = false;
      }, 4000);
    })
    .finally(function () {
      loading.value = false;
      getAlarmsFromServer(current_conditons);
    });
};

const getUserInfoFromServer = () => {
  requests.get("/user_info").then(
    (response) => {
      username.value = response.data.name;
    }
  ).catch(function (error) {
    showErrorMsg.value = true;
    errorMsg.value = `Cannot get userinfo from api server, error: ${error.message}`;
    setTimeout(() => {
      showErrorMsg.value = false;
    }, 4000);
  });
};

const userLogout = () => {
  window.location="/logout";
}

getAlarmsFromServer();
getUserInfoFromServer();

</script>

<template>
  <div>
    <el-container>
      <el-header class="header" height="40px">
        <el-row>
          <el-col :span="4">
            <span style="font-size: xx-large; width: min-content; vertical-align: baseline;">Fire Alarm</span>
          </el-col>
          <el-col :span="18" />
          <el-col :span="2" class="btn-container">
            <el-button link style="width: min-content;" @click="userLogout">Hello {{ username }}, Logout</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div>
          <el-card>
            <Condition @onConditionChanged="(data) => { current_conditons = data; getAlarmsFromServer(data); }" />
          </el-card>
          <br />
          <el-card v-loading="loading" element-loading-text="Loading...">
            <AlarmTab :tableData="tableData" @onMarkDelete="(v) => { deleteAlarmsFromServer(v) }"
              @onMarkClear="(v) => { clearAlarmsFromServer(v) }" />
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
  <div class="float-alert">
    <Transition name="float">
      <el-alert title="Error" type="error" :description="errorMsg" show-icon :closable="false" v-if="showErrorMsg" />
    </Transition>
  </div>
</template>

<style scoped>
.float-alert {
  position: fixed;
  bottom: 50px;
  width: 50%;
  left: 25%;
  z-index: 999;
}

.float-enter-active,
.float-leave-active {
  transition: opacity 0.5s ease;
}

.float-enter-from,
.float-leave-to {
  opacity: 0;
}

.header {
  margin: 10px;
}

.btn-container {
  display: flex;
  align-items: end;
}
</style>