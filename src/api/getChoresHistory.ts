import { useQuery } from "@supabase-cache-helpers/postgrest-swr"
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

const getChoresHistory = async () => {
    const { data: chores_history, error} = await useQuery(
        supabase
            .from("chores_history")
            .select("*")
            .order("id")
    );

    // 401 Unauthorized、認証が必要
    // if (error) return chores_history.status(401).json({ error: error.message });
    // 200番台は、処理が成功して正常にレスポンスができている状態
    return chores_history
};


export default getChoresHistory;
