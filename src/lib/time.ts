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


export function toHumanTime(total: number):string {
	total = Math.abs(total)
	const seconds = Math.floor((total) % 60);
	const minutes = Math.floor((total / 60) % 60);
	const hours = Math.floor((total / (60 * 60)) % 24);
	const days = Math.floor(total / (60 * 60 * 24));
	let result = '';

	if(days > 0) result += (days > 9 ? days : ('0'+days)) + ':' 
	if(hours > 0) result += (hours > 9 ? hours : ('0'+hours)) + ':' 
	
	result += (minutes > 9 ? minutes : ('0'+minutes)) + ':'
	result += (seconds > 9 ? seconds : ('0'+seconds))

	return result
}