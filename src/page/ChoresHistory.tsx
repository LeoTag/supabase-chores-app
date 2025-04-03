import Box from '@mui/material/Box';
import { Button, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { memo, useEffect, useState } from 'react'
import { KidProps } from '../config/types'
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
    return (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center'}} marginBottom={1} padding={2} paddingTop={1} className="p-chores__kids">
            <Stack width={110} height={110}><img src={`assets/images/${selectedKid.thumbnail}`} alt="" /></Stack>
            <Stack>
                <Typography variant="h5" component="h1">{selectedKid.name}</Typography>
                <Typography variant="subtitle1">{selectedKid.school_grade.grade}</Typography>
                <Typography variant="body2">基本のお小遣い：{selectedKid.school_grade.point.toLocaleString()}円</Typography>
                <Typography variant="body2">お手伝いポイント：{totalPoint.toLocaleString()}P</Typography>
            </Stack>
        </Stack>
    )
})

const ChoresHistoryList = memo(({
    selectedKid,
    selectedPeriod,
    setTotalPoint,
    setHistoryCount
}:{
    selectedKid: KidProps
    selectedPeriod: Date
    setTotalPoint: React.Dispatch<React.SetStateAction<number>>
    setHistoryCount: React.Dispatch<React.SetStateAction<number>>
}) => {
    const [checked, setChecked] = useState<number[]>([]);
    
    const { data: chores_history, count } = useQuery(
        fetchChoresHistory(selectedKid.id, selectedPeriod),
        { revalidateOnFocus: false, revalidateOnReconnect: false,}
    );

    useEffect(() => {
        if(!chores_history) return;
        const result = chores_history?.reduce((a, b) => a + b.chores_type.point, 0);
        setTotalPoint(result);
        if(count) setHistoryCount(count)
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
        {
            !count
            ? <Typography variant='body1' textAlign={'center'} marginTop={5}>履歴はありません</Typography>
            : <List sx={{ width: '100%', bgcolor: 'background.paper', marginBottom: "40px" }}>
                {
                chores_history?.map((history) => (
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
                            <ListItemText id={`checkbox-list-label-${history.id}`} primary={history.chores_type.title} />
                        </ListItemButton>
                    </ListItem>
                ))
                }
            </List>
        }
        {
            checked.length > 0 && <Stack direction="row" spacing={2} position={'fixed'} bottom={0} left={0} right={0} padding={1} sx={{ justifyContent: "center", alignItems: "center", backgroundColor: "white"}}>
                <Button onClick={handleResetChecked()} variant='outlined'>リセット</Button>
                <Button onClick={handleDeleteItems()} variant='contained'>選択項目を削除</Button>
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
    const [totalPoint, setTotalPoint] = useState(0);
    const [historyCount, setHistoryCount] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState(new Date())
    const nowDate = new Date()
    const prevMonth = selectedPeriod.getMonth() > 0 
                        ? new Date(selectedPeriod.getFullYear(), selectedPeriod.getMonth(), 0)
                        : new Date(selectedPeriod.getFullYear() - 1, 12, 0);
    const nowMonth  = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0);
    const nextMonth = new Date(selectedPeriod.getFullYear(), selectedPeriod.getMonth()+2, 0)

    const nowMonthDigits = ("0"+Number(nowMonth.getMonth())).slice(-2);
    const nextMonthDigits = ("0"+Number(nextMonth.getMonth())).slice(-2);
    const nextFlag = String(nowMonth.getFullYear()+nowMonthDigits) >= String(nextMonth.getFullYear()+nextMonthDigits)

    return (
        <TabPanel value={selectedKid.id} key={selectedKid.id} sx={{padding: 2}}>
            <KidProfile selectedKid={selectedKid} totalPoint={totalPoint} />

            <Box>
                <Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
                    <IconButton color="primary" aria-label="前の月へ" onClick={() => setSelectedPeriod(prevMonth)}>
                        <ArrowLeft />
                    </IconButton>
                    <Typography variant='h6'>{selectedPeriod.getMonth() + 1}月のお手伝い履歴（{historyCount}回）</Typography>
                    {
                        <IconButton 
                            color="primary" 
                            aria-label="次の月へ" 
                            onClick={() => setSelectedPeriod(nextMonth)}
                            disabled={!nextFlag}
                        >
                            <ArrowRight />
                        </IconButton>
                    }
                    
                </Stack>
                <ChoresHistoryList selectedKid={selectedKid} selectedPeriod={selectedPeriod} setTotalPoint={setTotalPoint} setHistoryCount={setHistoryCount} />
            </Box>
        </TabPanel>
    )
})

export default TabPanelContent;