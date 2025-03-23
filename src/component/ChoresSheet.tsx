import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import { Button, Checkbox, Drawer, Typography } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react'
import { supabase } from '../config/supabase';
import { KidProps } from '../App'

const buttonStyle = {
    position: 'fixed',
    bottom: '10%',
    right: '16px',
    zIndex: 1000,
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
    padding: '10px 12px',
    minWidth: '36px',
}

export type ChoresSheetDrawerProps = {
    setAddChoresHistory: (choresId: Number[], resetChecked: () => void) => () => void;
    selectedKid: KidProps;
}

const ChoresSheetDrawer = ({setAddChoresHistory, selectedKid}: ChoresSheetDrawerProps) => {
    const { data: chores_type } = useQuery(
        supabase
            .from("chores_type")
            .select("*")
            .order("point", {ascending: false})
            .order("id")
    );

    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };

    const [checked, setChecked] = useState<Number[]>([]);
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
        console.log("snackbarを出したい");
        console.log("historyをfetchする");
    }

    return (
        <Box padding={2}>
            <Button onClick={toggleDrawer(true)} variant='contained' sx={buttonStyle} 
                startIcon={<AddCircleIcon sx={{marginBottom: "6px", marginRight: 0, marginLeft: "7px"}} />}
            >
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
                    <Button onClick={setAddChoresHistory(checked, resetChecked)} variant='contained'
                        disabled={!checked.length}
                    >
                        お手伝いポイントを付与
                    </Button>
                </Box>
                <Box padding={2} sx={{textAlign: 'center'}} position={'absolute'} bottom={16} width={'100%'}>
                    <hr style={{marginBottom: "16px"}} />
                    <Button variant='contained' endIcon={<SettingsIcon />}>
                        お手伝い項目を管理（未）
                    </Button>
                </Box>
            </Drawer>
      </Box>
    )
}

export default ChoresSheetDrawer;