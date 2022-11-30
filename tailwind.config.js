/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './layout/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      'sans': ['Montserrat', ...defaultTheme.fontFamily.sans]
    },
    colors:{
      'primary': {
        100: '#F3F3FD',
        200: '#E7E6FC',
        300: '#CDCBFA',
        400: '#AFACF7',
        500: '#8B86F5',
        600: '#5A4FF3',
        700: '#5046D9',
        800: '#453DBC',
        900: '#383199',
        1000: '#28236C'
      },
      'secondary': {
        100: '#F2F0EB',
        200: '#EAE7E1',
        300: '#D7D4CD',
        400: '#BFB8A9',
        500: '#A0957E',
        600: '#948669',
        700: '#84775D',
        800: '#726751',
        900: '#5D5442',
        1000: '#423B2E'
      },
      'green' :{
        100: '#F3F9F4',
        200: '#E7F4E8',
        300: '#CDEACF',
        400: '#B0DFB3',
        500: '#8CD392',
        600: '#5BC766',
        700: '#51B15B',
        800: '#469A4F',
        900: '#397D40',
        1000: '#28582D',
      },
      'red': colors.red,
      'gray': colors.gray,
      'success': '#1A9550',
      'warning': '#F3B71E',
      'error': '#FD4040',
      'white': '#FFFFFF',
      'black': '#000000',
    },
    borderRadius: {
      '8': '8px',
      '10': '10px',
      '20': '20px',
      'none': '0px',
      'full': '9999px',
    },
    extend: {
      
    },
  },
  plugins: [],
}
