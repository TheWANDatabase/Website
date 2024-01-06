import type { Topic } from './api';

const TIMESTAMP_EXTRACTOR = /((\d{1,2}:{0,1}){1,3}:(\d{1,2}:{0,1}))/;
const CONTINUANCE_EXTRACTOR = /\[cont.\]/i;
const MAINLINE_EXTRACTOR = /\[(?:(?:\d?){1,2}(?::{0,1}?)){2,3}\]/;
const TOPIC_EXTRACTOR = /topic #{0,1}(\d+)+:*\s(.+)\*/i;
const TANGENT_EXTRACTOR = /\s{1,3}>\s(.+)/;

export function processTimestampDocument(text: string): Topic[] {
	const topics: Topic[] = [];
	const continuances = new Map<number, number>();
	const lines: string[] = text.split('\n');

	for (const line of lines) {
		if (MAINLINE_EXTRACTOR.test(line)) {
			const timestamp = fromHumanReadable(TIMESTAMP_EXTRACTOR.exec(line)?.[0] || '00:00');
			if (TOPIC_EXTRACTOR.test(line)) {
				const [, raw_id, title] = TOPIC_EXTRACTOR.exec(line) || [];
				topics.push({
					id: raw_id,
					episodeId: '',
					parent: null,
					title,
					start: timestamp,
					end: 0,
					created: new Date(),
					modified: new Date(),
					children: []
				});
			}
		} else if (CONTINUANCE_EXTRACTOR.test(line)) {
			if (TOPIC_EXTRACTOR.test(line)) {
				const [, raw_id, title] = TOPIC_EXTRACTOR.exec(line) || [];
				const id = parseInt(raw_id);

				let revisionCount = continuances.get(id);
				if (revisionCount === undefined) revisionCount = 1;
				continuances.set(id, revisionCount + 1);
				topics.push({
					id: `${raw_id}.${revisionCount}`,
					episodeId: '',
					parent: null,
					title: 'Cont. ' + title,
					start: 0,
					end: 0,
					created: new Date(),
					modified: new Date(),
					children: []
				});
			}
		} else if (TANGENT_EXTRACTOR.test(line)) {
			const timestamp = fromHumanReadable(TIMESTAMP_EXTRACTOR.exec(line)?.[0] || '00:00');
			const title = line.split(TIMESTAMP_EXTRACTOR).pop() || 'Unknown';
			topics[topics.length - 1].children?.push({
				id: '',
				episodeId: '',
				parent: null,
				title: title,
				start: timestamp,
				end: 0,
				created: new Date(),
				modified: new Date()
			});
		}
	}

	const finalized: Topic[] = topics.map((topic, i, tps) => {
		if (i + 1 < tps.length) {
			const next = tps[i + 1];

			if (next.start === 0) {
				if (next.children !== undefined && next.children.length > 0) {
					next.start = next.children[0].start;
				} else next.start = 0;
				tps[i + 1] = next;
			}

			topic.end = next.start - 1;
			if (topic.children !== undefined)
				topic.children = topic.children.map((child, idx, parent) => {
					if (idx + 1 < parent.length) {
						const nextChild = parent[idx + 1];
						child.end = nextChild.start - 1;
					} else if(idx+1 === parent.length) {
                        child.end = next.start - 1;
                    }
                    return child;
				});
		}

		return topic;
	});

	// for (let i = 0; i < topics.length; i++) {
	// 	const topic = topics[i];

	// }

	return finalized;
}

function fromHumanReadable(timestamp: string): number {
	const pieces: string[] = timestamp.split(':');

	const raw_seconds: string | undefined = pieces.pop();
	const raw_minutes: string | undefined = pieces.pop();
	const raw_hours: string | undefined = pieces.pop();
	const raw_days: string | undefined = pieces.pop();

	let seconds = 0;
	if (raw_seconds) seconds += parseInt(raw_seconds);
	if (raw_minutes) seconds += parseInt(raw_minutes) * 60;
	if (raw_hours) seconds += parseInt(raw_hours) * 60 * 60;
	if (raw_days) seconds += parseInt(raw_days) * 24 * 60 * 60;

	return seconds;
}
