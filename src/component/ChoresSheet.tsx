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
    selectedKidName: string;
}

const ChoresSheetDrawer = ({setAddChoresHistory, selectedKidName}: ChoresSheetDrawerProps) => {
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
    }

    return (
        <Box padding={2}>
            <Button onClick={toggleDrawer(true)} variant='contained' sx={buttonStyle} 
                endIcon={<AddCircleIcon sx={{marginTop: "4px", marginLeft: "-9px"}} />}
            >
                お手伝いを管理
            </Button>

            <Drawer open={drawerOpen} onClose={toggleDrawer(false)} anchor="right">
                <Box padding={2} sx={{textAlign: 'center'}}>
                    <Typography variant='h6' marginBottom={1} color='primary'>
                        {selectedKidName}
                        <Typography variant='body2' color='textPrimary' sx={{display: 'inline-block'}}>にお手伝いポイントを付与</Typography>
                    </Typography>
                    {
                        chores_type?.map(chores => 
                            <Card className="p-chores__card" key={chores.id}>
                                <CardActionArea onClick={handleToggle(chores.id)}>
                                    <Stack direction="row" sx={{justifyContent: "start", alignItems: "flex-start"}}>
                                        <Checkbox
                                            checked={checked.includes(chores.id)}
                                            disableRipple
                                            sx={{ padding: 1, paddingRight: 0 }}
                                        />
                                        <CardContent sx={{padding: "8px !important" as "8px"}}>
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
                    <Button onClick={setAddChoresHistory(checked, resetChecked)} variant='contained'>
                        選択した項目でポイント付与
                    </Button>
                </Box>
                <hr />
                <Box padding={2} sx={{textAlign: 'center'}}>
                    <Button onClick={toggleDrawer(false)} variant='contained'
                        endIcon={<SettingsIcon />}
                    >
                        お手伝い項目を設定
                    </Button>
                </Box>
            </Drawer>
      </Box>
    )
}

export default ChoresSheetDrawer;