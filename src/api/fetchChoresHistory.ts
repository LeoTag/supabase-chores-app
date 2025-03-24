import { supabase } from "../config/supabase"

const fetchChoresHistory = (kidId: number) => {
    // 当月の取得
    const nowDate = new Date();
    const nowYear = nowDate.getFullYear();
    const nowMonth = nowDate.getMonth() + 1;
    const nowMonthDigits = ("0"+nowMonth).slice(-2);
    const nextMonthDigits = ("0"+(nowMonth+1)).slice(-2);
    
    return supabase
        .from("chores_history")
        .select(`
            *,
            kids(name),
            chores_type(title, point)
        `, { count: "exact" })
        .eq('kid_id', kidId)
        .filter('created_at', 'gte', `${nowYear}-${nowMonthDigits}-01`)
        .filter('created_at', 'lt', `${nowYear}-${nextMonthDigits}-01`)
        .order("created_at", { ascending: false })
        .order("id", { ascending: true });
}

export default fetchChoresHistory;
