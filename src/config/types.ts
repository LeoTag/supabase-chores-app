export type KidProps = {
    id: number,
    name: string,
    thumbnail?: String | null,
    description?: String | null,
    grade_id: number,
    school_grade: {
        id: number,
        grade: string,
        point: number
    }
}

export type ChoresHistoryProps = {
    selectedKid: KidProps;
    setTotalPoint: (point: number) => void;
}

export type ChoresTypeProps = {
    description: string | null;
    id: number;
    point: number;
    title: string;
}