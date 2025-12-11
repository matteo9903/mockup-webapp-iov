/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Schema colori IOV basato sul design dell'istituto
        iov: {
          // Blu scuro per header principale
          'dark-blue': '#104676',
          'dark-blue-hover': '#0d3859',
          'dark-blue-text': '#002B58',

          // Giallo IOV per pulsanti e card principali
          'yellow': '#FFE69C',
          'yellow-light': '#FFE44D',
          'yellow-dark': '#E6C200',
          'yellow-text': '#5F2007',

          // Blu chiaro per card servizi
          'light-blue': '#D9F1FF',
          'light-blue-light': '#E1F5FE',
          'light-blue-dark': '#81D4FA',

          // Rosa per card ricerca
          'pink': '#FBE5FF',
          'pink-light': '#F8BBD0',
          'pink-dark': '#E91E63',
          'pink-text': '#6F0145',
          'pink-border': '#E8B3E8',

          // Rosso per logo Regione Veneto
          'veneto-red': '#C8102E',

          // Grigi per testi e sfondi
          'gray-text': '#333333',
          'gray-light': '#F5F5F5',
        },
      },
      backgroundImage: {
        'iov-gradient': 'linear-gradient(to bottom right, #F5FBFF 0%, #FFFFFF 100%)',
        'iov-gradient-alt': 'linear-gradient(135deg, #D9F1FF 0%, #E1F5FE 50%, #FFFFFF 100%)',
      },
    },
  },
  plugins: [],
};
