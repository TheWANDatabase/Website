export function getTimeRemaining(target: Date): TimeDifferential {
	const total = target.getTime() - new Date().getTime();
	const seconds = Math.floor((total / 1000) % 60);
	const minutes = Math.floor((total / 1000 / 60) % 60);
	const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
	const days = Math.floor(total / (1000 * 60 * 60 * 24));

	return {
		total,
		days,
		hours,
		minutes,
		seconds
	};
}

export interface TimeDifferential {
	total: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}
