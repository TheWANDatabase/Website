export type CachedEntity<T> = {
	cached: boolean
	data: T,
	queryTime: number
}

export type ApiError = {
	status: number,
	statusText: string,
	error: string,
	message: string
}

export type EpisodeSearchFilters = {
	filters: {
		order: {
			id: 'release-desc'
                | '';
			label: 'Stream Date (Descending)'
                | '';
		};
		hideCW: boolean;
		hideCorrupt: boolean;
		startDate: Date | string;
		endDate: Date | string;
		members: string[];
	};
	offset: number;
	limit: number ;
	flags: { 
        include: string[] 
    };
};

export type Episode = {
	id: string,
	floatplane?: string,
	title: string,
	description: string,
	thumbnail?: string,
	aired: string,
	duration: number,
	topicCount: number,
	hostCount: number,
	sponsorCount: number,
	merchMessageCount: number,
	introStart?: number,
	introDuration?: number,
	preShowOffset?: number,
	errors: string[],
	cast: unknown[],
	products: unknown[],
	merchMessages: unknown[],
	topics: Topic[],
	sponsors: Sponsor[]
}

export type Topic = {
	id: string;
	episodeId: string;
	parent: string | null;
	title: string;
	start: number;
	end: number;
	created: Date;
	modified: Date;
	ref: string | null;
	kind: 'topic' | 'merch message' | 'sponsor' | 'tangent' | 'sub topic';
	children?: Topic[];
}

export type Sponsor = {
	id: string,
	message: string,
	url?: string,
	added: string,
	modified: string,
	companyId: string,
	isDennis: boolean,
	start: number,
	end: number,
	safe: boolean
	episodeId: string,
	isSponsorDebut: boolean,
	company: Company
}

export type Company = {
	id: string,
    name: string,
    links: string[],
    logo?: number,
    founded?: number,
    added: string,
    modified: string
}