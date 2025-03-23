import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://pwikcxeokmjbynpdpjjv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aWtjeGVva21qYnlucGRwamp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MzQyODIsImV4cCI6MjA1ODIxMDI4Mn0.q1vhgp6Mf2i2Hm0vc8Vl2p1kNlWClwGSmfCLVaJVh6c");

const getAirportAPI = async (req: NextApiRequest, res: NextApiResponse) => {

// .select();で全カラム取得、.select(カラム名)で選択も可能
  const { data, error } = await supabase.from('airport').select();

  // 401 Unauthorized、認証が必要
  if (error) return res.status(401).json({ error: error.message });
  // 200番台は、処理が成功して正常にレスポンスができている状態
  return res.status(200).json(data);
};


export default getAirportAPI;
