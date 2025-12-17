
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Modal, TextInput } from "react-native";
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAcceptRequest = (request: any) => {
    if (isProcessing) {
      console.log('Already processing a request, please wait');
      return;
    }

    console.log('=== ACCEPT BUTTON PRESSED ===');
    console.log('Request ID:', request.id);
    console.log('Requester:', request.requester.name);
    console.log('Amount:', request.counterOffer || request.offeredAmount);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Alert.alert(
      'Primary Acceptance',
      `Accept ${request.requester.name}'s request for $${request.counterOffer || request.offeredAmount}?\n\nThis is a primary acceptance. ${request.requester.name} will be notified and can then:\n\n1. Pay $5 communication fee to the app\n2. Message you to coordinate pickup\n3. Pay you $${request.counterOffer || request.offeredAmount} for carrying service (cash or card)`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            console.log('Accept cancelled by user');
            setIsProcessing(false);
          },
        },
        {
          text: 'Accept Request',
          onPress: () => {
            setIsProcessing(true);
            console.log('=== PROCESSING ACCEPTANCE ===');
            console.log('Updating request status to primary_accepted');
            console.log('Current available weight:', trip.availableWeight);
            console.log('Request weight:', request.weight);
            console.log('New available weight:', trip.availableWeight - request.weight);
            
            // Update request status to 'primary_accepted'
            setTrip(prevTrip => {
              const updatedTrip = {
                ...prevTrip,
                requests: prevTrip.requests.map(r =>
                  r.id === request.id ? { ...r, status: 'primary_accepted' } : r
                ),
                availableWeight: prevTrip.availableWeight - request.weight,
              };
              console.log('=== TRIP STATE UPDATED ===');
              console.log('Updated trip:', JSON.stringify(updatedTrip, null, 2));
              return updatedTrip;
            });
            
            setTimeout(() => {
              setIsProcessing(false);
              Alert.alert(
                'Request Accepted!',
                `✓ Primary acceptance sent to ${request.requester.name}\n\n${request.requester.name} will now:\n\n1. Pay $5 communication fee to unlock messaging\n2. Coordinate pickup details with you via messages\n3. Pay $${request.counterOffer || request.offeredAmount} carrying service fee (cash or card)\n\nYou'll be notified when they pay the communication fee and messaging is unlocked.`,
                [{ 
                  text: 'OK', 
                  onPress: () => {
                    console.log('=== ACCEPTANCE COMPLETE ===');
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }
                }]
              );
            }, 100);
          },
        },
      ]
    );
  };

  const handleDeclineRequest = (request: any) => {
    if (isProcessing) {
      console.log('Already processing a request, please wait');
      return;
    }

    console.log('=== DECLINE BUTTON PRESSED ===');
    console.log('Request ID:', request.id);
    console.log('Requester:', request.requester.name);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    Alert.alert(
      'Decline Request',
      `Are you sure you want to decline ${request.requester.name}'s request?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            console.log('Decline cancelled by user');
            setIsProcessing(false);
          },
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            setIsProcessing(true);
            console.log('=== PROCESSING DECLINE ===');
            console.log('Removing request from list');
            console.log('Current requests count:', trip.requests.length);
            
            setTrip(prevTrip => {
              const updatedTrip = {
                ...prevTrip,
                requests: prevTrip.requests.filter(r => r.id !== request.id),
              };
              console.log('=== TRIP STATE UPDATED ===');
              console.log('New requests count:', updatedTrip.requests.length);
              console.log('Updated trip:', JSON.stringify(updatedTrip, null, 2));
              return updatedTrip;
            });
            
            setTimeout(() => {
              setIsProcessing(false);
              Alert.alert(
                'Request Declined',
                `${request.requester.name} has been notified.`,
                [{ 
                  text: 'OK', 
                  onPress: () => {
                    console.log('=== DECLINE COMPLETE ===');
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }
                }]
              );
            }, 100);
          },
        },
      ]
    );
  };

  const handleSendCounterOffer = (request: any) => {
    console.log('Counter offer button pressed for request:', request.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      `Your counter offer of $${counterOfferAmount} has been sent to ${selectedRequest.requester.name}.\n\nThey can accept your counter offer or negotiate further.`,
      [{ text: 'OK' }]
    );
  };

  const handleViewRequesterProfile = (requester: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Viewing requester profile:', requester.name);
    // In a real app, navigate to requester profile
  };

  const handleContactRequester = (request: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Contacting requester:', request.requester.name);
    
    // Check if request is in primary_accepted status
    if (request.status === 'primary_accepted') {
      Alert.alert(
        'Messaging Not Yet Available',
        `${request.requester.name} needs to pay the $5 communication fee to the app before messaging is enabled.\n\nThey have been notified of your acceptance and will be prompted to pay the fee to unlock messaging.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    // If status is 'paid' or 'accepted', allow messaging
    router.push(`/chat/${request.id}`);
  };

  const pendingRequests = trip.requests.filter(r => r.status === 'pending');
  const primaryAcceptedRequests = trip.requests.filter(r => r.status === 'primary_accepted');
  const acceptedRequests = trip.requests.filter(r => r.status === 'accepted' || r.status === 'paid');

  console.log('=== RENDER STATE ===');
  console.log('Total requests:', trip.requests.length);
  console.log('Pending requests:', pendingRequests.length);
  console.log('Primary accepted requests:', primaryAcceptedRequests.length);
  console.log('Accepted requests:', acceptedRequests.length);
  console.log('Available weight:', trip.availableWeight);

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
                      style={[styles.acceptButton, isProcessing && styles.buttonDisabled]}
                      onPress={() => {
                        console.log('=== ACCEPT BUTTON TAPPED ===');
                        handleAcceptRequest(request);
                      }}
                      activeOpacity={0.7}
                      disabled={isProcessing}
                    >
                      <IconSymbol 
                        ios_icon_name="checkmark.circle.fill" 
                        android_material_icon_name="check-circle" 
                        size={20} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.acceptButtonText}>
                        {isProcessing ? 'Processing...' : 'Accept'}
                      </Text>
                    </TouchableOpacity>
                    
                    {!request.counterOffer && (
                      <TouchableOpacity 
                        style={[styles.counterButton, isProcessing && styles.buttonDisabled]}
                        onPress={() => {
                          console.log('=== COUNTER BUTTON TAPPED ===');
                          handleSendCounterOffer(request);
                        }}
                        activeOpacity={0.7}
                        disabled={isProcessing}
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
                      style={[styles.declineButton, isProcessing && styles.buttonDisabled]}
                      onPress={() => {
                        console.log('=== DECLINE BUTTON TAPPED ===');
                        handleDeclineRequest(request);
                      }}
                      activeOpacity={0.7}
                      disabled={isProcessing}
                    >
                      <IconSymbol 
                        ios_icon_name="xmark.circle.fill" 
                        android_material_icon_name="cancel" 
                        size={20} 
                        color={colors.error} 
                      />
                      <Text style={styles.declineButtonText}>
                        {isProcessing ? 'Processing...' : 'Decline'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
        )}

        {/* Primary Accepted Requests Section */}
        {primaryAcceptedRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Awaiting Payment</Text>
              <View style={[styles.countBadge, styles.countBadgeWarning]}>
                <Text style={styles.countBadgeText}>{primaryAcceptedRequests.length}</Text>
              </View>
            </View>

            {primaryAcceptedRequests.map((request, index) => (
              <React.Fragment key={index}>
                <View style={[styles.requestCard, styles.primaryAcceptedCard]}>
                  <View style={styles.primaryAcceptedBadge}>
                    <IconSymbol 
                      ios_icon_name="hourglass" 
                      android_material_icon_name="hourglass-empty" 
                      size={16} 
                      color={colors.warning} 
                    />
                    <Text style={styles.primaryAcceptedBadgeText}>Primary Acceptance Sent</Text>
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

                  <View style={styles.paymentFlowCard}>
                    <Text style={styles.paymentFlowTitle}>Next Steps for {request.requester.name}:</Text>
                    
                    <View style={styles.paymentFlowStep}>
                      <View style={styles.paymentFlowStepNumber}>
                        <Text style={styles.paymentFlowStepNumberText}>1</Text>
                      </View>
                      <View style={styles.paymentFlowStepContent}>
                        <Text style={styles.paymentFlowStepTitle}>Pay Communication Fee</Text>
                        <Text style={styles.paymentFlowStepText}>$5 to app → Unlocks messaging</Text>
                      </View>
                      <IconSymbol 
                        ios_icon_name="hourglass" 
                        android_material_icon_name="hourglass-empty" 
                        size={20} 
                        color={colors.warning} 
                      />
                    </View>

                    <View style={styles.paymentFlowDivider} />

                    <View style={styles.paymentFlowStep}>
                      <View style={[styles.paymentFlowStepNumber, styles.paymentFlowStepNumberInactive]}>
                        <Text style={styles.paymentFlowStepNumberText}>2</Text>
                      </View>
                      <View style={styles.paymentFlowStepContent}>
                        <Text style={styles.paymentFlowStepTitle}>Message & Coordinate</Text>
                        <Text style={styles.paymentFlowStepText}>Discuss pickup details</Text>
                      </View>
                      <IconSymbol 
                        ios_icon_name="lock.fill" 
                        android_material_icon_name="lock" 
                        size={20} 
                        color={colors.textSecondary} 
                      />
                    </View>

                    <View style={styles.paymentFlowDivider} />

                    <View style={styles.paymentFlowStep}>
                      <View style={[styles.paymentFlowStepNumber, styles.paymentFlowStepNumberInactive]}>
                        <Text style={styles.paymentFlowStepNumberText}>3</Text>
                      </View>
                      <View style={styles.paymentFlowStepContent}>
                        <Text style={styles.paymentFlowStepTitle}>Pay Carrying Service Fee</Text>
                        <Text style={styles.paymentFlowStepText}>
                          ${request.counterOffer || request.offeredAmount} to you (cash or card)
                        </Text>
                      </View>
                      <IconSymbol 
                        ios_icon_name="lock.fill" 
                        android_material_icon_name="lock" 
                        size={20} 
                        color={colors.textSecondary} 
                      />
                    </View>
                  </View>

                  <View style={styles.acceptedAmount}>
                    <Text style={styles.acceptedAmountLabel}>Carrying Service Fee</Text>
                    <Text style={styles.acceptedAmountValue}>
                      ${request.counterOffer || request.offeredAmount}
                    </Text>
                  </View>

                  <TouchableOpacity 
                    style={[styles.contactButton, styles.contactButtonDisabled]}
                    onPress={() => handleContactRequester(request)}
                    activeOpacity={0.7}
                  >
                    <IconSymbol 
                      ios_icon_name="lock.fill" 
                      android_material_icon_name="lock" 
                      size={16} 
                      color={colors.textSecondary} 
                    />
                    <Text style={styles.contactButtonTextDisabled}>
                      Messaging Locked (Awaiting Payment)
                    </Text>
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
              <Text style={styles.sectionTitle}>Active Requests</Text>
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
                    <Text style={styles.acceptedBadgeText}>Communication Fee Paid - Messaging Active</Text>
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
                    <Text style={styles.acceptedAmountLabel}>Carrying Service Fee</Text>
                    <Text style={styles.acceptedAmountValue}>
                      ${request.counterOffer || request.offeredAmount}
                    </Text>
                    <Text style={styles.acceptedAmountNote}>
                      To be paid by requester (cash or card)
                    </Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => handleContactRequester(request)}
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
        {pendingRequests.length === 0 && primaryAcceptedRequests.length === 0 && acceptedRequests.length === 0 && (
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
  countBadgeWarning: {
    backgroundColor: colors.warning,
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
  primaryAcceptedCard: {
    borderWidth: 2,
    borderColor: colors.warning,
  },
  acceptedCard: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  primaryAcceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.warning}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  primaryAcceptedBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.warning,
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
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: 14,
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
    padding: 14,
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
    padding: 14,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  paymentFlowCard: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  paymentFlowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  paymentFlowStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentFlowStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentFlowStepNumberInactive: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  paymentFlowStepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  paymentFlowStepContent: {
    flex: 1,
  },
  paymentFlowStepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  paymentFlowStepText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  paymentFlowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
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
  contactButtonDisabled: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  contactButtonTextDisabled: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
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
  acceptedAmountNote: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
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
