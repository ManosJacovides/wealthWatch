//https://www.youtube.com/watch?v=Gz9bvYybaws&list=PL4cUxeGkcC9hUb6sHthUEwG7r9VDPBMKO&index=2

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase