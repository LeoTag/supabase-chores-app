import Box from '@mui/material/Box';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Checkbox, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase';


type ChoresHistoryProps = {
    kidId: number;
    setTotalPoint: (point: number) => void;
    nowYear: number;
    nowMonth: number;
}

/**
 * お手伝い履歴を取得
 * @param kidId 子供のID
 * @param nowYear 履歴を取得する年
 * @param nowMonth 履歴を取得する月
 */
const ChoresHistory = ({kidId, setTotalPoint, nowYear, nowMonth}:ChoresHistoryProps) => {
    const nowMonthDigits = ("0"+nowMonth).slice(-2);
    const nextMonthDigits = ("0"+(nowMonth+1)).slice(-2);

    const { data: chores_history } = useQuery(
        supabase
            .from("chores_history")
            .select(`
                *,
                kids(name),
                chores_type(title, point)
            `)
            .eq('kid_id', kidId)
            .filter('created_at', 'gte', `${nowYear}-${nowMonthDigits}-01`)
            .filter('created_at', 'lt', `${nowYear}-${nextMonthDigits}-01`)
            .order("created_at", {ascending: false})
            .order("id", {ascending: true})
    );

    useEffect(() => {
        if(chores_history === undefined) return;
        const result = chores_history?.reduce((a, b) => a + b.chores_type.point, 0);
        setTotalPoint(result);
    })

    const [checked, setChecked] = useState([0]);
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

    return (
        <Box>
            <Typography variant='h6'>{nowMonth}月のお手伝い履歴（{chores_history?.length}回）</Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
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
                        <ListItemButton role={undefined} onClick={handleToggle(history.id)} dense>
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
      </Box>
    )
}

export default ChoresHistory;