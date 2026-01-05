import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useStore } from '../../lib/store';

/**
 * Personal Information Screen
 */

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useStore();
    const [firstName, setFirstName] = useState(user?.firstName || 'Paul');
    const [lastName, setLastName] = useState(user?.lastName || 'Izilein');
    const [email, setEmail] = useState('contact@email.com');
    const [phone, setPhone] = useState('+220 771 1234');

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Information</Text>
                <View style={{ width: 40 }} /> {/* Spacer for centering */}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarOutline}>
                        {/* Mock image - in real app use user photo */}
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={50} color="#666" />
                        </View>
                        <TouchableOpacity style={styles.editIconBadge}>
                            <Ionicons name="pencil" size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>First name</Text>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Last name</Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone number</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholderTextColor="#666"
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Save Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
    scrollContent: {
        padding: 24,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 40,
    },
    avatarOutline: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#00BFA5',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.background,
    },
    form: {
        width: '100%',
        gap: 20,
    },
    inputGroup: {
        width: '100%',
    },
    label: {
        color: '#AAAAAA',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1E2328',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    saveButton: {
        backgroundColor: '#00BFA5',
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});


