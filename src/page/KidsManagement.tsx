import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material"
import { memo, useState } from "react"
import { dialogStyle } from "../assets/styles"
import { KidProps } from "../config/types"
import { ArrowLeft, ArrowRight } from "@mui/icons-material"

const SchoolGraderController = ({
    kid,
    gradeId,
    school_grade
}:{
    kid: KidProps,
    gradeId: KidProps["grade_id"],
    school_grade: KidProps["school_grade"][] | null | undefined
}) => {
    const [editMode, setEditMode] = useState(false);
    const [grade, setGrade] = useState(school_grade?.find(e => e.id === gradeId));
    const [gradeNum, setGradeNum] = useState(gradeId);

    const handleGrade = (num: number) => () => {
        const grade = school_grade?.find(e => e.id === num)
        if(!grade) return;
        setGradeNum(num);
        setGrade(grade);
    }
    
    return (
        <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2} paddingBottom={2} key={kid.id}>
            <Stack flex={2} alignItems="end">
                <img src={`assets/images/${kid.thumbnail}`} width={75} alt="" />
            </Stack>
            <Stack flex={3}>
                <Typography variant="subtitle1">{kid.name}</Typography>
                {
                    !editMode 
                    ? <Typography variant="body2" color="textPrimary">{grade?.grade}</Typography> 
                    :
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={.5}>
                        <Stack>
                            <IconButton color="primary" onClick={handleGrade(gradeNum - 1)} disabled={3 >= gradeNum}><ArrowLeft /></IconButton>
                        </Stack>
                        <Typography variant="body2" whiteSpace="nowrap">{grade?.grade}</Typography>
                        <Stack>
                            {/* FIXME: 11 */}
                            <IconButton color="primary" onClick={handleGrade(gradeNum + 1)} disabled={11 <= gradeNum}><ArrowRight /></IconButton>
                        </Stack>
                    </Stack>
                }
                
            </Stack>
            <Stack direction="column" spacing={1}>
                <Button
                    variant={editMode ? "contained": "outlined"}
                    color="primary"
                    size="small"
                    sx={{flex: 1, height: "100%"}}
                    onClick={() => setEditMode(!editMode)}
                >
                    {editMode ? "保存" : "編集"}
                </Button>
                {
                    editMode && (
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{flex: 1, height: "100%"}}
                            onClick={() => setEditMode(false)}
                        >
                            削除
                        </Button>
                    )
                }
            </Stack>
        </Stack>
    )
}

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
    

    return (
        <Box padding={0}>
            <Dialog
            open={kidsManagementOpen}
            onClose={() => setKidsManagementOpen(false)}
                sx={dialogStyle}
            >
                <DialogTitle>
                    <Typography color='primary' align="center" fontWeight={500}>
                        キッズ管理
                    </Typography>
                </DialogTitle>

                <DialogContent dividers>
                {
                    kids?.map((kid) => (
                        <SchoolGraderController
                            kid={kid}
                            gradeId={kid.grade_id}
                            school_grade={school_grade}
                            key={kid.id}
                        />
                    ))
                }
                </DialogContent>

                <DialogActions sx={{justifyContent: "center"}}>
                    <Button disabled variant='contained'>
                        キッズの新規登録
                    </Button>
                </DialogActions>
            </Dialog>
      </Box>
    )
})

export default KidsManagementDialog