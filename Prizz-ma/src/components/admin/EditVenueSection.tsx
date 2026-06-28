import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useAdminManager } from '../../context/AdminManagerContext';
import { colors } from '../../theme/colors';
import { AdminCard } from './AdminCard';

const AMENITIES: { key: 'priz' | 'silent' | 'klima'; label: string }[] = [
  { key: 'priz', label: 'Priz Var' },
  { key: 'silent', label: 'Sessiz Alan' },
  { key: 'klima', label: 'Klima' },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

type TimePickerFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};

function TimePickerField({ label, value, onChange }: TimePickerFieldProps) {
  const [show, setShow] = useState(false);

  const onPickerChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (selected) onChange(selected);
  };

  return (
    <View style={styles.timeField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.timeInput} onPress={() => setShow(true)}>
        <Ionicons name="time-outline" size={20} color={colors.cyanMuted} />
        <Text style={styles.timeText}>{formatTime(value)}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value}
          mode="time"
          is24Hour
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onPickerChange}
        />
      )}
    </View>
  );
}

export function AddVenueForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [coffeePrice, setCoffeePrice] = useState('');
  const [hasPriz, setHasPriz] = useState(false);
  const [hasQuietZone, setHasQuietZone] = useState(false);
  const [hasAC, setHasAC] = useState(false);
  const [isOpen247, setIsOpen247] = useState(false);

  const saveNewVenue = async () => {
    if (!name || !latitude || !longitude) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun (İsim, Lat, Lng)');
      return;
    }

    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'venues'), {
        name,
        subtitle,
        latitude: Number(latitude),
        longitude: Number(longitude),
        totalSeats: Number(totalSeats) || 50,
        occupiedSeats: 0,
        occupancyRate: 0,
        outletCount: 0,
        rating: 0,
        coffeePrice: Number(coffeePrice) || 0,
        hasPriz,
        hasQuietZone,
        hasAC,
        isOpen247,
        hasAffordableCoffee: Number(coffeePrice) > 0 && Number(coffeePrice) < 50,
        isVisible: true,
        adminId: user?.uid ?? '',
        openTime: '08:00',
        closeTime: '22:00',
      });
      Alert.alert('Başarılı', 'Mekan haritaya eklendi!');
      onClose();
    } catch (error) {
      Alert.alert('Hata', error instanceof Error ? error.message : 'Mekan eklenemedi.');
    }
  };

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Yeni Mekan Ekle</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.white} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroll}>
            <Text style={styles.fieldLabel}>Mekan Adı *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Örn: Kahve Dünyası" placeholderTextColor={colors.textMuted} />

            <Text style={styles.fieldLabel}>Alt Başlık</Text>
            <TextInput style={styles.input} value={subtitle} onChangeText={setSubtitle} placeholder="Örn: 2. Kat" placeholderTextColor={colors.textMuted} />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Latitude *</Text>
                <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} keyboardType="numeric" placeholder="40.77..." placeholderTextColor={colors.textMuted} />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Longitude *</Text>
                <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} keyboardType="numeric" placeholder="30.39..." placeholderTextColor={colors.textMuted} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Toplam Masa</Text>
                <TextInput style={styles.input} value={totalSeats} onChangeText={setTotalSeats} keyboardType="numeric" placeholder="50" placeholderTextColor={colors.textMuted} />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Kahve Fiyatı (₺)</Text>
                <TextInput style={styles.input} value={coffeePrice} onChangeText={setCoffeePrice} keyboardType="numeric" placeholder="45" placeholderTextColor={colors.textMuted} />
              </View>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Olanaklar</Text>
            <Pressable style={styles.checkRow} onPress={() => setHasPriz(!hasPriz)}>
              <Ionicons name={hasPriz ? 'checkbox' : 'square-outline'} size={24} color={hasPriz ? colors.cyan : colors.textMuted} />
              <Text style={styles.checkLabel}>Priz Var</Text>
            </Pressable>
            <Pressable style={styles.checkRow} onPress={() => setHasQuietZone(!hasQuietZone)}>
              <Ionicons name={hasQuietZone ? 'checkbox' : 'square-outline'} size={24} color={hasQuietZone ? colors.cyan : colors.textMuted} />
              <Text style={styles.checkLabel}>Sessiz Alan</Text>
            </Pressable>
            <Pressable style={styles.checkRow} onPress={() => setHasAC(!hasAC)}>
              <Ionicons name={hasAC ? 'checkbox' : 'square-outline'} size={24} color={hasAC ? colors.cyan : colors.textMuted} />
              <Text style={styles.checkLabel}>Klima</Text>
            </Pressable>
            <Pressable style={styles.checkRow} onPress={() => setIsOpen247(!isOpen247)}>
              <Ionicons name={isOpen247 ? 'checkbox' : 'square-outline'} size={24} color={isOpen247 ? colors.cyan : colors.textMuted} />
              <Text style={styles.checkLabel}>7/24 Açık</Text>
            </Pressable>

            <Pressable style={styles.saveBtn} onPress={saveNewVenue}>
              <Text style={styles.saveText}>MEKANI OLUŞTUR</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function EditVenueSection({ venueId }: { venueId?: string }) {
  const {
    selectedVenueId,
    coffeePrice,
    setCoffeePrice,
    openTime,
    setOpenTime,
    closeTime,
    setCloseTime,
    amenities,
    toggleAmenity,
    venues,
  } = useAdminManager();

  const activeVenueId = venueId ?? selectedVenueId;
  const activeVenue = venues.find((v) => v.id === activeVenueId);

  const saveChanges = async () => {
    if (!activeVenueId) {
      Alert.alert('Hata', 'Lütfen bir mekan seçin.');
      return;
    }
    try {
      await updateDoc(doc(db, 'venues', activeVenueId), {
        coffeePrice: Number(coffeePrice),
        openTime: formatTime(openTime),
        closeTime: formatTime(closeTime),
        hasPriz: amenities.priz,
        hasQuietZone: amenities.silent,
        hasAC: amenities.klima,
      });
      Alert.alert('Kaydedildi', 'Değişiklikler başarıyla güncellendi.');
    } catch (error: unknown) {
      Alert.alert('Hata', error instanceof Error ? error.message : 'Değişiklikler kaydedilemedi.');
    }
  };

  return (
    <AdminCard style={styles.card}>
      <Text style={styles.sectionTitle}>
        {activeVenue ? `${activeVenue.name} — Düzenle` : 'Mekan Düzenle'}
      </Text>

      <Text style={styles.fieldLabel}>Kahve Fiyatı (₺)</Text>
      <View style={styles.priceRow}>
        <Ionicons name="cafe" size={20} color={colors.cyanMuted} />
        <TextInput
          style={styles.priceInput}
          value={coffeePrice}
          onChangeText={setCoffeePrice}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.timeRow}>
        <TimePickerField label="Açılış" value={openTime} onChange={setOpenTime} />
        <TimePickerField label="Kapanış" value={closeTime} onChange={setCloseTime} />
      </View>

      <Text style={[styles.fieldLabel, styles.amenityLabel]}>Olanaklar</Text>
      {AMENITIES.map((item) => {
        const checked = amenities[item.key];
        return (
          <Pressable key={item.key} style={styles.checkRow} onPress={() => toggleAmenity(item.key)}>
            <Ionicons
              name={checked ? 'checkbox' : 'square-outline'}
              size={24}
              color={checked ? colors.cyan : colors.textMuted}
            />
            <Text style={styles.checkLabel}>{item.label}</Text>
          </Pressable>
        );
      })}

      <Pressable
        style={({ pressed }) => [styles.saveBtn, pressed && styles.savePressed]}
        onPress={saveChanges}
      >
        <Text style={styles.saveText}>DEĞİŞİKLİKLERİ KAYDET</Text>
      </Pressable>
    </AdminCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.white, marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, marginBottom: 8 },
  priceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.inputBg, borderRadius: 12,
    borderWidth: 1, borderColor: colors.inputBorder,
    paddingHorizontal: 14, minHeight: 50, marginBottom: 16,
  },
  priceInput: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.white, paddingVertical: 12 },
  timeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  timeField: { flex: 1 },
  timeInput: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.inputBg, borderRadius: 12,
    borderWidth: 1, borderColor: colors.inputBorder,
    paddingHorizontal: 12, minHeight: 50,
  },
  timeText: { fontSize: 15, fontWeight: '600', color: colors.white },
  amenityLabel: { marginTop: 4, marginBottom: 10 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  checkLabel: { fontSize: 15, color: colors.white, fontWeight: '500' },
  saveBtn: {
    marginTop: 18, backgroundColor: colors.adminPurple,
    borderRadius: 12, minHeight: 52,
    alignItems: 'center', justifyContent: 'center',
  },
  savePressed: { backgroundColor: colors.adminPurplePressed },
  saveText: { fontSize: 14, fontWeight: '800', color: '#1A1028', letterSpacing: 0.6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.adminBackground,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '90%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.white },
  formScroll: { paddingBottom: 40 },
  input: {
    backgroundColor: colors.inputBg, borderRadius: 12,
    borderWidth: 1, borderColor: colors.inputBorder,
    paddingHorizontal: 14, paddingVertical: 12,
    color: colors.white, fontSize: 16, marginBottom: 16,
  },
  row: { flexDirection: 'row' },
});