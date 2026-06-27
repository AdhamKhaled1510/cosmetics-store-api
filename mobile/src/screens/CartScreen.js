import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { t } from '../i18n';

export default function CartScreen({ navigation }) {
  const { lang } = useLanguage();
  const { items, updateQty, removeItem, total } = useCart();
  const isRtl = lang === 'ar';

  const renderItem = ({ item }) => {
    const name = lang === 'ar' ? item.name_ar : item.name_en;
    const images = JSON.parse(item.images || '[]');
    return (
      <View style={styles.item}>
        <Image source={{ uri: images[0] }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, isRtl && { textAlign: 'right' }]}>{name}</Text>
          <Text style={styles.itemPrice}>{item.price} ₪</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty - 1)}>
              <Ionicons name="remove" size={16} color="#FF6B9D" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.qty}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty + 1)}>
              <Ionicons name="add" size={16} color="#FF6B9D" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.itemTotal}>{(item.price * item.qty).toFixed(2)} ₪</Text>
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ddd" />
        <Text style={styles.emptyText}>{t('emptyCart', lang)}</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.shopBtnText}>{t('startShopping', lang)}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('total', lang)}</Text>
          <Text style={styles.totalValue}>{total.toFixed(2)} ₪</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutText}>{t('checkout', lang)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyText: { fontSize: 18, color: '#999', marginTop: 16 },
  shopBtn: { backgroundColor: '#FF6B9D', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25, marginTop: 20 },
  shopBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  list: { padding: 16 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 10,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
  },
  itemImage: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#f0f0f0' },
  itemInfo: { flex: 1, marginHorizontal: 12 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  itemPrice: { fontSize: 13, color: '#FF6B9D', fontWeight: '500', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center',
  },
  qtyText: { fontSize: 14, fontWeight: '600', marginHorizontal: 10 },
  itemRight: { alignItems: 'flex-end', gap: 12 },
  itemTotal: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  footer: {
    padding: 20, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 18, fontWeight: '600', color: '#333' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: '#FF6B9D' },
  checkoutBtn: { backgroundColor: '#FF6B9D', padding: 16, borderRadius: 14, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
