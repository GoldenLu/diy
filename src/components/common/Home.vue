<template>

    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
          <v-tags></v-tags>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue'
import vSidebar from './Sidebar.vue'
import vTags from './Tags.vue'
import bus from './bus'
export default {
  data () {
    return {
      collapse: false
    }
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  created () {
    bus.$on('collapse-content', msg => {
      this.collapse = msg
    })
  }
}
</script>
