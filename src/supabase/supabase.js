// supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mrqpbbhyrssvwhmoejjy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXBiYmh5cnNzdndobW9lamp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODkxMDAsImV4cCI6MjA3NDI2NTEwMH0.MnRx-xYHZl_MpLgiBitueqWylgHATRxRlKujxfmK-8g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
