import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { CarpoolFormData } from '../types/carpool';

export async function createCarpool(data: CarpoolFormData): Promise<{ error?: PostgrestError }> {
  const { error } = await supabase.from('carpools').insert([data]);
  return { error };
}