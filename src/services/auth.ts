import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export async function signIn(email: string, password: string): Promise<{ error?: AuthError }> {
  try {
    const { error }: AuthResponse = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { error };
  } catch (err) {
    return { error: err as AuthError };
  }
}

export async function signUp(email: string, password: string): Promise<{ error?: AuthError }> {
  try {
    const { error }: AuthResponse = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    return { error };
  } catch (err) {
    return { error: err as AuthError };
  }
}