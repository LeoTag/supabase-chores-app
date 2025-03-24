import Box from '@mui/material/Box';
import { Button, Checkbox, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { ChoresHistoryProps } from '../config/types'
import { supabase } from '../config/supabase'
import { mutate } from 'swr'
import fetchChoresHistory from '../api/fetchChoresHistory'

/**
 * お手伝い履歴を取得
 * @param setTotalPoint お手伝いの合計ポイント
 * @param chores_history お手伝い履歴
 * @param count お手伝い履歴の件数
 * @returns
 */
const ChoresHistory = ({selectedKid, setTotalPoint, chores_history, count}:ChoresHistoryProps) => {
    const [checked, setChecked] = useState<number[]>([]);

    useEffect(() => {
        if(chores_history === undefined) return;
        const result = chores_history?.reduce((a, b) => a + b.chores_type.point, 0);
        setTotalPoint(result);
    })

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

    const handleDeleteItems = () => async () => {
        const { error } = await supabase.from('chores_history').delete().in("id", checked);
        if (error) {
            console.error(error);
        } else {
            mutate(() => fetchChoresHistory(selectedKid.id), true);
        }
    }

    const handleResetChecked = () => () => {
        setChecked([])
    }

    const nowMonth = new Date().getMonth() + 1;

    return (
        <Box>
            <Typography variant='h6'>{nowMonth}月のお手伝い履歴（{count}回）</Typography>
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

            {
                checked.length > 0 && <Stack direction="row" spacing={2} position={'fixed'} bottom={0} left={0} right={0} padding={1} sx={{ justifyContent: "center", alignItems: "center", backgroundColor: "white"}}>
                    <Button onClick={handleResetChecked()} variant='outlined' color="primary">リセット</Button>
                    <Button onClick={handleDeleteItems()} variant='contained' color="error">選択項目を削除</Button>
                </Stack>
            }
      </Box>
    )
}

export default ChoresHistory;