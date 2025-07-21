// This secure API endpoint updates content in the database.
// It requires a valid, authenticated user session to work.

import { createClient } from '@supabase/supabase-js';

// IMPORTANT: These are server-side environment variables.
// They are not accessible in the browser.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with the SERVICE ROLE KEY for admin-level access.
// This is safe to do on the server, but should NEVER be done in the browser.
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(request, response) {
  // 1. Check that the request method is POST.
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. Extract the slug and new content from the request body.
    const { slug, newContent } = request.body;
    if (!slug || newContent === undefined) {
      return response.status(400).json({ error: 'Slug and new content are required.' });
    }

    // 3. (SECURITY) Verify the user is authenticated.
    // The user's access token is sent in the 'Authorization' header.
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
        return response.status(401).json({ error: 'Authentication required.' });
    }

    // Get the user's data from Supabase using their token.
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
        return response.status(401).json({ error: 'Invalid or expired token.' });
    }

    // 4. Update the database.
    // We use the secure `supabaseAdmin` client here.
    const { data, error: dbError } = await supabaseAdmin
      .from('site_content')
      .update({ content: newContent })
      .eq('slug', slug)
      .select() // Return the updated row.
      .single();

    if (dbError) {
      // This will catch database-level errors, like if RLS were misconfigured.
      throw dbError;
    }

    // 5. Success!
    return response.status(200).json({ message: 'Content updated successfully!', data });

  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}
