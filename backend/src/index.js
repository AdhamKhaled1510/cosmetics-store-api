const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb, dbRun, dbGet } = require('./db.js');
const productsRouter = require('./routes/products.js');
const authRouter = require('./routes/auth.js');
const ordersRouter = require('./routes/orders.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function init() {
  try {
    await initDb();
    const existing = dbGet("SELECT COUNT(*) as c FROM categories");
    if (!existing || existing.c === 0) {
      const cats = [
        { name_ar: 'أحمر شفاه', name_en: 'Lipstick' }, { name_ar: 'مكياج عيون', name_en: 'Eye Makeup' },
        { name_ar: 'أساس', name_en: 'Foundation' }, { name_ar: 'عناية بالبشرة', name_en: 'Skincare' },
        { name_ar: 'عطور', name_en: 'Perfumes' }
      ];
      for (const c of cats) dbRun('INSERT INTO categories (name_ar, name_en) VALUES (?, ?)', [c.name_ar, c.name_en]);
      const prods = [
        { name_ar: 'أحمر شفاه أحمر', name_en: 'Red Lipstick', desc_ar: 'طويل الثبات', desc_en: 'Long-lasting', price: 45, stock: 50, cat: 1, feat: 1 },
        { name_ar: 'ماسكارا سوداء', name_en: 'Black Mascara', desc_ar: 'لتطويل الرموش', desc_en: 'Volumizing', price: 55, stock: 40, cat: 2, feat: 1 },
        { name_ar: 'ظلال عيون', name_en: 'Eyeshadow Palette', desc_ar: '12 لون', desc_en: '12 colors', price: 85, stock: 20, cat: 2, feat: 1 },
        { name_ar: 'كريم أساس', name_en: 'Foundation', desc_ar: 'سائل طبيعي', desc_en: 'Natural liquid', price: 70, stock: 35, cat: 3, feat: 0 },
        { name_ar: 'مرطب للوجه', name_en: 'Face Moisturizer', desc_ar: 'يومي للبشرة', desc_en: 'Daily moisturizer', price: 60, stock: 45, cat: 4, feat: 1 },
        { name_ar: 'عطر زهري', name_en: 'Floral Perfume', desc_ar: 'رائحة أزهار', desc_en: 'Floral scent', price: 120, stock: 15, cat: 5, feat: 1 },
        { name_ar: 'سيروم فيتامين C', name_en: 'Vitamin C Serum', desc_ar: 'مضيء للبشرة', desc_en: 'Brightening', price: 95, stock: 25, cat: 4, feat: 0 },
        { name_ar: 'آيلاينر أسود', name_en: 'Black Eyeliner', desc_ar: 'مقاوم للماء', desc_en: 'Waterproof', price: 35, stock: 60, cat: 2, feat: 0 },
        { name_ar: 'بودرة وجه', name_en: 'Face Powder', desc_ar: 'شفافة لتثبيت', desc_en: 'Translucent setting', price: 50, stock: 30, cat: 3, feat: 0 },
      ];
      for (const p of prods) {
        dbRun('INSERT INTO products (name_ar, name_en, description_ar, description_en, price, stock, category_id, featured) VALUES (?,?,?,?,?,?,?,?)',
          [p.name_ar, p.name_en, p.desc_ar, p.desc_en, p.price, p.stock, p.cat, p.feat]);
      }
    }
  } catch (e) {
    console.error('Init error:', e);
  }
}

const handler = async (req, res) => {
  await init();
  return app(req, res);
};

module.exports = handler;

if (require.main === module) {
  init().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}
