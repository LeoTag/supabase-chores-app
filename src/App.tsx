import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Stack from '@mui/material/Stack';
import TabPanel from '@mui/lab/TabPanel';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { createClient } from "@supabase/supabase-js";
import { Checkbox, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import ChoresSheetDrawer from './component/ChoresSheet';
import ChoresHistory from './component/ChoresHistory'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

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

    const [value, setValue] = React.useState(1);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    // 今月の取得
    const nowDate = new Date();
    const nowYear = nowDate.getFullYear();
    const nowMonth = nowDate.getMonth() + 1;

    console.log(nowYear, nowMonth)

    return (
        <Box>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="kidsTab" variant="fullWidth" className="l-header__tablist">
                        {
                            kids?.map((kid) => (
                                <Tab label={kid.name} value={kid.id} key={kid.id} className="l-header__tablist__item" />
                            ))
                        }
                </TabList>
                </Box>
                    {
                    kids?.map((kid) => (
                        <TabPanel value={kid.id} key={kid.id} sx={{padding: 2}}>
                            <Stack direction="row" spacing={4} sx={{ alignItems: 'center'}} className="p-chores__kids" marginBottom={3}>
                                <div><img src={`assets/images/${kid.thumbnail}`} width={116} alt="" /></div>
                                <div>
                                    <Typography variant="h5" component="h1">{kid.name}</Typography>
                                    <Typography variant="body2">{kid.school_grade.grade}</Typography>

                                    <ul>
                                        <li>お小遣い：{kid.school_grade.point.toLocaleString()}円</li>
                                        <li>お手伝いP</li>
                                    </ul>
                                </div>
                            </Stack>
                            
                            <ChoresHistory kidId={kid.id} nowYear={nowYear} nowMonth={nowMonth} />
                        </TabPanel>
                    ))
                }
            </TabContext>
            <ChoresSheetDrawer />
        </Box>
    )
}

export default App;