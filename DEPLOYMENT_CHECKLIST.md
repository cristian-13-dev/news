# Vercel Deployment Checklist

## Before Deployment

- [x] Environment variables configured in `.env.local`
- [x] Next.js configuration ready (`next.config.ts`)
- [x] Sanity CDN hostname configured
- [x] Build scripts in `package.json`
- [ ] Code committed to Git
- [ ] Code pushed to GitHub

## Deployment Options

### Option A: GitHub Integration (Recommended)

1. [ ] Push code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. [ ] Go to [vercel.com/new](https://vercel.com/new)

3. [ ] Import repository: `cristian-13-dev/news`

4. [ ] Add environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `bo77yna6`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`

5. [ ] Click "Deploy"

### Option B: Vercel CLI

1. [ ] Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. [ ] Login:
   ```bash
   vercel login
   ```

3. [ ] Deploy:
   ```bash
   ./deploy.sh
   # or manually:
   vercel --prod
   ```

## After Deployment

### Update Sanity Settings

1. [ ] Go to [sanity.io/manage](https://sanity.io/manage)

2. [ ] Select project: `bo77yna6`

3. [ ] Navigate to **API** → **CORS Origins**

4. [ ] Add Vercel URLs:
   - [ ] `https://your-project.vercel.app`
   - [ ] `https://*.vercel.app` (for preview deployments)
   - [ ] Your custom domain (if any)

5. [ ] Check "Allow credentials"

6. [ ] Click "Save"

### Test Your Deployment

- [ ] Visit your Vercel URL
- [ ] Test posts listing page (`/posts`)
- [ ] Test individual post page (`/posts/[slug]`)
- [ ] Test Sanity Studio (`/studio`)
- [ ] Test all images load correctly
- [ ] Test videos and tables
- [ ] Test device comparison component
- [ ] Check mobile responsiveness

## Optional: Custom Domain

1. [ ] Go to Vercel project settings

2. [ ] Navigate to **Domains**

3. [ ] Add your custom domain

4. [ ] Update DNS records

5. [ ] Wait for DNS propagation

6. [ ] Add custom domain to Sanity CORS

## Monitoring

- [ ] Check deployment logs in Vercel
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error monitoring (optional)

## Troubleshooting

If build fails:
- Check Vercel build logs
- Verify environment variables
- Check for TypeScript errors
- Verify all imports are correct

If images don't load:
- Check Sanity CORS settings
- Verify image URLs
- Check Next.js image configuration

If Studio doesn't work:
- Add Vercel domain to Sanity allowed origins
- Check `/studio` route is accessible

## Your Project Details

- **Project ID**: `bo77yna6`
- **Dataset**: `production`
- **GitHub Repo**: `cristian-13-dev/news`
- **Branch**: `main`

## Quick Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployments
vercel ls

# View logs
vercel logs

# Using helper script
./deploy.sh
```

---

✅ **Ready to deploy!** Follow the steps above to get your blog live on Vercel.
