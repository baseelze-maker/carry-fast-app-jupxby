
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

// Mock notifications
const mockNotifications = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {mockNotifications.length > 0 ? (
          mockNotifications.map((notification, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity 
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadCard
                ]}
                activeOpacity={0.7}
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
