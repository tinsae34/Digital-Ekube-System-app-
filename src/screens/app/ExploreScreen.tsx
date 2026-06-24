import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing, Radius, Shadow, MaxContentWidth } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

type IoniconName = keyof typeof Ionicons.glyphMap;

const TOPICS: { icon: IoniconName; title: string; description: string; color: string }[] = [
  {
    icon: 'sync-circle-outline',
    title: 'How Ekub Works',
    description:
      'Ekub is a traditional rotational savings circle. Members contribute a fixed amount each period, and one member wins the entire pool through a transparent draw each round.',
    color: Brand.accent,
  },
  {
    icon: 'dice-outline',
    title: 'Fair Draws & Rotations',
    description:
      'Draws use a secure, transparent lottery system. Each member is guaranteed to receive the pool exactly once per cycle — no favourites, no bias.',
    color: '#27AE78',
  },
  {
    icon: 'card-outline',
    title: 'Seamless Payments',
    description:
      'Contributions collected via Telebirr, CBE Birr, or bank transfer are held in a secure custody account and disbursed automatically after each draw.',
    color: '#E0A34A',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Trust & Reputation',
    description:
      'Members build a credit and trust score based on timely contributions. High scores unlock access to premium, high-value ekub groups.',
    color: '#A259F7',
  },
];

export default function ExploreScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.pageHeader}>
            <ThemedText style={styles.pageTitle}>Explore Ekub</ThemedText>
            <ThemedText style={styles.pageSubtitle}>
              Learn how rotational savings work and why thousands trust it.
            </ThemedText>
          </View>

          {/* Topics */}
          {TOPICS.map((t, i) => (
            <View key={i} style={styles.topicCard}>
              <View style={[styles.topicIconWrap, { backgroundColor: t.color + '22', borderColor: t.color + '44' }]}>
                <Ionicons name={t.icon} size={24} color={t.color} />
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <ThemedText style={styles.topicTitle}>{t.title}</ThemedText>
                <ThemedText style={styles.topicDesc}>{t.description}</ThemedText>
              </View>
            </View>
          ))}

          {/* CTA */}
          <View style={styles.ctaCard}>
            <Ionicons name="rocket-outline" size={28} color={Brand.accent} />
            <ThemedText style={styles.ctaTitle}>Ready to start saving?</ThemedText>
            <ThemedText style={styles.ctaDesc}>
              Go to Home and join or create your first ekub group today.
            </ThemedText>
          </View>

          <View style={{ height: Spacing.seven }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg0 },
  safe: { flex: 1, alignSelf: 'center', width: '100%', maxWidth: MaxContentWidth },
  scroll: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, gap: Spacing.three },

  pageHeader: { paddingTop: Spacing.two, gap: Spacing.one },
  pageTitle: { color: Brand.textPrimary, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  pageSubtitle: { color: Brand.textSecondary, fontSize: 14, lineHeight: 20 },

  topicCard: {
    flexDirection: 'row',
    gap: Spacing.three,
    backgroundColor: Brand.bg2,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Brand.bg3,
    alignItems: 'flex-start',
    ...Shadow.sm,
  },
  topicIconWrap: {
    width: 50, height: 50,
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  topicTitle: { color: Brand.textPrimary, fontSize: 15, fontWeight: '700' },
  topicDesc: { color: Brand.textSecondary, fontSize: 13, lineHeight: 20 },

  ctaCard: {
    backgroundColor: Brand.accentMuted,
    borderRadius: Radius.xl,
    padding: Spacing.four + Spacing.one,
    borderWidth: 1,
    borderColor: Brand.accentBorder,
    alignItems: 'center',
    gap: Spacing.two,
    ...Shadow.accent,
  },
  ctaTitle: { color: Brand.textPrimary, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  ctaDesc: { color: Brand.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
