import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const admins = [
  { uid: 'nfbDce1pwdXdQO0RuAxBaLeJGXr2', email: 'studyanka@prizz-ma.com', name: 'StudyAnka Admin' },
  { uid: 'QZIJVSAJrLZrbJtPPdAEFQTGuWf2', email: 'nevada@prizz-ma.com', name: 'Nevada Admin' },
  { uid: 'y9IUnah6l1UN8wouyOLsWlnY1ff2', email: 'mackbear@prizz-ma.com', name: 'Mackbear Admin' },
  { uid: 'QQhNjeXfu7e1pgh5AzozrzthQCy2', email: 'coffeeandstudу@prizz-ma.com', name: 'Coffee And Study Admin' },
  { uid: 'rltgZgHuymcoKvRKY4XQX1DHUn53', email: 'gloriajeans@prizz-ma.com', name: 'Gloria Jeans Admin' },
  { uid: '1l6vFAHF0zLsEkJr48z69bl8tCt2', email: 'saukutuphane@prizz-ma.com', name: 'SAÜ Kütüphane Admin' },
  { uid: 'XwURvdCLAnVpTFJ6pdxJes4oVZI3', email: 'arifiyekutuphane@prizz-ma.com', name: 'Arifiye Admin' },
  { uid: 'jwNojM3Qd5OSTY4fqtk8tLeQTfA3', email: 'sakaryakutuphane@prizz-ma.com', name: 'Sakarya İl Admin' },
];

export async function seedVenues() {
  for (const admin of admins) {
    await setDoc(doc(db, 'users', admin.uid), {
      uid: admin.uid,
      email: admin.email,
      displayName: admin.name,
      role: 'admin',
      createdAt: new Date(),
    });
    console.log(`✅ ${admin.name} users koleksiyonuna eklendi`);
  }
  console.log('🎉 Tüm admin profilleri oluşturuldu!');
}