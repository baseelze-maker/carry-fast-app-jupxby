
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Alert, Modal } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function TravelerDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [itemDescription, setItemDescription] = useState('');
  const [itemWeight, setItemWeight] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  // Mock traveler data - In production, fetch based on params.travelerId
  const traveler = {
    id: params.travelerId || '2',
    name: 'Sarah Johnson',
    rating: 4.9,
    reviews: 24,
    verified: true,
    joinedDate: 'Jan 2023',
    completedTrips: 18,
    responseTime: '2 hours',
    from: 'Los Angeles, USA',
    to: 'Paris, France',
    finalDestination: 'Lyon, France',
    date: '2024-02-18',
    time: '10:00 AM',
    weight: '3 kg',
    suggestedPrice: '$40',
    description: 'I travel frequently for business between LA and France. Happy to help deliver small items like documents, gifts, or small packages. I prefer items that are well-packaged and clearly labeled. I have experience with international deliveries and understand customs requirements.',
    meetingPoints: {
      pickup: 'LAX Airport, Terminal B - International Departures',
      delivery: 'Charles de Gaulle Airport, Terminal 2E - Arrivals Hall',
    },
    preferences: [
      'Documents and papers',
      'Small gifts and souvenirs',
      'Electronics (properly packaged)',
      'Books and magazines',
    ],
    restrictions: [
      'No liquids or perishables',
      'No fragile items without proper packaging',
      'Maximum 3kg per delivery',
    ],
  };

  const reviews = [
    { 
      id: '1', 
      user: 'Mike Chen', 
      rating: 5, 
      comment: 'Very reliable! Delivered my documents on time and kept me updated throughout the journey. Highly recommend!', 
      date: 'Jan 2024',
      verified: true,
    },
    { 
      id: '2', 
      user: 'Emma Wilson', 
      rating: 5, 
      comment: 'Great communication throughout the process. Sarah was very professional and careful with my package.', 
      date: 'Dec 2023',
      verified: true,
    },
    { 
      id: '3', 
      user: 'David Lee', 
      rating: 4, 
      comment: 'Good service, slight delay but kept me informed. Would use again.', 
      date: 'Nov 2023',
      verified: false,
    },
  ];

  const handleSendRequest = () => {
    setShowRequestModal(true);
  };

  const handleSubmitRequest = () => {
    // Validate inputs
    if (!itemDescription.trim()) {
      Alert.alert('Missing Information', 'Please describe the item you want to send.');
      return;
    }
    if (!itemWeight.trim()) {
      Alert.alert('Missing Information', 'Please enter the item weight.');
      return;
    }
    if (!offerAmount.trim()) {
      Alert.alert('Missing Information', 'Please enter your offer amount.');
      return;
    }

    const weight = parseFloat(itemWeight);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight.');
      return;
    }

    if (weight > 3) {
      Alert.alert('Weight Limit Exceeded', 'This traveler can only carry up to 3 kg. Please adjust your item weight.');
      return;
    }

    // Close modal
    setShowRequestModal(false);

    // Show success message
    Alert.alert(
      'Request Sent Successfully',
      `Your delivery request has been sent to ${traveler.name} with an offer of $${offerAmount}.\n\nItem: ${itemDescription}\nWeight: ${itemWeight} kg\n\nYou will receive a notification when they respond. Average response time: ${traveler.responseTime}.`,
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('Request sent:', {
              traveler: traveler.name,
              travelerId: traveler.id,
              item: itemDescription,
              weight: itemWeight,
              offer: offerAmount,
              message: requestMessage,
            });
            // Reset form
            setItemDescription('');
            setItemWeight('');
            setOfferAmount('');
            setRequestMessage('');
            // Navigate back
            router.back();
          },
        },
      ]
    );
  };

  const handleMessageTraveler = () => {
    console.log('Opening chat with traveler:', traveler.id);
    router.push(`/chat/${traveler.id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Traveler Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <IconSymbol 
            ios_icon_name="square.and.arrow.up" 
            android_material_icon_name="share" 
            size={22} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <IconSymbol 
              ios_icon_name="person.circle.fill" 
              android_material_icon_name="account-circle" 
              size={80} 
              color={colors.primary} 
            />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.travelerName}>{traveler.name}</Text>
              {traveler.verified && (
                <IconSymbol 
                  ios_icon_name="checkmark.seal.fill" 
                  android_material_icon_name="verified" 
                  size={20} 
                  color={colors.secondary} 
                />
              )}
            </View>
            <View style={styles.ratingRow}>
              <IconSymbol 
                ios_icon_name="star.fill" 
                android_material_icon_name="star" 
                size={16} 
                color={colors.accent} 
              />
              <Text style={styles.ratingText}>{traveler.rating}</Text>
              <Text style={styles.reviewsText}>({traveler.reviews} reviews)</Text>
            </View>
            <Text style={styles.memberSince}>Member since {traveler.joinedDate}</Text>
            <View style={styles.responseTimeContainer}>
              <IconSymbol 
                ios_icon_name="clock" 
                android_material_icon_name="schedule" 
                size={14} 
                color={colors.success} 
              />
              <Text style={styles.responseTimeText}>Usually responds in {traveler.responseTime}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <Text style={styles.statNumber}>{traveler.completedTrips}</Text>
            <Text style={styles.statLabel}>Completed Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={24} 
              color={colors.accent} 
            />
            <Text style={styles.statNumber}>{traveler.rating}</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
        </View>

        {/* Trip Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.card}>
            {/* Route */}
            <View style={styles.routeContainer}>
              <View style={styles.locationRow}>
                <IconSymbol 
                  ios_icon_name="airplane.departure" 
                  android_material_icon_name="flight-takeoff" 
                  size={20} 
                  color={colors.secondary} 
                />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>From</Text>
                  <Text style={styles.locationText}>{traveler.from}</Text>
                </View>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.locationRow}>
                <IconSymbol 
                  ios_icon_name="location.fill" 
                  android_material_icon_name="place" 
                  size={20} 
                  color={colors.primary} 
                />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>To</Text>
                  <Text style={styles.locationText}>{traveler.to}</Text>
                </View>
              </View>
              {traveler.finalDestination !== traveler.to && (
                <>
                  <View style={styles.routeLine} />
                  <View style={styles.locationRow}>
                    <IconSymbol 
                      ios_icon_name="airplane.arrival" 
                      android_material_icon_name="flight-land" 
                      size={20} 
                      color={colors.accent} 
                    />
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationLabel}>Final Destination</Text>
                      <Text style={styles.locationText}>{traveler.finalDestination}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailBox}>
                <IconSymbol 
                  ios_icon_name="calendar" 
                  android_material_icon_name="calendar-today" 
                  size={18} 
                  color={colors.primary} 
                />
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{traveler.date}</Text>
              </View>
              <View style={styles.detailBox}>
                <IconSymbol 
                  ios_icon_name="clock" 
                  android_material_icon_name="schedule" 
                  size={18} 
                  color={colors.primary} 
                />
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{traveler.time}</Text>
              </View>
              <View style={styles.detailBox}>
                <IconSymbol 
                  ios_icon_name="scalemass" 
                  android_material_icon_name="scale" 
                  size={18} 
                  color={colors.primary} 
                />
                <Text style={styles.detailLabel}>Available</Text>
                <Text style={styles.detailValue}>{traveler.weight}</Text>
              </View>
              <View style={styles.detailBox}>
                <IconSymbol 
                  ios_icon_name="dollarsign.circle" 
                  android_material_icon_name="attach-money" 
                  size={18} 
                  color={colors.primary} 
                />
                <Text style={styles.detailLabel}>Suggested Price</Text>
                <Text style={styles.detailValue}>{traveler.suggestedPrice}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Text style={styles.descriptionText}>{traveler.description}</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What I Can Carry</Text>
          <View style={styles.card}>
            {traveler.preferences.map((pref, index) => (
              <View key={index} style={styles.preferenceItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check-circle" 
                  size={18} 
                  color={colors.success} 
                />
                <Text style={styles.preferenceText}>{pref}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Restrictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restrictions</Text>
          <View style={styles.card}>
            {traveler.restrictions.map((restriction, index) => (
              <View key={index} style={styles.restrictionItem}>
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill" 
                  android_material_icon_name="cancel" 
                  size={18} 
                  color={colors.error} 
                />
                <Text style={styles.restrictionText}>{restriction}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Meeting Points */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Points</Text>
          <View style={styles.card}>
            <View style={styles.meetingPoint}>
              <IconSymbol 
                ios_icon_name="mappin.circle.fill" 
                android_material_icon_name="place" 
                size={20} 
                color={colors.secondary} 
              />
              <View style={styles.meetingInfo}>
                <Text style={styles.meetingLabel}>Pickup</Text>
                <Text style={styles.meetingText}>{traveler.meetingPoints.pickup}</Text>
              </View>
            </View>
            <View style={styles.meetingDivider} />
            <View style={styles.meetingPoint}>
              <IconSymbol 
                ios_icon_name="mappin.circle.fill" 
                android_material_icon_name="place" 
                size={20} 
                color={colors.primary} 
              />
              <View style={styles.meetingInfo}>
                <Text style={styles.meetingLabel}>Delivery</Text>
                <Text style={styles.meetingText}>{traveler.meetingPoints.delivery}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews ({traveler.reviews})</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {reviews.map((review, index) => (
            <React.Fragment key={index}>
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <IconSymbol 
                    ios_icon_name="person.circle.fill" 
                    android_material_icon_name="account-circle" 
                    size={36} 
                    color={colors.textSecondary} 
                  />
                  <View style={styles.reviewInfo}>
                    <View style={styles.reviewUserRow}>
                      <Text style={styles.reviewUser}>{review.user}</Text>
                      {review.verified && (
                        <IconSymbol 
                          ios_icon_name="checkmark.seal.fill" 
                          android_material_icon_name="verified" 
                          size={14} 
                          color={colors.secondary} 
                        />
                      )}
                    </View>
                    <View style={styles.reviewRating}>
                      {[...Array(review.rating)].map((_, i) => (
                        <IconSymbol 
                          key={i}
                          ios_icon_name="star.fill" 
                          android_material_icon_name="star" 
                          size={12} 
                          color={colors.accent} 
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.messageButton} 
          activeOpacity={0.8}
          onPress={handleMessageTraveler}
        >
          <IconSymbol 
            ios_icon_name="message.fill" 
            android_material_icon_name="message" 
            size={20} 
            color={colors.text} 
          />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.requestButton} 
          activeOpacity={0.8}
          onPress={handleSendRequest}
        >
          <Text style={styles.requestButtonText}>Send Request</Text>
        </TouchableOpacity>
      </View>

      {/* Request Modal */}
      <Modal
        visible={showRequestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Delivery Request</Text>
              <TouchableOpacity 
                onPress={() => setShowRequestModal(false)}
                style={styles.closeButton}
              >
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill" 
                  android_material_icon_name="cancel" 
                  size={28} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Traveler Info */}
              <View style={styles.modalTravelerInfo}>
                <IconSymbol 
                  ios_icon_name="person.circle.fill" 
                  android_material_icon_name="account-circle" 
                  size={40} 
                  color={colors.primary} 
                />
                <View style={styles.modalTravelerDetails}>
                  <Text style={styles.modalTravelerName}>{traveler.name}</Text>
                  <Text style={styles.modalTravelerRoute}>{traveler.from} → {traveler.to}</Text>
                </View>
              </View>

              {/* Suggested Price Notice */}
              <View style={styles.priceNotice}>
                <IconSymbol 
                  ios_icon_name="info.circle.fill" 
                  android_material_icon_name="info" 
                  size={18} 
                  color={colors.secondary} 
                />
                <Text style={styles.priceNoticeText}>
                  Suggested price: {traveler.suggestedPrice} (You can offer a different amount)
                </Text>
              </View>

              {/* Form Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Item Description *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Business documents, Small gift"
                  placeholderTextColor={colors.textSecondary}
                  value={itemDescription}
                  onChangeText={setItemDescription}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Item Weight (kg) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 0.5"
                  placeholderTextColor={colors.textSecondary}
                  value={itemWeight}
                  onChangeText={setItemWeight}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.helperText}>
                  Maximum weight: 3 kg
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Your Offer Amount ($) *</Text>
                <View style={styles.offerInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.offerInput}
                    placeholder="Enter your offer"
                    placeholderTextColor={colors.textSecondary}
                    value={offerAmount}
                    onChangeText={setOfferAmount}
                    keyboardType="decimal-pad"
                  />
                </View>
                <Text style={styles.helperText}>
                  The traveler can accept, decline, or send a counteroffer
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Additional Message (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add any special instructions or details..."
                  placeholderTextColor={colors.textSecondary}
                  value={requestMessage}
                  onChangeText={setRequestMessage}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitRequest}
              >
                <Text style={styles.submitButtonText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 180,
  },
  profileSection: {
    backgroundColor: colors.card,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarLarge: {
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  travelerName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  reviewsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  memberSince: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  responseTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  responseTimeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    margin: 20,
    marginBottom: 0,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  routeContainer: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginVertical: 8,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 9,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  preferenceText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  restrictionText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  meetingPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  meetingText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  meetingDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.06)',
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  requestButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: 500,
    paddingHorizontal: 20,
  },
  modalTravelerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  modalTravelerDetails: {
    flex: 1,
  },
  modalTravelerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  modalTravelerRoute: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  priceNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: `${colors.secondary}15`,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: `${colors.secondary}30`,
  },
  priceNoticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  formGroup: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  offerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingLeft: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginRight: 4,
  },
  offerInput: {
    flex: 1,
    padding: 12,
    paddingLeft: 4,
    fontSize: 15,
    color: colors.text,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  submitButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
