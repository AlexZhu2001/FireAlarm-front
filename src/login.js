import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import Login from "./Login.vue"
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(Login);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.mount("#app");
