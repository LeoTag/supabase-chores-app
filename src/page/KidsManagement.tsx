import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Snackbar, SnackbarCloseReason, Stack, TextField, Typography } from "@mui/material"
import { Dispatch, memo, useState } from "react"
import { kidsManagement_dialogStyle, Mui_TextField_defaultStyle } from "../assets/styles"
import { KidProps, KidPropsWrite } from "../config/types"
import { ArrowLeft, ArrowRight } from "@mui/icons-material"
import { supabase } from "../config/supabase"
import { SubmitHandler, useForm } from "react-hook-form"
import { mutate } from "swr"
import React from "react"

const SchoolGraderController = memo(({
    kid,
    gradeId,
    school_grade,
    setSnackbarState
}:{
    kid: KidProps,
    gradeId: KidProps["grade_id"],
    school_grade: KidProps["school_grade"][] | null | undefined,
    setSnackbarState: Dispatch<React.SetStateAction<boolean>>
}) => {
    const [editMode, setEditMode] = useState(false);
    const [tempGrade, setTempGrade] = useState(school_grade?.find(e => e?.id === gradeId));
    const [gradeNum, setGradeNum] = useState(gradeId);
    const {register, getValues, setValue, handleSubmit, formState: { errors }} = useForm<KidPropsWrite>({
        defaultValues: {
            id: kid.id,
            name: kid.name,
            thumbnail: kid.thumbnail,
            description: kid.description || "",
            grade_id: kid.grade_id,
        }
    })

    const onSubmit: SubmitHandler<KidPropsWrite> = async (data) => {
        const { error } = await supabase.from('kids').upsert(data);
        
        if (error) {
            console.error(error);
        }else{
            mutate(() => supabase.from('kids').upsert(data))
            setSnackbarState(true);
            setEditMode(false)
        }
    }

    const handlePrevGrade = () => () => {
        setValue(`grade_id`, gradeNum - 1)
        setGradeNum(gradeNum - 1)
        setTempGrade(school_grade?.find(e => e?.id === gradeNum - 1))
    }
    const handleNextGrade = () => () => {
        setValue(`grade_id`, gradeNum + 1)
        setGradeNum(gradeNum + 1)
        setTempGrade(school_grade?.find(e => e?.id === gradeNum + 1))
    }

    return (
        <>
        <Box marginTop={2} marginBottom={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2} paddingBottom={2} key={kid.id}>
                <Stack flex={1.5} alignItems="end">
                    {/* FIXME: 画像変更機能追加したい */}
                    <img src={`assets/images/${kid.thumbnail}`} width={75} alt="" />
                </Stack>
                <Stack flex={3.5}>
                {
                    !editMode 
                    ? 
                    <>
                        <Typography variant="subtitle1">{getValues("name")}</Typography>
                        <Typography variant="body2">{getValues("description")}</Typography>
                        <Typography variant="body2" color="textPrimary">{tempGrade?.grade}</Typography> 
                    </>
                    :
                    <>
                    <TextField
                        defaultValue={kid.name ?? ''}
                        placeholder='名前を入力してください'
                        {...register(`name`, {required: true})}
                        sx={Mui_TextField_defaultStyle}
                    />
                    <TextField
                        defaultValue={kid.description ?? ''}
                        placeholder='ひとこと'
                        {...register(`description`)}
                        sx={Mui_TextField_defaultStyle}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={.5}>
                        <Stack>
                            {/* FIXME: 3 >= gradeNum */}
                            <IconButton
                                color="primary"
                                disabled={3 >= gradeNum}
                                onClick={handlePrevGrade()}
                            >
                                <ArrowLeft />
                            </IconButton>
                        </Stack>
                        <Typography variant="body2" color="textPrimary">{tempGrade?.grade}</Typography> 
                        <Stack>
                            {/* FIXME: 11 <= gradeNum */}
                            <IconButton
                                color="primary"
                                disabled={11 <= gradeNum}
                                onClick={handleNextGrade()}
                            >
                                <ArrowRight />
                            </IconButton>
                        </Stack>
                    </Stack>
                    {errors.name && <Typography color='error' variant='body2'>名前を入力してください</Typography>}
                    </>
                }
                </Stack>
            </Stack>
            <Stack direction="row" justifyContent="center" spacing={2}>
                {
                    editMode ? <>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{flex: 1, height: "100%", maxWidth: "10em"}}
                            onClick={() => {setEditMode(false)}}
                        >キャンセル</Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            type="submit"
                            sx={{flex: 1, height: "100%", maxWidth: "10em"}}
                        >
                            変更を保存する
                        </Button>
                    </>
                    :
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{flex: 1, height: "100%", maxWidth: "10em"}}
                        onClick={() => setEditMode(!editMode)}
                    >
                        編集
                    </Button>
                }
            </Stack>
            </form>
        </Box>
        </>
    )
})

const KidsManagementDialog = memo(({
    kids,
    school_grade,
    kidsManagementOpen,
    setKidsManagementOpen,
}:{
    kids: KidProps[] | null | undefined,
    school_grade: KidProps["school_grade"][] | null | undefined,
    kidsManagementOpen: boolean,
    setKidsManagementOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [snackbarState, setSnackbarState] = useState<boolean>(false);
    const handleSnackbarClose = (_e: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => {
        if (reason === 'clickaway') return;
        setSnackbarState(false);
    };

    return (
        <>
        <Snackbar
            open={snackbarState}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
            message="更新しました"
            sx={{display: "unset", position: "fixed", top: "8px", left: "auto !important", right: "8px !important", zIndex: 5000}}
        />
        <Box padding={0}>
            <Dialog
                open={kidsManagementOpen}
                onClose={() => setKidsManagementOpen(false)}
                sx={kidsManagement_dialogStyle}
            >
                <DialogTitle>
                    <Typography color='primary' align="center" fontWeight={500}>
                        キッズ管理
                    </Typography>
                </DialogTitle>

                <DialogContent dividers>
                {
                    kids?.map((kid) => <React.Fragment key={kid.id}>
                        <SchoolGraderController
                            kid={kid}
                            gradeId={kid.grade_id}
                            school_grade={school_grade}
                            setSnackbarState={setSnackbarState}
                            key={kid.id}
                        />
                        <Divider sx={{margin: "0.5em 0"}} />
                    </React.Fragment>)
                }
                </DialogContent>

                <DialogActions sx={{justifyContent: "center"}}>
                    <Button disabled variant='contained'>
                        キッズの新規登録
                    </Button>
                </DialogActions>
            </Dialog>
      </Box>
      </>
    )
})

export default KidsManagementDialog