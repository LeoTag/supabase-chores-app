import { useInsertMutation } from '@supabase-cache-helpers/postgrest-swr'
import { supabase } from '../config/supabase';
 
 
function Page() {
    const { trigger: insert } = useInsertMutation(
        supabase
        .from("kids")
            .select(`
                id, name, thumbnail, 
                school_grade(grade, point)
            `)
            .order("id"),
        {
          onSuccess: () => console.log('Success!'),
        }
      );
      return (
        <div>...</div>;
    )
}