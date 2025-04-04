import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import { Button, Checkbox, Divider, Drawer, IconButton, Typography } from '@mui/material'
import { Dispatch, memo, useState } from 'react'
import fetchChoresType from '../api/fetchChoresType'
import { KidProps } from '../config/types'
import { drawerStyle } from '../assets/styles'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'

const ChoresSheetDrawer = memo(({
    setAddChoresHistory,
    kids,
    selectedKid,
    setSelectedKid,
    drawerOpen,
    setDrawerOpen
}: {
    setAddChoresHistory: (choresId: number[], resetChecked: () => void) => () => void;
    kids: KidProps[] | null | undefined
    selectedKid: KidProps;
    setSelectedKid: Dispatch<React.SetStateAction<KidProps>>
    drawerOpen: boolean;
    setDrawerOpen: Dispatch<React.SetStateAction<boolean>>;
}
) => {
    const { data: chores_type } = useQuery(fetchChoresType(), { revalidateOnFocus: false, revalidateOnReconnect: false });
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
            <Drawer open={drawerOpen} onClose={toggleDrawer(false)} anchor="bottom" sx={drawerStyle}>
                <Box padding={2} sx={{textAlign: 'center'}}>
                    <Stack direction="row" justifyContent="space-evenly" alignItems="center" marginBottom={2}>
                        <Stack>
                            <IconButton color="primary" onClick={changeKid("prev")}>
                                <ArrowLeft />
                            </IconButton>
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
                            <IconButton color="primary" onClick={changeKid("next")}>
                                <ArrowRight />
                            </IconButton>
                        </Stack>
                    </Stack>

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
                <Divider />
                
            </Drawer>
      </Box>
    )
})

export default ChoresSheetDrawer;