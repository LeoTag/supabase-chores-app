import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Button, DialogTitle, IconButton, Typography, Dialog, DialogContent, DialogActions } from '@mui/material'
import { Dispatch, memo, useState } from 'react'
import fetchChoresType from '../api/fetchChoresType'
import { ChoresTypeProps, KidProps } from '../config/types'
import { dialogStyle } from '../assets/styles'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const ChoresCheckedList = ({
    chores,
    checked,
    setChecked,
}:{
    chores: ChoresTypeProps
    checked: number[]
    setChecked: Dispatch<React.SetStateAction<number[]>>
}) => {
    const [counter, setCounter] = useState(0);
    const handleRemove = (chores_id: number) => () => {
        setCounter(counter > 0 ? counter - 1: 0)
        const val_index = checked.lastIndexOf(chores_id)
        if(val_index !== -1) {
            checked.splice(val_index, 1); 
            setChecked([...checked]);
        }
    };
    const handleAdd = (chores_id: number) => () => {
        setCounter(counter < 5 ? counter + 1 : 5)
        setChecked([...checked, chores_id]);
    };

    return (
        <Card className="p-chores__card" key={chores.id}>
            <Stack direction="row" sx={{justifyContent: "start", alignItems: "flex-start"}}>
                <CardContent sx={{padding: "8px 8px 0 !important", width: "100%", justifyContent: "space-between"}}>
                    <Stack direction="row" spacing={2} sx={{justifyContent: "space-between"}}>
                        <h4 className="p-chores__card__title">{chores.title}</h4>
                        <h4 className="p-chores__card__point"><strong>{chores.point}</strong>ポイント</h4>
                    </Stack>
                    <p className="p-chores__card__description">{chores.description}</p>
                </CardContent>
            </Stack>
        
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                <IconButton 
                    color="primary"
                    disabled={counter === 0}
                    onClick={handleRemove(chores.id)}
                >
                    <RemoveCircleIcon />
                </IconButton>
                <Typography variant="body2" color="textPrimary">{counter}</Typography>
                <IconButton 
                    color="primary" 
                    disabled={counter === 5}
                    onClick={handleAdd(chores.id)}
                >
                    <AddCircleIcon />
                </IconButton>
            </Stack>
        </Card>
    )
}


const ChoresSheetDialog = memo(({
    setAddChoresHistory,
    kids,
    selectedKid,
    setSelectedKid,
    dialogOpen,
    setDialogOpen
}: {
    setAddChoresHistory: (choresId: number[], resetChecked: () => void) => () => void;
    kids: KidProps[] | null | undefined
    selectedKid: KidProps;
    setSelectedKid: Dispatch<React.SetStateAction<KidProps>>
    dialogOpen: boolean;
    setDialogOpen: Dispatch<React.SetStateAction<boolean>>;
}
) => {
    const { data: chores_type } = useQuery(fetchChoresType(), { revalidateOnFocus: false, revalidateOnReconnect: false });
    const toggleDialog = (newOpen: boolean) => () => {
        setDialogOpen(newOpen);
    };

    const [checked, setChecked] = useState<number[]>([]);
    const resetChecked = () => {
        setChecked([]);
        setDialogOpen(false);
    }

    const changeKid = (value: string) => () => {
        if(!kids) return
        const current = kids?.indexOf(selectedKid)
        
        if (value === "prev") {
            const prev = current === 0 ? kids?.length - 1 : current! - 1;
            setSelectedKid(kids[prev]);
        }else if (value === "next") {
            const next = current === kids?.length - 1 ? 0 : current! + 1;
            setSelectedKid(kids[next]);
        }
    }

    return (
        <Box padding={0}>
            <Dialog
                onClose={toggleDialog(false)}
                open={dialogOpen}
                sx={dialogStyle}
            >
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
                        <Stack>
                            <IconButton color="primary" onClick={changeKid("prev")}><ArrowLeft /></IconButton>
                        </Stack>
                        <Stack>
                            <img src={`assets/images/${selectedKid.thumbnail}`} width={70} alt="" />
                        </Stack>
                        <Stack>
                            <Typography variant='h6' color='primary'>
                                {selectedKid.name}
                                <Typography variant='body2' color='textPrimary' sx={{display: "inline"}}>への</Typography>
                            </Typography>
                            <Typography variant='body2' color='textPrimary'>お手伝いポイント</Typography>
                        </Stack>
                        <Stack>
                            <IconButton color="primary" onClick={changeKid("next")}><ArrowRight /></IconButton>
                        </Stack>
                    </Stack>
                </DialogTitle>

                <DialogContent dividers>
                    {
                        chores_type && chores_type.length > 0 
                        && chores_type.map((chores) => 
                            <ChoresCheckedList key={chores.id} chores={chores} checked={checked} setChecked={setChecked} />
                        )
                    }
                </DialogContent>

                <DialogActions sx={{justifyContent: "center"}}>
                    <Button onClick={setAddChoresHistory(checked, resetChecked)} variant='contained' disabled={!checked.length}>
                        お手伝いポイントを付与
                    </Button>
                </DialogActions>
            </Dialog>
      </Box>
    )
})

export default ChoresSheetDialog;