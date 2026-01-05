import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

/**
 * History Screen - List of past rides
 */

// Mock data for demo
const mockRides = [
    {
        id: '1',
        date: 'Today, 10:30 AM',
        pickup: 'Kotu Layout, Serrekunda',
        destination: 'Bakau Fish Market',
        price: 150,
        distance: 5.2,
        status: 'completed',
    },
    {
        id: '2',
        date: 'Yesterday, 3:45 PM',
        pickup: 'Senegambia Strip',
        destination: 'Banjul International Airport',
        price: 400,
        distance: 18.5,
        status: 'completed',
    },
    {
        id: '3',
        date: 'Jan 2, 2:15 PM',
        pickup: 'Westfield Junction',
        destination: 'Kololi Beach',
        price: 200,
        distance: 8.1,
        status: 'completed',
    },
    {
        id: '4',
        date: 'Jan 1, 9:00 AM',
        pickup: 'Banjul Ferry Terminal',
        destination: 'Kotu Beach Hotel',
        price: 180,
        distance: 6.3,
        status: 'completed',
    },
];

export default function HistoryScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Ride History</Text>
                    <Text style={styles.subtitle}>{mockRides.length} rides completed</Text>
                </View>
            </View>

            {/* Rides List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {mockRides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} />
                ))}

                {/* Empty state for when no rides */}
                {mockRides.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyText}>No rides yet</Text>
                        <Text style={styles.emptySubtext}>
                            Your ride history will appear here
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

function RideCard({ ride }: { ride: typeof mockRides[0] }) {
    return (
        <TouchableOpacity style={styles.rideCard} activeOpacity={0.7}>
            <Card style={styles.card}>
                {/* Date & Status */}
                <View style={styles.cardHeader}>
                    <Text style={styles.date}>{ride.date}</Text>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Completed</Text>
                    </View>
                </View>

                {/* Route */}
                <View style={styles.route}>
                    <View style={styles.routeRow}>
                        <View style={styles.dotGreen} />
                        <Text style={styles.address} numberOfLines={1}>
                            {ride.pickup}
                        </Text>
                    </View>
                    <View style={styles.routeLine} />
                    <View style={styles.routeRow}>
                        <View style={styles.dotRed} />
                        <Text style={styles.address} numberOfLines={1}>
                            {ride.destination}
                        </Text>
                    </View>
                </View>

                {/* Details */}
                <View style={styles.details}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Distance</Text>
                        <Text style={styles.detailValue}>{ride.distance} km</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Price</Text>
                        <Text style={styles.price}>D {ride.price.toFixed(2)}</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: 24,
        paddingTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    backButton: {
        padding: 5,
    },
    title: {
        ...Typography.h1,
        color: Colors.text,
        marginBottom: 4,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingTop: 0,
        gap: 16,
    },
    rideCard: {
        marginBottom: 16,
    },
    card: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    date: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.input,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.success,
    },
    statusText: {
        ...Typography.small,
        color: Colors.success,
        fontWeight: '600',
    },
    route: {
        marginBottom: 16,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    routeLine: {
        width: 2,
        height: 16,
        backgroundColor: Colors.border,
        marginLeft: 5,
        marginVertical: 4,
    },
    dotGreen: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.success,
    },
    dotRed: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.error,
    },
    address: {
        ...Typography.body,
        color: Colors.text,
        flex: 1,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    detailItem: {
        flex: 1,
        alignItems: 'center',
    },
    detailLabel: {
        ...Typography.small,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    detailValue: {
        ...Typography.body,
        color: Colors.text,
        fontWeight: '600',
    },
    price: {
        ...Typography.body,
        color: Colors.primary,
        fontWeight: '700',
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: Colors.border,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        ...Typography.h2,
        color: Colors.text,
        marginBottom: 8,
    },
    emptySubtext: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
});
