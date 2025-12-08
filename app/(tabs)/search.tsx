
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

// Mock data for travelers
const mockTravelers = [
  {
    id: '1',
    name: 'John Smith',
    from: 'New York, USA',
    to: 'London, UK',
    date: '2024-02-15',
    weight: '5 kg',
    price: '$50',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    from: 'Los Angeles, USA',
    to: 'Paris, France',
    date: '2024-02-18',
    weight: '3 kg',
    price: '$40',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Mike Chen',
    from: 'San Francisco, USA',
    to: 'Tokyo, Japan',
    date: '2024-02-20',
    weight: '7 kg',
    price: '$60',
    rating: 4.7,
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState('');

  const filteredTravelers = mockTravelers.filter(traveler => 
    traveler.to.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Travelers</Text>
        <Text style={styles.headerSubtitle}>Find someone traveling to your destination</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <IconSymbol 
              ios_icon_name="magnifyingglass" 
              android_material_icon_name="search" 
              size={20} 
              color={colors.textSecondary} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Where do you need to send?"
              placeholderTextColor={colors.textSecondary}
              value={destination}
              onChangeText={setDestination}
            />
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <TouchableOpacity style={styles.filterChip} activeOpacity={0.7}>
              <IconSymbol 
                ios_icon_name="calendar" 
                android_material_icon_name="calendar-today" 
                size={16} 
                color={colors.primary} 
              />
              <Text style={styles.filterChipText}>Date</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip} activeOpacity={0.7}>
              <IconSymbol 
                ios_icon_name="scalemass" 
                android_material_icon_name="scale" 
                size={16} 
                color={colors.primary} 
              />
              <Text style={styles.filterChipText}>Weight</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip} activeOpacity={0.7}>
              <IconSymbol 
                ios_icon_name="dollarsign" 
                android_material_icon_name="attach-money" 
                size={16} 
                color={colors.primary} 
              />
              <Text style={styles.filterChipText}>Price</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            {filteredTravelers.length} Travelers Found
          </Text>

          {filteredTravelers.map((traveler, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity 
                key={traveler.id}
                style={styles.travelerCard}
                activeOpacity={0.7}
              >
                {/* Traveler Header */}
                <View style={styles.travelerHeader}>
                  <View style={styles.avatarContainer}>
                    <IconSymbol 
                      ios_icon_name="person.circle.fill" 
                      android_material_icon_name="account-circle" 
                      size={48} 
                      color={colors.primary} 
                    />
                  </View>
                  <View style={styles.travelerInfo}>
                    <Text style={styles.travelerName}>{traveler.name}</Text>
                    <View style={styles.ratingContainer}>
                      <IconSymbol 
                        ios_icon_name="star.fill" 
                        android_material_icon_name="star" 
                        size={14} 
                        color={colors.accent} 
                      />
                      <Text style={styles.ratingText}>{traveler.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>{traveler.price}</Text>
                  </View>
                </View>

                {/* Trip Details */}
                <View style={styles.tripDetails}>
                  <View style={styles.routeContainer}>
                    <View style={styles.locationRow}>
                      <IconSymbol 
                        ios_icon_name="airplane.departure" 
                        android_material_icon_name="flight-takeoff" 
                        size={16} 
                        color={colors.secondary} 
                      />
                      <Text style={styles.locationText}>{traveler.from}</Text>
                    </View>
                    <View style={styles.routeLine} />
                    <View style={styles.locationRow}>
                      <IconSymbol 
                        ios_icon_name="airplane.arrival" 
                        android_material_icon_name="flight-land" 
                        size={16} 
                        color={colors.primary} 
                      />
                      <Text style={styles.locationText}>{traveler.to}</Text>
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <IconSymbol 
                        ios_icon_name="calendar" 
                        android_material_icon_name="calendar-today" 
                        size={14} 
                        color={colors.textSecondary} 
                      />
                      <Text style={styles.detailText}>{traveler.date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <IconSymbol 
                        ios_icon_name="scalemass" 
                        android_material_icon_name="scale" 
                        size={14} 
                        color={colors.textSecondary} 
                      />
                      <Text style={styles.detailText}>{traveler.weight}</Text>
                    </View>
                  </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
                  <Text style={styles.contactButtonText}>Contact Traveler</Text>
                </TouchableOpacity>
              </TouchableOpacity>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  searchSection: {
    padding: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
  resultsSection: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  travelerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  travelerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  travelerInfo: {
    flex: 1,
  },
  travelerName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  priceContainer: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tripDetails: {
    marginBottom: 16,
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
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 7,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
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
  contactButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
