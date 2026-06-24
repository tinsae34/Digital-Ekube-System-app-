import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing, Radius, Shadow, MaxContentWidth } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOPICS = [
  {
    emoji: '🔄',
    title: 'How Ekub Works',
    description:
      'Ekub is a traditional rotational savings circle. Members contribute a fixed amount each period. Every round, one member wins the entire pool through a transparent draw.',
    accent: '#1C3A2A',
  },
  {
    emoji: '🎲',
    title: 'Fair Draws & Rotations',
    description:
      'Draws use a secure, transparent lottery system. Each member is guaranteed to receive the pool exactly once per cycle — no favourites, no cheating.',
    accent: '#1C2A3A',
  },
  {
    emoji: '💳',
    title: 'Seamless Payments',
    description:
      'Contributions are collected via Telebirr, CBE Birr, or bank transfer and held in a secure custody account until disbursed after the draw.',
    accent: '#3A2E1C',
  },
  {
    emoji: '🤝',
    title: 'Trust & Reputation',
    description:
      'Members build a credit and trust score based on timely contributions. High scores unlock access to premium, high-value ekub groups.',
    accent: '#2A1C3A',
  },
];

export default function ExploreScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Explore Ekub</ThemedText>
            <ThemedText style={styles.subtitle}>
              Learn how rotational savings work and grow your wealth together
            </ThemedText>
          </View>

          {/* Topics */}
          {TOPICS.map((topic, i) => (
            <View key={i} style={[styles.card, { backgroundColor: topic.accent }]}>
              <View style={styles.cardEmojiWrap}>
                <ThemedText style={styles.cardEmoji}>{topic.emoji}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.cardTitle}>{topic.title}</ThemedText>
                <ThemedText style={styles.cardDesc}>{topic.description}</ThemedText>
              </View>
            </View>
          ))}

          {/* CTA Banner */}
          <View style={styles.ctaBanner}>
            <ThemedText style={styles.ctaTitle}>🚀 Ready to start saving?</ThemedText>
            <ThemedText style={styles.ctaDesc}>
              Go to Home and join or create your first ekub group today.
            </ThemedText>
          </View>

          <View style={{ height: Spacing.six }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Brand.bg1,
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  scroll: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },

  header: {
    paddingVertical: Spacing.two,
    gap: Spacing.one,
  },
  title: {
    color: Brand.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: Brand.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  card: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.three,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    ...Shadow.card,
  },
  cardEmojiWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: { fontSize: 24 },
  cardTitle: {
    color: Brand.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    color: Brand.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  ctaBanner: {
    backgroundColor: Brand.accentMuted,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Brand.accentBorder,
    gap: Spacing.one,
    alignItems: 'center',
    ...Shadow.accent,
  },
  ctaTitle: {
    color: Brand.accent,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  ctaDesc: {
    color: Brand.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
