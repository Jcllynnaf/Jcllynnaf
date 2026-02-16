// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://urkcslbznrjteooaiunc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVya2NzbGJ6bnJqdGVvb2FpdW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMTkwNTIsImV4cCI6MjA4Njc5NTA1Mn0.RuJSQDj4i2qHinzeW8iorbO19TWFteIMBFT9Bc95jAY';

export const supabase = createClient(supabaseUrl, supabaseKey);