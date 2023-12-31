import type { Socket } from 'socket.io-client';
import { writable } from 'svelte/store';
export const liveState = writable<StateMessage>(null);
export const socket = writable<Socket>(null);
export const nextShow = writable<Date>(null);
export const showTime = writable<string>("Loading...");