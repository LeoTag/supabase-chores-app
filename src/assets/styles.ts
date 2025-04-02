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
    bottom: '10%',
    right: '16px',
    zIndex: 1000,
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
    padding: '10px 12px',
    minWidth: '36px',
}

export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    bottom: '0',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    height: "100%",
    overflow: "hidden",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 1.5,
    boxShadow: 24,
    paddingBottom: 6,
    paddingTop: 0,
};