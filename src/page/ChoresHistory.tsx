import Box from '@mui/material/Box';
import { Button, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemText, Snackbar, Stack, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useState } from 'react'
import { ChoresHistoryProps, KidProps } from '../config/types'
import { supabase } from '../config/supabase'
import { mutate } from 'swr'
import fetchChoresHistory from '../api/fetchChoresHistory'
import { TabPanel } from '@mui/lab'
import { useQuery } from '@supabase-cache-helpers/postgrest-swr'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'

export const KidProfile = memo(({
    selectedKid,
    totalPoint
}:{
    selectedKid:KidProps
    totalPoint: number
}) => {
    console.log("▼KidProfile");
    return (
        <Stack direction="row" spacing={4} sx={{ alignItems: 'center'}} marginBottom={1} padding={2} paddingTop={1} className="p-chores__kids">
            <Stack><img src={`assets/images/${selectedKid.thumbnail}`} width={130} alt="" /></Stack>
            <Stack>
                <Typography variant="h5" component="h1">{selectedKid.name}</Typography>
                <Typography variant="body1">{selectedKid.school_grade.grade}</Typography>

                <List>
                    <ListItem disablePadding>
                        <ListItemText primary={`基本のお小遣い：${selectedKid.school_grade.point.toLocaleString()}円`}/>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemText primary={`お手伝いポイント：${totalPoint.toLocaleString()}P`}/>
                    </ListItem>
                </List>
            </Stack>
        </Stack>
    )
})

const ChoresHistoryTitle = memo((chores_history) => {
    console.log("▼ChoresHistoryTitle");
    const [selectedPeriod, setSelectedPeriod] = useState(new Date())
    /**
     * お手伝い履歴の選択月を変更
     */
    useCallback(async(date: Date) => {
        console.log("▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼");
        // const { error } = await fetchChoresHistory(selectedKid.id, date)
        const { error } = await supabase
                            .from("chores_history")
                            .select(`
                                *,
                                kids(name),
                                chores_type(title, point)
                            `, { count: "exact" })
                            .eq('kid_id', 1)
                            .filter('created_at', 'gte', `2025-04-01`)
                            .filter('created_at', 'lt', `2025-05-01`)
                            .order("created_at", { ascending: false })
                            .order("id", { ascending: true })
        
        if (error){
            console.error("リクエストが処理できません。");
            console.error(error);
        }else{
            // mutate(() => fetchChoresHistory(selectedKid.id, date), true);
            mutate(() => supabase
                .from("chores_history")
                .select(`
                    *,
                    kids(name),
                    chores_type(title, point)
                `, { count: "exact" })
                .eq('kid_id', 1)
                .filter('created_at', 'gte', `2025-04-01`)
                .filter('created_at', 'lt', `2025-05-01`)
                .order("created_at", { ascending: false })
                .order("id", { ascending: true })
            , true);
        }
        console.log(chores_history);
        console.log("▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲");
    }, [selectedPeriod]);

    const nowMonth = 3
    const count = 10

    return (
        <Stack direction="row" justifyContent={'center'} alignItems={'center'}>
            <IconButton color="primary" aria-label="前の月へ" onClick={() => setSelectedPeriod(new Date("2025-02-01"))}>
                <ArrowLeft />
            </IconButton>
            <Typography variant='h6'>{nowMonth}月のお手伝い履歴（{count}回）</Typography>
            <IconButton color="primary" aria-label="次の月へ" onClick={() => setSelectedPeriod(new Date("2025-04-01"))}>
                <ArrowRight />
            </IconButton>
        </Stack>
    )
})


const ChoresHistoryList = memo(() => {
    console.log("▼ChoresHistoryList");
    
    const [checked, setChecked] = useState<number[]>([]);

    const { data: chores_history, count } = useQuery(
        supabase
        .from("chores_history")
        .select(`
            *,
            kids(name),
            chores_type(title, point)
        `, { count: "exact" })
        .eq('kid_id', 1)
        .filter('created_at', 'gte', `2025-03-01`)
        .filter('created_at', 'lt', `2025-04-01`)
        .order("created_at", { ascending: false })
        .order("id", { ascending: true }),
        { revalidateOnFocus: false, revalidateOnReconnect: false,}
    );

    
    useEffect(() => {
        if(!chores_history) return;
        const result = chores_history?.reduce((a, b) => a + b.chores_type.point, 0);
        // setTotalPoint(result);
    }, [chores_history])

    const handleCheckboxToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
  
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const handleDeleteItems = () => async () => {
        const { error } = await supabase.from('chores_history').delete().in("id", checked);
        if (error) {
            console.error(error);
        } else {
            mutate(() => supabase.from('chores_history').delete().in("id", checked), true);
        }
    }

    const handleResetChecked = () => () => {
        setChecked([])
    }

    return (
        <>
        <List sx={{ width: '100%', bgcolor: 'background.paper', marginBottom: "40px" }}>
            {
            chores_history?.map((history) => {
                const labelId = `checkbox-list-label-${history.id}`;

                return (
                <ListItem key={history.id} disablePadding
                    secondaryAction={
                        <Typography variant="body2" color="text.secondary">
                            {history.created_at}
                        </Typography>
                    }
                >
                    <ListItemButton role={undefined} onClick={handleCheckboxToggle(history.id)} dense>
                        <Checkbox
                            edge="start"
                            checked={checked.includes(history.id)}
                            tabIndex={-1}
                            disableRipple
                            sx={{ padding: 0, paddingRight: 1 }}
                        />
                        <ListItemText id={labelId} primary={history.chores_type.title} />
                    </ListItemButton>
                </ListItem>
                );
            })}
        </List>
        {
            checked.length > 0 && <Stack direction="row" spacing={2} position={'fixed'} bottom={0} left={0} right={0} padding={1} sx={{ justifyContent: "center", alignItems: "center", backgroundColor: "white"}}>
                <Button onClick={handleResetChecked()} variant='outlined' color="primary">リセット</Button>
                <Button onClick={handleDeleteItems()} variant='contained' color="error">選択項目を削除</Button>
            </Stack>
        }
        </>
    )
})


const TabPanelContent = memo(({
    selectedKid
}:{
    selectedKid: KidProps
}) => {
    // const [totalPoint, setTotalPoint] = useState(0);
    const totalPoint = 1800
    
    return (
        <TabPanel value={selectedKid.id} key={selectedKid.id} sx={{padding: 2}}>
            <KidProfile selectedKid={selectedKid} totalPoint={totalPoint} />
            <Box>
                <ChoresHistoryTitle />
                <ChoresHistoryList />
            </Box>
        </TabPanel>
    )
})

export default TabPanelContent;