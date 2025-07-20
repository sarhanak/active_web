// This API endpoint fetches all gallery images from the database.

import { createClient } from '@supabase/supabase-js';

// Create a single Supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(request, response) {
  try {
    // Fetch all records from the 'gallery_images' table
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*') // Select all columns
      .order('created_at', { ascending: false }); // Show newest first

    if (error) {
      throw error;
    }
    
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return response.status(200).json(data);

  } catch (error) {
    console.error('Database Error:', error);
    return response.status(500).json({ error: 'Failed to fetch gallery images' });
  }
}
