
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function TripDetailsScreen() {
  const router = useRouter();
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [counterOfferAmount, setCounterOfferAmount] = useState('');
  const [counterOfferMessage, setCounterOfferMessage] = useState('');

  // Mock trip data
  const trip = {
    from: 'New York, USA',
    to: 'London, UK',
    date: '2024-02-15',
    time: '10:00 AM',
    weight: '5 kg',
    suggestedPrice: '$50',
    status: 'active',
    description: 'Flying to London for a business conference. Happy to help carry documents or small items. Our Centre representative will meet me at the destination to collect the items.',
    meetingPoints: {
      pickup: 'JFK Airport, Terminal 4 - International Departures',
      handover: 'Heathrow Airport, Terminal 5 - Arrivals Hall (Centre representative will meet here)',
    },
  };

  const [requests, setRequests] = useState([
    {
      id: '1',
      requester: 'Mike Chen',
      item: 'Business Documents',
      weight: '0.5 kg',
      status: 'pending',
      message: 'Urgent business papers that need to arrive by Feb 16th. I will hand them to you at JFK.',
      offeredAmount: '$25',
      hasCounterOffer: false,
    },
    {
      id: '2',
      requester: 'Emma Wilson',
      item: 'Small Package',
      weight: '1.2 kg',
      status: 'pending',
      message: 'Gift for my colleague at the Centre. Can you help carry it?',
      offeredAmount: '$30',
      hasCounterOffer: false,
    },
    {
      id: '3',
      requester: 'David Lee',
      item: 'Legal Documents',
      weight: '0.8 kg',
      status: 'accepted',
      message: 'Important contracts that need to reach our Centre office',
      offeredAmount: '$20',
      agreedAmount: '$20',
      hasCounterOffer: false,
    },
    {
      id: '4',
      requester: 'Lisa Brown',
      item: 'Medical Documents',
      weight: '0.3 kg',
      status: 'negotiating',
      message: 'Medical records needed urgently at the Centre',
      offeredAmount: '$15',
      counterOfferedAmount: '$22',
      hasCounterOffer: true,
    },
  ]);

  const handleAcceptRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    Alert.alert(
      'Accept Request',
      `Accept carry request from ${request.requester}?\n\nOffered amount: ${request.offeredAmount}\n\nYou will receive the item from ${request.requester} at pickup, carry it to the destination, and hand it over to our Centre representative.\n\nThe requester will be notified to proceed with payment.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => {
            // Update request status
            setRequests(prevRequests =>
              prevRequests.map(r =>
                r.id === requestId ? { ...r, status: 'accepted', agreedAmount: r.offeredAmount } : r
              )
            );

            // Send payment notification to requester
            sendPaymentNotification(request, request.offeredAmount);

            // Show success message
            Alert.alert(
              'Request Accepted',
              `You have accepted ${request.requester}&apos;s request.\n\nA payment notification has been sent to ${request.requester} for ${request.offeredAmount}.\n\nRemember: You will collect the item at pickup and hand it over to our Centre representative at the destination.`,
              [{ text: 'OK' }]
            );

            console.log(`Request ${requestId} accepted. Payment notification sent to ${request.requester} for ${request.offeredAmount}`);
          },
        },
      ]
    );
  };

  const handleDeclineRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    Alert.alert(
      'Decline Request',
      `Are you sure you want to decline ${request.requester}&apos;s request?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            // Remove request from list
            setRequests(prevRequests =>
              prevRequests.filter(r => r.id !== requestId)
            );

            Alert.alert(
              'Request Declined',
              `You have declined ${request.requester}&apos;s request.`,
              [{ text: 'OK' }]
            );

            console.log(`Request ${requestId} declined`);
          },
        },
      ]
    );
  };

  const handleCounterOffer = (request: any) => {
    setSelectedRequest(request);
    setCounterOfferAmount('');
    setCounterOfferMessage('');
    setShowCounterOfferModal(true);
  };

  const handleSubmitCounterOffer = () => {
    if (!counterOfferAmount.trim()) {
      Alert.alert('Missing Information', 'Please enter your counter offer amount.');
      return;
    }

    const amount = parseFloat(counterOfferAmount);
    const originalAmount = parseFloat(selectedRequest.offeredAmount.replace('$', ''));

    if (amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    // Close modal
    setShowCounterOfferModal(false);

    // Update request with counter offer
    setRequests(prevRequests =>
      prevRequests.map(r =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: 'negotiating',
              counterOfferedAmount: `$${amount}`,
              hasCounterOffer: true,
            }
          : r
      )
    );

    // Show success message
    Alert.alert(
      'Counter Offer Sent',
      `Your counter offer of $${amount} has been sent to ${selectedRequest.requester}.\n\nThey will be notified and can accept or make another offer.`,
      [{ text: 'OK' }]
    );

    console.log('Counter offer sent:', {
      requestId: selectedRequest.id,
      requester: selectedRequest.requester,
      originalOffer: selectedRequest.offeredAmount,
      counterOffer: `$${amount}`,
      message: counterOfferMessage,
    });
  };

  const sendPaymentNotification = (request: any, amount: string) => {
    // This function would integrate with your notification system
    const notification = {
      type: 'payment_request',
      recipient: request.requester,
      title: 'Payment Required',
      message: `Your carry request has been accepted! Please proceed with payment of ${amount}.`,
      amount: amount,
      item: request.item,
      timestamp: new Date().toISOString(),
    };

    console.log('Payment notification sent:', notification);
  };

  const handleMessageRequester = (requesterId: string) => {
    console.log(`Opening chat with requester: ${requesterId}`);
    router.push(`/chat/${requesterId}`);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'accepted':
        return styles.statusAccepted;
      case 'negotiating':
        return styles.statusNegotiating;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'negotiating':
        return 'Negotiating';
      default:
        return 'Pending';
    }
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
        <Text style={styles.headerTitle}>Trip Details</Text>
        <TouchableOpacity style={styles.editButton}>
          <IconSymbol 
            ios_icon_name="pencil" 
            android_material_icon_name="edit" 
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
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, styles.statusActive]}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={16} 
              color="#FFFFFF" 
            />
            <Text style={styles.statusText}>Active Trip</Text>
          </View>
        </View>

        {/* Trip Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trip Information</Text>
          
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
                ios_icon_name="airplane.arrival" 
                android_material_icon_name="flight-land" 
                size={20} 
                color={colors.primary} 
              />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>To</Text>
                <Text style={styles.locationText}>{trip.to}</Text>
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
              <Text style={styles.detailValue}>{trip.weight}</Text>
            </View>
            <View style={styles.detailBox}>
              <IconSymbol 
                ios_icon_name="dollarsign.circle" 
                android_material_icon_name="attach-money" 
                size={18} 
                color={colors.primary} 
              />
              <Text style={styles.detailLabel}>Suggested Fee</Text>
              <Text style={styles.detailValue}>{trip.suggestedPrice}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{trip.description}</Text>
          </View>
        </View>

        {/* Handover Process */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Handover Process</Text>
          <View style={styles.processNotice}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={18} 
              color={colors.secondary} 
            />
            <Text style={styles.processNoticeText}>
              You will collect items from requesters at pickup, carry them to the destination, and hand them over to our Centre representative.
            </Text>
          </View>
          <View style={styles.meetingPoint}>
            <IconSymbol 
              ios_icon_name="mappin.circle.fill" 
              android_material_icon_name="place" 
              size={20} 
              color={colors.secondary} 
            />
            <View style={styles.meetingInfo}>
              <Text style={styles.meetingLabel}>Pickup Point (Requester → You)</Text>
              <Text style={styles.meetingText}>{trip.meetingPoints.pickup}</Text>
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
              <Text style={styles.meetingLabel}>Handover Point (You → Centre Rep)</Text>
              <Text style={styles.meetingText}>{trip.meetingPoints.handover}</Text>
            </View>
          </View>
        </View>

        {/* Carry Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carry Requests ({requests.length})</Text>
          {requests.map((request, index) => (
            <React.Fragment key={index}>
              <View style={styles.requestCard}>
                {/* Request Header */}
                <View style={styles.requestHeader}>
                  <IconSymbol 
                    ios_icon_name="person.circle.fill" 
                    android_material_icon_name="account-circle" 
                    size={40} 
                    color={colors.primary} 
                  />
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestSender}>{request.requester}</Text>
                    <Text style={styles.requestItem}>{request.item}</Text>
                  </View>
                  <View style={getStatusBadgeStyle(request.status)}>
                    <Text style={styles.requestStatusText}>
                      {getStatusText(request.status)}
                    </Text>
                  </View>
                </View>

                {/* Request Details */}
                <View style={styles.requestDetails}>
                  <View style={styles.requestDetailItem}>
                    <IconSymbol 
                      ios_icon_name="scalemass" 
                      android_material_icon_name="scale" 
                      size={14} 
                      color={colors.textSecondary} 
                    />
                    <Text style={styles.requestDetailText}>{request.weight}</Text>
                  </View>
                  <View style={styles.requestDetailItem}>
                    <IconSymbol 
                      ios_icon_name="dollarsign.circle" 
                      android_material_icon_name="attach-money" 
                      size={14} 
                      color={colors.textSecondary} 
                    />
                    <Text style={styles.requestDetailText}>Offered: {request.offeredAmount}</Text>
                  </View>
                </View>

                {/* Counter Offer Info */}
                {request.hasCounterOffer && request.counterOfferedAmount && (
                  <View style={styles.counterOfferBadge}>
                    <IconSymbol 
                      ios_icon_name="arrow.left.arrow.right" 
                      android_material_icon_name="swap-horiz" 
                      size={14} 
                      color={colors.warning} 
                    />
                    <Text style={styles.counterOfferText}>
                      Your counter offer: {request.counterOfferedAmount}
                    </Text>
                  </View>
                )}

                {/* Message */}
                <Text style={styles.requestMessage}>{request.message}</Text>

                {/* Actions */}
                {request.status === 'pending' && (
                  <View style={styles.requestActions}>
                    <TouchableOpacity 
                      style={styles.acceptButton} 
                      activeOpacity={0.8}
                      onPress={() => handleAcceptRequest(request.id)}
                    >
                      <IconSymbol 
                        ios_icon_name="checkmark" 
                        android_material_icon_name="check" 
                        size={18} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.counterOfferButton} 
                      activeOpacity={0.8}
                      onPress={() => handleCounterOffer(request)}
                    >
                      <IconSymbol 
                        ios_icon_name="arrow.left.arrow.right" 
                        android_material_icon_name="swap-horiz" 
                        size={18} 
                        color={colors.warning} 
                      />
                      <Text style={styles.counterOfferButtonText}>Counter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.declineButton} 
                      activeOpacity={0.8}
                      onPress={() => handleDeclineRequest(request.id)}
                    >
                      <IconSymbol 
                        ios_icon_name="xmark" 
                        android_material_icon_name="close" 
                        size={18} 
                        color={colors.error} 
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {request.status === 'negotiating' && (
                  <View style={styles.negotiatingContainer}>
                    <View style={styles.negotiatingNotice}>
                      <IconSymbol 
                        ios_icon_name="clock.fill" 
                        android_material_icon_name="schedule" 
                        size={16} 
                        color={colors.warning} 
                      />
                      <Text style={styles.negotiatingNoticeText}>
                        Waiting for {request.requester} to respond to your counter offer
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.messageButton} 
                      activeOpacity={0.8}
                      onPress={() => handleMessageRequester(request.id)}
                    >
                      <IconSymbol 
                        ios_icon_name="message.fill" 
                        android_material_icon_name="message" 
                        size={18} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {request.status === 'accepted' && (
                  <View style={styles.acceptedContainer}>
                    <View style={styles.paymentNotice}>
                      <IconSymbol 
                        ios_icon_name="info.circle.fill" 
                        android_material_icon_name="info" 
                        size={16} 
                        color={colors.secondary} 
                      />
                      <Text style={styles.paymentNoticeText}>
                        Payment notification sent to {request.requester} for {request.agreedAmount}. You will collect the item at pickup and hand it over to our Centre representative at the destination.
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.messageButton} 
                      activeOpacity={0.8}
                      onPress={() => handleMessageRequester(request.id)}
                    >
                      <IconSymbol 
                        ios_icon_name="message.fill" 
                        android_material_icon_name="message" 
                        size={18} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </React.Fragment>
          ))}
        </View>
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
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Counter Offer</Text>
              <TouchableOpacity 
                onPress={() => setShowCounterOfferModal(false)}
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
              {selectedRequest && (
                <>
                  {/* Request Info */}
                  <View style={styles.modalRequestInfo}>
                    <IconSymbol 
                      ios_icon_name="person.circle.fill" 
                      android_material_icon_name="account-circle" 
                      size={40} 
                      color={colors.primary} 
                    />
                    <View style={styles.modalRequestDetails}>
                      <Text style={styles.modalRequestSender}>{selectedRequest.requester}</Text>
                      <Text style={styles.modalRequestItem}>{selectedRequest.item} • {selectedRequest.weight}</Text>
                    </View>
                  </View>

                  {/* Original Offer */}
                  <View style={styles.originalOfferCard}>
                    <Text style={styles.originalOfferLabel}>Their Offer</Text>
                    <Text style={styles.originalOfferAmount}>{selectedRequest.offeredAmount}</Text>
                  </View>

                  {/* Counter Offer Input */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Your Counter Offer ($) *</Text>
                    <View style={styles.offerInputContainer}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.offerInput}
                        placeholder="Enter your counter offer"
                        placeholderTextColor={colors.textSecondary}
                        value={counterOfferAmount}
                        onChangeText={setCounterOfferAmount}
                        keyboardType="decimal-pad"
                      />
                    </View>
                    <Text style={styles.helperText}>
                      Suggest a fair fee that works for both parties
                    </Text>
                  </View>

                  {/* Optional Message */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Message (Optional)</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Explain your counter offer..."
                      placeholderTextColor={colors.textSecondary}
                      value={counterOfferMessage}
                      onChangeText={setCounterOfferMessage}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCounterOfferModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitCounterOffer}
              >
                <Text style={styles.submitButtonText}>Send Counter Offer</Text>
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
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
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
    marginBottom: 16,
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
  descriptionContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  processNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.highlight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  processNoticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
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
    fontWeight: '600',
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  requestCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestSender: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  requestItem: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  requestStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAccepted: {
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusNegotiating: {
    backgroundColor: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requestStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  requestDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  requestDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestDetailText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  counterOfferBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.warning}15`,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: `${colors.warning}40`,
  },
  counterOfferText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning,
  },
  requestMessage: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: 12,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  counterOfferButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  counterOfferButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  negotiatingContainer: {
    gap: 8,
  },
  negotiatingNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.warning}15`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: `${colors.warning}40`,
  },
  negotiatingNoticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  acceptedContainer: {
    gap: 8,
  },
  paymentNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
  },
  paymentNoticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 12,
  },
  messageButtonText: {
    fontSize: 14,
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
    maxHeight: '75%',
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
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  modalRequestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  modalRequestDetails: {
    flex: 1,
  },
  modalRequestSender: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  modalRequestItem: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  originalOfferCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  originalOfferLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  originalOfferAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
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
    minHeight: 80,
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
    backgroundColor: colors.warning,
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
