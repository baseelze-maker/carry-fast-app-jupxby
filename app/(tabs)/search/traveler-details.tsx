
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function TravelerDetailsScreen() {
  const router = useRouter();

  // Mock traveler data
  const traveler = {
    name: 'Sarah Johnson',
    rating: 4.9,
    reviews: 24,
    verified: true,
    joinedDate: 'Jan 2023',
    completedTrips: 18,
    from: 'Los Angeles, USA',
    to: 'Paris, France',
    date: '2024-02-18',
    time: '10:00 AM',
    weight: '3 kg',
    price: '$40',
    description: 'I travel frequently for business. Happy to help deliver small items. I prefer documents and small packages only.',
    meetingPoints: {
      pickup: 'LAX Airport, Terminal B',
      delivery: 'Charles de Gaulle Airport, Terminal 2E',
    },
  };

  const reviews = [
    { id: '1', user: 'Mike Chen', rating: 5, comment: 'Very reliable! Delivered my documents on time.', date: 'Jan 2024' },
    { id: '2', user: 'Emma Wilson', rating: 5, comment: 'Great communication throughout the process.', date: 'Dec 2023' },
    { id: '3', user: 'David Lee', rating: 4, comment: 'Good service, slight delay but kept me informed.', date: 'Nov 2023' },
  ];

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
                  ios_icon_name="airplane.arrival" 
                  android_material_icon_name="flight-land" 
                  size={20} 
                  color={colors.primary} 
                />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>To</Text>
                  <Text style={styles.locationText}>{traveler.to}</Text>
                </View>
              </View>
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
                <Text style={styles.detailLabel}>Price</Text>
                <Text style={styles.detailValue}>{traveler.price}</Text>
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
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <IconSymbol 
                    ios_icon_name="person.circle.fill" 
                    android_material_icon_name="account-circle" 
                    size={36} 
                    color={colors.textSecondary} 
                  />
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewUser}>{review.user}</Text>
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
        <TouchableOpacity style={styles.messageButton} activeOpacity={0.8}>
          <IconSymbol 
            ios_icon_name="message.fill" 
            android_material_icon_name="message" 
            size={20} 
            color={colors.text} 
          />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.requestButton} activeOpacity={0.8}>
          <Text style={styles.requestButtonText}>Send Request</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
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
  reviewUser: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
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
});
