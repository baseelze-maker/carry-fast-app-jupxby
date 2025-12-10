
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Modal } from "react-native";
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
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [counterOfferAmount, setCounterOfferAmount] = useState('');

  const handleAcceptRequest = (request: any) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Alert.alert(
      'Accept Request',
      `Accept ${request.requester.name}'s request for $${request.counterOffer || request.offeredAmount}?\n\nThe requester will be notified to proceed with payment.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => {
            console.log('Accepting request:', request.id);
            // Update request status
            setTrip(prevTrip => ({
              ...prevTrip,
              requests: prevTrip.requests.map(r =>
                r.id === request.id ? { ...r, status: 'accepted' } : r
              ),
              availableWeight: prevTrip.availableWeight - request.weight,
            }));
            
            Alert.alert(
              'Request Accepted!',
              `${request.requester.name} has been notified to proceed with payment of $${request.counterOffer || request.offeredAmount}.`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const handleDeclineRequest = (request: any) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    Alert.alert(
      'Decline Request',
      `Are you sure you want to decline ${request.requester.name}'s request?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            console.log('Declining request:', request.id);
            setTrip(prevTrip => ({
              ...prevTrip,
              requests: prevTrip.requests.filter(r => r.id !== request.id),
            }));
            
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

  const handleSendCounterOffer = (request: any) => {
    setSelectedRequest(request);
    setCounterOfferAmount(request.offeredAmount.toString());
    setShowCounterOfferModal(true);
  };

  const submitCounterOffer = () => {
    if (!counterOfferAmount || parseFloat(counterOfferAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid counter offer amount.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    console.log('Sending counter offer:', counterOfferAmount);
    setTrip(prevTrip => ({
      ...prevTrip,
      requests: prevTrip.requests.map(r =>
        r.id === selectedRequest.id
          ? { ...r, counterOffer: parseFloat(counterOfferAmount) }
          : r
      ),
    }));
    
    setShowCounterOfferModal(false);
    setSelectedRequest(null);
    setCounterOfferAmount('');
    
    Alert.alert(
      'Counter Offer Sent!',
      `Your counter offer of $${counterOfferAmount} has been sent to ${selectedRequest.requester.name}.`,
      [{ text: 'OK' }]
    );
  };

  const handleViewRequesterProfile = (requester: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Viewing requester profile:', requester.name);
    // In a real app, navigate to requester profile
  };

  const handleContactRequester = (requester: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Contacting requester:', requester.name);
    router.push(`/chat/${requester.name}`);
  };

  const pendingRequests = trip.requests.filter(r => r.status === 'pending');
  const acceptedRequests = trip.requests.filter(r => r.status === 'accepted');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                <Text style={styles.locationLabel}>First Stop</Text>
                <Text style={styles.locationText}>{trip.to}</Text>
                {trip.canDeliverAtFirstDestination && (
                  <View style={styles.deliveryBadge}>
                    <Text style={styles.deliveryBadgeText}>Can deliver here</Text>
                  </View>
                )}
              </View>
            </View>
            {trip.finalDestination !== trip.to && (
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
                    <Text style={styles.locationText}>{trip.finalDestination}</Text>
                  </View>
                </View>
              </>
            )}
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
              <React.Fragment key={index}>
                <View style={styles.requestCard}>
                  {/* Requester Info */}
                  <TouchableOpacity 
                    style={styles.requesterHeader}
                    onPress={() => handleViewRequesterProfile(request.requester)}
                    activeOpacity={0.7}
                  >
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
                    <IconSymbol 
                      ios_icon_name="chevron.right" 
                      android_material_icon_name="chevron-right" 
                      size={20} 
                      color={colors.textSecondary} 
                    />
                  </TouchableOpacity>

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
                        {request.counterOffer ? 'Your Counter Offer' : 'Offered Amount'}
                      </Text>
                      <Text style={styles.offerAmount}>
                        ${request.counterOffer || request.offeredAmount}
                      </Text>
                    </View>
                    {request.counterOffer && (
                      <View style={styles.originalOfferBox}>
                        <Text style={styles.originalOfferLabel}>Original Offer</Text>
                        <Text style={styles.originalOfferAmount}>${request.offeredAmount}</Text>
                      </View>
                    )}
                  </View>

                  {/* Actions */}
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                      style={styles.acceptButton}
                      onPress={() => handleAcceptRequest(request)}
                      activeOpacity={0.8}
                    >
                      <IconSymbol 
                        ios_icon_name="checkmark.circle.fill" 
                        android_material_icon_name="check-circle" 
                        size={20} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    
                    {!request.counterOffer && (
                      <TouchableOpacity 
                        style={styles.counterButton}
                        onPress={() => handleSendCounterOffer(request)}
                        activeOpacity={0.8}
                      >
                        <IconSymbol 
                          ios_icon_name="arrow.left.arrow.right" 
                          android_material_icon_name="swap-horiz" 
                          size={20} 
                          color={colors.primary} 
                        />
                        <Text style={styles.counterButtonText}>Counter</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.declineButton}
                      onPress={() => handleDeclineRequest(request)}
                      activeOpacity={0.8}
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

                  {/* Contact Button */}
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => handleContactRequester(request.requester)}
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
              </React.Fragment>
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
              <React.Fragment key={index}>
                <View style={[styles.requestCard, styles.acceptedCard]}>
                  <View style={styles.acceptedBadge}>
                    <IconSymbol 
                      ios_icon_name="checkmark.circle.fill" 
                      android_material_icon_name="check-circle" 
                      size={16} 
                      color={colors.success} 
                    />
                    <Text style={styles.acceptedBadgeText}>Accepted - Awaiting Payment</Text>
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
                    onPress={() => handleContactRequester(request.requester)}
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
              </React.Fragment>
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

      {/* Counter Offer Modal */}
      <Modal
        visible={showCounterOfferModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCounterOfferModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Counter Offer</Text>
              <TouchableOpacity onPress={() => setShowCounterOfferModal(false)}>
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill" 
                  android_material_icon_name="cancel" 
                  size={28} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            {selectedRequest && (
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>
                  {selectedRequest.requester.name} offered ${selectedRequest.offeredAmount}
                </Text>
                <Text style={styles.modalSubtext}>
                  Enter your counter offer amount:
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.input}
                    value={counterOfferAmount}
                    onChangeText={setCounterOfferAmount}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.modalCancelButton}
                    onPress={() => setShowCounterOfferModal(false)}
                  >
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.modalSubmitButton}
                    onPress={submitCounterOffer}
                  >
                    <Text style={styles.modalSubmitButtonText}>Send Offer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  deliveryBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  deliveryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.card,
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
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  offerBox: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  offerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  offerAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  originalOfferBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  originalOfferLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  originalOfferAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  counterButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  counterButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  declineButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.error,
  },
  declineButtonText: {
    fontSize: 15,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'android' ? 20 : 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  modalSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalSubmitButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
});
