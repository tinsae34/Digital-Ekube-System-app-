import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Pressable,
    ScrollView,
    View,
    TextInput,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing, Radius, Shadow } from '@/constants/theme';
import { groupService, Group } from '@/services/groupService';
import { useAuth } from '@/services/authContext';

export default function GroupsListScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('my');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    const [myGroups, setMyGroups] = useState<Group[]>([]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [allData, myData] = await Promise.all([
                groupService.getAll(),
                groupService.getUserGroups(),
            ]);
            setAllGroups(allData.groups);
            setMyGroups(myData.groups);
        } catch (error) {
            console.error('Load groups error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const displayGroups = activeTab === 'my' ? myGroups : allGroups;
    const filteredGroups = displayGroups.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    const formatCurrency = (amount: string) => {
        return parseFloat(amount).toLocaleString('en-US', { maximumFractionDigits: 0 });
    };

    if (loading) {
        return (
            <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Brand.accent} />
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <SafeAreaView style={styles.safe} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText style={styles.headerTitle}>Groups</ThemedText>
                    {user?.role === 'admin' && (
                        <Pressable
                            style={styles.createBtn}
                            onPress={() => router.push('/screens/app/CreateGroupScreen' as any)}>
                            <Ionicons name="add" size={20} color={Brand.white} />
                        </Pressable>
                    )}
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    <Pressable
                        style={[styles.tab, activeTab === 'my' && styles.tabActive]}
                        onPress={() => setActiveTab('my')}>
                        <ThemedText style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
                            My Groups ({myGroups.length})
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'all' && styles.tabActive]}
                        onPress={() => setActiveTab('all')}>
                        <ThemedText style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                            All Groups ({allGroups.length})
                        </ThemedText>
                    </Pressable>
                </View>

                {/* Search */}
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={18} color={Brand.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search groups..."
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

                {/* List */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Brand.accent} />
                    }>
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map(group => (
                            <Pressable
                                key={group.id}
                                style={styles.groupCard}
                                onPress={() => router.push(`/screens/app/GroupDetailScreen?id=${group.id}` as any)}>
                                <View style={styles.groupIconWrap}>
                                    <Ionicons name="people" size={24} color={Brand.accent} />
                                </View>
                                <View style={styles.groupInfo}>
                                    <ThemedText style={styles.groupName}>{group.name}</ThemedText>
                                    {group.description && (
                                        <ThemedText style={styles.groupDesc} numberOfLines={1}>
                                            {group.description}
                                        </ThemedText>
                                    )}
                                    <View style={styles.groupMeta}>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="people-outline" size={12} color={Brand.textSecondary} />
                                            <ThemedText style={styles.metaText}>{group.member_count} members</ThemedText>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="calendar-outline" size={12} color={Brand.textSecondary} />
                                            <ThemedText style={styles.metaText}>{group.frequency}</ThemedText>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.groupRight}>
                                    <ThemedText style={styles.amount}>{formatCurrency(group.contribution_amount)}</ThemedText>
                                    <ThemedText style={styles.currency}>Birr</ThemedText>
                                    <Ionicons name="chevron-forward" size={20} color={Brand.textMuted} />
                                </View>
                            </Pressable>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="folder-open-outline" size={64} color={Brand.textMuted} />
                            <ThemedText style={styles.emptyText}>
                                {search ? 'No groups found' : activeTab === 'my' ? 'No groups yet' : 'No groups available'}
                            </ThemedText>
                            <ThemedText style={styles.emptySubtext}>
                                {activeTab === 'my' ? 'Join or create a group to get started' : 'Be the first to create one'}
                            </ThemedText>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Brand.bg0 },
    safe: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.three,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Brand.textPrimary,
    },
    createBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Brand.accent,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadow.accent,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.four,
        gap: Spacing.two,
        marginBottom: Spacing.three,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.two,
        alignItems: 'center',
        borderRadius: Radius.full,
        backgroundColor: Brand.bg2,
        borderWidth: 1,
        borderColor: Brand.bg3,
    },
    tabActive: {
        backgroundColor: Brand.accent,
        borderColor: Brand.accent,
        ...Shadow.accent,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Brand.textSecondary,
    },
    tabTextActive: {
        color: Brand.white,
        fontWeight: '700',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Brand.bg2,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.three,
        height: 48,
        gap: Spacing.two,
        marginHorizontal: Spacing.four,
        marginBottom: Spacing.three,
        borderWidth: 1,
        borderColor: Brand.bg3,
    },
    searchInput: {
        flex: 1,
        color: Brand.textPrimary,
        fontSize: 15,
        padding: 0,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.four,
        paddingBottom: Spacing.four,
        gap: Spacing.two,
    },
    groupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Brand.bg2,
        borderRadius: Radius.lg,
        padding: Spacing.three,
        gap: Spacing.three,
        borderWidth: 1,
        borderColor: Brand.bg3,
        ...Shadow.sm,
    },
    groupIconWrap: {
        width: 48,
        height: 48,
        borderRadius: Radius.md,
        backgroundColor: Brand.accentMuted,
        borderWidth: 1,
        borderColor: Brand.accentBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupInfo: {
        flex: 1,
        gap: 2,
    },
    groupName: {
        fontSize: 16,
        fontWeight: '700',
        color: Brand.textPrimary,
    },
    groupDesc: {
        fontSize: 13,
        color: Brand.textSecondary,
    },
    groupMeta: {
        flexDirection: 'row',
        gap: Spacing.two,
        marginTop: 2,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: Brand.textSecondary,
    },
    groupRight: {
        alignItems: 'flex-end',
        gap: 2,
    },
    amount: {
        fontSize: 18,
        fontWeight: '800',
        color: Brand.accent,
    },
    currency: {
        fontSize: 11,
        color: Brand.textMuted,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: Spacing.seven,
        gap: Spacing.two,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Brand.textSecondary,
    },
    emptySubtext: {
        fontSize: 14,
        color: Brand.textMuted,
    },
});
