import { useEffect, useState } from 'react'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Stack from '@mui/material/Stack';
import TabPanel from '@mui/lab/TabPanel';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { mutate } from "swr";
import { AppBar, List, ListItem, ListItemText, Tabs, ThemeProvider, Typography } from '@mui/material'
import ChoresSheetDrawer from './component/ChoresSheet';
import ChoresHistory from './component/ChoresHistory'
import { supabase } from './config/supabase';
import fetchChoresHistory from './api/fetchChoresHistory'
import fetchKids from './api/fetchKids'
import { muiThemeStyle } from './assets/styles'
import { KidProps } from './config/types'

const App = () => {
    const [selectedKid, setSelectedKid] = useState({} as KidProps);
    const [totalPoint, setTotalPoint] = useState(0);
    const [tabValue, setTabValue] = useState(1);

    // DB Connect
    const { data: kids } = useQuery(fetchKids(), { revalidateOnFocus: false, revalidateOnReconnect: false,});
    const { data: chores_history, count } = useQuery(
        fetchChoresHistory(selectedKid.id),
        { revalidateOnFocus: true, revalidateOnReconnect: true,}
    );
    
    const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    }

    useEffect(() => {
        if(selectedKid.id) return;
        if(!kids || kids.length === 0) return;
        setSelectedKid(kids[0]);
    }, [kids]);

    /**
     * お手伝い履歴を追加
     * @param choresId お手伝いID
     * @param resetChecked チェックボックスをリセットする関数
     * @returns
     */
    const setAddChoresHistory = (choresId: number[], resetChecked: () => void) => async () => {
        const date = new Date().toLocaleDateString("ja-JP", {year: "numeric", month: "2-digit", day: "2-digit"}).replace(/\//g, '-');
        const insertData = choresId.map((id) => ({
            kid_id: selectedKid.id,
            point_type_id: id,
            created_at: date
        }));
    
        const { error } = await supabase.from('chores_history').insert(insertData);
    
        if (error) {
            console.error(error);
        } else {
            resetChecked();
            mutate(() => fetchChoresHistory(selectedKid.id), true);
        }
    };

    return (
        <ThemeProvider theme={muiThemeStyle}>
            <TabContext value={tabValue}>
                <AppBar position="sticky">
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                    >
                        {
                            kids?.map((kid) => (
                                <Tab label={kid.name} value={kid.id} key={kid.id} onClick={()=>{
                                    setSelectedKid(kid)
                                }} />
                            ))
                        }
                    </Tabs>
                </AppBar>
                {
                    kids?.map((kid) => (
                        <TabPanel value={kid.id} key={kid.id} sx={{padding: 2}}>
                            <Stack direction="row" spacing={4} sx={{ alignItems: 'center'}} marginBottom={1} padding={2} paddingTop={1} className="p-chores__kids">
                                <Stack><img src={`assets/images/${kid.thumbnail}`} width={130} alt="" /></Stack>
                                <Stack>
                                    <Typography variant="h5" component="h1">{kid.name}</Typography>
                                    <Typography variant="body1">{kid.school_grade.grade}</Typography>

                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemText primary={`基本のお小遣い：${kid.school_grade.point.toLocaleString()}円`}/>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemText primary={`お手伝いポイント：${totalPoint.toLocaleString()}P`}/>
                                        </ListItem>
                                    </List>
                                </Stack>
                            </Stack>
                            
                            {
                                chores_history && <ChoresHistory setTotalPoint={setTotalPoint} chores_history={chores_history} count={count} />
                            }
                        </TabPanel>
                    ))
                }
            </TabContext>
            <ChoresSheetDrawer setAddChoresHistory={setAddChoresHistory} selectedKid={selectedKid} />
        </ThemeProvider>
    )
}

export default App;