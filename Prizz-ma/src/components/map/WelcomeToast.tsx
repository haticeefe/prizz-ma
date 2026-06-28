import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type WelcomeToastProps = {
  venueName: string;
  visible: boolean;
};

export function WelcomeToast({ venueName, visible }: WelcomeToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const coffeeY = useRef(new Animated.Value(0)).current;
  const laptopY = useRef(new Animated.Value(0)).current;
  const coffeeLoop = useRef<Animated.CompositeAnimation | null>(null);
  const laptopLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible) {
      // Giriş animasyonu
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      // Kahve zıplar
      coffeeLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(coffeeY, { toValue: -12, duration: 400, useNativeDriver: true }),
          Animated.timing(coffeeY, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      );
      coffeeLoop.current.start();

      // Laptop biraz gecikmeli zıplar
      setTimeout(() => {
        laptopLoop.current = Animated.loop(
          Animated.sequence([
            Animated.timing(laptopY, { toValue: -12, duration: 400, useNativeDriver: true }),
            Animated.timing(laptopY, { toValue: 0, duration: 400, useNativeDriver: true }),
          ])
        );
        laptopLoop.current.start();
      }, 200);

      // 3 saniye sonra çık
      setTimeout(() => {
        coffeeLoop.current?.stop();
        laptopLoop.current?.stop();
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.8, duration: 400, useNativeDriver: true }),
        ]).start();
      }, 3000);

    } else {
      coffeeLoop.current?.stop();
      laptopLoop.current?.stop();
      opacity.setValue(0);
      scale.setValue(0.5);
      coffeeY.setValue(0);
      laptopY.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ scale }] }]}>
      <View style={styles.emojiRow}>
        <Animated.Text style={[styles.emoji, { transform: [{ translateY: coffeeY }] }]}>
          ☕
        </Animated.Text>
        <Animated.Text style={[styles.emoji, { transform: [{ translateY: laptopY }] }]}>
          💻
        </Animated.Text>
      </View>
      <Text style={styles.welcome}>Hoş geldin!</Text>
      <Text style={styles.venueName}>{venueName}</Text>
      <Text style={styles.subtitle}>İyi çalışmalar 📚</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    backgroundColor: 'rgba(10, 16, 24, 0.95)',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    zIndex: 999,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  emoji: {
    fontSize: 42,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '900',
    color: '#00E5FF',
    marginBottom: 4,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
});