import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    discord: {
      '50': '#f6f7fe',
      '100': '#dcdefc',
      '200': '#bdc2fa',
      '300': '#979ff7',
      '400': '#818bf5',
      '500': '#636ff3',
      '600': '#505bd8',
      '700': '#4049ae',
      '800': '#363e93',
      '900': '#272d6a',
    },
  },
  config: { useSystemColorMode: false, initialColorMode: 'light' },
  styles: {
    global: {
      body: {
        fontFamily: `"Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif`,
        color: 'gray.800',
        bg: 'gray.100',
        fontWeight: '400',
      },
      a: {
        cursor: 'pointer',
        color: 'discord.500',
      },
    },
  },
  semanticTokens: {
    colors: {
      card: {
        text: {
          thin: { default: 'gray.600', _dark: '#ffffff' },
          base: { default: 'gray.900', _dark: '#ffffff' },
          bold: { default: 'black', _dark: '#ffffff' },
        },
        bg: {
          base: { default: 'white', _dark: '#1e1e1e' },
          hover: { default: 'gray.50', _dark: '#2d2d2d' },
        },
      },
    },
  },
})
