import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { t } from '../i18n';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const { lang } = useLanguage();
  const { addItem } = useCart();
  const isRtl = lang === 'ar';
  const name = lang === 'ar' ? product.name_ar : product.name_en;
  const desc = lang === 'ar' ? product.description_ar : product.description_en;
  const images = JSON.parse(product.images || '[]');
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <Image source={{ uri: images[selectedImage] }} style={styles.mainImage} />
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.roundBtn} onPress={() => navigation.goBack()}>
              <Ionicons name={isRtl ? 'arrow-forward' : 'arrow-back'} size={22} color="#1a1a1a" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundBtn}>
              <Ionicons name="heart-outline" size={22} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
          {images.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow} contentContainerStyle={styles.thumbContent}>
              {images.map((uri, i) => (
                <TouchableOpacity key={i} onPress={() => setSelectedImage(i)} style={[styles.thumbWrap, selectedImage === i && styles.thumbActive]}>
                  <Image source={{ uri }} style={styles.thumb} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.content}>
          <Text style={[styles.name, isRtl && { textAlign: 'right' }]}>{name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price} <Text style={styles.currencySm}>₪</Text></Text>
            <View style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
              <View style={[styles.stockDot, { backgroundColor: product.stock > 0 ? '#4CAF50' : '#ff4444' }]} />
              <Text style={[styles.stockText, { color: product.stock > 0 ? '#4CAF50' : '#ff4444' }]}>
                {product.stock > 0 ? (lang === 'ar' ? 'متوفر' : 'In Stock') : (lang === 'ar' ? 'غير متوفر' : 'Out of Stock')}
              </Text>
            </View>
          </View>

          {desc && (
            <View style={styles.descSection}>
              <Text style={[styles.sectionTitle, isRtl && { textAlign: 'right' }]}>{t('desc', lang)}</Text>
              <Text style={[styles.desc, isRtl && { textAlign: 'right' }]}>{desc}</Text>
            </View>
          )}

          <View style={[styles.metaRow, isRtl && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="cube-outline" size={16} color="#999" />
            <Text style={styles.metaText}>{lang === 'ar' ? 'الكمية المتوفرة: ' : 'Stock: '}{product.stock}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>{t('total', lang)}</Text>
          <Text style={styles.totalPrice}>{product.price} ₪</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => { addItem(product); navigation.navigate('Cart'); }}>
          <Ionicons name="bag-add-outline" size={20} color="#fff" />
          <Text style={styles.addBtnText}>{t('addToCart', lang)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageSection: { backgroundColor: '#FAFAFA' },
  mainImage: { width, height: width * 1.1, resizeMode: 'cover' },
  imageActions: {
    position: 'absolute', top: StatusBar.currentHeight + 4 || 44, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  roundBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10,
  },
  thumbRow: { marginTop: -20, marginBottom: 4, marginLeft: 16 },
  thumbContent: { gap: 8, paddingRight: 16 },
  thumbWrap: {
    width: 48, height: 48, borderRadius: 10, overflow: 'hidden',
    borderWidth: 2, borderColor: 'transparent',
  },
  thumbActive: { borderColor: '#FF6B9D' },
  thumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  content: { padding: 20 },
  name: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', lineHeight: 26 },
  priceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginVertical: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  price: { fontSize: 28, fontWeight: '800', color: '#FF6B9D' },
  currencySm: { fontSize: 18, fontWeight: '600' },
  inStock: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  outOfStock: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  stockDot: { width: 7, height: 7, borderRadius: 3.5 },
  stockText: { fontSize: 13, fontWeight: '500' },
  descSection: { marginTop: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 8 },
  desc: { fontSize: 14, color: '#666', lineHeight: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  metaText: { fontSize: 13, color: '#999' },
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, paddingBottom: 24,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  totalLabel: { fontSize: 12, color: '#999', fontWeight: '500' },
  totalPrice: { fontSize: 20, fontWeight: '800', color: '#FF6B9D' },
  addBtn: {
    flexDirection: 'row', backgroundColor: '#FF6B9D',
    paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14,
    alignItems: 'center', gap: 8,
    elevation: 2, shadowColor: '#FF6B9D', shadowOpacity: 0.3, shadowRadius: 8,
  },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
