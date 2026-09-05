# Supabase Storage Setup Guide

To enable image uploads in the Admin Panel (project cover photos and gallery images), follow these instructions to configure the storage bucket in your Supabase dashboard.

---

## 1. Create the Storage Bucket

1. Open your project on [database.new](https://database.new) or [app.supabase.com](https://app.supabase.com).
2. In the left navigation, click on **Storage**.
3. Click **New Bucket**.
4. Configure bucket settings:
   - **Name:** `portfolio-media`
   - **Public Bucket:** **Toggle ON** (files should be publicly readable via CDN)
   - **File size limit:** `10 MB` (or default)
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp, image/gif, image/svg+xml`
5. Click **Create Bucket**.

---

## 2. Security & RLS Policies (Storage Policies)

By default, Supabase requires storage policies for read and write operations. Run this SQL in the **SQL Editor** or configure in the **Policies** tab of Storage:

```sql
-- Allow anyone to view media files in portfolio-media bucket
create policy "Public Access to Portfolio Media"
on storage.objects for select
using ( bucket_id = 'portfolio-media' );

-- Allow authenticated admin users to upload media
create policy "Authenticated Users Can Upload Portfolio Media"
on storage.objects for insert
with check (
  bucket_id = 'portfolio-media'
  and auth.role() = 'authenticated'
);

-- Allow authenticated admin users to update media
create policy "Authenticated Users Can Update Portfolio Media"
on storage.objects for update
using (
  bucket_id = 'portfolio-media'
  and auth.role() = 'authenticated'
);

-- Allow authenticated admin users to delete media
create policy "Authenticated Users Can Delete Portfolio Media"
on storage.objects for delete
using (
  bucket_id = 'portfolio-media'
  and auth.role() = 'authenticated'
);
```

---

## 3. Verify in Admin Panel

Once the bucket and policies are set up, navigate to `/admin/projects/new`. Uploading an image file will automatically upload to `portfolio-media/uploads/...` and populate the public URL into the project record.
