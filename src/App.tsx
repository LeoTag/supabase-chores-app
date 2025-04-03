import { Dispatch, useEffect, useState } from 'react'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { mutate } from "swr";
import { AppBar, Box, Button, Paper, Stack, Tabs, ThemeProvider, Typography } from '@mui/material'
import ChoresSheetDrawer from './page/ChoresDrawer';
import { supabase } from './config/supabase';
import { muiThemeStyle } from './assets/styles'
import TabPanelContent from './page/ChoresHistory'
import { KidProps } from './config/types'
import fetchChoresHistory from './api/fetchChoresHistory'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { TabPanel } from '@mui/lab'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { styled } from "@mui/material/styles";

const HeaderTab = ({
    kids,
    setSelectedKid,
    tabValue,
    setTabValue,
}:{
    kids: KidProps[] | null | undefined,
    setSelectedKid: Dispatch<React.SetStateAction<KidProps>>,
    tabValue: number,
    setTabValue: Dispatch<React.SetStateAction<number>>
}) => {
    const kidsOver3 = kids && kids.length > 3 ? true : false

    return (
        <Paper color='accent' sx={{position: "sticky", margin: 1, width: "calc(100% - 16px)", borderRadius: "8px", overflow: "hidden", top: 0}}>
            <Tabs
                value={tabValue}
                onChange={(_e: React.SyntheticEvent, newValue: number) => {setTabValue(newValue)}}
                textColor="inherit"
                variant="fullWidth"
                sx={{borderWidth: 3}}
            >
                {
                    
                    kids?.map((kid) => (
                             <Tab
                                label={kid.name}
                                icon={<img src={`assets/images/${kid.thumbnail}`} width={40} alt="" />}
                                iconPosition={kidsOver3 ? 'top': 'start'}
                                value={kid.id}
                                key={kid.id}
                                sx={{padding:1}}
                                onClick={() => setSelectedKid(kid)}  />
                    ))
                }
            </Tabs>
        </Paper>
    )
}


const BottomNav = () => {
    const [bottomNav, setBottomNav] = useState(0);
    const StyledTab = styled(Tab)({
        color: "rgba(255,255,255,1)",
        fontSize: "11px",
        padding: "8px",
        minHeight: "unset",
        "&.Mui-selected": {
            color: "white",
        }
    });

    return (
        <AppBar elevation={3} sx={{ position: "absolute", top: "auto", bottom: "8px", left: "8px", width: "calc(100% - 16px)", borderRadius: "8px" }}>
            <Tabs
                value={bottomNav}
                variant="fullWidth"
                onChange={(_e, newValue) => {setBottomNav(newValue)}}
            >
                <StyledTab label="お手伝い設定" icon={<PlaylistAddCheckIcon />} />
                <StyledTab label="ポイントをあげる" icon={<AutoAwesomeIcon sx={{ color: "yellow" }} />} />
                <StyledTab label="キッズ管理" icon={<ManageAccountsIcon />} />
            </Tabs>
        </AppBar>
    )
}


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

            <BottomNav />
            <ChoresSheetDrawer setAddChoresHistory={setAddChoresHistory} selectedKid={selectedKid} />
        </ThemeProvider>
    )
}

export default App;