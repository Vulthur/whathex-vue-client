import Vue from 'vue'
import App from './components/App'

Vue.config.productionTip = false

const EventBus = new Vue()

export { EventBus }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App></App>',
  components: { App }
})