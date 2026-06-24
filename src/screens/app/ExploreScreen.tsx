import React from 'react';
import { StyleSheet, ScrollView, View, useColorScheme, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, MaxContentWidth } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const topics = [
    {
      title: '🔄 How Ekub Works',
      description: 'Ekub is a traditional rotational savings association. Group members contribute a fixed amount periodically. Every period, a draw is held, and one member receives the entire pool.'
    },
    {
      title: '🎲 Fair Draws & Rotations',
      description: 'The drawing order is determined using a transparent, secure lottery system in the app. Each member is guaranteed to receive the pool exactly once during the cycle.'
    },
    {
      title: '💳 Seamless Mobile Payments',
      description: 'Contributions are collected via integrated payment methods (such as Telebirr or CBE Birr) and stored in a secure custody account until the draw is disbursed.'
    },
    {
      title: '🤝 Trust & Reputation',
      description: 'Members build an on-chain credit and trust score based on their history of timely contributions. High scores allow entry into high-value premium groups.'
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              Explore Digital Ekub
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              Learn more about rules, rotations, and secure savings pools
            </ThemedText>
          </View>

          <View style={styles.topicsList}>
            {topics.map((topic, index) => (
              <ThemedView
                key={index}
                type="backgroundElement"
                style={styles.topicCard}>
                <ThemedText type="smallBold" style={styles.topicTitle}>{topic.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.topicDescription}>
                  {topic.description}
                </ThemedText>
              </ThemedView>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
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
    alignItems: 'center',
    paddingVertical: Spacing.three,
    gap: Spacing.one,
  },
  title: {
    fontSize: 22,
    fontWeight: '850',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 18,
  },
  topicsList: {
    gap: Spacing.three,
  },
  topicCard: {
    padding: Spacing.four,
    borderRadius: 20,
    gap: Spacing.two,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  topicDescription: {
    lineHeight: 20,
    fontSize: 14,
  },
});
