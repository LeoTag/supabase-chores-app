import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

const putSnackbar = (message:string, open: boolean, setSnackbar: (open: boolean) => void) => {
    const handleClose = (_e: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => {
        if (reason === 'clickaway') return;
        setSnackbar(false);
    };
  
    return (
        
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                message={message}
            />
        
    );
}

export default putSnackbar;