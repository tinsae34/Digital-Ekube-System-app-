import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Pressable,
    ScrollView,
    View,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing, Radius, Shadow } from '@/constants/theme';
import { groupService, Group, GroupMember } from '@/services/groupService';
import { useAuth } from '@/services/authContext';

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function GroupDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuth();
    const groupId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [group, setGroup] = useState<Group & { members: GroupMember[] } | null>(null);
    const [isMember, setIsMember] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    const loadGroup = async () => {
        try {
            setLoading(true);
            const data = await groupService.getById(groupId);
            setGroup(data);

            // Check if user is a member
            const membership = data.members.find(m => m.user_id === user?.id);
            setIsMember(!!membership);
            setUserRole(membership?.role || null);
        } catch (error) {
            console.error('Load group error:', error);
            Alert.alert('Error', 'Failed to load group details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupId) {
            loadGroup();
        }
    }, [groupId]);

    const handleJoin = async () => {
        try {
            setJoining(true);
            await groupService.join(groupId);
            Alert.alert('Success', 'Successfully joined the group!');
            await loadGroup(); // Reload to update member status
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to join group');
        } finally {
            setJoining(false);
        }
    };

    const handleLeave = () => {
        Alert.alert(
            'Leave Group',
            'Are you sure you want to leave this group?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await groupService.leave(groupId);
                            Alert.alert('Success', 'You have left the group');
                            router.back();
                        } catch (error: any) {
                            Alert.alert('Error', error?.message || 'Failed to leave group');
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

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

    if (!group) {
        return (
            <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={64} color={Brand.textMuted} />
                <ThemedText style={styles.errorText}>Group not found</ThemedText>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <SafeAreaView style={styles.safe} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={Brand.textPrimary} />
                    </Pressable>
                    <ThemedText style={styles.headerTitle}>Group Details</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                    {/* Group Info */}
                    <View style={styles.infoCard}>
                        <View style={styles.iconWrap}>
                            <Ionicons name="people" size={40} color={Brand.accent} />
                        </View>
                        <ThemedText style={styles.groupName}>{group.name}</ThemedText>
                        {group.description && (
                            <ThemedText style={styles.groupDesc}>{group.description}</ThemedText>
                        )}
                        <View style={styles.statusRow}>
                            <View style={[styles.statusBadge, { backgroundColor: Brand.accentMuted }]}>
                                <ThemedText style={styles.statusText}>{group.status}</ThemedText>
                            </View>
                            {isMember && (
                                <View style={[styles.statusBadge, { backgroundColor: Brand.accentMuted }]}>
                                    <Ionicons name="checkmark-circle" size={14} color={Brand.accent} />
                                    <ThemedText style={styles.statusText}>Member</ThemedText>
                                </View>
                            )}
                            {userRole === 'admin' && (
                                <View style={[styles.statusBadge, { backgroundColor: Brand.accent }]}>
                                    <Ionicons name="shield-checkmark" size={14} color={Brand.white} />
                                    <ThemedText style={[styles.statusText, { color: Brand.white }]}>Admin</ThemedText>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Details */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Details</ThemedText>
                        <View style={styles.detailCard}>
                            <DetailRow icon="cash-outline" label="Contribution" value={`${formatCurrency(group.contribution_amount)} Birr`} />
                            <DetailRow icon="calendar-outline" label="Frequency" value={group.frequency} />
                            <DetailRow icon="calendar-number-outline" label="Start Date" value={formatDate(group.start_date)} />
                            <DetailRow icon="people-outline" label="Members" value={`${group.member_count} members`} />
                        </View>
                    </View>

                    {/* Members */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>Members ({group.members?.length || 0})</ThemedText>
                        </View>
                        <View style={styles.membersList}>
                            {group.members?.map((member) => (
                                <View key={member.id} style={styles.memberCard}>
                                    <View style={styles.memberAvatar}>
                                        <ThemedText style={styles.memberAvatarText}>
                                            {member.user?.name.charAt(0).toUpperCase()}
                                        </ThemedText>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <ThemedText style={styles.memberName}>{member.user?.name}</ThemedText>
                                        <ThemedText style={styles.memberPhone}>{member.user?.phone}</ThemedText>
                                    </View>
                                    {member.role === 'admin' && (
                                        <View style={styles.adminBadge}>
                                            <Ionicons name="shield-checkmark" size={12} color={Brand.accent} />
                                            <ThemedText style={styles.adminText}>Admin</ThemedText>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Action Button */}
                <View style={styles.actionBar}>
                    {!isMember ? (
                        <Pressable
                            style={[styles.actionBtn, joining && { opacity: 0.6 }]}
                            onPress={handleJoin}
                            disabled={joining}>
                            {joining ? (
                                <ActivityIndicator color={Brand.white} />
                            ) : (
                                <>
                                    <Ionicons name="person-add" size={20} color={Brand.white} />
                                    <ThemedText style={styles.actionBtnText}>Join Group</ThemedText>
                                </>
                            )}
                        </Pressable>
                    ) : (
                        <Pressable style={styles.leaveBtn} onPress={handleLeave}>
                            <Ionicons name="exit-outline" size={20} color={Brand.error} />
                            <ThemedText style={styles.leaveBtnText}>Leave Group</ThemedText>
                        </Pressable>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

function DetailRow({ icon, label, value }: { icon: IoniconName; label: string; value: string }) {
    return (
        <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
                <Ionicons name={icon} size={18} color={Brand.textSecondary} />
                <ThemedText style={styles.detailLabel}>{label}</ThemedText>
            </View>
            <ThemedText style={styles.detailValue}>{value}</ThemedText>
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
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Brand.bg2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Brand.textPrimary,
    },
    scroll: { flex: 1 },
    scrollContent: {
        padding: Spacing.four,
        gap: Spacing.four,
    },
    infoCard: {
        backgroundColor: Brand.bg2,
        borderRadius: Radius.xl,
        padding: Spacing.four,
        alignItems: 'center',
        gap: Spacing.two,
        borderWidth: 1,
        borderColor: Brand.bg3,
        ...Shadow.card,
    },
    iconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Brand.accentMuted,
        borderWidth: 2,
        borderColor: Brand.accentBorder,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadow.accent,
    },
    groupName: {
        fontSize: 24,
        fontWeight: '800',
        color: Brand.textPrimary,
        textAlign: 'center',
    },
    groupDesc: {
        fontSize: 14,
        color: Brand.textSecondary,
        textAlign: 'center',
    },
    statusRow: {
        flexDirection: 'row',
        gap: Spacing.two,
        marginTop: Spacing.one,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: Spacing.two,
        paddingVertical: Spacing.one,
        borderRadius: Radius.full,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: Brand.accent,
        textTransform: 'capitalize',
    },
    section: { gap: Spacing.two },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Brand.textPrimary,
    },
    detailCard: {
        backgroundColor: Brand.bg2,
        borderRadius: Radius.lg,
        padding: Spacing.three,
        gap: Spacing.two + 4,
        borderWidth: 1,
        borderColor: Brand.bg3,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.two,
    },
    detailLabel: {
        fontSize: 14,
        color: Brand.textSecondary,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '700',
        color: Brand.textPrimary,
    },
    membersList: { gap: Spacing.two },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Brand.bg2,
        borderRadius: Radius.lg,
        padding: Spacing.three,
        gap: Spacing.two,
        borderWidth: 1,
        borderColor: Brand.bg3,
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Brand.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    memberAvatarText: {
        fontSize: 16,
        fontWeight: '800',
        color: Brand.white,
    },
    memberName: {
        fontSize: 14,
        fontWeight: '700',
        color: Brand.textPrimary,
    },
    memberPhone: {
        fontSize: 12,
        color: Brand.textSecondary,
    },
    adminBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Brand.accentMuted,
        paddingHorizontal: Spacing.two,
        paddingVertical: 4,
        borderRadius: Radius.full,
    },
    adminText: {
        fontSize: 11,
        fontWeight: '700',
        color: Brand.accent,
    },
    actionBar: {
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.three,
        borderTopWidth: 1,
        borderTopColor: Brand.bg3,
        backgroundColor: Brand.bg0,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.two,
        backgroundColor: Brand.accent,
        height: 54,
        borderRadius: Radius.md,
        ...Shadow.accent,
    },
    actionBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: Brand.white,
    },
    leaveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.two,
        backgroundColor: Brand.bg2,
        height: 54,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        borderColor: Brand.error,
    },
    leaveBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: Brand.error,
    },
    errorText: {
        fontSize: 16,
        color: Brand.textSecondary,
        marginTop: Spacing.three,
    },
});
