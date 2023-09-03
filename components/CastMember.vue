<script setup>
const props = defineProps(['person'])
</script>

<template>
  <div class="flex w-82 mx-auto mt-2 mb-5 bg-slate-800 rounded-lg p-2">
    <div class="flex ml-2 mr-4 my-auto align-middle">
      <UAvatar class="object-cover" size="3xl" :alt="props.person.name" :src="'https://cdn.thewandb.com/mugs/'+props.person.mug" />
    </div>
    <div class="flex-col w-52">
      <h1 class="text-xl font-bold -mb-1">
        {{ props.person.name }}
      </h1>
      <h2 class="font-bold">
        {{ props.person.role }}
      </h2>
      <a v-if="props.person.outlet_uri" class="text-lg my-5 h-5" :href="props.person.outlet_uri">{{ props.person.outlet }}</a>
      <a v-else class="text-lg my-5 h-5">{{ props.person.outlet }}</a>
      <div>
        <UTooltip v-if="props.person.ltt_forum" text="Click to open the LinusTechTips Forum">
          <a

            :href="'https://linustechtips.com/profile/' + props.person.ltt_forum"
            target="_blank"
          >
            <img class="w-5 inline mx-1" src="/2018_Linus_Tech_Tips_logo.svg">
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known LinusTechTips Forum account">
          <a>
            <img class="w-5 inline mx-1" src="/2018_Linus_Tech_Tips_logo_grey.svg">
          </a>
        </UTooltip>

        <UTooltip v-if="props.person.linkedin" text="Click to open on LinkedIn">
          <a
            :href="'https://www.linkedin.com/in/' + props.person.linkedin"
            target="_blank"
          >
            <Icon class="w-7 h-7 mx-1" name="devicon:linkedin" />
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known IMDB profile">
          <a><Icon class="w-7 h-7 mx-1" name="devicon-plain:linkedin" /></a>
        </UTooltip>

        <UTooltip v-if="props.person.wikipedia" text="Click to open on Wikipedia">
          <a
            :href="'https://en.wikipedia.org/wiki/' + props.person.wikipedia"
            target="_blank"
          >
            <Icon class="w-7 h-7 mx-1" name="mdi:wikipedia" />
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known Wikipedia page">
          <a><Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:wikipedia" /></a>
        </UTooltip>

        <UTooltip v-if="props.person.instagram" text="Click to open on profile on Instagram">
          <a
            :href="'https://www.instagram.com/' + props.person.instagram"
            target="_blank"
          >
            <Icon class="w-7 h-7 mx-1" name="mdi:instagram" color="#C13584" />
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known Instagram profile">
          <a><Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:instagram" /></a>
        </UTooltip>

        <UTooltip v-if="props.person.twitter" text="Click to open on on Twitter">
          <a :href="'https://twitter.com/' + props.person.twitter" target="_blank">
            <Icon class="w-7 h-7 mx-1" name="logos:twitter" />
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known Twitter profile">
          <a><Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:twitter" /></a>
        </UTooltip>

        <UTooltip v-if="props.person.imdb" text="Click to open on the IMDB website">
          <a :href="'https://www.imdb.com/name/' + props.person.imdb" target="_blank">
            <Icon class="w-7 h-7 mx-1" name="bxl:imdb" color="#f3ce13" />
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known IMDB profile">
          <a><Icon class="w-7 h-7 mx-1 fill-slate-400" name="bxl:imdb" /></a>
        </UTooltip>
      </div>
    </div>
  </div>
</template>
