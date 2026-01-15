import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { addRideRating } from '../../lib/firebase';

/**
 * Rate Ride Screen
 * Allows user to rate driver after trip completion
 */

export default function RateRideScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { rideId } = params;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmitRating = async () => {
        if (rating === 0) {
            return; // Must select at least 1 star
        }

        setLoading(true);
        try {
            await addRideRating(rideId as string, rating, comment);
            // Navigate back to home
            router.replace('/(main)');
        } catch (error) {
            console.error('Error submitting rating:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        router.replace('/(main)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Success Icon */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkmark" size={60} color="white" />
                    </View>
                </View>

                <Text style={styles.title}>Trip Completed!</Text>
                <Text style={styles.subtitle}>Rate your experience with the driver</Text>

                {/* Driver Info (Mock) */}
                <View style={styles.driverCard}>
                    <View style={styles.driverAvatar}>
                        <Ionicons name="person" size={40} color="white" />
                    </View>
                    <View style={styles.driverInfo}>
                        <Text style={styles.driverName}>Driver Name</Text>
                        <Text style={styles.vehicleText}>Toyota Corolla • ABC 123</Text>
                    </View>
                </View>

                {/* Star Rating */}
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            style={styles.starButton}
                        >
                            <Ionicons
                                name={star <= rating ? 'star' : 'star-outline'}
                                size={44}
                                color={star <= rating ? '#FFD700' : '#666'}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Comment Input */}
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment (optional)"
                    placeholderTextColor="#666"
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    maxLength={200}
                />

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
                    onPress={handleSubmitRating}
                    disabled={rating === 0 || loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Submitting...' : 'Submit Rating'}
                    </Text>
                </TouchableOpacity>

                {/* Skip Button */}
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E12',
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 30,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 30,
        textAlign: 'center',
    },
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E2328',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        marginBottom: 30,
        gap: 15,
    },
    driverAvatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    vehicleText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 30,
    },
    starButton: {
        padding: 5,
    },
    commentInput: {
        width: '100%',
        backgroundColor: '#1E2328',
        borderRadius: 12,
        padding: 16,
        color: 'white',
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    submitButton: {
        backgroundColor: Colors.primary,
        width: '100%',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    submitButtonDisabled: {
        backgroundColor: '#444',
        opacity: 0.5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    skipButton: {
        paddingVertical: 12,
    },
    skipButtonText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
});
