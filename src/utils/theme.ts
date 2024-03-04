import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
    colors: {
        stone: {
            "950": "#0c0a09",
            "900": "#1c1917",
            "800": "#292524",
            "700": "#44403c",
            "600": "#57534e",
            "500": "#78716c",
            "400": "#a8a29e",
            "300": "#d6d3d1",
            "200": "#e7e5e4",
            "100": "#f5f5f4",
            "50": "#fafaf9",
        }
    },
    styles: {
        global: {
            body: {
                fontFamily: 'Roboto, sans-serif'
            },
        },
    },
})