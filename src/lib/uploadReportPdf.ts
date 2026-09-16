import { supabase } from './supabaseClient'

const REPORTS_BUCKET = 'reports'

/**
 * Uploads the generated PDF to Supabase Storage and returns a signed URL,
 * saving it on the report row so organizers can access a copy later without
 * the client regenerating it. Failures here are non-fatal to the download
 * flow — the attendee still gets their PDF even if the upload fails.
 */
export async function uploadReportPdf(
  reportId: string,
  blob: Blob,
): Promise<string | null> {
  const path = `${reportId}.pdf`

  const { error: uploadError } = await supabase.storage
    .from(REPORTS_BUCKET)
    .upload(path, blob, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (uploadError) {
    console.error('PDF upload failed:', uploadError)
    return null
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(REPORTS_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 365)

  if (signedUrlError || !signedUrlData) {
    console.error('Could not create signed URL:', signedUrlError)
    return null
  }

  const { error: updateError } = await supabase
    .from('reports')
    .update({ pdf_url: signedUrlData.signedUrl })
    .eq('id', reportId)

  if (updateError) {
    console.error('Could not save pdf_url on report row:', updateError)
  }

  return signedUrlData.signedUrl
}
