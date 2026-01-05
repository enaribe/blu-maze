import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

/**
 * Request Trip Screen
 */

export default function RequestTripScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Request a Trip</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {/* Input Container */}
                <View style={styles.inputsContainer}>
                    <View style={styles.iconsColumn}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="locate-outline" size={18} color="white" />
                        </View>
                        <View style={styles.verticalLine} />
                        <View style={[styles.iconCircle, { backgroundColor: '#00BFA5' }]}>
                            <Ionicons name="location" size={18} color="white" />
                        </View>
                    </View>

                    <View style={styles.inputsColumn}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value="Kotu Layout"
                                placeholderTextColor="#666"
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter destination"
                                placeholderTextColor="#666"
                                autoFocus
                            />
                        </View>
                    </View>
                </View>

                {/* My Addresses */}
                <Text style={styles.sectionTitle}>My addresses</Text>
                <View style={styles.listContainer}>
                    <ListItem
                        icon="home"
                        title="Home"
                        subtitle="Kairaba Avenue, Serrekunda, Gambia"
                        onPress={() => router.push('/(main)/?step=preview')} // deep link to preview step
                    />
                    <View style={styles.divider} />
                    <ListItem
                        icon="briefcase"
                        title="Office"
                        subtitle="Kairaba Avenue, Serrekunda, Gambia"
                        onPress={() => router.push('/(main)/?step=preview')}
                    />
                </View>

                {/* Recent */}
                <Text style={styles.sectionTitle}>Recent</Text>
                <View style={styles.listContainer}>
                    <ListItem
                        icon="time"
                        title="Traffic Light"
                        subtitle="Kairaba Avenue, Serrekunda, Gambia"
                        onPress={() => router.push('/(main)/?step=preview')}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

function ListItem({ icon, title, subtitle, onPress }: { icon: any; title: string; subtitle: string; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.listItem} onPress={onPress}>
            <View style={styles.listIconCircle}>
                <Ionicons name={icon} size={20} color="white" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{title}</Text>
                <Text style={styles.listSubtitle}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E12',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    inputsContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E2328',
        borderRadius: 16,
        padding: 16,
        marginBottom: 30,
        gap: 15,
    },
    iconsColumn: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2A2E35',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    verticalLine: {
        flex: 1,
        width: 2,
        backgroundColor: '#444',
        marginVertical: 4,
        minHeight: 20,
    },
    inputsColumn: {
        flex: 1,
        gap: 15,
        justifyContent: 'space-between',
    },
    inputWrapper: {
        height: 40,
        justifyContent: 'center',
    },
    input: {
        color: 'white',
        fontSize: 16,
    },
    sectionTitle: {
        color: '#AAAAAA',
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 5,
    },
    listContainer: {
        backgroundColor: '#1E2328',
        borderRadius: 16,
        marginBottom: 30,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 15,
    },
    listIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0058D1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    listSubtitle: {
        color: '#AAAAAA',
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginLeft: 70,
    },
});
