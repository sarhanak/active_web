// A temporary API to check environment variables on Vercel.
// WARNING: DELETE THIS FILE AFTER DEBUGGING IS COMPLETE.

export default function handler(request, response) {
  const anonCreate = Boolean(process.env.SUPABASE_ANON_KEY);
  const urlCreate = Boolean(process.env.SUPABASE_URL);
  const serviceCreate = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  const debugInfo = {
    message: "Checking Vercel Environment Variables...",
    variables: {
      SUPABASE_URL_IS_SET: urlCreate,
      SUPABASE_ANON_KEY_IS_SET: anonCreate,
      SUPABASE_SERVICE_ROLE_KEY_IS_SET: serviceCreate,
    },
    instructions: "If any of these values are 'false', the corresponding Environment Variable is missing or incorrect in your Vercel project settings. Please delete and re-add them carefully.",
  };

  response.status(200).json(debugInfo);
}
