/* School of Financial Fitness — Supabase project settings.
 *
 * HOW TO WIRE THIS UP (one-time, at deploy):
 *   1. Create a free project at https://supabase.com/dashboard
 *   2. Open Project Settings → API and copy the Project URL and the
 *      "anon public" key.
 *   3. Paste them below, replacing the PASTE_… placeholders.
 *
 * SECURITY — READ THIS BEFORE YOU PASTE ANYTHING:
 *   - Only EVER use the "anon public" key here. It is safe to ship in
 *     front-end code because the database's Row Level Security policies
 *     (see progress.sql) decide what each student may read or write.
 *   - NEVER paste the "service_role" key into this file, any page, or
 *     this repo. That key bypasses every policy and must only ever live
 *     in a server environment. If it ever leaks, roll it immediately in
 *     the Supabase dashboard.
 *   - Until real values are pasted, the login UI shows a "login is being
 *     connected" state and every page keeps working exactly as today.
 */

window.FINFIT_SUPABASE = {
    url: 'https://ijpdbxlvgbvxoxrzuxnm.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqcGRieGx2Z2J2eG94cnp1eG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NjQ1ODMsImV4cCI6MjEwODQ0MDU4M30.UIj7xhlTPdAydzG9oFmC-NXYgucLnpnh3bjKAipRmVA'
};
