<template>
 <div>
   <p style="font-size: 3rem" @click="test">3 rem</p>
 </div>
</template>

<script>
export default {
  name: "test",
  methods:{
    test() {
      this.$message('ssss')
    }
  }
}
</script>

<style scoped>

</style>
