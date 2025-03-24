export type KidProps = {
    id: number,
    name: string,
    thumbnail: String | null,
    school_grade: {
        grade: string,
        point: number
    }
}

export type ChoresSheetDrawerProps = {
    setAddChoresHistory: (choresId: number[], resetChecked: () => void) => () => void;
    selectedKid: KidProps;
}

export type ChoresHistoryProps = {
    selectedKid: KidProps;
    setTotalPoint: (point: number) => void;
    chores_history: {
        id: number;
        chores_type: {
            title: string;
            point: number;
        };
        created_at: string;
    }[] | undefined;
    count: number | null;
}