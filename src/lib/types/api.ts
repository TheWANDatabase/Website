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