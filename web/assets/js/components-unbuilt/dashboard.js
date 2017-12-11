import navBar from './nav-bar.vue'
import dashboard from './dashboard.vue'

Vue.use(require('vue-moment'));

new Vue({
  el: '#shuttle-signups-dashboard',
  components: {
    navBar,
    dashboard
  }
})