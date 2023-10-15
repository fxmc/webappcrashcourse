import { API_KEY, SUPA_URL } from "./env";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = SUPA_URL;
const supabaseKey = API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
