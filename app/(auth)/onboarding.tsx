import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useStore } from '../../lib/store';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Safe',
    description: 'Book a safe, reliable ride with local drivers.',
    image: require('../../assets/images/react-logo.png'), // Placeholder image
    // In a real app we would use the actual images provided in the design
  },
  {
    id: '2',
    title: 'Reliable',
    description: "Turn on your location or choose a nearby landmark and we'll find you.",
    image: require('../../assets/images/react-logo.png'), // Placeholder
  },
  {
    id: '3',
    title: 'Efficient',
    description: "See your driver's photo, car details, and live GPS tracking.",
    image: require('../../assets/images/react-logo.png'), // Placeholder
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          {/* Placeholder for the large image in the design */}
          <View style={styles.imagePlaceholder}>
            {/*  We can use an specific placeholder color or the react logo as temp */}
            {/* <Image source={item.image} style={styles.image} resizeMode="contain" /> */}
            {/* Using a colored view to mimic the image area for now */}
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Logo */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logoheader.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={32}
        style={styles.flatList}
      />

      {/* Footer Content */}
      <View style={styles.footer}>
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => {
              useStore.getState().completeOnboarding();
              router.push('/(auth)/phone');
            }}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => {
              useStore.getState().completeOnboarding();
              router.push('/(auth)/phone');
            }}
          >
            <Text style={styles.signupButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    zIndex: 10,
  },
  headerLogo: {
    width: 150,
    height: 60,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    paddingHorizontal: 20,
    paddingBottom: 20, // Add some bottom padding to avoid text touching footer
  },
  imageContainer: {
    width: width - 40,
    height: 300,
    maxHeight: '50%', // Allow shrinking on small screens
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#333',
    marginBottom: 30, // Reduced margin
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#2C2C2E',
  },
  textContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30, // Lowering buttons slightly closer to edge
  },
  buttonContainer: {
    marginBottom: 20, // reduced gap between buttons and pagination
    gap: 15,
  },
  button: {
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginButton: {
    backgroundColor: Colors.primary,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signupButton: {
    backgroundColor: '#1C1C1E',
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 20, // ensure fixed height
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3A3A3C',
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 20,
  },
});
