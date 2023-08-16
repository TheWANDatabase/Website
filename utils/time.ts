export function toTimestamp(ts: number = 0) {
    let hours = ~~(ts / 3600);
    let minutes = ~~(ts % 3600 / 60);
    let seconds = ~~(ts % 60);

    return `${paddy(hours, 2)}:${paddy(minutes, 2)}:${paddy(seconds, 2)}`;
}

export function paddy(num: number, padlen: number = 0, padchar: string = '0') {
    let pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    let pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}