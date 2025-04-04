import { useEffect, useState } from 'react'
import TabContext from '@mui/lab/TabContext';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";

import { Box, Button, Stack, ThemeProvider, Typography } from '@mui/material'

import { supabase } from './config/supabase';
import { muiThemeStyle } from './assets/styles'
import TabPanelContent from './page/ChoresHistory'
import { KidProps } from './config/types'

import { TabPanel } from '@mui/lab'
import BottomNav from './page/BottomNav'
import HeaderTab from './page/HeaderTab'


const App = () => {
    // ローカル以外ではコンソール無効
    if (import.meta.env.VITE_APP_ENV !== 'local') {
        console.log = console.info = console.debug = console.warn = console.error = () => {};
    }

    const [selectedKid, setSelectedKid] = useState({} as KidProps);
    const [tabValue, setTabValue] = useState(1);
    const { data: kids } = useQuery(
        supabase
            .from("kids")
            .select(`
                id, name, thumbnail, 
                school_grade(grade, point)
            `)
            .order("id"),
            { revalidateOnFocus: false, revalidateOnReconnect: false,}
    );

    console.log("=====================");
    console.log("▼App：", selectedKid.name)

    useEffect(() => {
        if(selectedKid.id) return;
        if(!kids || kids.length === 0) return;
        setSelectedKid(kids[0]);
    }, [kids]);


    
    return (
        <ThemeProvider theme={muiThemeStyle}>
            <TabContext value={tabValue} key={selectedKid.id}>
                <HeaderTab kids={kids} setSelectedKid={setSelectedKid} tabValue={tabValue} setTabValue={setTabValue} />

                {
                    kids?.map((kid) => (
                        // kid.name === "はなこ"
                        //     ? ""
                            <TabPanelContent selectedKid={kid} key={kid.id} />
                    ))
                }
                <TabPanel value="manage" key="manage" sx={{padding: 2, paddingTop: 4}}>
                    {
                        kids?.map((kid) => (
                            <>
                            <Stack direction="row" justifyContent="space-evenly" alignItems="center" marginBottom={3}>
                                <Stack>
                                    <img src={`assets/images/${kid.thumbnail}`} width={110} alt="" />
                                </Stack>
                                <Stack>
                                    <Typography variant='h6' color='primary'>{kid.name}</Typography>
                                    <Typography variant='body2' color='textPrimary'>{kid.school_grade.grade}</Typography>
                                    <Typography variant='body2' color='textPrimary'>基本のお小遣い：{kid.school_grade.point}円</Typography>
                                    <Button variant='outlined' size='small' sx={{marginTop: 1}}>編集</Button>
                                </Stack>
                            </Stack>
                            </>
                        ))
                    }
                    <Box textAlign="center">
                        <Button variant='contained'>キッズ追加</Button>
                    </Box>
                </TabPanel>
            </TabContext>

            <BottomNav kids={kids} selectedKid={selectedKid} setSelectedKid={setSelectedKid} />
        </ThemeProvider>
    )
}

export default App;