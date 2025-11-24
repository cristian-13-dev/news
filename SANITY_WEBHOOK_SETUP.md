# Configurare Webhook Sanity pentru Revalidare Instant

## Ce face acest sistem?

Când publici sau actualizezi un post în Sanity Studio, webhook-ul trimite automat o notificare către aplicația Next.js care revalidează paginile afectate. Astfel, conținutul nou apare instant în producție fără să aștepți cele 60 de secunde de la ISR.

## Pași de configurare

### 1. Generează un secret pentru webhook

Rulează în terminal pentru a genera un secret securizat:

```bash
openssl rand -base64 32
```

### 2. Adaugă variabila de mediu

#### Local (`.env.local`)
```env
SANITY_REVALIDATE_SECRET=secretul_generat_mai_sus
```

#### Producție (Vercel/alt host)
Adaugă aceeași variabilă în dashboard-ul de deployment:
- **Vercel**: Project Settings → Environment Variables
- **Nume**: `SANITY_REVALIDATE_SECRET`
- **Valoare**: secretul generat
- **Environment**: Production (și Preview dacă vrei)

### 3. Configurează Webhook în Sanity

1. Mergi la [manage.sanity.io](https://manage.sanity.io)
2. Selectează proiectul tău
3. Navighează la **API** → **Webhooks**
4. Click pe **Create webhook** / **Add webhook**

#### Setări Webhook:

**Name**: `Revalidate Next.js`

**URL**: 
```
https://your-domain.vercel.app/api/revalidate?secret=SECRETUL_TAU
```
⚠️ **Înlocuiește**:
- `your-domain.vercel.app` cu domeniul tău real
- `SECRETUL_TAU` cu secretul generat anterior

**Dataset**: `production` (sau dataset-ul tău)

**Trigger on**: Selectează:
- ✅ Create
- ✅ Update  
- ✅ Delete

**Filter** (opțional, doar pentru posts):
```groq
_type == "post"
```

**Projection** (pentru a trimite slug-ul):
```groq
{
  "slug": slug.current,
  "_type": _type,
  "_id": _id
}
```

**HTTP method**: `POST`

**HTTP Headers** (opțional):
```
Content-Type: application/json
```

**API version**: `v2021-03-25` (sau cea mai recentă)

5. Click **Save**

### 4. Testează webhook-ul

#### Test din Sanity:
1. În pagina webhook-ului, click pe **Test webhook**
2. Verifică că primești răspuns `200 OK`
3. Verifică logs în Vercel/alt host

#### Test real:
1. Publică sau actualizează un post în Sanity Studio
2. Verifică imediat site-ul în producție
3. Conținutul ar trebui să apară instant (sau în câteva secunde)

### 5. Monitorizare

#### Verifică logs în Vercel:
1. Vercel Dashboard → Project → Logs
2. Caută după `[Revalidate]` pentru a vedea webhook-urile procesate

#### Verifică delivery logs în Sanity:
1. Sanity Project → API → Webhooks
2. Click pe webhook-ul tău
3. Vezi **Recent deliveries** pentru status și răspunsuri

## Cum funcționează

1. **Publici un post** în Sanity Studio → Click "Publish"
2. **Sanity trimite webhook** către `/api/revalidate?secret=...`
3. **Next.js verifică secretul** și revalidează:
   - Path-ul specific: `/posts/slug-ul-postului`
   - Listing-ul: `/posts`
   - Home page: `/`
   - Cache tags: `post`, `post:slug`
4. **Conținutul se actualizează instant** în producție

## Troubleshooting

### Webhook-ul nu se declanșează:
- Verifică că ai dat **Publish** (nu doar Save) în Sanity
- Verifică filter-ul: dacă ai pus `_type == "post"`, doar posturile vor declanșa webhook-ul
- Verifică dataset-ul: trebuie să fie același cu cel din `.env`

### Eroare 401 Unauthorized:
- Secretul din URL nu se potrivește cu `SANITY_REVALIDATE_SECRET` din Vercel
- Verifică că ai adăugat variabila în Vercel și ai re-deployat

### Eroare 500:
- Verifică logs în Vercel pentru detalii
- Verifică că projection-ul returnează `slug.current` corect

### Conținutul nu se actualizează:
- Verifică că ISR este activat (`export const revalidate = 60`)
- Verifică că `useCdn: false` în client Sanity
- Așteaptă câteva secunde după webhook (cache clearing poate dura 2-5 secunde)
- Încearcă hard refresh: Ctrl+Shift+R / Cmd+Shift+R

## Structura sistemului

```
┌─────────────┐
│   Sanity    │
│   Studio    │
└──────┬──────┘
       │ 1. Publish post
       ↓
┌─────────────┐
│   Webhook   │  POST /api/revalidate?secret=xxx
└──────┬──────┘
       │ 2. Trimite notificare
       ↓
┌─────────────────────┐
│   Next.js API       │
│   /api/revalidate   │
│                     │
│ - Verifică secret   │
│ - Revalidează paths │
│ - Revalidează tags  │
└──────┬──────────────┘
       │ 3. Revalidează cache
       ↓
┌─────────────────────┐
│  Pagini actualizate │
│  - /posts           │
│  - /posts/[slug]    │
│  - /                │
└─────────────────────┘
```

## Alternative

Dacă nu vrei să configurezi webhook-ul, poți:
1. **Reduce ISR interval**: `export const revalidate = 10` (10 secunde)
2. **Disable cache**: `export const revalidate = 0` (întotdeauna fresh, dar mai scump)
3. **Manual revalidation**: Declanșează manual din Vercel Dashboard

## Resurse

- [Next.js On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation)
- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
