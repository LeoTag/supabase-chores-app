export type KidProps = {
    id: number,
    name: string,
    thumbnail: String | null,
    school_grade: {
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