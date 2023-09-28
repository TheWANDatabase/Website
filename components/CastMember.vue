<script setup>
const props = defineProps(['person'])
const cfg = useState('uconf')
console.log('person:', props.person)
</script>

<template>
  <div :class="`flex w-82 mx-auto mt-2 mb-5 bg-${cfg.theme.greyscale}-800 rounded-lg p-2`">
    <div class="flex ml-2 mr-4 my-auto align-middle">
      <UAvatar class="object-cover" size="3xl" :alt="props.person.forename + ' ' + props.person.surname"
        :src="'https://cdn.thewandb.com/mugs/' + props.person.avatar" />
    </div>
    <div class="flex-col w-72">
      <h1 class="text-xl font-bold -mb-1">
        {{ props.person.forename + (props.person.alias ? ' "' + props.person.alias + '"' : '') + ' ' +
          props.person.surname }}
      </h1>
      <h2 class="font-bold">
        {{ props.person.role }}
      </h2>
      <a v-if="props.person.outlet_uri" class="text-lg my-5 h-5" :href="props.person.outlet.url">{{
        props.person.outlet.name }}</a>
      <a v-else class="text-lg my-5 h-5">{{ props.person.outlet.name }}</a>
      <div>
        <UTooltip v-if="props.person.socials.ltt_forum" text="Click to open the LinusTechTips Forum">
          <a :href="'https://linustechtips.com/profile/' + props.person.socials.ltt_forum" target="_blank">
            <img class="w-5 inline mx-1" src="/2018_Linus_Tech_Tips_logo.svg">
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known LinusTechTips Forum account">
          <a>
            <img class="w-5 inline mx-1" src="/2018_Linus_Tech_Tips_logo_grey.svg">
          </a>
        </UTooltip>

        <UTooltip v-if="props.person.socials.linkedin" text="Click to open on LinkedIn">
          <a :href="'https://www.linkedin.com/in/' + props.person.socials.linkedin" target="_blank">
            <Icon class="w-7 h-7 mx-1" name="devicon:linkedin" />
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known IMDB profile">
          <a>
            <Icon class="w-7 h-7 mx-1" name="devicon-plain:linkedin" />
          </a>
        </UTooltip>

        <UTooltip v-if="props.person.socials.wikipedia" text="Click to open on Wikipedia">
          <a :href="'https://en.wikipedia.org/wiki/' + props.person.socials.wikipedia" target="_blank">
            <Icon class="w-7 h-7 mx-1" name="mdi:wikipedia" />
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known Wikipedia page">
          <a>
            <Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:wikipedia" />
          </a>
        </UTooltip>

        <UTooltip v-if="props.person.socials.instagram" text="Click to open on profile on Instagram">
          <a :href="'https://www.instagram.com/' + props.person.socials.instagram" target="_blank">
            <Icon class="w-7 h-7 mx-1" name="mdi:instagram" color="#C13584" />
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known Instagram profile">
          <a>
            <Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:instagram" />
          </a>
        </UTooltip>

        <UTooltip v-if="props.person.socials.twitter" text="Click to open on on Twitter">
          <a :href="'https://twitter.com/' + props.person.socials.twitter" target="_blank">
            <Icon class="w-7 h-7 mx-1" name="logos:twitter" />
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known Twitter profile">
          <a>
            <Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:twitter" />
          </a>
        </UTooltip>

        <UTooltip v-if="props.person.socials.imdb" text="Click to open on the IMDB website">
          <a :href="'https://www.imdb.com/name/' + props.person.socials.imdb" target="_blank">
            <Icon class="w-7 h-7 mx-1" name="bxl:imdb" color="#f3ce13" />
          </a>
        </UTooltip>
        <UTooltip v-else text="This person does not have a known IMDB profile">
          <a>
            <Icon class="w-7 h-7 mx-1 fill-slate-400" name="bxl:imdb" />
          </a>
        </UTooltip>
      </div>
    </div>
  </div>
</template>
