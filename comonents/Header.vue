<script lang="ts" setup>
const search = ref();
const searchText = ref('');
const settingsDropdown = ref();

useAsyncData(async () => {
  // search.value.disabled = true
  search.value.placeholder = 'Search is unavailable.'
}, {
  watch: [search]
})

onMounted(() => {
  window.onclick = (event) => {
    if (!event.target || !("id" in event.target)) return;

    if (event.target !== settingsDropdown.value && event.target.id !== 'header__settings__button') {
      if (settingsDropdown.value.attributes.getNamedItem('opened').value === 'true') {
        toggleDropdown();
      }
    }
  }
})

const toggleDropdown = () => {
  let state = settingsDropdown.value.attributes.getNamedItem('opened');

  if (state.value === 'false') {
    state.value = 'true';
    settingsDropdown.value.style.opacity = '1';
    settingsDropdown.value.style.visibility = 'visible';
    settingsDropdown.value.style.marginTop = '0.5rem';
    settingsDropdown.value.style.width = '300px';
    settingsDropdown.value.style.pointerEvents = 'all';
  } else {
    state.value = 'false';
    settingsDropdown.value.style.opacity = '0';
    settingsDropdown.value.style.visibility = 'hidden';
    settingsDropdown.value.style.marginTop = '0';
    settingsDropdown.value.style.width = '0px';
    settingsDropdown.value.style.pointerEvents = 'none';
  }
  settingsDropdown.value.attributes.setNamedItem(state);


}

</script>
<template>
  <div class="header">
    <div class="header__side">
      <div class="settings">
        <button id="header__settings__button" class="header__settings__button" @click="toggleDropdown">
          <Icon id="header__settings__button" name="i-mdi:settings-outline"/>
        </button>
        <div ref="settingsDropdown" class="dropdown__container" opened="false">
          <div class="dropdown__item">
            <span>
              <Icon name="i-mdi:account-outline"/>
              Account
            </span>
          </div>
          <div class="dropdown__item">
            <span>
              <Icon name="i-mdi:logout"/>
              Logout
            </span>
          </div>
          <div class="dropdown__item">
            <span>
              <Icon name="i-mdi:information-outline"/>
              Theme
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="header__menu left">
      <ul>
        <li>
          <nuxt-link to="/archive">
            <Icon name="i-fluent-mdl2:archive"/>
            Archives
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/hosts">
            <Icon name="i-material-symbols:person-2-outline"/>
            Hosts
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/sponsors">
            <Icon name="i-mdi:advertisements"/>
            Sponsors
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/">
            <img alt="The WAN Database" src="https://cdn.thewandb.com/assets/WANDB_darkBackground.svg" width="100"/>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/products">
            <Icon name="i-material-symbols:shopping-bag-outline"/>
            Products
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/about">
            <Icon name="i-mdi:information-outline"/>
            About
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/contact">
            <Icon name="i-material-symbols:person-2-outline"/>
            Contact
          </nuxt-link>
        </li>
      </ul>
    </div>
    <div class="header__side">
      <div class="header__search">
        <Icon name="i-mdi:search"/>
        <input ref="search" v-model="searchText" placeholder="Search for anything" type="text">
      </div>
    </div>
  </div>
</template>
<style scoped>
.settings {
  display: flex;
  position: relative;
  top: 60px;
  flex-direction: column;
  padding: 0 0.1rem;
  margin-right: 1rem;
}

.settings > .dropdown__container {
  opacity: 0;
  overflow: hidden;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  top: 100%;
  position: relative;
  width: 300px;

  background: hsl(0, 0%, 20%);
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
}

.settings > .dropdown__container > .dropdown__item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 40px;
  padding: 0 0.1rem;
  margin-right: 1rem;
}

.settings > .dropdown__container > .dropdown__item:hover {
  background: hsl(0, 0%, 30%);
}

.settings > button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  vertical-align: center;
  line-height: 1rem;
  text-align: center;
  transition: all 0.2s ease-in-out;
  font-size: 1.5rem;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
}

.settings > button:hover {
  color: hsl(0, 0%, 50%);
  transition: all 0.2s ease-in-out;
}

.header {
  background: hsl(0, 0%, 10%);
  color: white;
  display: flex;
  position: sticky;
  top: 0;
  z-index: 100;
  align-items: center;
}

.header__search {
  width: auto;
  margin-right: 1.5rem;
}

.header__menu {
  flex: 1;
}

.header__menu > ul {
  display: flex;
  justify-content: space-evenly;
  list-style: none;
  padding: 0;
}

.header__menu > ul > li {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  color: white;
  text-transform: uppercase;
  padding: 0.5rem 0.75rem;
  margin: 0 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border-radius: 20px;
}

.header__menu > ul > li > a {
  font-weight: 600;
  display: flex;
  align-items: center;
  text-decoration: none;
  width: 140px;
  color: white;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.header__menu > ul > li > a > svg {
  margin-right: 0.5rem;
}

.header__menu > ul > li:hover {
  background: hsl(0, 0%, 20%);
}

.left {
  margin: 0 auto;
}

.header__side {
  display: flex;
  align-items: center;
  justify-content: left;
  justify-content: space-between;
  width: 300px;
  height: 40px;
  padding: 0 0.1rem;
  margin: 0 1rem;
}

.header__search {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: space-around;
  width: 300px;
  height: 40px;
  background: hsl(0, 0%, 20%);
  border-radius: 20px;
  padding: 0 0.1rem;
  margin-right: 1rem;
}

.header__search > input {
  background: none;
  border: none;
  outline: none;
  color: white;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  margin-right: 0.75rem;
}

.header__search > input::placeholder {
  color: white;
  font-weight: 600;
}

.header__search > svg {
  color: white;
  font-size: 1.5rem;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
}
</style>
