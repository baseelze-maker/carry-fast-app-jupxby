
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

// Mock notifications
const initialNotifications = [
  {
    id: '1',
    type: 'payment_request',
    title: 'Payment Required',
    message: 'Your delivery request has been accepted! Please proceed with payment of $25.',
    sender: 'Sarah Johnson',
    amount: '$25',
    time: '2m ago',
    read: false,
    icon: 'creditcard.fill',
    iconAndroid: 'payment',
    iconColor: colors.warning,
  },
  {
    id: '2',
    type: 'request',
    title: 'New Delivery Request',
    message: 'Mike Chen wants to send an item on your trip to London',
    time: '5m ago',
    read: false,
    icon: 'shippingbox',
    iconAndroid: 'inventory',
    iconColor: colors.secondary,
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'Sarah Johnson: "Sure, I can deliver that for you!"',
    time: '1h ago',
    read: false,
    icon: 'message.fill',
    iconAndroid: 'message',
    iconColor: colors.primary,
  },
  {
    id: '4',
    type: 'accepted',
    title: 'Request Accepted',
    message: 'Emma Wilson accepted your delivery request',
    time: '3h ago',
    read: true,
    icon: 'checkmark.circle.fill',
    iconAndroid: 'check-circle',
    iconColor: colors.success,
  },
  {
    id: '5',
    type: 'payment_request',
    title: 'Payment Required',
    message: 'David Lee accepted your request. Please pay $20 to confirm the delivery.',
    sender: 'David Lee',
    amount: '$20',
    time: '5h ago',
    read: true,
    icon: 'creditcard.fill',
    iconAndroid: 'payment',
    iconColor: colors.warning,
  },
  {
    id: '6',
    type: 'review',
    title: 'New Review',
    message: 'David Lee left you a 5-star review',
    time: '1d ago',
    read: true,
    icon: 'star.fill',
    iconAndroid: 'star',
    iconColor: colors.accent,
  },
  {
    id: '7',
    type: 'reminder',
    title: 'Trip Reminder',
    message: 'Your trip to Paris is tomorrow at 10:00 AM',
    time: '1d ago',
    read: true,
    icon: 'bell.fill',
    iconAndroid: 'notifications',
    iconColor: colors.warning,
  },
  {
    id: '8',
    type: 'completed',
    title: 'Delivery Completed',
    message: 'Your item was successfully delivered by John Smith',
    time: '2d ago',
    read: true,
    icon: 'checkmark.seal.fill',
    iconAndroid: 'verified',
    iconColor: colors.success,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n => ({ ...n, read: true }))
    );
  };

  const handleNotificationPress = (notification: any) => {
    // Mark as read
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navigate based on notification type
    if (notification.type === 'payment_request') {
      // In a real app, this would navigate to a payment screen
      console.log('Opening payment screen for:', notification.amount);
      // router.push('/payment');
    } else if (notification.type === 'message') {
      router.push(`/chat/${notification.id}`);
    } else if (notification.type === 'request') {
      router.push('/trips/trip-details');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <React.Fragment key={index}>
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
                  {notification.type === 'payment_request' && notification.amount && (
                    <View style={styles.paymentBadge}>
                      <IconSymbol 
                        ios_icon_name="dollarsign.circle.fill" 
                        android_material_icon_name="attach-money" 
                        size={14} 
                        color={colors.warning} 
                      />
                      <Text style={styles.paymentAmount}>{notification.amount}</Text>
                      <Text style={styles.paymentAction}>• Tap to pay</Text>
                    </View>
                  )}
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))
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
              You&apos;re all caught up! Check back later for updates.
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
  headerTitle: {
    fontSize: 24,
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  unreadCard: {
    backgroundColor: colors.highlight,
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
  paymentBadge: {
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
  paymentAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.warning,
  },
  paymentAction: {
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
