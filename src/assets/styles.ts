import { createTheme, styled, Tab } from "@mui/material"

declare module '@mui/material/styles/createPalette' {
    interface PaletteOptions {    
        white?: PaletteColorOptions;
        accent?: PaletteColorOptions;
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        white: true;
        accent: true;
    }
}

export const muiThemeStyle = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#65b2c6',
            light: '#98e4f9',
            dark: '#308295',
            contrastText: '#fff',
        },
        secondary: {
            main: '#d87274',
            light: '#ffa2a3',
            dark: '#a34449',
            contrastText: '#fff',
        },
        accent:{
            main: '#5F3E3A',
            light: '#8d6964',
            dark: '#341714'
        },
        white:{
            main: '#fff',
            light: '#fff',
            dark: '#fff',
            contrastText: '#fff',
        },
    },
    shape: {
        borderRadius: 8
    },
    typography: {
        fontFamily: [
            "Noto Sans JP",
            'Nunito',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(','),
    },
})


export const dialogStyle = {
    margin: "auto auto 25px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90dvh",
    display: "block !important",
    ".MuiDialog-container": {
        display: "block !important",
    },
    ".MuiDialog-paper": {
        margin: "auto",
    },
    '.MuiDialogTitle-root': {
        padding: "16px 8px",
    },
    '& .MuiDialogContent-root': {
        padding: 2,
    },
    '& .MuiDialogActions-root': {
        padding: 1,
    },
}

export const StyledTab = styled(Tab)({
    color: "rgba(255,255,255,1)",
    fontSize: "11px",
    padding: "8px",
    minHeight: "unset",
    "&.Mui-selected": {
        color: "white",
    },
    "&.Mui-disabled": {
        color: "#eee",
        background: "#aaa"
    }
});

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
    top: 'calc(50% - 25px)',
    left: '50%',
    bottom: '0',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    maxWidth: "500px",
    height: "80dvh",
    overflow: "hidden",
    bgcolor: 'background.paper',
    borderRadius: 1.5,
    boxShadow: 24,
    paddingBottom: 6,
    paddingTop: 0,
};

export const bottomNavStyle = {
    zIndex: 2000, 
    position: "fixed", 
    top: "auto", 
    bottom: "8px", 
    left: "8px", 
    right: "8px", 
    width: "calc(100% - 16px)", 
    maxWidth: "680px", 
    margin: "auto",
    borderRadius: "8px"
}

export const choresTypeEdit_header = {
    marginBottom: 2,
    paddingBottom: 1, 
    borderBottom: 2, 
    borderColor: 'primary.main',
    fontWeight: 600,
}
export const choresListEdit_closeIcon = {
    position: "absolute",
    right: 0,
    top: 0
}

// MUIデフォルトスタイルを上書き
export const Mui_TextField_defaultStyle = {
    backgroundColor: "#fff",
    input:{
        padding: "8px 14px",
        fontSize: "13px",
    },
}

export const Mui_Button_defaultStyle = {
    backgroundColor: "#fff",
    padding: "2px 8px",
    fontSize: "13px"
}

