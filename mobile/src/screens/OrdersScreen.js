import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { getOrders } from '../api';
import { t } from '../i18n';

const statusColors = {
  pending: '#FFA726',
  completed: '#4CAF50',
  cancelled: '#EF5350',
};

export default function OrdersScreen() {
  const { lang } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B9D" />
      </SafeAreaView>
    );
  }

  const renderOrder = ({ item }) => {
    const items = JSON.parse(item.items || '[]');
    return (
      <View style={[styles.orderCard]}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>#{item.id}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[item.status] || '#999' },
            ]}
          >
            <Text style={styles.statusText}>
              {t(item.status, lang) || item.status}
            </Text>
          </View>
        </View>
        <Text style={[styles.orderDate]}>
          {new Date(item.created_at).toLocaleDateString(
            lang === 'ar' ? 'ar-SA' : 'en-US'
          )}
        </Text>
        {items.map((i, idx) => (
          <Text key={idx} style={[styles.orderItem]}>
            {lang === 'ar' ? i.name_ar : i.name_en} × {i.qty} - {i.price} ₪
          </Text>
        ))}
        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>
            {t('total', lang)}: {item.total} ₪
          </Text>
          <Text style={styles.orderPayment}>
            {item.payment_method === 'cod'
              ? t('cashOnDelivery', lang)
              : t('cardPayment', lang)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>{t('noProducts', lang)}</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  orderDate: { fontSize: 13, color: '#999', marginBottom: 8 },
  orderItem: { fontSize: 14, color: '#666', marginBottom: 4 },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#FF6B9D' },
  orderPayment: { fontSize: 14, color: '#666' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});
