import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { colors } from '../../theme/colors';
import { AdminCard } from './AdminCard';

function formatTimeAgo(createdAt: unknown): string {
  let date: Date | null = null;

  if (
    createdAt &&
    typeof createdAt === 'object' &&
    'toDate' in createdAt &&
    typeof (createdAt as { toDate: () => Date }).toDate === 'function'
  ) {
    date = (createdAt as { toDate: () => Date }).toDate();
  } else if (createdAt instanceof Date) {
    date = createdAt;
  } else if (typeof createdAt === 'number') {
    date = new Date(createdAt);
  }

  if (!date || Number.isNaN(date.getTime())) return '';

  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dk önce`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} sa önce`;
  return `${Math.floor(diffHours / 24)} gün önce`;
}

export function RecentReviewsSection({ compact }: { compact?: boolean }) {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const displayedReviews = compact ? reviews.slice(0, 2) : reviews;

  return (
    <AdminCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Son Yorumlar</Text>
        <Pressable onPress={() => Alert.alert('Yorumlar', 'Tüm yorumlar listelenecek.')}>
          <Text style={styles.seeAll}>TÜMÜNÜ GÖR</Text>
        </Pressable>
      </View>

      {displayedReviews.map((review, index) => (
        <View
          key={review.id}
          style={[styles.reviewItem, index < displayedReviews.length - 1 && styles.reviewBorder]}
        >
          <View style={styles.reviewTop}>
            <Text style={styles.name}>{review.userName}</Text>
            <Text style={styles.time}>{formatTimeAgo(review.createdAt)}</Text>
          </View>
          <Text style={styles.comment}>{review.comment}</Text>
        </View>
      ))}
    </AdminCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.cyan,
    letterSpacing: 0.4,
  },
  reviewItem: {
    paddingVertical: 12,
  },
  reviewBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.adminCardBorder,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  time: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});
