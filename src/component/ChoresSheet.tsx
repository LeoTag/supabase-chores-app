import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { createClient } from "@supabase/supabase-js";
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import { Button, Drawer, Typography } from '@mui/material'
import { useState } from 'react'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

 export type ChoresSheetProps = {
    id: number,
    title: string,
    point: number,
    description: string
}

const ChoresSheetDrawer = () => {

    const { data: chores_type } = useQuery(
        supabase
            .from("chores_type")
            .select("*")
            .order("id")
    );

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
    };

    return (
        <Box padding={2}>
            <Button onClick={toggleDrawer(true)}>お手伝い表を開く</Button>
            <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
                <Box padding={2}>
                    <Typography variant='h6' marginBottom={1}>お手伝い表</Typography>
                    {
                        chores_type?.map(chores => 
                            <Card className="p-chores__card" key={chores.id}>
                                <CardActionArea>
                                    {/* onClick={() => setSelectedCard(chores)} */}
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