import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { EditVenueSection, AddVenueForm } from '../../components/admin/EditVenueSection';
import { ManagerHeader } from '../../components/admin/ManagerHeader';
import { colors } from '../../theme/colors';
import type { Place } from '../../types/place';

const TAB_BAR_HEIGHT = 56;

export function AdminVenueScreen() {
  const insets = useSafeAreaInsets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [venues, setVenues] = useState<Place[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>('venue_001');

  useEffect(() => {
    const q = query(collection(db, 'venues'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Place[];
      setVenues(data);
    });
    return () => unsub();
  }, []);

  const handleDelete = (venue: Place) => {
    Alert.alert(
      'Mekanı Sil',
      `"${venue.name}" mekanını silmek istediğine emin misin?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await deleteDoc(doc(db, 'venues', venue.id));
            if (selectedVenueId === venue.id && venues.length > 1) {
              setSelectedVenueId(venues.find((v) => v.id !== venue.id)?.id ?? '');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ManagerHeader />

        {/* Yeni Mekan Ekle butonu */}
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle" size={24} color={colors.background} />
          <Text style={styles.addButtonText}>YENİ MEKAN EKLE</Text>
        </Pressable>

        {/* Mekan listesi */}
        <Text style={styles.sectionLabel}>Mekanlar</Text>
        {venues.map((venue) => (
          <Pressable
            key={venue.id}
            style={[
              styles.venueRow,
              selectedVenueId === venue.id && styles.venueRowSelected,
            ]}
            onPress={() => setSelectedVenueId(venue.id)}
          >
            <View style={styles.venueInfo}>
              <Text style={styles.venueName}>{venue.name}</Text>
              <Text style={styles.venueSubtitle}>{venue.subtitle}</Text>
            </View>
            <Pressable
              style={styles.deleteBtn}
              onPress={() => handleDelete(venue)}
            >
              <Ionicons name="trash-outline" size={18} color="#F87171" />
            </Pressable>
          </Pressable>
        ))}

        {/* Seçili mekanı düzenle */}
        {selectedVenueId ? (
          <>
            <Text style={styles.sectionLabel}>Düzenle</Text>
            <EditVenueSection venueId={selectedVenueId} />
          </>
        ) : null}

      </ScrollView>

      {showAddModal && (
        <AddVenueForm onClose={() => setShowAddModal(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.adminBackground,
  },
  scroll: {
    paddingHorizontal: 18,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.cyan,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  addButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  venueRowSelected: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  venueSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
});