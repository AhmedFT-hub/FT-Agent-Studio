# Vercel Blob Storage Setup

This project uses Vercel Blob for image uploads. Follow these steps to enable image uploads:

## Automatic Setup (Recommended)

When you first deploy to Vercel and try to upload an image:

1. Vercel will automatically detect that you're using Blob storage
2. It will create a Blob store for your project
3. The `BLOB_READ_WRITE_TOKEN` environment variable will be automatically added

**No manual setup required!**

## Manual Setup (If Needed)

If automatic setup doesn't work:

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (`ft-agent-studio`)
3. Go to **Storage** tab
4. Click **Create Database** → **Blob**
5. Connect the Blob store to your project
6. The environment variable will be automatically added

## Verify Setup

After deployment, test the upload feature:

1. Go to Settings page
2. Click "Add New Agent" or "Edit" any agent
3. Click the "Upload Image" button
4. Select an image file
5. If successful, the image URL will appear automatically

## Supported File Types

- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

**Maximum file size:** 5MB

## Pricing

Vercel Blob is included in the free Hobby plan with:
- 1 GB storage
- 1 GB bandwidth per month

For more information: https://vercel.com/docs/storage/vercel-blob
