import Box from '@mui/material/Box';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { createClient } from "@supabase/supabase-js";
import { Checkbox, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
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

type ChoresHistoryProps = {
    kidId: number;
    nowYear: number;
    nowMonth: number;
}

const ChoresHistory = ({kidId, nowYear, nowMonth}:ChoresHistoryProps) => {
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
            .eq('kids_id', kidId)
            .filter('created_at', 'gte', `${nowYear}-${nowMonthDigits}-01`)
            .filter('created_at', 'lt', `${nowYear}-${nextMonthDigits}-01`)
            .order("id")
    );

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
            <h3>{nowMonth}月のお手伝い履歴</h3>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {
                chores_history?.map((history) => {
                    const labelId = `checkbox-list-label-${history.id}`;

                    return (
                    <ListItem key={history.id} disablePadding>
                        <ListItemButton role={undefined} onClick={handleToggle(history.id)} dense>
                    
                        <Checkbox
                            edge="start"
                            checked={checked.includes(history.id)}
                            tabIndex={-1}
                            disableRipple
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