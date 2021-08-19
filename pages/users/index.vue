<template>
  <section class="container">
    <div>
      <h1 class="title">
        {{ title }}
      </h1>
      <p>
        {{ tratamento }}
      </p>
      <nuxt-link class="button" to="/">
        Homepage
      </nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  async asyncData ({ $axios }) {
    const data = await $axios.$get('/tratamento')
    return { tratamento: data }
  },
  head () {
    return {
      title: 'Tratamento'
    }
  }
}
</script>
