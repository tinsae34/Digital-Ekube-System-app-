import React, { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  ScrollView,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import { useAuth } from '@/services/authContext';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing, Radius, Shadow, MaxContentWidth } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Static Data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', label: 'All Groups', emoji: '🏦' },
  { id: '2', label: 'Weekly',     emoji: '📅' },
  { id: '3', label: 'Monthly',    emoji: '🗓️' },
  { id: '4', label: 'Premium',    emoji: '⭐' },
  { id: '5', label: 'New',        emoji: '✨' },
];

const TOP_GROUPS = [
  {
    id: '1',
    name: 'Habesha Weekly Savings',
    location: 'Addis Ababa',
    contribution: '500 Birr/week',
    members: 12,
    rating: '4.8',
    bg: '#3A2E1C',
    emoji: '💰',
  },
  {
    id: '2',
    name: 'Tech Gadget Fund',
    location: 'Bole District',
    contribution: '1,000 Birr/month',
    members: 8,
    rating: '4.5',
    bg: '#1C2A3A',
    emoji: '💻',
  },
  {
    id: '3',
    name: 'Family Holiday Pool',
    location: 'Piassa',
    contribution: '250 Birr/week',
    members: 5,
    rating: '4.2',
    bg: '#1C3A2A',
    emoji: '🌍',
  },
];

const SUGGESTED_GROUPS = [
  {
    id: '4',
    name: 'Merchants Circle',
    contribution: '2,000 Birr/month',
    members: 20,
    emoji: '🏪',
    bg: '#2A1C3A',
  },
  {
    id: '5',
    name: 'Youth Savers',
    contribution: '100 Birr/week',
    members: 15,
    emoji: '🎓',
    bg: '#3A1C1C',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function AvatarBadge({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <View style={styles.avatar}>
      <ThemedText style={styles.avatarText}>{initials}</ThemedText>
    </View>
  );
}

function CategoryChip({
  item,
  active,
  onPress,
}: {
  item: (typeof CATEGORIES)[0];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}>
      <ThemedText style={[styles.chipEmoji]}>{item.emoji}</ThemedText>
      <ThemedText
        style={[styles.chipLabel, active && styles.chipLabelActive]}>
        {item.label}
      </ThemedText>
    </Pressable>
  );
}

function GroupCard({ item }: { item: (typeof TOP_GROUPS)[0] }) {
  return (
    <View style={[styles.groupCard, { backgroundColor: item.bg }]}>
      {/* Emoji banner */}
      <View style={styles.groupCardBanner}>
        <ThemedText style={styles.groupCardEmoji}>{item.emoji}</ThemedText>
      </View>
      {/* Info */}
      <View style={styles.groupCardInfo}>
        <ThemedText style={styles.groupCardName} numberOfLines={1}>
          {item.name}
        </ThemedText>
        <View style={styles.groupCardMeta}>
          <ThemedText style={styles.metaText}>📍 {item.location}</ThemedText>
          <View style={styles.ratingBadge}>
            <ThemedText style={styles.ratingText}>⭐ {item.rating}</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.contributionText}>
          {item.contribution} · {item.members} members
        </ThemedText>
      </View>
    </View>
  );
}

function SuggestedCard({ item }: { item: (typeof SUGGESTED_GROUPS)[0] }) {
  return (
    <View style={[styles.suggestedCard, { backgroundColor: item.bg }]}>
      <ThemedText style={styles.suggestedEmoji}>{item.emoji}</ThemedText>
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText style={styles.suggestedName} numberOfLines={1}>
          {item.name}
        </ThemedText>
        <ThemedText style={styles.suggestedMeta}>
          {item.contribution} · {item.members} members
        </ThemedText>
      </View>
      <View style={styles.joinBtn}>
        <ThemedText style={styles.joinBtnText}>Join</ThemedText>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [activeCat, setActiveCat] = useState('1');
  const [search, setSearch] = useState('');

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={styles.locationRow}>
                <ThemedText style={styles.locationPin}>📍</ThemedText>
                <ThemedText style={styles.locationText}>
                  {user?.phone || 'Addis Ababa'}
                </ThemedText>
              </View>
              <ThemedText style={styles.locationSub}>
                Find ekub groups in your area
              </ThemedText>
            </View>
            <Pressable onPress={logout} style={styles.avatarWrap}>
              <AvatarBadge name={user?.name || 'U'} />
            </Pressable>
          </View>

          {/* ── Greeting ── */}
          <ThemedText style={styles.greeting}>
            {getGreeting()} {user?.name?.split(' ')[0] || 'there'}...
          </ThemedText>

          {/* ── Role badge ── */}
          <View style={styles.roleBadge}>
            <ThemedText style={styles.roleBadgeText}>
              {user?.role === 'admin' ? '🔑 Admin' : '👤 Member'}
            </ThemedText>
          </View>

          {/* ── Search ── */}
          <View style={styles.searchWrap}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              style={styles.searchInput}
              placeholder="Search ekub groups..."
              placeholderTextColor={Brand.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* ── Categories ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}>
            {CATEGORIES.map(cat => (
              <CategoryChip
                key={cat.id}
                item={cat}
                active={activeCat === cat.id}
                onPress={() => setActiveCat(cat.id)}
              />
            ))}
          </ScrollView>

          {/* ── Top Groups ── */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Top rated groups</ThemedText>
            <Pressable style={styles.seeAllBtn}>
              <ThemedText style={styles.seeAllText}>See all →</ThemedText>
            </Pressable>
          </View>

          <FlatList
            data={TOP_GROUPS}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardList}
            renderItem={({ item }) => <GroupCard item={item} />}
          />

          {/* ── Stats Card ── */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>12,500</ThemedText>
              <ThemedText style={styles.statLabel}>Total Pool (Birr)</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>3</ThemedText>
              <ThemedText style={styles.statLabel}>Active Groups</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>Jun 30</ThemedText>
              <ThemedText style={styles.statLabel}>Next Draw</ThemedText>
            </View>
          </View>

          {/* ── Suggested Groups ── */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Suggested for you</ThemedText>
            <Pressable style={styles.seeAllBtn}>
              <ThemedText style={styles.seeAllText}>See all →</ThemedText>
            </Pressable>
          </View>

          <View style={styles.suggestedList}>
            {SUGGESTED_GROUPS.map(item => (
              <SuggestedCard key={item.id} item={item} />
            ))}
          </View>

          <View style={{ height: Spacing.six }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationPin: { fontSize: 14 },
  locationText: {
    color: Brand.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  locationSub: {
    color: Brand.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  avatarWrap: { marginLeft: Spacing.two },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Brand.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.accent,
  },
  avatarText: {
    color: Brand.black,
    fontWeight: '800',
    fontSize: 15,
  },

  // Greeting
  greeting: {
    color: Brand.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: Spacing.two,
  },

  // Role badge
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Brand.accentMuted,
    borderWidth: 1,
    borderColor: Brand.accentBorder,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    marginBottom: Spacing.three,
  },
  roleBadgeText: {
    color: Brand.accent,
    fontSize: 12,
    fontWeight: '700',
  },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.bg2,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: Brand.bg3,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    color: Brand.textPrimary,
    fontSize: 15,
    padding: 0,
  },

  // Categories
  categories: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Brand.bg2,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderWidth: 1,
    borderColor: Brand.bg3,
  },
  chipActive: {
    backgroundColor: Brand.accent,
    borderColor: Brand.accent,
  },
  chipEmoji: { fontSize: 14 },
  chipLabel: {
    color: Brand.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: Brand.black,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    color: Brand.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  seeAllBtn: {
    backgroundColor: Brand.bg2,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two + 4,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderColor: Brand.bg3,
  },
  seeAllText: {
    color: Brand.accent,
    fontSize: 12,
    fontWeight: '700',
  },

  // Group card (horizontal scroll)
  cardList: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  groupCard: {
    width: 220,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  groupCardBanner: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupCardEmoji: { fontSize: 52 },
  groupCardInfo: {
    padding: Spacing.two + 4,
    gap: 4,
  },
  groupCardName: {
    color: Brand.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  groupCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    color: Brand.textSecondary,
    fontSize: 11,
  },
  ratingBadge: {
    backgroundColor: Brand.accentMuted,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    color: Brand.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  contributionText: {
    color: Brand.textMuted,
    fontSize: 11,
    marginTop: 2,
  },

  // Stats card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Brand.bg2,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: Brand.bg3,
    ...Shadow.card,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: Brand.accent,
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    color: Brand.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Brand.bg3,
    marginHorizontal: Spacing.two,
  },

  // Suggested cards (vertical list)
  suggestedList: {
    gap: Spacing.two,
  },
  suggestedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    ...Shadow.card,
  },
  suggestedEmoji: { fontSize: 30 },
  suggestedName: {
    color: Brand.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  suggestedMeta: {
    color: Brand.textSecondary,
    fontSize: 12,
  },
  joinBtn: {
    backgroundColor: Brand.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two + 4,
    paddingVertical: Spacing.one + 2,
    ...Shadow.accent,
  },
  joinBtnText: {
    color: Brand.black,
    fontSize: 12,
    fontWeight: '800',
  },
});
