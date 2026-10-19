module.exports = {
  content: ['./src/main/react/**/*.{js,jsx,ts,tsx}', './src/main/resources/public/index.html'],
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#070b14',
        },
        rose: {
          950: '#4c0519',
        },
        blue: {
          950: '#082f49',
        }
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 200ms ease-in-out',
      }
    },
  },
  plugins: [],
}