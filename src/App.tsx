import { useEffect, useState } from 'react'
import TabContext from '@mui/lab/TabContext';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";

import { ThemeProvider } from '@mui/material'

import { supabase } from './config/supabase';
import { muiThemeStyle } from './assets/styles'
import TabPanelContent from './page/ChoresHistory'
import { KidProps } from './config/types'

import BottomNav from './layout/BottomNav'
import HeaderTab from './layout/HeaderTab'


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
                *,
                school_grade(id, grade, point)
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
                        <TabPanelContent selectedKid={kid} key={kid.id} />
                    ))
                }
            </TabContext>

            <BottomNav kids={kids} selectedKid={selectedKid} setSelectedKid={setSelectedKid} />
        </ThemeProvider>
    )
}

export default App;