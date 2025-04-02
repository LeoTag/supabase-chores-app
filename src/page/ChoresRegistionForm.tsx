import { Box, Button, InputAdornment, Snackbar, SnackbarCloseReason, Stack, Tab, TextField, Typography } from '@mui/material'
import Modal from '@mui/material/Modal';
import SettingsIcon from '@mui/icons-material/Settings';
import { memo, useEffect, useState } from 'react'
import { modalStyle } from '../assets/styles'
import { useForm, SubmitHandler } from "react-hook-form"
import { supabase } from '../config/supabase'
import { useQuery } from '@supabase-cache-helpers/postgrest-swr'
import { ChoresTypeProps } from '../config/types'
import { TabContext, TabList, TabPanel } from '@mui/lab'

/**
 * お手伝い項目の新規登録
 */
const ChoresRegistrationForm = memo(() => {
    // FIXME: バリデーション処理追加
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ChoresTypeProps>({
        defaultValues: {title: "", point: undefined, description: ""}
    })
    
    const [snackbarState, setSnackbarState] = useState<boolean>(false);
    const handleSnackbarClose = (_e: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => {
        if (reason === 'clickaway') return;
        setSnackbarState(false);
    };

    const onSubmit: SubmitHandler<ChoresTypeProps> = async (data) => {
        const { error } = await supabase.from('chores_type').insert(data);
    
        if (error) {
            console.error(error);
        }else{
            reset()
            setSnackbarState(true);
        }
    }

    return (
        <>
        {
            <form onSubmit={handleSubmit(onSubmit)}>
                <Snackbar
                    open={snackbarState}
                    autoHideDuration={2000}
                    onClose={handleSnackbarClose}
                    message="追加しました"
                />
                <Box marginBottom={2}>
                    <Stack flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={1}>
                        <TextField
                            placeholder='タイトルを入力してください'
                            size="small"
                            {...register(`title`, { required: true })}
                            sx={{width: "65%"}}
                            error={errors.title && true}
                        />
                        <TextField
                            size="small"
                            {...register(`point`, { required: true })}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">P</InputAdornment>,
                                },
                            }}
                            sx={{width: "33%"}}
                            error={errors.point && true}
                        />
                    </Stack>
                    <TextField
                        placeholder='説明文を入力してください'
                        size="small"
                        {...register(`description`)}
                        sx={{width: "100%"}}
                    />
                    {errors.title && <Typography color='error' variant='body2'>タイトルを入力してください</Typography>}
                    {errors.point && <Typography color='error' variant='body2'>ポイントを入力してください</Typography>}
                </Box>

                <Box textAlign={'center'}>
                    <Button type='submit' variant='contained'>新規作成</Button>
                </Box>
            </form>
        }
        </>
    )
})


const ChoresEditForm = memo(() => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ChoresTypeProps[]>()

    const onSubmit: SubmitHandler<ChoresTypeProps[]> = (data) => console.log(data)
    // console.log(watch()[0]?.title) 
    
    const {data: chores_type} = useQuery(
        supabase
            .from("chores_type")
            .select("*")
            .order("point", {ascending: false})
            .order("id")
    )

    return (
        <>
            
            {
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box marginBottom={2}>
                    {
                        chores_type?.map((type, i) => (
                            <Box sx={{
                                padding: "8px 22px",
                                margin: "0 -22px",
                                backgroundColor: i % 2 == 0 ? "#f5f5f5": "#fff",
                                borderTop: "1px solid #eee",
                                borderBottom: "1px solid #eee"
                            }}>
                            <Stack flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={1} key={type.id}>
                                <TextField
                                    defaultValue={type.title}
                                    size="small"
                                    {...register(`${type.id}.title`, { required: true })}
                                    sx={{width: "65%", backgroundColor: "#fff"}}
                                />
                                <TextField
                                    defaultValue={type.point}
                                    size="small"
                                    {...register(`${type.id}.point`, { required: true })}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">P</InputAdornment>,
                                        },
                                    }}
                                    sx={{width: "33%", backgroundColor: "#fff"}}
                                />
                            </Stack>
                            <TextField
                                defaultValue={type.description ?? ''}
                                placeholder='説明文を入れてください'
                                size="small"
                                {...register(`${type.id}.description`)}
                                sx={{width: "100%", backgroundColor: "#fff"}}
                            />
                            </Box>
                        ))
                    }
                
                    {errors[0]?.title && <span>This field is required</span>}
                </Box>
                <Box textAlign={'center'}>
                    <Button variant='contained'>編集</Button>
                </Box>
            </form>
            }
        </>
    )
})

const ChoresRegistionModal = () => {
    const [open, setOpen] = useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [tabValue, setTabValue] = useState('modal-tab1');
    const handleTabChange = (_e: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
      };

    return (
      <>
        <Button variant='contained' color="warning" onClick={handleOpen} startIcon={<SettingsIcon />}>
            お手伝いの種類を管理する
        </Button>
        <Modal
            open={open}
            onClose={handleClose}
            sx={{top: "10vh", height: "80vh"}}
        >
            <Box sx={modalStyle}>
                <TabContext value={tabValue}>
                    <TabList onChange={handleTabChange} aria-label="lab API tabs example" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab label="項目の新規作成" value="modal-tab1" sx={{width: "50%"}}/>
                        <Tab label="項目を編集" value="modal-tab2" sx={{width: "50%"}}/>
                    </TabList>
                    
                    <TabPanel value="modal-tab1" style={{overflow:'scroll'}}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ paddingBottom: 1, borderBottom: 2, borderColor: 'primary.main' }} marginBottom={2}>
                            お手伝い項目を新規作成する
                        </Typography>
                        
                        <ChoresRegistrationForm />
                    </TabPanel>
                    <TabPanel value="modal-tab2" style={{height: "100%", overflow:'scroll'}}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ paddingBottom: 1, borderBottom: 2, borderColor: 'primary.main' }} marginBottom={2}>
                            既存のお手伝い項目を編集する
                        </Typography>
                        
                        <ChoresEditForm />
                    </TabPanel>
                </TabContext>
            </Box>
        </Modal>
      </>
    );
}

export default ChoresRegistionModal