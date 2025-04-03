import Tab from '@mui/material/Tab';
import { KidProps } from '../config/types'
import { Dispatch } from 'react'
import { Paper, Tabs } from '@mui/material'

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

export default HeaderTab