import { createTheme } from "@mui/material"

export const muiThemeStyle = createTheme({
    typography: {
      fontFamily: [
        "Noto Sans JP",
        'Nunito',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
    }
})

export const buttonStyle = {
    position: 'fixed',
    bottom: '30%',
    right: '16px',
    zIndex: 1000,
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
    padding: '10px 12px',
    minWidth: '36px',
}