import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { AppBar, Box, Tabs } from '@mui/material'
import { Dispatch, useState } from 'react'
import fetchChoresHistory from '../api/fetchChoresHistory'
import ChoresSheetDrawer from './ChoresDrawer';
import { mutate } from "swr";
import { supabase } from '../config/supabase'
import { KidProps } from '../config/types'
import ChoresRegistionModal from './ChoresRegistionForm'
import { StyledTab } from '../assets/styles'

const BottomNav = ({
    kids,
    selectedKid,
    setSelectedKid
}: {
    kids: KidProps[] | null | undefined
    selectedKid: KidProps
    setSelectedKid: Dispatch<React.SetStateAction<KidProps>>
}) => {
    const [bottomNav, setBottomNav] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState(false);

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

    const handleToggleModal = () => () => {
        setDrawerOpen(false)
        setModalOpen(!modalOpen);
    }
    const handleToggleDrawer = () => () => {
        setModalOpen(false)
        setDrawerOpen(!drawerOpen);
    }

    return (
        <>
        <ChoresSheetDrawer 
            setAddChoresHistory={setAddChoresHistory} 
            kids={kids}
            selectedKid={selectedKid}
            setSelectedKid={setSelectedKid}
            drawerOpen={drawerOpen} 
            setDrawerOpen={setDrawerOpen}
         />

        <Box padding={2} sx={{textAlign: 'center'}} width={'100%'}>
            <ChoresRegistionModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </Box>
        
        <AppBar elevation={3} sx={{ zIndex: 2000, position: "absolute", top: "auto", bottom: "0px", left: "8px", width: "calc(100% - 16px)", borderRadius: "8px" }}>
            <Tabs
                value={bottomNav}
                variant="fullWidth"
                onChange={(_e, newValue) => {setBottomNav(newValue)}}
            >
                <StyledTab label="お手伝い設定" icon={<PlaylistAddCheckIcon />} onClick={handleToggleModal()} />
                <StyledTab label="ポイントをあげる" icon={<AutoAwesomeIcon />} onClick={handleToggleDrawer()} />
                <StyledTab label="キッズ管理" icon={<ManageAccountsIcon />} disabled />
            </Tabs>
        </AppBar>
        </>
    )
}

export default BottomNav