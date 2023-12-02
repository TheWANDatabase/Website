<script>
    import {writable} from "svelte/store";
    import GoSearch from 'svelte-icons/go/GoSearch.svelte'
    import GoGear from 'svelte-icons/go/GoGear.svelte'

    const searchStore = writable("");
    const placeholderStore = writable("Search...");
    const searchExpanded = writable(false);

    placeholderStore.set("Search is currently disabled");

    function openSearch() {
        if ($searchExpanded) return searchExpanded.set(false);
        searchExpanded.set(true);
    }
</script>
<div class="header">
  <div class="dropdown">
    <div class="icon">
      <GoGear/>
    </div>
  </div>
  <div class="centraliser">
    <ul>
      <li>
        <a href="/archive">
          <!--          <Icon name="i-fluent-mdl2:archive"/>-->
          Archives
        </a>
      </li>
      <li>
        <a href="/hosts">
          <!--          <Icon name="i-material-symbols:person-2-outline"/>-->
          Hosts
        </a>
      </li>
      <li>
        <a href="/sponsors">
          <!--          <Icon name="i-mdi:advertisements"/>-->
          Sponsors
        </a>
      </li>
      <li style="scale: 1.4; margin-top: 5px;">
        <a href="/">
          <img alt="The WAN Database" src="https://cdn.thewandb.com/assets/WANDB_darkBackground.svg" width="100"/>
        </a>
      </li>
      <li>
        <a href="/products">
          <!--          <Icon name="i-material-symbols:shopping-bag-outline"/>-->
          Products
        </a>
      </li>
      <li>
        <a href="/about">
          <!--          <Icon name="i-mdi:information-outline"/>-->
          About
        </a>
      </li>
      <li>
        <a href="/contact">
          <!--          <Icon name="i-material-symbols:person-2-outline"/>-->
          Contact
        </a>
      </li>
    </ul>
  </div>
  <div class="search" on:click={openSearch} style={$searchExpanded ? 'width: 300px;' : 'width: 42px;'}>
    <div class="icon" style={$searchExpanded ? 'visibility: hidden; width: 0px' : 'visibility: visible; width: 42px'}>
      <GoSearch/>
    </div>
    <input bind:value="{$searchStore}" placeholder={$placeholderStore}
           style={$searchExpanded ? 'width: 100%; margin: 0 0.75rem;' : 'width: 0px; margin: 0 0;'}
           type="text"/>
  </div>
</div>
<style>
    .header {
        display: grid;
        grid-template-columns: 320px auto 320px;
        background-color: #000;
        color: #fff;
        padding: 10px 0;
        margin: 5px;
        width: calc(100% - 10px);
        border-radius: 5px;
        position: sticky;
        justify-content: center;
        justify-content: space-around;
    }

    .header .dropdown {
        width: 200px;
        margin-right: auto;
    }

    .header .search, .header .dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        justify-content: space-around;
        /*width: 300px;*/
        height: 40px;
        background: hsl(0, 0%, 20%);
        border-radius: 20px;
        padding: 0 0.1rem;
        margin: 5px 0 5px auto;
        transition: 200ms;
    }

    .header .dropdown {
        width: 42px;
        margin: 5px auto 5px 0;
    }

    .header .search > input {
        background: none;
        border: none;
        outline: none;
        color: white;
        /*width: 100%;*/
        font-size: 1rem;
        font-weight: 600;
        margin-right: 0.75rem;
        margin-left: 0.75rem;
        transition: 200ms;
    }

    .header .search > input::placeholder {
        color: white;
        font-weight: 500;
    }

    .header .search > .icon, .header .dropdown > .icon {
        width: 22px;
        height: 22px;
        margin: 0 auto;
        transition: 200ms;
    }

    .header ul {
        /*position: relative;*/
        left: 100%;
        transform: translateX(-10%);
        list-style: none;
        margin: 0 auto;
        min-width: 1000px;
        padding: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

    }

    .header ul li {
        display: inline-block;
        margin: 0 10px;
        font-size: 1.1em;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .header ul li a {
        color: #aaa;
        text-decoration: none;
        transition: 200ms ease-in-out;
    }

    .header ul li a:hover {
        color: #fff;
        text-decoration: underline;
        transition: 200ms ease-in-out;
    }
</style>