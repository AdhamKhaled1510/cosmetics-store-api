import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api';
import { t } from '../i18n';

export default function CheckoutScreen({ navigation }) {
  const { lang } = useLanguage();
  const { items, total, clearCart } = useCart();
  const isRtl = lang === 'ar';

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleOrder = async () => {
    if (!address || !phone) {
      Alert.alert('', 'Please fill in address and phone');
      return;
    }

    try {
      await createOrder({
        items: items.map((i) => ({
          id: i.id,
          name_ar: i.name_ar,
          name_en: i.name_en,
          price: i.price,
          qty: i.qty,
        })),
        total,
        payment_method: paymentMethod === 'cod' ? 'cod' : 'card',
        shipping_address: address,
        phone,
        notes,
      });
      Alert.alert('', t('orderPlaced', lang), [
        { text: 'OK', onPress: () => { clearCart(); navigation.navigate('Orders'); } },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={[styles.container]}>
        <Text style={[styles.title, isRtl && { textAlign: 'right' }]}>
          {t('checkout', lang)}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRtl && { textAlign: 'right' }]}>
            {t('shippingAddress', lang)}
          </Text>
          <TextInput
            style={[styles.input, isRtl && { textAlign: 'right' }]}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
          />
          <TextInput
            style={[styles.input, isRtl && { textAlign: 'right' }]}
            value={phone}
            onChangeText={setPhone}
            placeholder={t('phone', lang)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.textArea, isRtl && { textAlign: 'right' }]}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('notes', lang)}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRtl && { textAlign: 'right' }]}>
            {t('payment', lang)}
          </Text>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cod' && styles.paymentActive,
            ]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons
              name={paymentMethod === 'cod' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color="#FF6B9D"
            />
            <Text style={styles.paymentText}>{t('cashOnDelivery', lang)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentActive,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons
              name={paymentMethod === 'card' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color="#FF6B9D"
            />
            <Text style={styles.paymentText}>{t('cardPayment', lang)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>{t('total', lang)}</Text>
          <Text style={styles.totalValue}>{total.toFixed(2)} ₪</Text>
        </View>

        <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
          <Text style={styles.orderBtnText}>{t('placeOrder', lang)}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  paymentActive: { borderColor: '#FF6B9D', backgroundColor: '#FFF0F5' },
  paymentText: { marginLeft: 12, fontSize: 16, color: '#333' },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: { fontSize: 20, fontWeight: '600' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: '#FF6B9D' },
  orderBtn: {
    backgroundColor: '#FF6B9D',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  orderBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
