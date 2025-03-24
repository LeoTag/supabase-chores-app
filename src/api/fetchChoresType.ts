import { supabase } from "../config/supabase"

const fetchChoresType = () => supabase
    .from("chores_type")
    .select("*")
    .order("point", {ascending: false})
    .order("id")
    
export default fetchChoresType;
