<script lang="ts">

  import {onMount} from "svelte";
  import {writable} from "svelte/store";
  import decode from "jsonwebtoken";

  let user = writable(null);

  onMount(() => {
    let token = localStorage.getItem("token");
    if (token) {
      let details = decode(token);
      console.log(details)
    }
  });

</script>