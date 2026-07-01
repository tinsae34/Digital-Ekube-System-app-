import { useState } from 'react';
import {
    StyleSheet,
    Pressable,
    ScrollView,
    View,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing, Radius, Shadow } from '@/constants/theme';
import { groupService } from '@/services/groupService';

const FREQUENCIES = ['weekly', 'monthly', 'quarterly'];

export default function CreateGroupScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [contributionAmount, setContributionAmount] = useState('');
    const [frequency, setFrequency] = useState<string>('monthly');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const handleCreate = async () => {
        // Validation
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a group name');
            return;
        }
        if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
            Alert.alert('Error', 'Please enter a valid contribution amount');
            return;
        }

        try {
            setLoading(true);
            await groupService.create({
                name: name.trim(),
                description: description.trim() || undefined,
                contribution_amount: parseFloat(contributionAmount),
                frequency,
                start_date: startDate,
            });

            Alert.alert('Success', 'Group created successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <SafeAreaView style={styles.safe} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={Brand.textPrimary} />
                    </Pressable>
                    <ThemedText style={styles.headerTitle}>Create Group</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled">
                        {/* Icon */}
                        <View style={styles.iconWrap}>
                            <Ionicons name="people" size={48} color={Brand.accent} />
                        </View>

                        {/* Group Name */}
                        <View style={styles.field}>
                            <ThemedText style={styles.label}>GROUP NAME *</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Tech Savers Circle"
                                placeholderTextColor={Brand.textMuted}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Description */}
                        <View style={styles.field}>
                            <ThemedText style={styles.label}>DESCRIPTION (Optional)</ThemedText>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe the purpose of this group..."
                                placeholderTextColor={Brand.textMuted}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        {/* Contribution Amount */}
                        <View style={styles.field}>
                            <ThemedText style={styles.label}>CONTRIBUTION AMOUNT (Birr) *</ThemedText>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="cash-outline" size={20} color={Brand.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., 500"
                                    placeholderTextColor={Brand.textMuted}
                                    value={contributionAmount}
                                    onChangeText={setContributionAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Frequency */}
                        <View style={styles.field}>
                            <ThemedText style={styles.label}>CONTRIBUTION FREQUENCY *</ThemedText>
                            <View style={styles.frequencyRow}>
                                {FREQUENCIES.map((freq) => (
                                    <Pressable
                                        key={freq}
                                        style={[styles.frequencyChip, frequency === freq && styles.frequencyChipActive]}
                                        onPress={() => setFrequency(freq)}>
                                        <ThemedText
                                            style={[
                                                styles.frequencyText,
                                                frequency === freq && styles.frequencyTextActive,
                                            ]}>
                                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                        </ThemedText>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Start Date */}
                        <View style={styles.field}>
                            <ThemedText style={styles.label}>START DATE *</ThemedText>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="calendar-outline" size={20} color={Brand.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={Brand.textMuted}
                                    value={startDate}
                                    onChangeText={setStartDate}
                                />
                            </View>
                            <ThemedText style={styles.hint}>Format: YYYY-MM-DD</ThemedText>
                        </View>

                        {/* Info Box */}
                        <View style={styles.infoBox}>
                            <Ionicons name="information-circle-outline" size={20} color={Brand.accent} />
                            <ThemedText style={styles.infoText}>
                                As the creator, you'll automatically become an admin of this group.
                            </ThemedText>
                        </View>

                        {/* Create Button */}
                        <Pressable
                            style={[styles.createBtn, loading && { opacity: 0.6 }]}
                            onPress={handleCreate}
                            disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color={Brand.white} />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle" size={20} color={Brand.white} />
                                    <ThemedText style={styles.createBtnText}>Create Group</ThemedText>
                                </>
                            )}
                        </Pressable>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
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
    iconWrap: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Brand.accentMuted,
        borderWidth: 2,
        borderColor: Brand.accentBorder,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        ...Shadow.accent,
    },
    field: { gap: Spacing.one + 2 },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: Brand.textSecondary,
        letterSpacing: 0.5,
    },
    input: {
        height: 50,
        backgroundColor: Brand.bg2,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.three,
        fontSize: 15,
        color: Brand.textPrimary,
        borderWidth: 1,
        borderColor: Brand.bg3,
    },
    textArea: {
        height: 100,
        paddingTop: Spacing.two + 4,
        textAlignVertical: 'top',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.two,
        backgroundColor: Brand.bg2,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.three,
        borderWidth: 1,
        borderColor: Brand.bg3,
    },
    frequencyRow: {
        flexDirection: 'row',
        gap: Spacing.two,
    },
    frequencyChip: {
        flex: 1,
        height: 50,
        backgroundColor: Brand.bg2,
        borderRadius: Radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Brand.bg3,
    },
    frequencyChipActive: {
        backgroundColor: Brand.accent,
        borderColor: Brand.accent,
        ...Shadow.accent,
    },
    frequencyText: {
        fontSize: 14,
        fontWeight: '600',
        color: Brand.textSecondary,
    },
    frequencyTextActive: {
        color: Brand.white,
        fontWeight: '800',
    },
    hint: {
        fontSize: 12,
        color: Brand.textMuted,
        marginTop: -Spacing.one,
    },
    infoBox: {
        flexDirection: 'row',
        gap: Spacing.two,
        backgroundColor: Brand.accentMuted,
        padding: Spacing.three,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Brand.accentBorder,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: Brand.textSecondary,
        lineHeight: 18,
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.two,
        height: 54,
        backgroundColor: Brand.accent,
        borderRadius: Radius.md,
        ...Shadow.accent,
    },
    createBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: Brand.white,
    },
});
