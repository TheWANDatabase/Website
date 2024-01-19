import type { Topic } from './types/api';

const TIMESTAMP_EXTRACTOR = /((\d{1,2}:{0,1}){1,3}:(\d{1,2}:{0,1}))/;
const CONTINUANCE_EXTRACTOR = /\[cont.\]/i;
const MAINLINE_EXTRACTOR = /\[(?:(?:\d?){1,2}(?::{0,1}?)){2,3}\]/;
const TOPIC_EXTRACTOR = /topic\s#{0,1}(\d+)+:*\s(.+)\*/i;
const TANGENT_EXTRACTOR = /\s{1,3}>\s(.+)/;
const SPONSOR_EXTRACTOR =
	/\*(?:sponsors?)\s?(?:spots?)?\s?(?:ft\.?|feat\.?|featuring)?\s?(?:dennis)?.*\*/i;
const MERCH_MESSAGE_EXTRACTOR = /merch\smessages\s#{0,1}(\d+)+(?:.+)\*/i;
const UNKNOWN_TYPE_EXTRACTOR = /\*(.*)\*/i;

const IGNORE_HEADERS = [
	'Chapters.',
	'Chapters',
	'Intro.',
	'Intro',
	'Outro.',
	'Outro'
]


export function processTimestampDocument(text: string): Topic[] {
	const topics: Topic[] = [];
	const continuances = new Map<number, number>();
	const lines: string[] = text.split('\n');
	let inSponsorSpots = false;
	let inMerchMessages = false;
	let wasContinued = false;

	for (const line of lines) {
		if (MAINLINE_EXTRACTOR.test(line)) {
			const timestamp = fromHumanReadable(TIMESTAMP_EXTRACTOR.exec(line)?.[0] || '00:00');
			if (TOPIC_EXTRACTOR.test(line)) {
				if (inSponsorSpots) inSponsorSpots = false;
				if (inMerchMessages) inMerchMessages = false;
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
					ref: null,
					kind: 'topic',
					children: []
				});
			} else if (SPONSOR_EXTRACTOR.test(line)) {
				if (inMerchMessages) inMerchMessages = false;
				inSponsorSpots = true;
				topics.push({
					id: 'sponsors',
					episodeId: '',
					parent: null,
					title: 'Sponsor Spots',
					start: timestamp,
					end: 0,
					created: new Date(),
					modified: new Date(),
					ref: null,
					kind: 'sponsor',
					children: []
				});
			} else if (MERCH_MESSAGE_EXTRACTOR.test(line)) {
				if (inSponsorSpots) inSponsorSpots = false;
				inMerchMessages = true;
				const [, raw_id] = MERCH_MESSAGE_EXTRACTOR.exec(line) || [];
				topics.push({
					id: 'merch_messages - ' + raw_id,
					episodeId: '',
					parent: null,
					title: 'Merch Messages',
					start: timestamp,
					end: 0,
					created: new Date(),
					modified: new Date(),
					ref: null,
					kind: 'merch message',
					children: []
				});
			} else {
				const [, title] = UNKNOWN_TYPE_EXTRACTOR.exec(line) || [];
				if (inSponsorSpots) inSponsorSpots = false;
				if (inMerchMessages) inMerchMessages = false;

				if(IGNORE_HEADERS.includes(title)) continue;
				console.log(title, 'timestamp: ' + timestamp)
				topics.push({
					id: 'unknown-' + Date.now(),
					episodeId: '',
					parent: null,
					title: title,
					start: timestamp,
					end: 0,
					created: new Date(),
					modified: new Date(),
					ref: null,
					kind: 'topic',
					children: []
				});
			}

			if(wasContinued) {
				if(topics[topics.length-2].start > 0) continue;
				topics[topics.length-2].start = topics[topics.length-1].start;
				wasContinued = false;
			}
		} else if (CONTINUANCE_EXTRACTOR.test(line)) {
			wasContinued = true;
			if (TOPIC_EXTRACTOR.test(line)) {
				if (inSponsorSpots) inSponsorSpots = false;
				if (inMerchMessages) inMerchMessages = false;
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
					ref: null,
					kind: 'topic',
					children: []
				});
			} else if (SPONSOR_EXTRACTOR.test(line)) {
				if (inMerchMessages) inMerchMessages = false;
				inSponsorSpots = true;
				topics.push({
					id: 'sponsors',
					episodeId: '',
					parent: null,
					title: 'Sponsor Spots',
					start: 0,
					end: 0,
					created: new Date(),
					modified: new Date(),
					ref: null,
					kind: 'sponsor',
					children: []
				});
			} else if (MERCH_MESSAGE_EXTRACTOR.test(line)) {
				if (inSponsorSpots) inSponsorSpots = false;
				inMerchMessages = true;
				const [, raw_id] = MERCH_MESSAGE_EXTRACTOR.exec(line) || [];
				topics.push({
					id: 'merch_messages - ' + raw_id,
					episodeId: '',
					parent: null,
					title: 'Merch Messages',
					start: 0,
					end: 0,
					created: new Date(),
					modified: new Date(),
					ref: null,
					kind: 'merch message',
					children: []
				});
			} else {
				const [, title] = UNKNOWN_TYPE_EXTRACTOR.exec(line) || [];
				if (inSponsorSpots) inSponsorSpots = false;
				if (inMerchMessages) inMerchMessages = false;

				if(IGNORE_HEADERS.includes(title)) continue;

				topics.push({
					id: 'unknown-' + Date.now(),
					episodeId: '',
					parent: null,
					title: title,
					start: 0,
					end: 0,
					created: new Date(),
					modified: new Date(),
					ref: null,
					kind: 'tangent',
					children: []
				});
			}
		} else if (TANGENT_EXTRACTOR.test(line)) {
			const timestamp = fromHumanReadable(TIMESTAMP_EXTRACTOR.exec(line)?.[0] || '00:00');
			const title = line.split(TIMESTAMP_EXTRACTOR).pop() || 'Unknown';
			if (inSponsorSpots) {
				topics[topics.length - 1].children?.push({
					id: '',
					episodeId: '',
					parent: null,
					title: title,
					start: timestamp,
					end: 0,
					ref: null,
					kind: 'sponsor',
					created: new Date(),
					modified: new Date()
				});
			} else if(inMerchMessages) {
				topics[topics.length - 1].children?.push({
					id: '',
					episodeId: '',
					parent: null,
					title: title,
					start: timestamp,
					end: 0,
					ref: null,
					kind: 'merch message',
					created: new Date(),
					modified: new Date()
				});
			} else {
				topics[topics.length - 1].children?.push({
					id: '',
					episodeId: '',
					parent: null,
					title: title,
					start: timestamp,
					end: 0,
					ref: null,
					kind: 'sub topic',
					created: new Date(),
					modified: new Date()
				});
			}

			if(wasContinued) {
				topics[topics.length-2].start = topics[topics.length-1].start;
				wasContinued = false;
			}
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
					} else if (idx + 1 === parent.length) {
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
