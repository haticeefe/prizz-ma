import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  doc, getDoc, collection, onSnapshot,
  query, where, orderBy, addDoc, Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types/auth';
import type { Place } from '../types/place';

type VenueDetailRouteProp = RouteProp<RootStackParamList, 'VenueDetail'>;

export function VenueDetailScreen() {
  const route = useRoute<VenueDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { venueId } = route.params;

  const [venue, setVenue] = useState<Place | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'venues', venueId)).then((snap) => {
      if (snap.exists()) {
        setVenue({ id: snap.id, ...snap.data() } as Place);
      }
    });
  }, [venueId]);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('venueId', '==', venueId),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [venueId]);

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      Alert.alert('Hata', 'Yorum boş olamaz.');
      return;
    }
    setSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Giriş yapmanız gerekiyor.');
        return;
      }

      let displayName = 'Anonim';
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          displayName = userDoc.data().displayName ?? 'Anonim';
        }
      } catch (_) {}

      await addDoc(collection(db, 'reviews'), {
        venueId: venueId.trim(),
        userId: user.uid,
        userName: displayName,
        rating,
        comment: comment.trim(),
        createdAt: Timestamp.now(),
      });
      setComment('');
      setRating(5);
      Alert.alert('Teşekkürler!', 'Yorumun eklendi.');
    } catch (error) {
      console.error('Yorum hatası:', error);
      Alert.alert('Hata', 'Yorum eklenemedi: ' + String(error));
    } finally {
      setSubmitting(false);
    }
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 75) return '#F87171';
    if (rate >= 40) return '#FBBF24';
    return '#34D399';
  };

  const formatTimeAgo = (createdAt: any) => {
    if (!createdAt) return '';
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMin < 1) return 'Az önce';
    if (diffMin < 60) return `${diffMin} dk önce`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} sa önce`;
    return `${Math.floor(diffHours / 24)} gün önce`;
  };

  if (!venue) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  const occColor = getOccupancyColor(venue.occupancyRate);
  const emptySeats = venue.totalSeats - venue.occupiedSeats;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>{venue.name}</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color="#FFD60A" />
            <Text style={styles.statValue}>{venue.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Puan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="people" size={20} color={colors.cyan} />
            <Text style={styles.statValue}>{emptySeats}</Text>
            <Text style={styles.statLabel}>Boş Masa</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="flash" size={20} color="#FBBF24" />
            <Text style={styles.statValue}>{venue.outletCount}</Text>
            <Text style={styles.statLabel}>Priz</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="people-circle" size={20} color={occColor} />
            <Text style={[styles.statValue, { color: occColor }]}>%{venue.occupancyRate}</Text>
            <Text style={styles.statLabel}>Doluluk</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.occupancyLabelRow}>
            <Text style={styles.sectionTitle}>Doluluk Durumu</Text>
            <Text style={[styles.occPct, { color: occColor }]}>%{venue.occupancyRate}</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${venue.occupancyRate}%`, backgroundColor: occColor }]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Olanaklar</Text>
          <View style={styles.tagsRow}>
            {venue.hasPriz && <View style={styles.tag}><Ionicons name="flash" size={14} color={colors.cyan} /><Text style={styles.tagText}>Priz Var</Text></View>}
            {venue.isOpen247 && <View style={styles.tag}><Ionicons name="time" size={14} color={colors.cyan} /><Text style={styles.tagText}>7/24 Açık</Text></View>}
            {venue.hasQuietZone && <View style={styles.tag}><Ionicons name="volume-mute" size={14} color={colors.cyan} /><Text style={styles.tagText}>Sessiz Alan</Text></View>}
            {venue.hasAC && <View style={styles.tag}><Ionicons name="snow" size={14} color={colors.cyan} /><Text style={styles.tagText}>Klima</Text></View>}
            {venue.hasAffordableCoffee && <View style={styles.tag}><Ionicons name="cafe" size={14} color={colors.cyan} /><Text style={styles.tagText}>Uygun Kahve</Text></View>}
            {venue.coffeePrice > 0 && <View style={styles.tag}><Ionicons name="pricetag" size={14} color={colors.cyan} /><Text style={styles.tagText}>₺{venue.coffeePrice} Kahve</Text></View>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yorum Yaz</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={28}
                  color="#FFD60A"
                />
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.commentInput}
            placeholder="Deneyimini paylaş..."
            placeholderTextColor={colors.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
          />
          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.8 }]}
            onPress={handleSubmitReview}
            disabled={submitting}
          >
            <Ionicons name="send" size={18} color={colors.background} />
            <Text style={styles.submitText}>
              {submitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yorumlar ({reviews.length})</Text>
          {reviews.length === 0 ? (
            <Text style={styles.emptyText}>Henüz yorum yok. İlk yorumu sen yaz!</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewName}>{review.userName}</Text>
                  <Text style={styles.reviewTime}>{formatTimeAgo(review.createdAt)}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {[1,2,3,4,5].map((s) => (
                    <Ionicons
                      key={s}
                      name={s <= review.rating ? 'star' : 'star-outline'}
                      size={14}
                      color="#FFD60A"
                    />
                  ))}
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  content: { paddingHorizontal: 20, gap: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.white },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(248,113,113,0.15)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F87171' },
  liveText: { fontSize: 11, fontWeight: '800', color: '#F87171', letterSpacing: 0.5 },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 16, paddingHorizontal: 8,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.white },
  statLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  section: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16, gap: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.white },
  occupancyLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  occPct: { fontSize: 14, fontWeight: '700' },
  barBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,229,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  tagText: { fontSize: 12, fontWeight: '600', color: colors.cyan },
  ratingRow: { flexDirection: 'row', gap: 8 },
  commentInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 14, color: colors.white,
    fontSize: 14, minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: colors.cyan,
    borderRadius: 12, paddingVertical: 14,
  },
  submitText: { fontSize: 15, fontWeight: '700', color: colors.background },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 14, gap: 6,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewName: { fontSize: 13, fontWeight: '700', color: colors.white },
  reviewTime: { fontSize: 11, color: colors.textMuted },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewComment: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingVertical: 8 },
});