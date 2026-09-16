# generate-report Edge Function

Deploy with the Supabase CLI:

```
supabase functions deploy generate-report --project-ref <your-project-ref>
```

Set secrets (never commit real values):

```
supabase secrets set GEMINI_API_KEY=your-key --project-ref <your-project-ref>
supabase secrets set GEMINI_MODEL=gemini-2.5-flash --project-ref <your-project-ref>
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available to
Edge Functions on Supabase — no need to set them manually.
