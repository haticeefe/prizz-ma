export type AdminReview = {
  id: string;
  name: string;
  comment: string;
  timeAgo: string;
};

export const ADMIN_REVIEWS: AdminReview[] = [
  {
    id: '1',
    name: 'Ayşe K.',
    comment: 'Prizler çalışıyor, ortam çok sessiz. Kesinlikle tavsiye ederim.',
    timeAgo: '12 DK ÖNCE',
  },
  {
    id: '2',
    name: 'Mehmet T.',
    comment: 'Kahve fiyatları biraz yüksek ama çalışmak için ideal.',
    timeAgo: '1 SA ÖNCE',
  },
  {
    id: '3',
    name: 'Zeynep A.',
    comment: 'Klima harika, yazın bile rahat çalışılabiliyor.',
    timeAgo: '3 SA ÖNCE',
  },
];
