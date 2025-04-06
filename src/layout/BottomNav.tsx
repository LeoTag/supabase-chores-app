import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { AppBar, Tabs } from '@mui/material'
import { Dispatch, useState } from 'react'
import fetchChoresHistory from '../api/fetchChoresHistory'
import GiveChoresPointsDialog from '../page/GiveChoresPointsDialog';
import { mutate } from "swr";
import { supabase } from '../config/supabase'
import { KidProps } from '../config/types'
import ChoresRegistionDialog from '../page/ChoresRegistionDialog'
import { bottomNavStyle, StyledTab } from '../assets/styles'
import KidsManagementDialog from '../page/KidsManagement'
import getSchoolGrade from '../api/schoolGrade'

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
    const [giveChoresPointOpen, setGiveChoresPointOpen] = useState<boolean>(false);
    const [choresSettingOpen, setChoresSettingOpen] = useState(false);
    const [kidsManagementOpen, setKidsManagementOpen] = useState(false);
    const { data: school_grade } = getSchoolGrade()
    
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

    const handleChoresSetting = () => () => {
        setGiveChoresPointOpen(false)
        setKidsManagementOpen(false)
        setChoresSettingOpen(!choresSettingOpen);
    }
    const handleGiveChoresPointDialog = () => () => {
        setChoresSettingOpen(false)
        setKidsManagementOpen(false)
        setGiveChoresPointOpen(!giveChoresPointOpen);
    }

    const handleKidsManagement = () => () => {
        setChoresSettingOpen(false)
        setGiveChoresPointOpen(false)
        setKidsManagementOpen(!kidsManagementOpen);
    }

    return (
        <>
        <ChoresRegistionDialog choresSettingOpen={choresSettingOpen} setChoresSettingOpen={setChoresSettingOpen} />
        <GiveChoresPointsDialog 
            setAddChoresHistory={setAddChoresHistory} 
            kids={kids}
            selectedKid={selectedKid}
            setSelectedKid={setSelectedKid}
            dialogOpen={giveChoresPointOpen} 
            setDialogOpen={setGiveChoresPointOpen}
        />
        <KidsManagementDialog kids={kids} school_grade={school_grade} kidsManagementOpen={kidsManagementOpen} setKidsManagementOpen={setKidsManagementOpen} />

        <AppBar elevation={3} sx={bottomNavStyle}>
            <Tabs
                value={bottomNav}
                variant="fullWidth"
                onChange={(_e, newValue) => {setBottomNav(newValue)}}
            >
                <StyledTab label="お手伝い設定" icon={<PlaylistAddCheckIcon />} onClick={handleChoresSetting()} />
                <StyledTab label="ポイントをあげる" icon={<AutoAwesomeIcon />} onClick={handleGiveChoresPointDialog()} />
                <StyledTab label="キッズ管理" icon={<ManageAccountsIcon />} onClick={handleKidsManagement()} />
            </Tabs>
        </AppBar>
        </>
    )
}

export default BottomNav