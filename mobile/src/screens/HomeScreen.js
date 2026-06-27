import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, Image, StyleSheet, SafeAreaView, Dimensions, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n';
import { getProducts } from '../api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const BANNER_H = width * 0.45;

const BANNERS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', labelAr: 'تخفيضات تصل إلى 50%', labelEn: 'Up to 50% OFF' },
  { id: '2', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800', labelAr: 'مستحضرات التجميل الأصلية', labelEn: '100% Original Beauty' },
  { id: '3', image: 'https://images.unsplash.com/photo-1556229162-5c63ed7c4efb?w=800', labelAr: 'توصيل مجاني', labelEn: 'Free Delivery' },
];

const CAT_ICONS = ['💄', '👁️', '🎨', '🧴', '🌸', '💇‍♀️', '🧖‍♀️'];

export default function HomeScreen({ navigation }) {
  const { lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [catList, setCatList] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState('');
  const isRtl = lang === 'ar';
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerRef = useRef(null);

  useEffect(() => {
    const params = {};
    if (activeCat) params.category = activeCat;
    if (search) params.search = search;
    getProducts(params).then(({ data }) => {
      setProducts(data.products);
      setCatList(data.categories);
    }).catch(() => {});
  }, [activeCat, search]);

  useEffect(() => {
    const t = setInterval(() => {
      const next = (bannerIdx + 1) % BANNERS.length;
      bannerRef.current?.scrollTo({ x: next * width, animated: true });
      setBannerIdx(next);
    }, 4000);
    return () => clearInterval(t);
  }, [bannerIdx]);

  const featured = products.filter(p => p.featured);

  const renderProduct = ({ item }) => {
    const name = lang === 'ar' ? item.name_ar : item.name_en;
    const images = JSON.parse(item.images || '[]');
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <View style={styles.imageWrap}>
          <Image source={{ uri: images[0] }} style={styles.productImage} />
          {item.featured ? <View style={styles.featuredBadge}><Ionicons name="flash" size={10} color="#fff" /></View> : null}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>{item.price} <Text style={styles.currency}>₪</Text></Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBanner = ({ item }) => (
    <TouchableOpacity activeOpacity={1} style={{ width, height: BANNER_H }}>
      <Image source={{ uri: item.image }} style={{ width, height: BANNER_H, resizeMode: 'cover' }} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerText}>{lang === 'ar' ? item.labelAr : item.labelEn}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFeatured = ({ item }) => {
    const name = lang === 'ar' ? item.name_ar : item.name_en;
    const images = JSON.parse(item.images || '[]');
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.featuredCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Image source={{ uri: images[0] }} style={styles.featuredImg} />
        <Text style={styles.featuredName} numberOfLines={1}>{name}</Text>
        <Text style={styles.featuredPrice}>{item.price} ₪</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>Glow</Text>
          <Text style={styles.logoAccent}>RX</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={22} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          style={[styles.searchInput, isRtl && { textAlign: 'right' }]}
          placeholder={t('search', lang)}
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>{t('noProducts', lang)}</Text>}
        ListHeaderComponent={
          <>
            <ScrollView
              ref={bannerRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => setBannerIdx(Math.round(e.nativeEvent.contentOffset.x / width))}
              style={{ marginBottom: 4 }}
            >
              {BANNERS.map(b => (
                <View key={b.id} style={{ width, height: BANNER_H }}>
                  <Image source={{ uri: b.image }} style={{ width, height: BANNER_H, resizeMode: 'cover' }} />
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerText}>{lang === 'ar' ? b.labelAr : b.labelEn}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.dots}>
              {BANNERS.map((_, i) => (
                <View key={i} style={[styles.dot, i === bannerIdx && styles.dotActive]} />
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{lang === 'ar' ? 'الأقسام' : 'Categories'}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
              {catList.map((cat, i) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catCard, activeCat === String(cat.id) && styles.catCardActive]}
                  onPress={() => setActiveCat(activeCat === String(cat.id) ? null : String(cat.id))}
                >
                  <Text style={styles.catEmoji}>{CAT_ICONS[i % CAT_ICONS.length]}</Text>
                  <Text style={[styles.catLabel, activeCat === String(cat.id) && styles.catLabelActive]} numberOfLines={1}>
                    {lang === 'ar' ? cat.name_ar : cat.name_en}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {featured.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}</Text>
                </View>
                <FlatList
                  data={featured}
                  renderItem={renderFeatured}
                  keyExtractor={item => String(item.id)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: 4 }}
                />
              </>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{lang === 'ar' ? 'جميع المنتجات' : 'All Products'}</Text>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  logoRow: { flexDirection: 'row', alignItems: 'baseline' },
  logoText: { fontSize: 26, fontWeight: '900', color: '#1a1a1a', letterSpacing: -1 },
  logoAccent: { fontSize: 26, fontWeight: '900', color: '#FF6B9D', letterSpacing: -1 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16,
    marginHorizontal: 20, marginBottom: 12, height: 46,
    borderWidth: 1, borderColor: '#F0F0F0',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#333' },
  bannerOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  bannerText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ddd' },
  dotActive: { width: 20, backgroundColor: '#FF6B9D', borderRadius: 3 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 6,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  catContent: { paddingHorizontal: 20, gap: 10 },
  catCard: {
    width: 74, alignItems: 'center', paddingVertical: 10,
    borderRadius: 16, backgroundColor: '#fff',
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
  },
  catCardActive: { backgroundColor: '#FFF0F5' },
  catEmoji: { fontSize: 26, marginBottom: 4 },
  catLabel: { fontSize: 10, fontWeight: '600', color: '#555', textAlign: 'center' },
  catLabelActive: { color: '#FF6B9D' },
  featuredCard: {
    width: 130, backgroundColor: '#fff', borderRadius: 14,
    padding: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
  },
  featuredImg: { width: '100%', height: 110, borderRadius: 10, backgroundColor: '#f0f0f0' },
  featuredName: { fontSize: 12, fontWeight: '600', color: '#1a1a1a', marginTop: 8 },
  featuredPrice: { fontSize: 13, fontWeight: '800', color: '#FF6B9D', marginTop: 4 },
  row: { justifyContent: 'space-between', paddingHorizontal: 20, gap: 8 },
  productsList: { paddingBottom: 24 },
  productCard: {
    width: CARD_WIDTH, backgroundColor: '#fff',
    borderRadius: 14, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  imageWrap: { height: CARD_WIDTH, backgroundColor: '#F8F8F8' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  featuredBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#FF6B9D', width: 20, height: 20, borderRadius: 6,
    justifyContent: 'center', alignItems: 'center',
  },
  productInfo: { padding: 10, paddingTop: 8 },
  productName: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', lineHeight: 17 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  productPrice: { fontSize: 15, fontWeight: '800', color: '#FF6B9D' },
  currency: { fontSize: 12, fontWeight: '600' },
  addBtn: { width: 28, height: 28, borderRadius: 9, backgroundColor: '#FF6B9D', justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
});
