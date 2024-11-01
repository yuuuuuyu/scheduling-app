import { createApp, defineComponent, h } from "vue"
import App from "./App.vue"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import "./style.css"

const app = createApp(App)

app.use(ElementPlus).mount("#app")

