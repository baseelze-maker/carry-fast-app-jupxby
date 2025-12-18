
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import * as Haptics from "expo-haptics";

// Mock trip data
const mockTrip = {
  id: '1',
  from: 'New York, USA',
  to: 'London, UK',
  finalDestination: 'Manchester, UK',
  date: '2024-02-15',
  time: '10:00 AM',
  weight: 5,
  availableWeight: 5,
  status: 'active',
  canDeliverAtFirstDestination: true,
  requests: [
    {
      id: 'r1',
      requester: {
        name: 'Alice Brown',
        rating: 4.7,
        completedDeliveries: 8,
        verified: true,
      },
      itemDescription: 'Important business documents',
      weight: 1.5,
      offeredAmount: 25,
      counterOffer: null,
      status: 'pending',
      pickupLocation: 'Manhattan, New York',
      deliveryLocation: 'Central London',
      requestedDate: '2024-02-10',
    },
    {
      id: 'r2',
      requester: {
        name: 'Bob Wilson',
        rating: 4.9,
        completedDeliveries: 15,
        verified: true,
      },
      itemDescription: 'Small gift package',
      weight: 0.8,
      offeredAmount: 30,
      counterOffer: 35,
      status: 'pending',
      pickupLocation: 'Brooklyn, New York',
      deliveryLocation: 'Westminster, London',
      requestedDate: '2024-02-11',
    },
    {
      id: 'r3',
      requester: {
        name: 'Carol Davis',
        rating: 4.5,
        completedDeliveries: 5,
        verified: false,
      },
      itemDescription: 'Medical supplies',
      weight: 2.0,
      offeredAmount: 40,
      counterOffer: null,
      status: 'pending',
      pickupLocation: 'Queens, New York',
      deliveryLocation: 'Manchester City Centre',
      requestedDate: '2024-02-12',
    },
  ],
};

export default function TripDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [trip, setTrip] = useState(mockTrip);

  console.log('=== TRIP DETAILS SCREEN RENDERED ===');
  console.log('Trip ID:', params.id);
  console.log('Total requests:', trip.requests.length);

  const handleAcceptRequest = (request: any) => {
    console.log('=== ACCEPT BUTTON PRESSED ===');
    console.log('Request ID:', request.id);
    console.log('Requester:', request.requester.name);
    
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log('Haptics error:', error);
    }
    
    Alert.alert(
      'Accept Request',
      `Accept ${request.requester.name}'s request for $${request.counterOffer || request.offeredAmount}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Accept cancelled'),
        },
        {
          text: 'Accept',
          onPress: () => {
            console.log('=== PROCESSING ACCEPTANCE ===');
            
            // Update request status
            setTrip(prevTrip => {
              const updatedRequests = prevTrip.requests.map(r =>
                r.id === request.id ? { ...r, status: 'accepted' } : r
              );
              
              const updatedTrip = {
                ...prevTrip,
                requests: updatedRequests,
                availableWeight: prevTrip.availableWeight - request.weight,
              };
              
              console.log('Trip updated:', updatedTrip);
              return updatedTrip;
            });
            
            Alert.alert(
              'Success!',
              `Request accepted! ${request.requester.name} has been notified.`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const handleDeclineRequest = (request: any) => {
    console.log('=== DECLINE BUTTON PRESSED ===');
    console.log('Request ID:', request.id);
    console.log('Requester:', request.requester.name);
    
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.log('Haptics error:', error);
    }
    
    Alert.alert(
      'Decline Request',
      `Are you sure you want to decline ${request.requester.name}'s request?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Decline cancelled'),
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            console.log('=== PROCESSING DECLINE ===');
            
            // Remove request from list
            setTrip(prevTrip => {
              const updatedRequests = prevTrip.requests.filter(r => r.id !== request.id);
              
              const updatedTrip = {
                ...prevTrip,
                requests: updatedRequests,
              };
              
              console.log('Trip updated:', updatedTrip);
              console.log('Remaining requests:', updatedRequests.length);
              return updatedTrip;
            });
            
            Alert.alert(
              'Request Declined',
              `${request.requester.name} has been notified.`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const pendingRequests = trip.requests.filter(r => r.status === 'pending');
  const acceptedRequests = trip.requests.filter(r => r.status === 'accepted');

  console.log('Pending requests:', pendingRequests.length);
  console.log('Accepted requests:', acceptedRequests.length);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            console.log('Back button pressed');
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
              console.log('Haptics error:', error);
            }
            router.back();
          }}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip Info Card */}
        <View style={styles.tripCard}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active Trip</Text>
          </View>

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
                <Text style={styles.locationText}>{trip.from}</Text>
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
                <Text style={styles.locationText}>{trip.to}</Text>
              </View>
            </View>
          </View>

          {/* Trip Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <IconSymbol 
                ios_icon_name="calendar" 
                android_material_icon_name="calendar-today" 
                size={18} 
                color={colors.primary} 
              />
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{trip.date}</Text>
            </View>
            <View style={styles.detailBox}>
              <IconSymbol 
                ios_icon_name="clock" 
                android_material_icon_name="schedule" 
                size={18} 
                color={colors.primary} 
              />
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{trip.time}</Text>
            </View>
            <View style={styles.detailBox}>
              <IconSymbol 
                ios_icon_name="scalemass" 
                android_material_icon_name="scale" 
                size={18} 
                color={colors.primary} 
              />
              <Text style={styles.detailLabel}>Available</Text>
              <Text style={styles.detailValue}>{trip.availableWeight} kg</Text>
            </View>
          </View>
        </View>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending Requests</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{pendingRequests.length}</Text>
              </View>
            </View>

            {pendingRequests.map((request, index) => (
              <View key={request.id} style={styles.requestCard}>
                {/* Requester Info */}
                <View style={styles.requesterHeader}>
                  <IconSymbol 
                    ios_icon_name="person.circle.fill" 
                    android_material_icon_name="account-circle" 
                    size={48} 
                    color={colors.primary} 
                  />
                  <View style={styles.requesterInfo}>
                    <View style={styles.requesterNameRow}>
                      <Text style={styles.requesterName}>{request.requester.name}</Text>
                      {request.requester.verified && (
                        <IconSymbol 
                          ios_icon_name="checkmark.seal.fill" 
                          android_material_icon_name="verified" 
                          size={16} 
                          color={colors.secondary} 
                        />
                      )}
                    </View>
                    <View style={styles.requesterStats}>
                      <IconSymbol 
                        ios_icon_name="star.fill" 
                        android_material_icon_name="star" 
                        size={12} 
                        color={colors.accent} 
                      />
                      <Text style={styles.requesterRating}>{request.requester.rating}</Text>
                      <Text style={styles.requesterDeliveries}>
                        • {request.requester.completedDeliveries} deliveries
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Item Details */}
                <View style={styles.itemDetails}>
                  <View style={styles.itemRow}>
                    <IconSymbol 
                      ios_icon_name="shippingbox" 
                      android_material_icon_name="inventory" 
                      size={16} 
                      color={colors.textSecondary} 
                    />
                    <Text style={styles.itemText}>{request.itemDescription}</Text>
                  </View>
                  <View style={styles.itemRow}>
                    <IconSymbol 
                      ios_icon_name="scalemass" 
                      android_material_icon_name="scale" 
                      size={16} 
                      color={colors.textSecondary} 
                    />
                    <Text style={styles.itemText}>{request.weight} kg</Text>
                  </View>
                </View>

                {/* Locations */}
                <View style={styles.locationsContainer}>
                  <View style={styles.locationDetail}>
                    <Text style={styles.locationDetailLabel}>Pickup</Text>
                    <Text style={styles.locationDetailText}>{request.pickupLocation}</Text>
                  </View>
                  <View style={styles.locationDetail}>
                    <Text style={styles.locationDetailLabel}>Delivery</Text>
                    <Text style={styles.locationDetailText}>{request.deliveryLocation}</Text>
                  </View>
                </View>

                {/* Offer Amount */}
                <View style={styles.offerContainer}>
                  <View style={styles.offerBox}>
                    <Text style={styles.offerLabel}>
                      {request.counterOffer ? 'Counter Offer' : 'Offered Amount'}
                    </Text>
                    <Text style={styles.offerAmount}>
                      ${request.counterOffer || request.offeredAmount}
                    </Text>
                  </View>
                </View>

                {/* Actions - SIMPLIFIED AND FIXED */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    style={styles.acceptButton}
                    onPress={() => {
                      console.log('ACCEPT BUTTON TAPPED - Request:', request.id);
                      handleAcceptRequest(request);
                    }}
                    activeOpacity={0.6}
                  >
                    <IconSymbol 
                      ios_icon_name="checkmark.circle.fill" 
                      android_material_icon_name="check-circle" 
                      size={20} 
                      color="#FFFFFF" 
                    />
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.declineButton}
                    onPress={() => {
                      console.log('DECLINE BUTTON TAPPED - Request:', request.id);
                      handleDeclineRequest(request);
                    }}
                    activeOpacity={0.6}
                  >
                    <IconSymbol 
                      ios_icon_name="xmark.circle.fill" 
                      android_material_icon_name="cancel" 
                      size={20} 
                      color={colors.error} 
                    />
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Accepted Requests Section */}
        {acceptedRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Accepted Requests</Text>
              <View style={[styles.countBadge, styles.countBadgeSuccess]}>
                <Text style={styles.countBadgeText}>{acceptedRequests.length}</Text>
              </View>
            </View>

            {acceptedRequests.map((request, index) => (
              <View key={request.id} style={[styles.requestCard, styles.acceptedCard]}>
                <View style={styles.acceptedBadge}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill" 
                    android_material_icon_name="check-circle" 
                    size={16} 
                    color={colors.success} 
                  />
                  <Text style={styles.acceptedBadgeText}>Accepted</Text>
                </View>

                <View style={styles.requesterHeader}>
                  <IconSymbol 
                    ios_icon_name="person.circle.fill" 
                    android_material_icon_name="account-circle" 
                    size={40} 
                    color={colors.primary} 
                  />
                  <View style={styles.requesterInfo}>
                    <Text style={styles.requesterName}>{request.requester.name}</Text>
                    <Text style={styles.itemText}>{request.itemDescription}</Text>
                  </View>
                </View>

                <View style={styles.acceptedAmount}>
                  <Text style={styles.acceptedAmountLabel}>Amount</Text>
                  <Text style={styles.acceptedAmountValue}>
                    ${request.counterOffer || request.offeredAmount}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => {
                    console.log('Contact button pressed for:', request.requester.name);
                    Alert.alert('Contact', `Message ${request.requester.name}`);
                  }}
                  activeOpacity={0.7}
                >
                  <IconSymbol 
                    ios_icon_name="message.fill" 
                    android_material_icon_name="message" 
                    size={16} 
                    color={colors.primary} 
                  />
                  <Text style={styles.contactButtonText}>Message {request.requester.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {pendingRequests.length === 0 && acceptedRequests.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol 
              ios_icon_name="tray" 
              android_material_icon_name="inbox" 
              size={64} 
              color={colors.textSecondary} 
            />
            <Text style={styles.emptyTitle}>No Requests Yet</Text>
            <Text style={styles.emptyText}>
              When requesters find your trip, their requests will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
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
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  tripCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  routeContainer: {
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginVertical: 4,
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
    marginVertical: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailBox: {
    flex: 1,
    backgroundColor: colors.highlight,
    borderRadius: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countBadgeSuccess: {
    backgroundColor: colors.success,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  requestCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  acceptedCard: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  acceptedBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
  },
  requesterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  requesterInfo: {
    flex: 1,
  },
  requesterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  requesterName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  requesterStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requesterRating: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  requesterDeliveries: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  itemDetails: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    fontSize: 14,
    color: colors.text,
  },
  locationsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  locationDetail: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
  },
  locationDetailLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  locationDetailText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  offerContainer: {
    marginBottom: 16,
  },
  offerBox: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  offerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  offerAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  declineButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.error,
    minHeight: 52,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  acceptedAmount: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  acceptedAmountLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  acceptedAmountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.success,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
});
