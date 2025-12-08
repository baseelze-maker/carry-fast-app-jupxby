
import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  ScrollView,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent
} from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    icon: 'airplane',
    iconAndroid: 'flight',
    title: 'Welcome to TravelConnect',
    description: 'Connect travelers with extra luggage space to people who need to send items quickly and affordably.',
    gradient: ['#4CAF50', '#45a049'],
  },
  {
    id: 2,
    icon: 'shippingbox',
    iconAndroid: 'inventory',
    title: 'Send Items Easily',
    description: 'Search for travelers going to your destination and send documents or small items with them. Fast, reliable, and cost-effective.',
    gradient: ['#2196F3', '#1976D2'],
  },
  {
    id: 3,
    icon: 'dollarsign.circle',
    iconAndroid: 'attach-money',
    title: 'Earn While You Travel',
    description: 'Make the most of your unused luggage weight and earn money by delivering items to fellow users.',
    gradient: ['#FFC107', '#FFA000'],
  },
  {
    id: 4,
    icon: 'checkmark.shield',
    iconAndroid: 'verified-user',
    title: 'Safe & Secure',
    description: 'Verified users, ratings, and reviews ensure a trustworthy community for everyone. Your safety is our priority.',
    gradient: ['#9C27B0', '#7B1FA2'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / width);
        setCurrentIndex(index);
      }
    }
  );

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({ x: width * nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const handleDotPress = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: width * index, animated: true });
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id} style={styles.slide}>
            {/* Gradient Background Circle */}
            <View style={styles.gradientCircleContainer}>
              <LinearGradient
                colors={item.gradient}
                style={styles.gradientCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.iconContainer}>
                  <IconSymbol 
                    ios_icon_name={item.icon} 
                    android_material_icon_name={item.iconAndroid} 
                    size={100} 
                    color="#FFFFFF" 
                  />
                </View>
              </LinearGradient>
            </View>

            {/* Content */}
            <View style={styles.textContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleDotPress(index)}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity,
                      backgroundColor: index === currentIndex ? colors.primary : colors.border,
                    }
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext} 
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <IconSymbol 
            ios_icon_name="arrow.right" 
            android_material_icon_name="arrow-forward" 
            size={20} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>

        {/* Login Link */}
        {currentIndex === onboardingData.length - 1 && (
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 60,
    right: 20,
    zIndex: 10,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: Platform.OS === 'android' ? 80 : 100,
  },
  gradientCircleContainer: {
    marginBottom: 60,
  },
  gradientCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  bottomSection: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
    height: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0px 4px 12px rgba(76, 175, 80, 0.3)',
    elevation: 4,
    minWidth: 200,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '700',
  },
});
