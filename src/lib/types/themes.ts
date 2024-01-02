export interface PartialTheme {
    name: string;
	loadingOpacity: number;
	loadedOpacity: number;
	bgPrimary: string;
}

export interface Theme extends PartialTheme {
	name: string;
	loadingOpacity: number;
	loadedOpacity: number;
	brand: string;
	primary: string;
	secondary: string;
	bgPrimary: string;
	bgSecondary: string;
    bgTertiary: string;
	bgAccent: string;
    bgSecondaryAccent:string;
	textPrimary: string;
    textAccent: string;
	messageBar: string;
	messageBarUrgent: string;
	plyrColorMain: string;
}

interface ThemeLibrary {
    [key: string]: Theme
}

export const themes: ThemeLibrary = {
	Day: {
		name: 'Day',
		loadingOpacity: 1,
        loadedOpacity: 0,
		brand: '184,43,32',
		primary: 'var(--brand)',
		secondary: '62,83,153',
		bgPrimary: '237,231,212',
		bgSecondary: '187,181,185',
        bgTertiary: '170,181,155',
		bgAccent: '10,10,10',
        bgSecondaryAccent: '130,155,185',
		textPrimary: '30,30,30',
        textAccent: '200,200,200',
		messageBar: 'var(--primary)',
		messageBarUrgent: '153, 62, 62',
		plyrColorMain: 'rgb(var(--secondary))'
	},
	Night: {
		name: 'Night',
		loadingOpacity: 1,
        loadedOpacity: 0,
		brand: '184,43,32',
		primary: 'var(--brand)',
		secondary: '#3e5399',
		bgPrimary: '22,22,26',
		bgSecondary: '36,36,50',
        bgTertiary: '45,45,55',
		bgAccent: '36,36,50',
        bgSecondaryAccent: '40,40,55',
		textPrimary: '200,200,200',
        textAccent: '230,230,230',
		messageBar: 'var(--primary)',
		messageBarUrgent: '153, 62, 62',
		plyrColorMain: 'rgb(var(--brand))'
	}
};
