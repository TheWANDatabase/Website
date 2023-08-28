<script setup>
useHead({
  title: 'Home | The WAN DB',
  link: [
    {
      hid: 'canonical',
      property: 'canonical',
      content: 'https://thewandb.com/'
    }
  ],
  meta: [
    {
      hid: 'robots',
      property: 'robots',
      content: 'index, archive'
    },
    {
      hid: 'og-title',
      property: 'og:title',
      content: 'Home | The WAN DB'
    },
    {
      hid: 'twitter-title',
      property: 'twitter:title',
      content: 'Home | The WAN DB'
    },
    {
      hid: 'description',
      property: 'description',
      content: 'The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect.'
    },
    {
      hid: 'og-description',
      property: 'og:description',
      content: 'The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect.'
    },
    {
      hid: 'twitter-description',
      property: 'twitter:description',
      content: 'The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect.'
    },
    {
      hid: 'og-image',
      property: 'og:image',
      content:'https://tnhnbqvtxzrrcfpsjsfq.supabase.co/storage/v1/object/public/mugs/6i7htvrnka731.png'
    },
    {
      hid: 'twitter-image',
      property: 'twitter:image',
      content: 'https://tnhnbqvtxzrrcfpsjsfq.supabase.co/storage/v1/object/public/mugs/6i7htvrnka731.png'
    },
    {
      hid: 'twitter-card',
      property: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      hid: 'og-type',
      property: 'og:type',
      content: 'website'
    }
  ],
  script: [
    {
      src: 'https://www.youtube.com/iframe_api'
    },
    {
      src: '/scripts/player.js'
    }
  ]
})
</script>
<template>
  <VideoFeed />
</template>
