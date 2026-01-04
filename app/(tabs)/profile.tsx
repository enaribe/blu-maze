import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Card, Button } from '../../components/ui';
import { useStore } from '../../lib/store';

/**
 * Profile Screen - User profile and settings
 */

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profilePhoto}>
            <Text style={styles.profileInitial}>
              {user?.firstName?.[0] || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>
            {user?.firstName || 'User'} {user?.lastName || ''}
          </Text>
          <Text style={styles.phone}>{user?.phoneNumber || '+220 XXX XXXX'}</Text>
        </View>

        {/* Loyalty Points */}
        <Card style={styles.loyaltyCard}>
          <View style={styles.loyaltyContent}>
            <View>
              <Text style={styles.loyaltyLabel}>Loyalty Points</Text>
              <Text style={styles.loyaltyPoints}>250 points</Text>
            </View>
            <Text style={styles.loyaltyIcon}>⭐</Text>
          </View>
          <Text style={styles.loyaltySubtext}>
            Earn 1 point per ride • Redeem for discounts
          </Text>
        </Card>

        {/* Referral Code */}
        <Card style={styles.referralCard}>
          <Text style={styles.referralTitle}>Refer & Earn</Text>
          <View style={styles.referralCode}>
            <Text style={styles.code}>ABDOULIE123456</Text>
            <TouchableOpacity style={styles.copyButton}>
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.referralSubtext}>
            Share your code and get D 50 credit per referral
          </Text>
        </Card>

        {/* Menu Items */}
        <View style={styles.menu}>
          <MenuItem icon="🏠" label="Home Address" onPress={() => {}} />
          <MenuItem icon="💼" label="Office Address" onPress={() => {}} />
          <MenuItem icon="⭐" label="Favorite Places" onPress={() => {}} />
          <MenuItem icon="💳" label="Payment Methods" onPress={() => {}} />
          <MenuItem icon="🔔" label="Notifications" onPress={() => {}} />
          <MenuItem icon="❓" label="Help & Support" onPress={() => {}} />
          <MenuItem icon="📄" label="Terms & Privacy" onPress={() => {}} />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            variant="outline"
            onPress={handleLogout}
          />
        </View>

        {/* App Version */}
        <Text style={styles.version}>Blu Maze v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  name: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: 4,
  },
  phone: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  loyaltyCard: {
    padding: 20,
    marginBottom: 16,
  },
  loyaltyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  loyaltyLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  loyaltyPoints: {
    ...Typography.h2,
    color: Colors.primary,
    fontWeight: '700',
  },
  loyaltyIcon: {
    fontSize: 40,
  },
  loyaltySubtext: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  referralCard: {
    padding: 20,
    marginBottom: 24,
  },
  referralTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  referralCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  code: {
    flex: 1,
    ...Typography.h3,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 2,
  },
  copyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyText: {
    ...Typography.caption,
    color: '#000',
    fontWeight: '600',
  },
  referralSubtext: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  menu: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuLabel: {
    ...Typography.body,
    color: Colors.text,
  },
  menuArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  logoutContainer: {
    marginTop: 32,
  },
  version: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
});
