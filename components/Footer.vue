<script async setup>
import style from './Footer.module.css'
</script>
<template>
  <div :class="style.footer">
    <p>
      <span style="">Made using
        <Icon name="logos:nuxt-icon" /> Nuxt.JS by
        <a style="color: #7a5bfa; text-decoration: none;" href="https://github.com/altriusrs" target="_blank">Altrius</a>
      </span>
      <br>
      <span>
        <a style="color: #7a5bfa; text-decoration: none;" href="https://github.com/altriusrs/wandb">
          <Icon name="mdi:github" />
          Contribute Here
        </a> |
        <a style="color: #7a5bfa; text-decoration: none;" href="https://ko-fi.com/altrius">
          <Icon name="simple-icons:kofi" />
          Buy Me A Coffee
        </a>
      </span>
    </p>
    <span class="style.copyright">
      The WAN Database is not affiliated with Linus Media Group or any of its employees, partners, or otherwise.
      It is solely owned and operated as a community project meant to help provide a handy index of everything discussed.
      The copyright of the content featured on this website belongs solely to its original creators.
    </span>
  </div>
</template>
