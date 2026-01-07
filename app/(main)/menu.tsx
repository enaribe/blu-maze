import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useStore } from '../../lib/store';

import { logoutUser } from '../../lib/firebase';

/**
 * Burger Menu Screen
 * Sliding menu with user profile and app navigation
 */

export default function MenuScreen() {
    const router = useRouter();
    const { user, logout } = useStore();

    const handleLogout = async () => {
        await logoutUser();
        logout();
        router.replace('/(auth)/welcome');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* User Profile Header Segment */}
                <TouchableOpacity
                    style={styles.profileHeader}
                    onPress={() => router.push('/(main)/profile')}
                >
                    <View style={styles.userInfo}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person" size={24} color="#666" />
                        </View>
                        <View>
                            <Text style={styles.userName}>{user?.firstName || 'Paul'} {user?.lastName || 'Izilein'}</Text>
                            <Text style={styles.userPhone}>{user?.phoneNumber || '+220 771 1810'}</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
                </TouchableOpacity>

                {/* Menu Items */}
                <ScrollView style={styles.menuList}>
                    <MenuItem
                        icon="location-outline"
                        label="Addresses"
                        onPress={() => router.push('/(main)/addresses')}
                    />
                    <MenuItem
                        icon="time-outline"
                        label="History"
                        onPress={() => router.push('/(main)/history')}
                    />
                    <MenuItem
                        icon="card-outline"
                        label="Payment methods"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="help-circle-outline"
                        label="Help"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="star-outline"
                        label="Loyalty points"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="log-out-outline"
                        label="Logout"
                        onPress={handleLogout}
                    />
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => router.back()}
                    >
                        <View style={styles.closeIconCircle}>
                            <Ionicons name="close" size={30} color="#00D9D5" />
                        </View>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }}>
                        <Text style={styles.termsText}>Terms and conditions</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

function MenuItem({
    icon,
    label,
    onPress
}: {
    icon: any;
    label: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <Ionicons name={icon} size={24} color="white" />
            <Text style={styles.menuLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E12',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1E2328',
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
        marginTop: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userPhone: {
        color: '#AAAAAA',
        fontSize: 12,
    },
    menuList: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        gap: 20,
    },
    menuLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
        gap: 20,
    },
    closeButton: {
        alignItems: 'center',
        gap: 8,
    },
    closeIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#00D9D5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        color: '#AAAAAA',
        fontSize: 12,
    },
    termsText: {
        color: '#00D9D5',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
