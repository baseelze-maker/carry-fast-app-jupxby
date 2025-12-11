
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  sender?: string;
  amount?: string;
  originalAmount?: string;
  counterAmount?: string;
  offeredAmount?: string;
  time: string;
  timestamp: number;
  read: boolean;
  icon: string;
  iconAndroid: string;
  iconColor: string;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'primary_acceptance',
    title: 'Request Accepted!',
    message: 'Sarah Johnson accepted your carry request! Pay $5 communication fee to unlock messaging and coordinate pickup details.',
    sender: 'Sarah Johnson',
    amount: '$25',
    time: '30s ago',
    timestamp: Date.now() - 30000,
    read: false,
    icon: 'checkmark.seal.fill',
    iconAndroid: 'verified',
    iconColor: colors.success,
  },
  {
    id: '2',
    type: 'app_payment_required',
    title: 'Communication Fee Required',
    message: 'Pay $5 communication fee to unlock messaging with Sarah Johnson and discuss your carry request',
    sender: 'Sarah Johnson',
    amount: '$5',
    time: '1m ago',
    timestamp: Date.now() - 60000,
    read: false,
    icon: 'message.badge.fill',
    iconAndroid: 'message',
    iconColor: colors.secondary,
  },
  {
    id: '3',
    type: 'counter_offer',
    title: 'Counter Offer Received',
    message: 'Sarah Johnson sent a counter offer of $35 for your carry request',
    sender: 'Sarah Johnson',
    originalAmount: '$25',
    counterAmount: '$35',
    time: '2m ago',
    timestamp: Date.now() - 120000,
    read: false,
    icon: 'arrow.left.arrow.right',
    iconAndroid: 'swap-horiz',
    iconColor: colors.warning,
  },
  {
    id: '4',
    type: 'traveler_payment_request',
    title: 'Pay Traveler',
    message: 'Your request was accepted! Pay $25 to Sarah Johnson for the carrying service (card or cash)',
    sender: 'Sarah Johnson',
    amount: '$25',
    time: '5m ago',
    timestamp: Date.now() - 300000,
    read: false,
    icon: 'creditcard.fill',
    iconAndroid: 'payment',
    iconColor: colors.primary,
  },
  {
    id: '5',
    type: 'offer_accepted',
    title: 'Offer Accepted',
    message: 'Mike Chen accepted your offer of $30. Please proceed with payment.',
    sender: 'Mike Chen',
    amount: '$30',
    time: '15m ago',
    timestamp: Date.now() - 900000,
    read: false,
    icon: 'checkmark.circle.fill',
    iconAndroid: 'check-circle',
    iconColor: colors.success,
  },
  {
    id: '6',
    type: 'request',
    title: 'New Carry Request',
    message: 'Mike Chen wants you to carry an item on your trip to London. Offered amount: $25',
    offeredAmount: '$25',
    time: '20m ago',
    timestamp: Date.now() - 1200000,
    read: false,
    icon: 'shippingbox',
    iconAndroid: 'inventory',
    iconColor: colors.secondary,
  },
  {
    id: '7',
    type: 'message',
    title: 'New Message',
    message: 'Sarah Johnson: "Sure, I can carry that for you!"',
    time: '1h ago',
    timestamp: Date.now() - 3600000,
    read: false,
    icon: 'message.fill',
    iconAndroid: 'message',
    iconColor: colors.primary,
  },
  {
    id: '8',
    type: 'accepted',
    title: 'Request Accepted',
    message: 'Emma Wilson accepted your carry request for $30',
    amount: '$30',
    time: '3h ago',
    timestamp: Date.now() - 10800000,
    read: true,
    icon: 'checkmark.circle.fill',
    iconAndroid: 'check-circle',
    iconColor: colors.success,
  },
  {
    id: '9',
    type: 'traveler_payment_request',
    title: 'Pay Traveler',
    message: 'David Lee accepted your request. Pay $20 for the carrying service.',
    sender: 'David Lee',
    amount: '$20',
    time: '5h ago',
    timestamp: Date.now() - 18000000,
    read: true,
    icon: 'creditcard.fill',
    iconAndroid: 'payment',
    iconColor: colors.primary,
  },
  {
    id: '10',
    type: 'review',
    title: 'New Review',
    message: 'David Lee left you a 5-star review',
    time: '1d ago',
    timestamp: Date.now() - 86400000,
    read: true,
    icon: 'star.fill',
    iconAndroid: 'star',
    iconColor: colors.accent,
  },
  {
    id: '11',
    type: 'reminder',
    title: 'Trip Reminder',
    message: 'Your trip to Paris is tomorrow at 10:00 AM. Remember to collect items from requesters at pickup and hand them over to our Centre representative at the destination.',
    time: '1d ago',
    timestamp: Date.now() - 86400000,
    read: true,
    icon: 'bell.fill',
    iconAndroid: 'notifications',
    iconColor: colors.warning,
  },
  {
    id: '12',
    type: 'completed',
    title: 'Handover Completed',
    message: 'Your item was successfully handed over to our Centre representative by John Smith',
    time: '2d ago',
    timestamp: Date.now() - 172800000,
    read: true,
    icon: 'checkmark.seal.fill',
    iconAndroid: 'verified',
    iconColor: colors.success,
  },
];

type FilterType = 'all' | 'unread' | 'payments' | 'messages' | 'requests';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<FilterType>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n => ({ ...n, read: true }))
    );
  };

  const handleDeleteNotification = (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prevNotifications =>
              prevNotifications.filter(n => n.id !== id)
            );
          },
        },
      ]
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    if (notification.type === 'primary_acceptance') {
      console.log('Opening app payment screen after primary acceptance');
      router.push({
        pathname: '/app-payment',
        params: {
          travelerName: notification.sender,
          requestId: notification.id,
        },
      });
    } else if (notification.type === 'app_payment_required') {
      console.log('Opening app payment screen for:', notification.amount);
      router.push({
        pathname: '/app-payment',
        params: {
          travelerName: notification.sender,
          requestId: notification.id,
        },
      });
    } else if (notification.type === 'traveler_payment_request' || notification.type === 'offer_accepted') {
      console.log('Opening traveler payment screen for:', notification.amount);
      router.push({
        pathname: '/payment',
        params: {
          amount: notification.amount?.replace('$', ''),
          travelerName: notification.sender,
        },
      });
    } else if (notification.type === 'counter_offer') {
      console.log('Opening counter offer details');
      router.push('/trips/trip-details');
    } else if (notification.type === 'message') {
      router.push(`/chat/${notification.id}`);
    } else if (notification.type === 'request') {
      router.push('/trips/trip-details');
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    switch (filter) {
      case 'unread':
        filtered = notifications.filter(n => !n.read);
        break;
      case 'payments':
        filtered = notifications.filter(n =>
          ['primary_acceptance', 'app_payment_required', 'traveler_payment_request', 'offer_accepted'].includes(n.type)
        );
        break;
      case 'messages':
        filtered = notifications.filter(n => n.type === 'message');
        break;
      case 'requests':
        filtered = notifications.filter(n => ['request', 'counter_offer', 'accepted'].includes(n.type));
        break;
      default:
        filtered = notifications;
    }

    return filtered;
  };

  const groupNotificationsByDate = (notifs: Notification[]) => {
    const now = Date.now();
    const oneDayAgo = now - 86400000;
    const twoDaysAgo = now - 172800000;

    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const earlier: Notification[] = [];

    notifs.forEach(notif => {
      if (notif.timestamp > oneDayAgo) {
        today.push(notif);
      } else if (notif.timestamp > twoDaysAgo) {
        yesterday.push(notif);
      } else {
        earlier.push(notif);
      }
    });

    return { today, yesterday, earlier };
  };

  const filteredNotifications = getFilteredNotifications();
  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const renderNotification = (notification: Notification, index: number) => (
    <React.Fragment key={index}>
      <View style={styles.notificationWrapper}>
        <TouchableOpacity
          style={[
            styles.notificationCard,
            !notification.read && styles.unreadCard
          ]}
          activeOpacity={0.7}
          onPress={() => handleNotificationPress(notification)}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${notification.iconColor}20` }]}>
            <IconSymbol
              ios_icon_name={notification.icon}
              android_material_icon_name={notification.iconAndroid}
              size={24}
              color={notification.iconColor}
            />
          </View>
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              {!notification.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>
            {notification.type === 'primary_acceptance' && notification.amount && (
              <View style={styles.primaryAcceptanceBadge}>
                <IconSymbol
                  ios_icon_name="checkmark.seal.fill"
                  android_material_icon_name="verified"
                  size={14}
                  color={colors.success}
                />
                <Text style={styles.primaryAcceptanceAmount}>{notification.amount}</Text>
                <Text style={styles.primaryAcceptanceAction}>• Pay $5 to message</Text>
              </View>
            )}
            {notification.type === 'app_payment_required' && notification.amount && (
              <View style={styles.appPaymentBadge}>
                <IconSymbol
                  ios_icon_name="message.badge.fill"
                  android_material_icon_name="message"
                  size={14}
                  color={colors.secondary}
                />
                <Text style={styles.appPaymentAmount}>{notification.amount}</Text>
                <Text style={styles.appPaymentAction}>• Communication fee</Text>
              </View>
            )}
            {notification.type === 'traveler_payment_request' && notification.amount && (
              <View style={styles.paymentBadge}>
                <IconSymbol
                  ios_icon_name="dollarsign.circle.fill"
                  android_material_icon_name="attach-money"
                  size={14}
                  color={colors.primary}
                />
                <Text style={styles.paymentAmount}>{notification.amount}</Text>
                <Text style={styles.paymentAction}>• Pay traveler</Text>
              </View>
            )}
            {notification.type === 'counter_offer' && notification.counterAmount && (
              <View style={styles.counterOfferBadge}>
                <IconSymbol
                  ios_icon_name="arrow.left.arrow.right"
                  android_material_icon_name="swap-horiz"
                  size={14}
                  color={colors.warning}
                />
                <Text style={styles.counterOfferAmount}>
                  {notification.originalAmount} → {notification.counterAmount}
                </Text>
                <Text style={styles.counterOfferAction}>• Tap to respond</Text>
              </View>
            )}
            {notification.type === 'request' && notification.offeredAmount && (
              <View style={styles.offerBadge}>
                <IconSymbol
                  ios_icon_name="dollarsign.circle.fill"
                  android_material_icon_name="attach-money"
                  size={14}
                  color={colors.secondary}
                />
                <Text style={styles.offerAmount}>Offer: {notification.offeredAmount}</Text>
              </View>
            )}
            {notification.type === 'offer_accepted' && notification.amount && (
              <View style={styles.acceptedBadge}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={14}
                  color={colors.success}
                />
                <Text style={styles.acceptedAmount}>{notification.amount}</Text>
                <Text style={styles.acceptedAction}>• Tap to pay</Text>
              </View>
            )}
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(notification.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol
            ios_icon_name="trash"
            android_material_icon_name="delete"
            size={20}
            color={colors.error}
          />
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllRead}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All
            </Text>
            {filter === 'all' && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
              Unread
            </Text>
            {unreadCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'payments' && styles.filterButtonActive]}
            onPress={() => setFilter('payments')}
          >
            <IconSymbol
              ios_icon_name="dollarsign.circle"
              android_material_icon_name="attach-money"
              size={16}
              color={filter === 'payments' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.filterText, filter === 'payments' && styles.filterTextActive]}>
              Payments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'messages' && styles.filterButtonActive]}
            onPress={() => setFilter('messages')}
          >
            <IconSymbol
              ios_icon_name="message"
              android_material_icon_name="message"
              size={16}
              color={filter === 'messages' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.filterText, filter === 'messages' && styles.filterTextActive]}>
              Messages
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === 'requests' && styles.filterButtonActive]}
            onPress={() => setFilter('requests')}
          >
            <IconSymbol
              ios_icon_name="shippingbox"
              android_material_icon_name="inventory"
              size={16}
              color={filter === 'requests' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.filterText, filter === 'requests' && styles.filterTextActive]}>
              Requests
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length > 0 ? (
          <>
            {groupedNotifications.today.length > 0 && (
              <View style={styles.dateSection}>
                <Text style={styles.dateSectionTitle}>Today</Text>
                {groupedNotifications.today.map((notification, index) =>
                  renderNotification(notification, index)
                )}
              </View>
            )}

            {groupedNotifications.yesterday.length > 0 && (
              <View style={styles.dateSection}>
                <Text style={styles.dateSectionTitle}>Yesterday</Text>
                {groupedNotifications.yesterday.map((notification, index) =>
                  renderNotification(notification, index)
                )}
              </View>
            )}

            {groupedNotifications.earlier.length > 0 && (
              <View style={styles.dateSection}>
                <Text style={styles.dateSectionTitle}>Earlier</Text>
                {groupedNotifications.earlier.map((notification, index) =>
                  renderNotification(notification, index)
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="bell.slash"
              android_material_icon_name="notifications-off"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? "You're all caught up! Check back later for updates."
                : `No ${filter} notifications at the moment.`}
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
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  filterContainer: {
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  dateSection: {
    marginTop: 16,
  },
  dateSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  notificationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notificationCard: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  unreadCard: {
    backgroundColor: colors.highlight,
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  primaryAcceptanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.success}15`,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: `${colors.success}40`,
  },
  primaryAcceptanceAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  primaryAcceptanceAction: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  appPaymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.secondary}15`,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: `${colors.secondary}40`,
  },
  appPaymentAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
  },
  appPaymentAction: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.primary}15`,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
  },
  paymentAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentAction: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  counterOfferBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.warning}15`,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: `${colors.warning}40`,
  },
  counterOfferAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.warning,
  },
  counterOfferAction: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.secondary}15`,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: `${colors.secondary}40`,
  },
  offerAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.success}15`,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: `${colors.success}40`,
  },
  acceptedAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  acceptedAction: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 100,
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
    lineHeight: 22,
  },
});
