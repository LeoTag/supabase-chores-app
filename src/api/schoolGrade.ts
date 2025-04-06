import { useQuery } from "@supabase-cache-helpers/postgrest-swr"
import { supabase } from "../config/supabase"

const getSchoolGrade = () => useQuery(
    supabase.from("school_grade").select(`id, grade, point`).order("id"),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
)
export default getSchoolGrade;
