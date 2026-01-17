import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lpzfhsrqgxugsbprplpq.supabase.co';
const supabaseKey = 'sb_publishable_tqtjgA5DhRZK_R2-Uqi8kQ_YgtucoWy';

export const supabase = createClient(supabaseUrl, supabaseKey);