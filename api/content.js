// This API endpoint fetches specific text content from the database.
// Example: /api/content?slug=mission-statement

import { createClient } from '@supabase/supabase-js';

// Create a single Supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(request, response) {
  // Get the 'slug' from the query parameter of the URL
  const { slug } = request.query;

  if (!slug) {
    return response.status(400).json({ error: 'Slug is required' });
  }

  try {
    // Fetch data from the 'site_content' table where the slug matches
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('slug', slug)
      .single(); // We expect only one result

    if (error) {
      throw error;
    }

    if (!data) {
        return response.status(404).json({ error: 'Content not found' });
    }

    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return response.status(200).json(data);

  } catch (error) {
    console.error('Database Error:', error);
    return response.status(500).json({ error: 'Failed to fetch content' });
  }
}
