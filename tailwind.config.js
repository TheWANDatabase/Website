/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
  theme: {
    extend: {
      colors: {
        teracotta: {
          50: '#fef3f2',
          100: '#fde6e3',
          200: '#fcd2cc',
          300: '#f9b2a8',
          400: '#f48575',
          500: '#ea5d49',
          600: '#d6412c',
          700: '#ba3522',
          800: '#952e1f',
          900: '#7c2c20',
          950: '#43130c'
        },
        nightrider: {
          50: '#f8f4ee',
          100: '#ede3d4',
          200: '#ddc8ab',
          300: '#caa57a',
          400: '#ba8855',
          500: '#ab7447',
          600: '#925c3c',
          700: '#764632',
          800: '#643b2f',
          900: '#56342d',
          950: '#1c0f0d'
        },
        golden: {
          50: '#fef9ec',
          100: '#fcecc9',
          200: '#f9d78e',
          300: '#f7bb52',
          400: '#f4a32b',
          500: '#e87d11',
          600: '#d25e0d',
          700: '#af400e',
          800: '#8e3112',
          900: '#752a12',
          950: '#431305'
        },
        scorch: {
          DEFAULT: '#E87D11',
          50: '#FAD8B7',
          100: '#F8CEA4',
          200: '#F6BA7E',
          300: '#F3A658',
          400: '#F09132',
          500: '#E87D11',
          600: '#B4610D',
          700: '#7F4509',
          800: '#4B2906',
          900: '#170C02',
          950: '#000000'
        },
        poppy: {
          DEFAULT: '#B92C25',
          50: '#EEABA8',
          100: '#EA9B97',
          200: '#E37A75',
          300: '#DD5A53',
          400: '#D63931',
          500: '#B92C25',
          600: '#8A211C',
          700: '#5C1612',
          800: '#2D0B09',
          900: '#000000',
          950: '#000000'
        }
      }
    }
  },
  safelist: [
    {
      pattern: /(bg|text|border|shadow)-(scorch|golden|poppy|slate|gray|zinc|neutral|stone|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)+/,
      variants: ['hover']
    }
  ]
}
