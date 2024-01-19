export type StateMessage = {
    live: boolean,
    wan?: boolean,
    isWAN?: boolean;
    title: string;
    description: string;
    thumbnail: string;
    imminence: 0 | 1 | 2 | 3 | 4;
    textImminence: "Distant" | "Today" | "Soon" | "Imminent" | "Live"
  }