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