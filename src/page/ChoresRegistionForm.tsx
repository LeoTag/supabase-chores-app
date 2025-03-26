import { Box, Button, Divider, Typography } from '@mui/material'
import Modal from '@mui/material/Modal';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react'
import { modalStyle } from '../assets/styles'

const ChoresRegistionForm = () => {
    return (
        <Box>
            <p>aaa</p>
        </Box>
    )
}

const ChoresRegistionModal = () => {
    const [open, setOpen] = useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
      <>
        <Button variant='contained' color="warning" onClick={handleOpen} startIcon={<SettingsIcon />}>
            お手伝いの種類を変更する
        </Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">
                    お手伝い項目の管理
                </Typography>
                <Divider sx={{margin: "8px 0 12px"}} />
                <ChoresRegistionForm />
            </Box>
        </Modal>
      </>
    );
}

export default ChoresRegistionModal