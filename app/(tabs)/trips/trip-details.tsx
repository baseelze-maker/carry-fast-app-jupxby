
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function TripDetailsScreen() {
  const router = useRouter();

  // Mock trip data
  const trip = {
    from: 'New York, USA',
    to: 'London, UK',
    date: '2024-02-15',
    time: '10:00 AM',
    weight: '5 kg',
    price: '$50',
    status: 'active',
    description: 'Flying to London for a business conference. Happy to help deliver documents or small items.',
    meetingPoints: {
      pickup: 'JFK Airport, Terminal 4',
      delivery: 'Heathrow Airport, Terminal 5',
    },
  };

  const [requests, setRequests] = useState([
    {
      id: '1',
      sender: 'Mike Chen',
      item: 'Business Documents',
      weight: '0.5 kg',
      status: 'pending',
      message: 'Urgent business papers that need to arrive by Feb 16th',
      agreedPrice: '$25',
    },
    {
      id: '2',
      sender: 'Emma Wilson',
      item: 'Small Package',
      weight: '1.2 kg',
      status: 'pending',
      message: 'Gift for my sister, can you help?',
      agreedPrice: '$30',
    },
    {
      id: '3',
      sender: 'David Lee',
      item: 'Legal Documents',
      weight: '0.8 kg',
      status: 'accepted',
      message: 'Important contracts for my client',
      agreedPrice: '$20',
    },
  ]);

  const handleAcceptRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    Alert.alert(
      'Accept Request',
      `Accept delivery request from ${request.sender}?\n\nAgreed amount: ${request.agreedPrice}\n\nThe sender will be notified to proceed with payment.`,
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
                r.id === requestId ? { ...r, status: 'accepted' } : r
              )
            );

            // Send payment notification to sender
            sendPaymentNotification(request);

            // Show success message
            Alert.alert(
              'Request Accepted',
              `You have accepted ${request.sender}'s request.\n\nA payment notification has been sent to ${request.sender} for ${request.agreedPrice}.`,
              [{ text: 'OK' }]
            );

            console.log(`Request ${requestId} accepted. Payment notification sent to ${request.sender} for ${request.agreedPrice}`);
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
      `Are you sure you want to decline ${request.sender}'s request?`,
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
              `You have declined ${request.sender}'s request.`,
              [{ text: 'OK' }]
            );

            console.log(`Request ${requestId} declined`);
          },
        },
      ]
    );
  };

  const sendPaymentNotification = (request: any) => {
    // This function would integrate with your notification system
    // For now, we'll just log it
    const notification = {
      type: 'payment_request',
      recipient: request.sender,
      title: 'Payment Required',
      message: `Your delivery request has been accepted! Please proceed with payment of ${request.agreedPrice}.`,
      amount: request.agreedPrice,
      item: request.item,
      timestamp: new Date().toISOString(),
    };

    console.log('Payment notification sent:', notification);

    // In a real app, this would:
    // 1. Send a push notification to the sender
    // 2. Create a notification entry in the database
    // 3. Send an email/SMS reminder
    // 4. Update the request status to 'awaiting_payment'
  };

  const handleMessageSender = (senderId: string) => {
    console.log(`Opening chat with sender: ${senderId}`);
    router.push(`/chat/${senderId}`);
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
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>{trip.price}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{trip.description}</Text>
          </View>
        </View>

        {/* Meeting Points */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meeting Points</Text>
          <View style={styles.meetingPoint}>
            <IconSymbol 
              ios_icon_name="mappin.circle.fill" 
              android_material_icon_name="place" 
              size={20} 
              color={colors.secondary} 
            />
            <View style={styles.meetingInfo}>
              <Text style={styles.meetingLabel}>Pickup</Text>
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
              <Text style={styles.meetingLabel}>Delivery</Text>
              <Text style={styles.meetingText}>{trip.meetingPoints.delivery}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Requests ({requests.length})</Text>
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
                    <Text style={styles.requestSender}>{request.sender}</Text>
                    <Text style={styles.requestItem}>{request.item}</Text>
                  </View>
                  <View style={[
                    styles.requestStatusBadge,
                    request.status === 'accepted' ? styles.statusAccepted : styles.statusPending
                  ]}>
                    <Text style={styles.requestStatusText}>
                      {request.status === 'accepted' ? 'Accepted' : 'Pending'}
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
                    <Text style={styles.requestDetailText}>{request.agreedPrice}</Text>
                  </View>
                </View>

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
                      <Text style={styles.declineButtonText}>Decline</Text>
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
                        Payment notification sent to {request.sender}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.messageButton} 
                      activeOpacity={0.8}
                      onPress={() => handleMessageSender(request.id)}
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
  },
  statusPending: {
    backgroundColor: colors.accent,
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
    flex: 1,
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
  acceptedContainer: {
    gap: 8,
  },
  paymentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
