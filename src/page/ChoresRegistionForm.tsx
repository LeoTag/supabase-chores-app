import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, InputAdornment, Snackbar, SnackbarCloseReason, Stack, Tab, TextField, Typography } from '@mui/material'
import Modal from '@mui/material/Modal';
import { Dispatch, memo, useState } from 'react'
import { choresListEdit_closeIcon, choresTypeEdit_header, modalStyle, Mui_Button_defaultStyle, Mui_TextField_defaultStyle } from '../assets/styles'
import { useForm, SubmitHandler } from "react-hook-form"
import { supabase } from '../config/supabase'
import { useQuery } from '@supabase-cache-helpers/postgrest-swr'
import { ChoresTypeProps } from '../config/types'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import CloseIcon from '@mui/icons-material/Close';
import { mutate } from 'swr'

/**
 * お手伝い項目の新規登録
 */
const ChoresRegistrationForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ChoresTypeProps>({
        defaultValues: {title: "", point: undefined, description: ""}
    })
    
    const [snackbarState, setSnackbarState] = useState<boolean>(false);
    const [snackbarMsg, setSnackbarMsg] = useState<string>("");
    const handleSnackbarClose = (_e: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => {
        if (reason === 'clickaway') return;
        setSnackbarState(false);
    };

    const onSubmit: SubmitHandler<ChoresTypeProps> = async (data) => {
        // FIXME: バリデーション処理追加

        const { error } = await supabase.from('chores_type').insert(data);
    
        if (error) {
            console.error(error);
            setSnackbarMsg("更新できませんでした")
            setSnackbarState(true);
        }else{
            reset()
            setSnackbarMsg("追加しました")
            setSnackbarState(true);
        }
    }

    return (
        <>
        {
            <form onSubmit={handleSubmit(onSubmit)}>
                <Snackbar
                    open={snackbarState}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message={snackbarMsg}
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
                            type='number'
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
                    {errors.point && <Typography color='error' variant='body2'>ポイントを半角数字で入力してください</Typography>}
                </Box>

                <Box textAlign={'center'}>
                    <Button type='submit' variant='contained'>新規作成</Button>
                </Box>
            </form>
        }
        </>
    )
}

/**
 * お手伝い項目の削除ダイアログ
 * 削除の最終確認＆削除実行
 */
const DeleteConfirmDialog = ({
    type,
    dialogOpen,
    setDialogOpen
}:{
    type: ChoresTypeProps,
    dialogOpen: boolean,
    setDialogOpen: Dispatch<React.SetStateAction<boolean>>
}) => {
    
    const deleteChores = () => async () => {
        const { error } = await supabase.from('chores_type').delete().eq("id", type.id);
    
        if (error) {
            console.error(error);
        }else{
            mutate(() => supabase.from('chores_type').delete().eq("id", type.id))
            setDialogOpen(false)
        }
    }
    return (
    <>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent>
            <DialogContentText><strong>{type.title}</strong>を削除しますがよろしいですか？</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDialogOpen(false)} autoFocus>キャンセル</Button>
            <Button color='error' onClick={deleteChores()}>削除する</Button>
        </DialogActions>
        </Dialog>
        </>
    );
}

const ChoresEditListItem = ({
    type
}:{
    type: ChoresTypeProps
}) => {
    // FIXME: Zod入れてバリデーションしたい
    const [editState, setEditState] = useState<boolean>(false)
    const {register, handleSubmit, reset, formState: { errors, isDirty }} = useForm<ChoresTypeProps>({
        defaultValues: type
    })

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [snackbarState, setSnackbarState] = useState<boolean>(false);
    const handleSnackbarClose = (_e: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => {
        if (reason === 'clickaway') return;
        setSnackbarState(false);
    };

    const onSubmit: SubmitHandler<ChoresTypeProps> = async (data) => {
        const { error } = await supabase.from('chores_type').upsert(data);
    
        if (error) {
            console.error(error);
        }else{
            mutate(() => supabase.from('chores_type').upsert(data))
            setSnackbarState(true);
            setEditState(false)
        }
    }

    const handleEditClose = () => () => {
        reset()
        setEditState(false)
    }

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Snackbar
                open={snackbarState}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                message="更新しました"
            />
            <Stack direction="row" justifyContent="space-between" alignItems={!editState ? "center": "end"} spacing={1} sx={{position: "relative"}}>
                {
                    !editState ? 
                        // 通常時：テキストのみ表示
                        <Stack direction="column" flex={9} >
                            <Typography variant='body1'>{type.title}</Typography>
                            <Typography variant='body2'>{type.point}P</Typography>
                            <Typography variant='body2'>{type.description}</Typography>
                        </Stack>
                        :
                        // 編集時：テキストフィールドで編集可能に
                        <Stack direction="column" spacing={.5} flex={9}>
                            <TextField
                                defaultValue={type.title}
                                {...register(`title`, { required: true })}
                                sx={Mui_TextField_defaultStyle}
                            />
                            {errors.title && <Typography color='error' variant='body2'>タイトルを入力してください</Typography>}
                            
                            <TextField
                                defaultValue={type.point}
                                type='number'
                                {...register(`point`, { required: true })}
                                slotProps={{input: {endAdornment: <InputAdornment position="end">P</InputAdornment>}}}
                                sx={Mui_TextField_defaultStyle}
                            />
                            {errors.point && <Typography color='error' variant='body2'>ポイントを半角数字で入力してください</Typography>}
                            <TextField
                                defaultValue={type.description ?? ''}
                                placeholder='説明文を入力してください'
                                {...register(`description`)}
                                sx={Mui_TextField_defaultStyle}
                            />
                        </Stack>
                }
                <Stack direction="column" flex={1} spacing={1} justifyContent="space-between">
                {
                    !editState ? 
                        <Button variant='contained' size="small" onClick={() => setEditState(true)}>編集</Button>
                        :
                        <Stack spacing={2} justifyContent="flex-end">
                            <CloseIcon onClick={handleEditClose()} sx={choresListEdit_closeIcon} />
                            <Button variant='outlined' type='submit' disabled={!isDirty} sx={Mui_Button_defaultStyle}>更新</Button>
                            <Button variant='outlined' color='error' sx={Mui_Button_defaultStyle}
                                onClick={() => setDialogOpen(true)}>削除</Button>
                        </Stack>
                }
                </Stack>
            </Stack>
        </form>
        <DeleteConfirmDialog type={type} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        </>
    )
}

const ChoresEditList = memo(() => {
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
                <Box marginBottom={2}>
                    {
                        chores_type?.map((type, i) => (
                            <Box 
                                sx={{
                                    padding: "8px 22px",
                                    margin: "0 -22px",
                                    backgroundColor: i % 2 == 0 ? "#f5f5f5": "#fff",
                                    borderTop: "1px solid #eee",
                                    borderBottom: "1px solid #eee"
                                }}
                                key={type.id}
                            >
                                <ChoresEditListItem type={type} />
                            </Box>
                        ))
                    }
                </Box>
            }
        </>
    )
})

const ChoresRegistionModal = ({
    modalOpen,
    setModalOpen
}:{
    modalOpen: boolean,
    setModalOpen: Dispatch<React.SetStateAction<boolean>>
}) => {
    const [tabValue, setTabValue] = useState('modal-tab1');
    const handleTabChange = (_e: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    return (
      <>
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            sx={{top: "10vh", height: "80vh"}}
        >
            <Box sx={modalStyle}>
                <TabContext value={tabValue}>
                    <TabList onChange={handleTabChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab label="項目の新規作成" value="modal-tab1" />
                        <Tab label="項目を編集" value="modal-tab2" />
                    </TabList>
                    
                    <TabPanel value="modal-tab1" style={{overflow:'scroll'}}>
                        <Typography variant="subtitle1" sx={choresTypeEdit_header}>
                            お手伝い項目を新規作成する
                        </Typography>
                        <ChoresRegistrationForm />
                    </TabPanel>
                    <TabPanel value="modal-tab2" style={{height: "100%", overflow:'scroll'}}>
                        <Typography variant="subtitle1" sx={choresTypeEdit_header}>
                            既存のお手伝い項目を編集する
                        </Typography>
                        <ChoresEditList />
                    </TabPanel>
                </TabContext>
            </Box>
        </Modal>
      </>
    );
}

export default ChoresRegistionModal