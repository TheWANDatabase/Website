import {onMounted, onUnmounted} from 'vue';

export function useInterval(callback: Function, time = 1000) {
  let timer: number | null = null;

  function start() {
    stop();
    timer = setInterval(callback, time);
  }

  function stop() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  onMounted(start);
  onUnmounted(stop);

  return {start, stop};
}