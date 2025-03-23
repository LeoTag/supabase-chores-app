import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Stack from '@mui/material/Stack';
import TabPanel from '@mui/lab/TabPanel';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { AppBar, List, ListItem, ListItemButton, ListItemText, Tabs, Typography } from '@mui/material'
import ChoresSheetDrawer from './component/ChoresSheet';
import ChoresHistory from './component/ChoresHistory'
import { supabase } from './config/supabase';

 export type KidProps = {
    name: string,
    grade_id: number | null,
    thumbnail: String | null,
    school_grade: {
        grade: string,
        point: number
    }
}

const App = () => {
    const { data: kids } = useQuery(
        supabase
            .from("kids")
            .select(`
                id, name, thumbnail, 
                school_grade(grade, point)
            `)
            .order("id"),
    );

    const [selectedKidId, setSelectedKidId] = React.useState(1);
    const [selectedKidName, setSelectedKidName] = React.useState("");
    const [totalPoint, setTotalPoint] = React.useState(0);
    const [value, setValue] = React.useState(1);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    // 当月の取得
    const nowDate = new Date();
    const nowYear = nowDate.getFullYear();
    const nowMonth = nowDate.getMonth() + 1;

    console.log(nowYear, nowMonth)

    /**
     * お手伝い履歴を追加
     * @param choresId お手伝いID
     */
    const setAddChoresHistory = async (choresId: number) => {
        const date = new Date().toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit",day: "2-digit"}).replace(/\//g, '-');
        const { error } = await supabase
            .from('chores_history')
            .insert({ kid_id: selectedKidId, point_type_id: choresId, created_at: date});
    }

    return (
        <Box>
            <TabContext value={value}>
                <AppBar position="sticky">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                    >
                        {
                            kids?.map((kid) => (
                                <Tab label={kid.name} value={kid.id} key={kid.id} className="l-header__tablist__item" onClick={()=>{
                                    setSelectedKidId(kid.id)
                                    setSelectedKidName(kid.name)
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
                                            <ListItemText primary={`お手伝いポイント：${totalPoint.toLocaleString()}円`}/>
                                        </ListItem>
                                    </List>
                                </Stack>
                            </Stack>
                            
                            <ChoresHistory kidId={kid.id} setTotalPoint={setTotalPoint} nowYear={nowYear} nowMonth={nowMonth} />
                        </TabPanel>
                    ))
                }
            </TabContext>
            <ChoresSheetDrawer setAddChoresHistory={setAddChoresHistory} selectedKidName={selectedKidName} />
        </Box>
    )
}

export default App;