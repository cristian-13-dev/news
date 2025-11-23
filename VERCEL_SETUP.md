# Vercel Deployment Setup

## Environment Variables

Add these environment variables in your Vercel project settings:

### Required Variables:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=bo77yna6
NEXT_PUBLIC_SANITY_DATASET=production
```

### How to Add Environment Variables in Vercel:

1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - **Value**: `bo77yna6`
   - **Environments**: Select Production, Preview, and Development
   
4. Add the second variable:
   - **Name**: `NEXT_PUBLIC_SANITY_DATASET`
   - **Value**: `production`
   - **Environments**: Select Production, Preview, and Development

## Deployment Steps

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Setup for Vercel deployment"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click **"Add New Project"**
4. Import your GitHub repository: `cristian-13-dev/news`
5. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
6. Add environment variables (see above)
7. Click **"Deploy"**

## Post-Deployment Setup

### Update CORS Settings in Sanity

After deployment, update your Sanity CORS settings:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project: `bo77yna6`
3. Go to **API** → **CORS origins**
4. Add your Vercel domains:
   - `https://your-project.vercel.app`
   - `https://your-custom-domain.com` (if you have one)
5. Check "Allow credentials"

### Sanity Studio Access

Your Sanity Studio will be available at:
- `https://your-project.vercel.app/studio`

Make sure to add allowed domains in Sanity settings for Studio access.

## Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch (Production)
- Create preview deployments for pull requests
- Provide unique URLs for each deployment

## Custom Domain (Optional)

1. Go to your Vercel project
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed by Vercel

## Monitoring

- **Deployment logs**: Available in Vercel dashboard
- **Analytics**: Enable in Vercel project settings
- **Error tracking**: Check Functions tab for errors

## Important Notes

- ✅ Environment variables are configured
- ✅ Next.js configuration is ready
- ✅ Sanity configuration is set up
- ✅ Build optimizations are in place
- 🔒 Never commit `.env.local` to git (already in .gitignore)
- 📝 Update Sanity CORS after first deployment

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### Images Not Loading
- Verify `next.config.ts` has Sanity CDN configured
- Check image URLs are correct
- Verify CORS settings in Sanity

### Studio Not Loading
- Add Vercel domain to Sanity allowed origins
- Check studio route is accessible at `/studio`

## Next Steps

1. ✅ Environment variables configured in Vercel
2. ✅ Deploy to Vercel
3. ✅ Update Sanity CORS settings
4. ✅ Test your live site
5. ✅ Configure custom domain (optional)
