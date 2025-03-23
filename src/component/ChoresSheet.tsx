import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import { Button, Drawer, Typography } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from 'react'
import { supabase } from '../config/supabase';

const buttonStyle = {
    position: 'fixed',
    bottom: '10%',
    right: '0px',
    zIndex: 1000,
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
    padding: '10px 12px',
    minWidth: '36px',
}

export type ChoresSheetDrawerProps = {
    setAddChoresHistory: (choresId: number) => void;
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

    const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
    };

    return (
        <Box padding={2}>
            <Button onClick={toggleDrawer(true)} variant='contained' sx={buttonStyle} 
                endIcon={<AddCircleIcon sx={{marginTop: "4px", marginLeft: "-9px"}} />}
            >
                お手伝いを管理
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
                <Box padding={2}>
                    <Typography variant='body1' marginBottom={1}>{selectedKidName}にお手伝いポイントを付与</Typography>
                    {
                        chores_type?.map(chores => 
                            <Card className="p-chores__card" key={chores.id}>
                                <CardActionArea onClick={() => setAddChoresHistory(chores.id)}>
                                    <CardContent sx={{padding: 1.5}}>
                                        <Stack direction="row" spacing={2} sx={{justifyContent: "space-between"}}>
                                            <h4 className="p-chores__card__title">{chores.title}</h4>
                                            <h4 className="p-chores__card__point"><strong>{chores.point}</strong>ポイント</h4>
                                        </Stack>
                                        <p className="p-chores__card__description">{chores.description}</p>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )
                    }
                </Box>
            </Drawer>
      </Box>
    )
}

export default ChoresSheetDrawer;