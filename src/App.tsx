import { useEffect, useState } from 'react'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { mutate } from "swr";
import { AppBar, Tabs, ThemeProvider } from '@mui/material'
import ChoresSheetDrawer from './page/ChoresDrawer';
import { supabase } from './config/supabase';
import { muiThemeStyle } from './assets/styles'
import TabPanelContent from './page/ChoresHistory'
import { KidProps } from './config/types'
import fetchChoresHistory from './api/fetchChoresHistory'

const App = () => {
    // ローカル以外ではコンソール無効
    if (import.meta.env.VITE_APP_ENV !== 'local') {
        console.log = console.info = console.debug = console.warn = console.error = () => {};
    }

    console.log("=====================");
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

    console.log("▼App：", selectedKid.name)
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
            <TabContext value={tabValue} key={selectedKid.id}>
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
                                <Tab label={kid.name} value={kid.id} key={kid.id} onClick={() => setSelectedKid(kid)} />
                            ))
                        }
                    </Tabs>
                </AppBar>
                {
                    kids?.map((kid) => (
                        <TabPanelContent selectedKid={kid} key={kid.id} />
                    ))
                }
            </TabContext>
            <ChoresSheetDrawer setAddChoresHistory={setAddChoresHistory} selectedKid={selectedKid} />
        </ThemeProvider>
    )
}

export default App;