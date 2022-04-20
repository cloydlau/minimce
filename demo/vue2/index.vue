<template>
  <div>
    <MiniMCE
      v-model="value"
      v-bind="props"
    />

    <br>
    <button @click="value='<p>123</p><p>123</p>'">编程式设值</button>
    <button @click="value=''">清空</button>

    <p>{{ value }}</p>
    <p>{{ props }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '初始值',
      props: {
        readonly: false,
        disabled: false,
        apiKey: import.meta.env.VITE_APP_API_KEY,
      }
    }
  }
}
</script>

<style lang="scss">
/*@media (prefers-color-scheme: dark) {
  body {
    filter: invert(1) hue-rotate(180deg);
    color: white;
  }
  img {
    filter: invert(1) hue-rotate(180deg);
  }
}*/
</style>
