import Box from '@mui/material/Box';
import { Checkbox, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { ChoresHistoryProps } from '../config/types'

/**
 * お手伝い履歴を取得
 * @param setTotalPoint お手伝いの合計ポイント
 * @param chores_history お手伝い履歴
 * @param count お手伝い履歴の件数
 * @returns
 */
const ChoresHistory = ({setTotalPoint, chores_history, count}:ChoresHistoryProps) => {
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

    const nowMonth = new Date().getMonth() + 1;

    return (
        <Box>
            <Typography variant='h6'>{nowMonth}月のお手伝い履歴（{count}回）</Typography>
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