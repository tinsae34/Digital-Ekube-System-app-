import React, { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  ScrollView,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/services/authContext';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing, Radius, Shadow, MaxContentWidth } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────
type IoniconName = keyof typeof Ionicons.glyphMap;

// ─── Static Data ──────────────────────────────────────────────────────────────
const CATEGORIES: { id: string; label: string; icon: IoniconName }[] = [
  { id: '1', label: 'All',     icon: 'grid-outline'          },
  { id: '2', label: 'Weekly',  icon: 'calendar-outline'      },
  { id: '3', label: 'Monthly', icon: 'calendar-number-outline'},
  { id: '4', label: 'Premium', icon: 'star-outline'          },
  { id: '5', label: 'New',     icon: 'sparkles-outline'      },
];

const TOP_GROUPS = [
  { id: '1', name: 'Habesha Weekly Savings', location: 'Addis Ababa',  contribution: '500 Birr/wk',    members: 12, rating: '4.8', icon: 'wallet-outline'    as IoniconName, bgGrad: '#0F1A2E' },
  { id: '2', name: 'Tech Gadget Fund',        location: 'Bole District', contribution: '1,000 Birr/mo', members: 8,  rating: '4.5', icon: 'laptop-outline'    as IoniconName, bgGrad: '#0E1A1A' },
  { id: '3', name: 'Family Holiday Pool',     location: 'Piassa',       contribution: '250 Birr/wk',   members: 5,  rating: '4.2', icon: 'earth-outline'     as IoniconName, bgGrad: '#1A0E2E' },
];

const SUGGESTED_GROUPS = [
  { id: '4', name: 'Merchants Circle', contribution: '2,000 Birr/mo', members: 20, icon: 'storefront-outline'  as IoniconName },
  { id: '5', name: 'Youth Savers',     contribution: '100 Birr/wk',   members: 15, icon: 'school-outline'      as IoniconName },
  { id: '6', name: 'Diaspora Pool',    contribution: '500 Birr/wk',   members: 30, icon: 'airplane-outline'    as IoniconName },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={styles.avatar}>
      <ThemedText style={styles.avatarText}>{initials}</ThemedText>
    </View>
  );
}

function CategoryChip({
  item, active, onPress,
}: { item: (typeof CATEGORIES)[0]; active: boolean; onPress(): void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Ionicons
        name={item.icon}
        size={14}
        color={active ? Brand.white : Brand.textSecondary}
      />
      <ThemedText style={[styles.chipLabel, active && styles.chipLabelActive]}>
        {item.label}
      </ThemedText>
    </Pressable>
  );
}

function GroupCard({ item }: { item: (typeof TOP_GROUPS)[0] }) {
  return (
    <View style={[styles.groupCard, { backgroundColor: item.bgGrad }]}>
      <View style={styles.groupIconWrap}>
        <Ionicons name={item.icon} size={32} color={Brand.accent} />
      </View>
      <ThemedText style={styles.groupName} numberOfLines={1}>{item.name}</ThemedText>
      <View style={styles.groupMeta}>
        <View style={styles.groupMetaItem}>
          <Ionicons name="location-outline" size={11} color={Brand.textSecondary} />
          <ThemedText style={styles.metaText}>{item.location}</ThemedText>
        </View>
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={10} color={Brand.accent} />
          <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
        </View>
      </View>
      <View style={styles.groupFooter}>
        <View style={styles.groupMetaItem}>
          <Ionicons name="people-outline" size={11} color={Brand.textMuted} />
          <ThemedText style={styles.contributionText}>{item.members} members</ThemedText>
        </View>
        <ThemedText style={styles.contributionText}>{item.contribution}</ThemedText>
      </View>
    </View>
  );
}

function SuggestedCard({ item }: { item: (typeof SUGGESTED_GROUPS)[0] }) {
  return (
    <View style={styles.suggestedCard}>
      <View style={styles.suggestedIconWrap}>
        <Ionicons name={item.icon} size={22} color={Brand.accent} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <ThemedText style={styles.suggestedName} numberOfLines={1}>{item.name}</ThemedText>
        <View style={styles.suggestedMeta}>
          <Ionicons name="people-outline" size={11} color={Brand.textSecondary} />
          <ThemedText style={styles.suggestedMetaText}>{item.members} members · {item.contribution}</ThemedText>
        </View>
      </View>
      <Pressable style={styles.joinBtn}>
        <ThemedText style={styles.joinBtnText}>Join</ThemedText>
      </Pressable>
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
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={Brand.accent} />
                <ThemedText style={styles.locationText}>
                  {user?.phone || 'Addis Ababa'}
                </ThemedText>
                <Ionicons name="chevron-down-outline" size={13} color={Brand.textSecondary} />
              </View>
              <ThemedText style={styles.locationSub}>Find ekub groups near you</ThemedText>
            </View>
            <Pressable onPress={logout} style={styles.avatarWrap}>
              <Avatar name={user?.name || 'U'} />
            </Pressable>
          </View>

          {/* ── Greeting ── */}
          <ThemedText style={styles.greeting}>
            {getGreeting()},{'\n'}{user?.name?.split(' ')[0] || 'there'}.
          </ThemedText>

          {/* ── Role badge ── */}
          <View style={styles.badgeRow}>
            <View style={styles.rolePill}>
              <Ionicons
                name={user?.role === 'admin' ? 'shield-checkmark-outline' : 'person-outline'}
                size={12}
                color={Brand.accent}
              />
              <ThemedText style={styles.rolePillText}>
                {user?.role === 'admin' ? 'Admin' : 'Member'}
              </ThemedText>
            </View>
          </View>

          {/* ── Search ── */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={Brand.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search ekub groups..."
              placeholderTextColor={Brand.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle-outline" size={18} color={Brand.textSecondary} />
              </Pressable>
            )}
          </View>

          {/* ── Categories ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catList}>
            {CATEGORIES.map(cat => (
              <CategoryChip
                key={cat.id} item={cat}
                active={activeCat === cat.id}
                onPress={() => setActiveCat(cat.id)}
              />
            ))}
          </ScrollView>

          {/* ── Stats ── */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="cash-outline" size={18} color={Brand.accent} />
              <ThemedText style={styles.statValue}>12,500</ThemedText>
              <ThemedText style={styles.statLabel}>Pool (Birr)</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="layers-outline" size={18} color={Brand.accent} />
              <ThemedText style={styles.statValue}>3</ThemedText>
              <ThemedText style={styles.statLabel}>Active Groups</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={18} color={Brand.accent} />
              <ThemedText style={styles.statValue}>Jun 30</ThemedText>
              <ThemedText style={styles.statLabel}>Next Draw</ThemedText>
            </View>
          </View>

          {/* ── Top Groups ── */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Top rated groups</ThemedText>
            <Pressable style={styles.seeAllBtn}>
              <ThemedText style={styles.seeAllText}>See all</ThemedText>
              <Ionicons name="arrow-forward-outline" size={13} color={Brand.accent} />
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

          {/* ── Suggested ── */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Suggested for you</ThemedText>
            <Pressable style={styles.seeAllBtn}>
              <ThemedText style={styles.seeAllText}>See all</ThemedText>
              <Ionicons name="arrow-forward-outline" size={13} color={Brand.accent} />
            </Pressable>
          </View>

          <View style={styles.suggestedList}>
            {SUGGESTED_GROUPS.map(item => (
              <SuggestedCard key={item.id} item={item} />
            ))}
          </View>

          <View style={{ height: Spacing.seven }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg0 },
  safe: {
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

  // Header
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { color: Brand.textPrimary, fontSize: 14, fontWeight: '600' },
  locationSub:  { color: Brand.textSecondary, fontSize: 12, marginTop: 3 },
  avatarWrap: { marginLeft: Spacing.two },
  avatar: {
    width: 42, height: 42,
    borderRadius: 21,
    backgroundColor: Brand.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.accent,
  },
  avatarText: { color: Brand.white, fontWeight: '800', fontSize: 15 },

  // Greeting
  greeting: {
    color: Brand.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 38,
  },

  // Badge
  badgeRow: { flexDirection: 'row', marginTop: -Spacing.two },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: Brand.accentMuted,
    borderWidth: 1,
    borderColor: Brand.accentBorder,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half + 1,
  },
  rolePillText: { color: Brand.accent, fontSize: 11, fontWeight: '700' },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.bg2,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    height: 48,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: Brand.bg3,
    ...Shadow.sm,
  },
  searchInput: { flex: 1, color: Brand.textPrimary, fontSize: 15, padding: 0 },

  // Categories
  catList: { gap: Spacing.two, paddingBottom: Spacing.one },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Brand.bg2,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two + 4,
    paddingVertical: Spacing.one + 2,
    borderWidth: 1,
    borderColor: Brand.bg3,
  },
  chipActive: { backgroundColor: Brand.accent, borderColor: Brand.accent, ...Shadow.accent },
  chipLabel: { color: Brand.textSecondary, fontSize: 13, fontWeight: '600' },
  chipLabelActive: { color: Brand.white, fontWeight: '700' },

  // Stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Brand.bg2,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Brand.bg3,
    ...Shadow.card,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { color: Brand.textPrimary, fontSize: 17, fontWeight: '800' },
  statLabel: { color: Brand.textSecondary, fontSize: 10, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: Brand.bg3, marginHorizontal: Spacing.two },

  // Section header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: Brand.textPrimary, fontSize: 17, fontWeight: '800' },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Brand.bg2,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two + 4,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderColor: Brand.bg3,
  },
  seeAllText: { color: Brand.accent, fontSize: 12, fontWeight: '700' },

  // Group cards (horizontal)
  cardList: { gap: Spacing.two, paddingBottom: Spacing.one },
  groupCard: {
    width: 210,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: Brand.bg3,
    ...Shadow.card,
  },
  groupIconWrap: {
    width: 52, height: 52,
    borderRadius: Radius.md,
    backgroundColor: Brand.accentMuted,
    borderWidth: 1,
    borderColor: Brand.accentBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupName: { color: Brand.textPrimary, fontSize: 14, fontWeight: '700' },
  groupMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  groupMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { color: Brand.textSecondary, fontSize: 11 },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Brand.accentMuted,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: { color: Brand.accent, fontSize: 11, fontWeight: '700' },
  groupFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contributionText: { color: Brand.textMuted, fontSize: 11 },

  // Suggested
  suggestedList: { gap: Spacing.two },
  suggestedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: Brand.bg2,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Brand.bg3,
    ...Shadow.sm,
  },
  suggestedIconWrap: {
    width: 46, height: 46,
    borderRadius: Radius.md,
    backgroundColor: Brand.accentMuted,
    borderWidth: 1,
    borderColor: Brand.accentBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestedName: { color: Brand.textPrimary, fontSize: 14, fontWeight: '700' },
  suggestedMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  suggestedMetaText: { color: Brand.textSecondary, fontSize: 12 },
  joinBtn: {
    backgroundColor: Brand.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 3,
    ...Shadow.accent,
  },
  joinBtnText: { color: Brand.white, fontSize: 12, fontWeight: '800' },
});
