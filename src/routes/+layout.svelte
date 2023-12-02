<script lang="ts">
  import {io} from "socket.io-client";
  import {readable} from "svelte/store";
  import Header from "$lib/Header.svelte";

  // const notificationStore = writable([]);
  //
  // notificationStore.subscribe(value => {
  //   if (value.length > 0) {
  //     const toast = document.querySelector('.snackbar .toast');
  //     toast.style.transform = 'translate(0, 0)';
  //     setTimeout(() => {
  //       toast.style.transform = 'translate(-105%, 0)';
  //     }, 3000);
  //   }
  // });
  //

  export const socketStore = readable({}, () => {
    const socket = io('wss://mq.thewandb.com', {
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log('connected');

      // socket.emit('message', JSON.stringify({type: 2, payload: 'bingo'}));
      // socket.emit('message', JSON.stringify({type: 2, payload: 'live'}));

      return () => {
        socket.close();
      }
    });

    socket.on('state', (data) => {
      console.log(data);
      // notificationStore.update(value => {
      //   value.push(data);
      //   return value;
      // });
    });
  })

  // socketStore.subscribe(() => {
  // });
</script>
<div class="container">
  <Header/>
</div>

<!--<div class="snackbar">-->
<!--  {#each $notificationStore as notification, index}-->
<!--    <div class="toast">-->
<!--      <h1>{notification.type}</h1>-->
<!--      <p>{notification.payload}</p>-->
<!--    </div>-->
<!--  {/each}-->
<!--</div>-->
<!--<style>-->
<!--    .snackbar {-->
<!--        position: fixed;-->
<!--        top: 0;-->
<!--        left: 100%;-->
<!--        width: 200px;-->
<!--        height: 100vh;-->
<!--        transform: translate(0, 200px);-->
<!--        pointer-events: none;-->
<!--        z-index: 1000;-->
<!--    }-->

<!--    .snackbar .toast {-->
<!--        position: absolute;-->
<!--        top: 100%;-->
<!--        left: 0;-->
<!--        transform: translate(-105%, 0);-->
<!--        background-color: white;-->
<!--        padding: 1rem;-->
<!--        border-radius: 0.5rem;-->
<!--        /*box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);*/-->
<!--    }-->
<!--</style>-->

