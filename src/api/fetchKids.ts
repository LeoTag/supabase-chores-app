import { supabase } from "../config/supabase"

const fetchKids = () => supabase
    .from("kids")
    .select(`
        id, name, thumbnail, 
        school_grade(grade, point)
    `)
    .order("id")
    
export default fetchKids;
