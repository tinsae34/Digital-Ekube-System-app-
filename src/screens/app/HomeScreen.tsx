import React from 'react';
import { StyleSheet, Pressable, ScrollView, View, useColorScheme } from 'react-native';
import { useAuth } from '@/services/authContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, MaxContentWidth } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  // Mock Ekub data for visual demonstration
  const mockEkubs = [
    { id: '1', name: 'Habesha Weekly Savings', contribution: '500 Birr/week', members: 12, status: 'Active' },
    { id: '2', name: 'Tech Gadget Fund', contribution: '1,000 Birr/month', members: 8, status: 'Drawing Soon' },
    { id: '3', name: 'Family Holiday Pool', contribution: '250 Birr/week', members: 5, status: 'Pending' },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Welcome Back,</ThemedText>
              <ThemedText type="subtitle" style={styles.userName}>
                {user?.name || 'Ekub Member'}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: 2 }}>
                Role: <ThemedText type="smallBold" style={{ color: '#4A3AFF' }}>{user?.role ? user.role.toUpperCase() : 'USER'}</ThemedText> | Phone: {user?.phone || 'N/A'}
              </ThemedText>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                {
                  borderColor: colorScheme === 'dark' ? '#2E3135' : '#D1D3D8',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={logout}>
              <ThemedText type="smallBold" style={styles.logoutText}>Sign Out</ThemedText>
            </Pressable>
          </View>

          {/* Balance Cards / Stats */}
          <ThemedView type="backgroundElement" style={styles.statsCard}>
            <View>
              <ThemedText type="small" themeColor="textSecondary" style={styles.statsLabel}>
                TOTAL SAVINGS POOL
              </ThemedText>
              <ThemedText style={styles.balanceText}>12,500 Birr</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.statsGrid}>
              <View>
                <ThemedText type="small" themeColor="textSecondary">Active Pools</ThemedText>
                <ThemedText style={styles.statNumber}>3</ThemedText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <ThemedText type="small" themeColor="textSecondary">OTP Code</ThemedText>
                <ThemedText style={styles.statNumber}>{user?.otp_placeholder || '123456'}</ThemedText>
              </View>
              <View>
                <ThemeTextWrapper value="Next Draw Date" />
                <ThemedText style={styles.statValue}>June 30</ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>My Ekub Groups</ThemedText>
            <Pressable>
              <ThemedText type="linkPrimary">See All</ThemedText>
            </Pressable>
          </View>

          {/* List of Groups */}
          <View style={styles.groupsContainer}>
            {mockEkubs.map((ekub) => (
              <ThemedView
                key={ekub.id}
                type="backgroundElement"
                style={styles.groupCard}>
                <View style={styles.groupHeader}>
                  <ThemedText type="smallBold" style={styles.groupName}>{ekub.name}</ThemedText>
                  <View style={[
                    styles.statusBadge,
                    {
                      backgroundColor: ekub.status === 'Active' ? '#E8F5E9' : 
                                       ekub.status === 'Drawing Soon' ? '#E1F5FE' : '#FFF3E0'
                    }
                  ]}>
                    <ThemedText style={[
                      styles.statusText,
                      {
                        color: ekub.status === 'Active' ? '#2E7D32' : 
                               ekub.status === 'Drawing Soon' ? '#0277BD' : '#EF6C00'
                      }
                    ]}>
                      {ekub.status}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.groupDetails}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Contribution: {ekub.contribution}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {ekub.members} members
                  </ThemedText>
                </View>
              </ThemedView>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Simple internal helper wrapper
function ThemeTextWrapper({ value }: { value: string }) {
  return <ThemedText type="small" themeColor="textSecondary">{value}</ThemedText>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  scrollContent: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
  },
  logoutButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    color: '#D32F2F',
    fontSize: 13,
  },
  statsCard: {
    padding: Spacing.four,
    borderRadius: 24,
    gap: Spacing.three,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  statsLabel: {
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  balanceText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#4A3AFF',
    marginTop: Spacing.one,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: Spacing.one,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: Spacing.half,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.half,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  groupsContainer: {
    gap: Spacing.two,
  },
  groupCard: {
    padding: Spacing.three,
    borderRadius: 16,
    gap: Spacing.two,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  groupDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
