const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb, dbRun, dbGet, dbAll } = require('./db.js');
const productsRouter = require('./routes/products.js');
const authRouter = require('./routes/auth.js');
const ordersRouter = require('./routes/orders.js');

const app = express();
app.use(cors());
app.use(express.json());

const categoriesData = [
  ['أحمر شفاه', 'Lipstick'],
  ['مكياج عيون', 'Eye Makeup'],
  ['أساس', 'Foundation'],
  ['عناية بالبشرة', 'Skincare'],
  ['عطور', 'Perfumes'],
];

const productsData = [
  ['أحمر شفاه أحمر','Red Lipstick','طويل الثبات','Long-lasting',45,50,1,1,'["https://picsum.photos/seed/lipstick/400/400"]'],
  ['ماسكارا سوداء','Black Mascara','لتطويل الرموش','Volumizing',55,40,2,1,'["https://picsum.photos/seed/mascara/400/400"]'],
  ['ظلال عيون','Eyeshadow Palette','12 لون','12 colors',85,20,2,1,'["https://picsum.photos/seed/eyeshadow/400/400"]'],
  ['كريم أساس','Foundation','سائل طبيعي','Natural liquid',70,35,3,0,'["https://picsum.photos/seed/foundation/400/400"]'],
  ['مرطب للوجه','Face Moisturizer','يومي للبشرة','Daily moisturizer',60,45,4,1,'["https://picsum.photos/seed/moisturizer/400/400"]'],
  ['عطر زهري','Floral Perfume','رائحة أزهار','Floral scent',120,15,5,1,'["https://picsum.photos/seed/perfume/400/400"]'],
  ['سيروم فيتامين C','Vitamin C Serum','مضيء للبشرة','Brightening',95,25,4,0,'["https://picsum.photos/seed/vitaminc/400/400"]'],
  ['آيلاينر أسود','Black Eyeliner','مقاوم للماء','Waterproof',35,60,2,0,'["https://picsum.photos/seed/eyeliner/400/400"]'],
  ['بودرة وجه','Face Powder','شفافة لتثبيت','Translucent setting',50,30,3,0,'["https://picsum.photos/seed/facepowder/400/400"]'],
];

let ready = false;
let initPromise = null;
app.use((req, res, next) => {
  if (ready) return next();
  if (!initPromise) {
    initPromise = initDb().then(() => {
      const catCount = dbGet("SELECT COUNT(*) as c FROM categories");
      if (!catCount || catCount.c === 0) {
        for (const c of categoriesData) dbRun('INSERT INTO categories (name_ar, name_en) VALUES (?, ?)', c);
        for (const p of productsData) dbRun('INSERT INTO products (name_ar, name_en, description_ar, description_en, price, stock, category_id, featured, images) VALUES (?,?,?,?,?,?,?,?,?)', p);
      } else {
        dbRun("UPDATE products SET images = ? WHERE images IS NULL OR images = '[]'", productsData[0][8]);
      }
      ready = true;
    }).catch(e => console.error('Init error:', e));
  }
  initPromise.then(() => next()).catch(() => next());
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/debug', (req, res) => {
  try {
    const cats = dbAll('SELECT * FROM categories');
    res.json({ cats, ready });
  } catch(e) {
    res.json({ error: e.message });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}

module.exports = app;
