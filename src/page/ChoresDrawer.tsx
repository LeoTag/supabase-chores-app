import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import { Button, Checkbox, Drawer, Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react'
import fetchChoresType from '../api/fetchChoresType'
import { buttonStyle } from '../assets/styles';
import { ChoresSheetDrawerProps } from '../config/types'
import putSnackbar from '../component/SnackBar'

const ChoresSheetDrawer = ({setAddChoresHistory, selectedKid}: ChoresSheetDrawerProps) => {
    const { data: chores_type } = useQuery(fetchChoresType(), { revalidateOnFocus: false, revalidateOnReconnect: false });
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<boolean>(false);
    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };

    const [checked, setChecked] = useState<number[]>([]);
    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const resetChecked = () => {
        setChecked([]);
        setDrawerOpen(false);
        setSnackbar(true)
    }

    return (
        <Box padding={2}>
            <Button onClick={toggleDrawer(true)} variant='contained' sx={buttonStyle}>
                お手伝いポイントを管理
            </Button>

            <Drawer open={drawerOpen} onClose={toggleDrawer(false)} anchor="right">
                <Box padding={2} sx={{textAlign: 'center'}}>
                    <img src={`assets/images/${selectedKid.thumbnail}`} width={80} alt="" style={{display: 'inline-block'}} />
                    <Typography variant='h6' marginBottom={1} color='primary'>
                        {selectedKid.name}
                        <Typography variant='body2' color='textPrimary' sx={{display: 'inline-block'}}>へのお手伝いポイント</Typography>
                    </Typography>
                    {
                        chores_type?.map(chores => 
                            <Card className="p-chores__card" key={chores.id}>
                                <CardActionArea onClick={handleToggle(chores.id)}>
                                    <Stack direction="row" sx={{justifyContent: "start", alignItems: "flex-start"}}>
                                        <Checkbox
                                            checked={checked.includes(chores.id)}
                                            disableRipple
                                            sx={{ padding: 1, paddingRight: 0}}
                                        />
                                        <CardContent sx={{padding: "8px !important" as "8px", width: "100%", justifyContent: "space-between"}}>
                                            <Stack direction="row" spacing={2} sx={{justifyContent: "space-between"}}>
                                                <h4 className="p-chores__card__title">{chores.title}</h4>
                                                <h4 className="p-chores__card__point"><strong>{chores.point}</strong>ポイント</h4>
                                            </Stack>
                                            <p className="p-chores__card__description">{chores.description}</p>
                                        </CardContent>
                                    </Stack>
                                </CardActionArea>
                            </Card>
                        )
                    }
                    <Button onClick={setAddChoresHistory(checked, resetChecked)} variant='contained' disabled={!checked.length}>
                        お手伝いポイントを付与
                    </Button>
                </Box>
                <hr style={{margin: "16px"}} />
                <Box padding={2} sx={{textAlign: 'center'}} width={'100%'}>
                    <Button variant='contained' disabled startIcon={<SettingsIcon />}>
                        お手伝い項目を管理<br />（未着手）
                    </Button>
                </Box>
            </Drawer>
            {
                putSnackbar("ポイントを追加しました", snackbar, setSnackbar)
            }
      </Box>
    )
}

export default ChoresSheetDrawer;