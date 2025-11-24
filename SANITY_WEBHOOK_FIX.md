# ✅ Configurație Corectă Webhook Sanity

## Setări care trebuie modificate:

### 1. HTTP method
**Actual:** `PATCH` ❌  
**Corect:** `POST` ✅

### 2. Dataset  
**Actual:** `(all datasets)` ⚠️  
**Recomandat:** `production` ✅

### 3. Projection (verifică exact așa)
```groq
{"slug": slug.current, "_type": _type, "_id": _id}
```

## 📋 Configurația completă corectă:

**Name:**
```
Revalidate Posts
```

**Description:**
```
Revalidates Next.js pages when posts are created, updated, or deleted
```

**URL:**
```
https://news-two-drab.vercel.app/api/revalidate?secret=ZYWaQhJAY3PG/n/jku7MEHyV3qbzkCNf8zZuFQSb1HQ=
```

**Dataset:**
```
production
```
(sau păstrează "all datasets" dacă vrei să funcționeze pe toate)

**Trigger on:**
- ✅ Create
- ✅ Update  
- ✅ Delete

**Filter:**
```groq
_type == "post"
```

**Projection:**
```groq
{"slug": slug.current, "_type": _type, "_id": _id}
```

**HTTP method:**
```
POST
```
⚠️ **IMPORTANT: Schimbă din PATCH în POST**

**HTTP headers:**
```
(lasă gol sau poți adăuga)
Content-Type: application/json
```

**API version:**
```
v2025-02-19
```
(sau cea mai recentă disponibilă)

**Status:**
- ✅ Enable webhook (bifat)

**Drafts:**
- ⬜ Trigger webhook when drafts are modified (nebifat, pentru că lucrăm doar cu published)

**Versions:**
- ⬜ Trigger webhook when versions are modified (nebifat)

## 🧪 După ce salvezi:

1. Click pe **Test webhook** 
2. Ar trebui să primești: `200 OK` cu răspuns JSON
3. Verifică Recent deliveries pentru confirmare

## ❗ Dacă primești erori:

### 401 Unauthorized:
- Secretul nu se potrivește - verifică URL-ul
- Variabila `SANITY_REVALIDATE_SECRET` nu e în Vercel

### 404 Not Found:
- URL-ul e greșit
- API route-ul nu e deployed în producție

### 500 Server Error:
- Verifică logs în Vercel Dashboard
- Posibil că projection-ul nu returnează datele corecte
