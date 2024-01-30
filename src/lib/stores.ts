import type { Socket } from 'socket.io-client';
import { writable } from 'svelte/store';
import type { TimeDifferential } from './time';
import type { StateMessage } from './types/socket/State';
import type Plyr from 'plyr';

export const liveState = writable<StateMessage>();
export const socket = writable<Socket>();
export const nextShow = writable<Date>();
export const showTime = writable<TimeDifferential>();

export const player = writable<Plyr>();
export const currentEpisode = writable<string>();
export const currentTime = writable<number>(0);
export const maxDuration = writable<number>(0);
export const preshowOffset = writable<number>(0);
export const playing = writable<boolean>(false);
export const playbackSource = writable<'youtube' | 'floatplane'>('youtube');
export const adjustedTime = writable<number>(0);

export const pageTitle = writable("The WAN Database - The Unofficial Archive Project");
export const pageImage = writable("https://cdn.thewandb.com/assets/WANDB_whiteBackgroundSocial.png")