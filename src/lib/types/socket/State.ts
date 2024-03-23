export interface StateMessage {
	live: boolean;
	isWan: boolean;
	isAfterparty: boolean;
	title: string;
	description: string;
	thumbnail: Thumbnail;
	imminence: number;
	sponsors: Sponsor[];
	streamUrl: string;
}

export interface Thumbnail {
	width: number;
	height: number;
	path: string;
	childImages: null | Thumbnail[];
}

export interface Sponsor {
	company: string;
	name: string;
	logo: string;
	link: string;
	message: string;
}

