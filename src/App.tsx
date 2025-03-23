import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Stack from '@mui/material/Stack';
import TabPanel from '@mui/lab/TabPanel';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

 export type KidProps = {
    name: string,
    grade_id: number | null,
    thumbnail: String | null,
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
            {
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
            }
    );

    const { data: chores_type } = useQuery(
        supabase
            .from("chores_type")
            .select("*"),
            {
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
            }
    );

    const [value, setValue] = React.useState(1);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    console.log(kids);
    console.log(chores_type);
    
    return (
        <Box>
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example" variant="fullWidth">
                    {
                        kids?.map((kid) => (
                            <Tab label={kid.name} value={kid.id} key={kid.id} />
                        ))
                    }
            </TabList>
            </Box>
                {
                kids?.map((kid) => (
                    <TabPanel value={kid.id} key={kid.id} sx={{padding: 2}}>
                        <Stack direction="row" spacing={2}>
                            <div><img src={`assets/images/${kid.thumbnail}`} width={100} alt="" /></div>
                            <div>
                                <h2>{kid.name}</h2>
                                {kid.school_grade.grade}<br />
                                <ul>
                                    <li>お小遣い：{kid.school_grade.point.toLocaleString()}円</li>
                                    <li>お手伝いP</li>
                                </ul>
                            </div>
                        </Stack>
                        <Stack>
                            {
                                chores_type?.map(point => 
                                    point.name
                                )
                            }
                        </Stack>

                    </TabPanel>
                ))
            }
        </TabContext>
      </Box>
    )
}

export default App;