
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import * as Haptics from "expo-haptics";

// Empty arrays - ready for you to add your own trips and requests
const mockMyTrips: any[] = [];

const mockMyRequests: any[] = [];

export default function TripsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'trips' | 'requests'>('trips');

  const handleViewTripDetails = (tripId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Opening trip details for trip ID:', tripId);
    router.push({
      pathname: '/(tabs)/trips/trip-details',
      params: { id: tripId, type: 'trip' }
    });
  };

  const handleViewRequestDetails = (requestId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Opening request details for request ID:', requestId);
    router.push({
      pathname: '/(tabs)/trips/trip-details',
      params: { id: requestId, type: 'request' }
    });
  };

  const handlePayment = (request: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Opening payment for:', request.id);
    router.push({
      pathname: '/payment',
      params: {
        amount: request.amount,
        travelerName: request.traveler,
      },
    });
  };

  const handleCancelRequest = (requestId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    console.log('Canceling request:', requestId);
    // In a real app, you would show a confirmation dialog and then cancel the request
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Activity</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trips' && styles.activeTab]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab('trips');
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'trips' && styles.activeTabText]}>
            My Trips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab('requests');
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            My Requests
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'trips' ? (
          <View style={styles.section}>
            {mockMyTrips.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol 
                  ios_icon_name="airplane" 
                  android_material_icon_name="flight" 
                  size={64} 
                  color={colors.textSecondary} 
                />
                <Text style={styles.emptyStateTitle}>No Trips Yet</Text>
                <Text style={styles.emptyStateText}>
                  Post your first trip to start connecting with people who need to send items to your destination.
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/(tabs)/(home)/post-trip');
                  }}
                  activeOpacity={0.8}
                >
                  <IconSymbol 
                    ios_icon_name="plus.circle.fill" 
                    android_material_icon_name="add-circle" 
                    size={20} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.emptyStateButtonText}>Post a Trip</Text>
                </TouchableOpacity>
              </View>
            ) : (
              mockMyTrips.map((trip, index) => (
                <React.Fragment key={index}>
                  <View style={styles.card}>
                    {/* Status Badge */}
                    <View style={[
                      styles.statusBadge,
                      trip.status === 'active' ? styles.statusActive : styles.statusCompleted
                    ]}>
                      <Text style={styles.statusText}>
                        {trip.status === 'active' ? 'Active' : 'Completed'}
                      </Text>
                    </View>

                    {/* Route */}
                    <View style={styles.routeContainer}>
                      <View style={styles.locationRow}>
                        <IconSymbol 
                          ios_icon_name="airplane.departure" 
                          android_material_icon_name="flight-takeoff" 
                          size={18} 
                          color={colors.secondary} 
                        />
                        <Text style={styles.locationText}>{trip.from}</Text>
                      </View>
                      <View style={styles.routeLine} />
                      <View style={styles.locationRow}>
                        <IconSymbol 
                          ios_icon_name="airplane.arrival" 
                          android_material_icon_name="flight-land" 
                          size={18} 
                          color={colors.primary} 
                        />
                        <Text style={styles.locationText}>{trip.to}</Text>
                      </View>
                    </View>

                    {/* Details */}
                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <IconSymbol 
                          ios_icon_name="calendar" 
                          android_material_icon_name="calendar-today" 
                          size={14} 
                          color={colors.textSecondary} 
                        />
                        <Text style={styles.detailText}>{trip.date}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <IconSymbol 
                          ios_icon_name="scalemass" 
                          android_material_icon_name="scale" 
                          size={14} 
                          color={colors.textSecondary} 
                        />
                        <Text style={styles.detailText}>{trip.weight}</Text>
                      </View>
                    </View>

                    {/* Requests */}
                    {trip.status === 'active' && trip.requests > 0 && (
                      <View style={styles.requestsContainer}>
                        <IconSymbol 
                          ios_icon_name="envelope.badge" 
                          android_material_icon_name="mail" 
                          size={16} 
                          color={colors.accent} 
                        />
                        <Text style={styles.requestsText}>
                          {trip.requests} new request{trip.requests > 1 ? 's' : ''}
                        </Text>
                      </View>
                    )}

                    {/* Actions */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity 
                        style={styles.actionButton} 
                        activeOpacity={0.7}
                        onPress={() => handleViewTripDetails(trip.id)}
                      >
                        <Text style={styles.actionButtonText}>View Details</Text>
                      </TouchableOpacity>
                      {trip.status === 'active' && (
                        <TouchableOpacity style={styles.actionButtonSecondary} activeOpacity={0.7}>
                          <Text style={styles.actionButtonSecondaryText}>Edit</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </React.Fragment>
              ))
            )}
          </View>
        ) : (
          <View style={styles.section}>
            {mockMyRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol 
                  ios_icon_name="shippingbox" 
                  android_material_icon_name="local-shipping" 
                  size={64} 
                  color={colors.textSecondary} 
                />
                <Text style={styles.emptyStateTitle}>No Requests Yet</Text>
                <Text style={styles.emptyStateText}>
                  Search for travelers going to your destination and send them a delivery request.
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/(tabs)/search');
                  }}
                  activeOpacity={0.8}
                >
                  <IconSymbol 
                    ios_icon_name="magnifyingglass" 
                    android_material_icon_name="search" 
                    size={20} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.emptyStateButtonText}>Search Travelers</Text>
                </TouchableOpacity>
              </View>
            ) : (
              mockMyRequests.map((request, index) => (
                <React.Fragment key={index}>
                  <View style={styles.card}>
                    {/* Status Badge */}
                    <View style={[
                      styles.statusBadge,
                      request.status === 'accepted' ? styles.statusAccepted : styles.statusPending
                    ]}>
                      <Text style={styles.statusText}>
                        {request.status === 'accepted' ? 'Accepted - Pay Now' : 'Pending'}
                      </Text>
                    </View>

                    {/* Traveler Info */}
                    <View style={styles.travelerRow}>
                      <IconSymbol 
                        ios_icon_name="person.circle.fill" 
                        android_material_icon_name="account-circle" 
                        size={40} 
                        color={colors.primary} 
                      />
                      <View style={styles.travelerInfo}>
                        <Text style={styles.travelerLabel}>Traveler</Text>
                        <Text style={styles.travelerName}>{request.traveler}</Text>
                      </View>
                    </View>

                    {/* Route */}
                    <View style={styles.routeContainer}>
                      <View style={styles.locationRow}>
                        <IconSymbol 
                          ios_icon_name="airplane.departure" 
                          android_material_icon_name="flight-takeoff" 
                          size={18} 
                          color={colors.secondary} 
                        />
                        <Text style={styles.locationText}>{request.from}</Text>
                      </View>
                      <View style={styles.routeLine} />
                      <View style={styles.locationRow}>
                        <IconSymbol 
                          ios_icon_name="airplane.arrival" 
                          android_material_icon_name="flight-land" 
                          size={18} 
                          color={colors.primary} 
                        />
                        <Text style={styles.locationText}>{request.to}</Text>
                      </View>
                    </View>

                    {/* Date & Amount */}
                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <IconSymbol 
                          ios_icon_name="calendar" 
                          android_material_icon_name="calendar-today" 
                          size={14} 
                          color={colors.textSecondary} 
                        />
                        <Text style={styles.detailText}>{request.date}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <IconSymbol 
                          ios_icon_name="dollarsign.circle" 
                          android_material_icon_name="attach-money" 
                          size={14} 
                          color={colors.textSecondary} 
                        />
                        <Text style={styles.detailText}>${request.amount}</Text>
                      </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionsRow}>
                      {request.status === 'accepted' ? (
                        <TouchableOpacity 
                          style={styles.payButton} 
                          activeOpacity={0.7}
                          onPress={() => handlePayment(request)}
                        >
                          <IconSymbol 
                            ios_icon_name="creditcard.fill" 
                            android_material_icon_name="payment" 
                            size={18} 
                            color="#FFFFFF" 
                          />
                          <Text style={styles.payButtonText}>Pay ${request.amount}</Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TouchableOpacity 
                            style={styles.actionButton} 
                            activeOpacity={0.7}
                            onPress={() => handleViewRequestDetails(request.id)}
                          >
                            <Text style={styles.actionButtonText}>View Details</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.actionButtonDanger} 
                            activeOpacity={0.7}
                            onPress={() => handleCancelRequest(request.id)}
                          >
                            <Text style={styles.actionButtonDangerText}>Cancel</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                </React.Fragment>
              ))
            )}
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  section: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: '0px 4px 12px rgba(76, 175, 80, 0.3)',
    elevation: 4,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusActive: {
    backgroundColor: colors.primary,
  },
  statusCompleted: {
    backgroundColor: colors.textSecondary,
  },
  statusAccepted: {
    backgroundColor: colors.success,
  },
  statusPending: {
    backgroundColor: colors.accent,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  routeContainer: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  locationText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  requestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.highlight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  requestsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  travelerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  travelerInfo: {
    flex: 1,
  },
  travelerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  travelerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actionButtonDanger: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  actionButtonDangerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  payButton: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
