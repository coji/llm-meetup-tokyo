import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {},
  config: { useSystemColorMode: true, initialColorMode: 'light' },
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
        color: 'gray.500',
      },
    },
  },
})
