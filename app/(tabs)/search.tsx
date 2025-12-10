
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Modal } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import DateTimePicker from "@react-native-community/datetimepicker";

// Mock data for travelers
const mockTravelers = [
  {
    id: '1',
    name: 'John Smith',
    from: 'New York, USA',
    to: 'London, UK',
    finalDestination: 'Manchester, UK',
    date: '2024-02-15',
    weight: 5,
    price: 50,
    rating: 4.8,
    canDeliverAtFirstDestination: true,
    verified: true,
    completedTrips: 15,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    from: 'Los Angeles, USA',
    to: 'Paris, France',
    finalDestination: 'Lyon, France',
    date: '2024-02-18',
    weight: 3,
    price: 40,
    rating: 4.9,
    canDeliverAtFirstDestination: false,
    verified: true,
    completedTrips: 24,
  },
  {
    id: '3',
    name: 'Mike Chen',
    from: 'San Francisco, USA',
    to: 'Tokyo, Japan',
    finalDestination: 'Osaka, Japan',
    date: '2024-02-20',
    weight: 7,
    price: 60,
    rating: 4.7,
    canDeliverAtFirstDestination: true,
    verified: true,
    completedTrips: 12,
  },
  {
    id: '4',
    name: 'Emma Wilson',
    from: 'Chicago, USA',
    to: 'Berlin, Germany',
    finalDestination: 'Munich, Germany',
    date: '2024-02-22',
    weight: 4,
    price: 45,
    rating: 4.6,
    canDeliverAtFirstDestination: true,
    verified: false,
    completedTrips: 8,
  },
  {
    id: '5',
    name: 'David Martinez',
    from: 'Miami, USA',
    to: 'Madrid, Spain',
    finalDestination: 'Barcelona, Spain',
    date: '2024-02-25',
    weight: 6,
    price: 55,
    rating: 4.8,
    canDeliverAtFirstDestination: false,
    verified: true,
    completedTrips: 20,
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    from: 'Boston, USA',
    to: 'Rome, Italy',
    finalDestination: 'Florence, Italy',
    date: '2024-02-28',
    weight: 4,
    price: 48,
    rating: 4.9,
    canDeliverAtFirstDestination: true,
    verified: true,
    completedTrips: 30,
  },
];

type SortOption = 'date' | 'price-low' | 'price-high' | 'rating' | 'weight';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [minWeight, setMinWeight] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const clearFilters = () => {
    setSelectedDate(null);
    setMinWeight('');
    setMaxPrice('');
    setMinRating(0);
    setVerifiedOnly(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedDate) count++;
    if (minWeight) count++;
    if (maxPrice) count++;
    if (minRating > 0) count++;
    if (verifiedOnly) count++;
    return count;
  };

  // Filter and sort travelers
  const getFilteredTravelers = () => {
    let filtered = mockTravelers.filter(traveler => {
      // Search query filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        traveler.to.toLowerCase().includes(searchLower) ||
        traveler.finalDestination.toLowerCase().includes(searchLower) ||
        traveler.from.toLowerCase().includes(searchLower) ||
        traveler.name.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;

      // Date filter
      if (selectedDate) {
        const travelerDate = new Date(traveler.date);
        if (travelerDate.toDateString() !== selectedDate.toDateString()) {
          return false;
        }
      }

      // Weight filter
      if (minWeight && traveler.weight < parseFloat(minWeight)) {
        return false;
      }

      // Price filter
      if (maxPrice && traveler.price > parseFloat(maxPrice)) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && traveler.rating < minRating) {
        return false;
      }

      // Verified filter
      if (verifiedOnly && !traveler.verified) {
        return false;
      }

      return true;
    });

    // Sort travelers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'weight':
          return b.weight - a.weight;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredTravelers = getFilteredTravelers();
  const activeFilterCount = getActiveFilterCount();

  const handleTravelerPress = (travelerId: string) => {
    console.log('Opening traveler details for:', travelerId);
    router.push({
      pathname: '/search/traveler-details',
      params: { travelerId }
    });
  };

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
              placeholder="Search by destination or name..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill" 
                  android_material_icon_name="cancel" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter and Sort Row */}
          <View style={styles.controlsRow}>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]} 
              activeOpacity={0.7}
              onPress={() => setShowFilters(true)}
            >
              <IconSymbol 
                ios_icon_name="slider.horizontal.3" 
                android_material_icon_name="tune" 
                size={18} 
                color={activeFilterCount > 0 ? colors.card : colors.primary} 
              />
              <Text style={[styles.filterButtonText, activeFilterCount > 0 && styles.filterButtonTextActive]}>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Text>
            </TouchableOpacity>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.sortContainer}
              contentContainerStyle={styles.sortContent}
            >
              <TouchableOpacity 
                style={[styles.sortChip, sortBy === 'date' && styles.sortChipActive]} 
                activeOpacity={0.7}
                onPress={() => setSortBy('date')}
              >
                <Text style={[styles.sortChipText, sortBy === 'date' && styles.sortChipTextActive]}>
                  Earliest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sortChip, sortBy === 'price-low' && styles.sortChipActive]} 
                activeOpacity={0.7}
                onPress={() => setSortBy('price-low')}
              >
                <Text style={[styles.sortChipText, sortBy === 'price-low' && styles.sortChipTextActive]}>
                  Lowest Price
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]} 
                activeOpacity={0.7}
                onPress={() => setSortBy('rating')}
              >
                <Text style={[styles.sortChipText, sortBy === 'rating' && styles.sortChipTextActive]}>
                  Top Rated
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sortChip, sortBy === 'weight' && styles.sortChipActive]} 
                activeOpacity={0.7}
                onPress={() => setSortBy('weight')}
              >
                <Text style={[styles.sortChipText, sortBy === 'weight' && styles.sortChipTextActive]}>
                  Most Weight
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            {filteredTravelers.length} {filteredTravelers.length === 1 ? 'Traveler' : 'Travelers'} Found
          </Text>

          {filteredTravelers.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol 
                ios_icon_name="magnifyingglass" 
                android_material_icon_name="search" 
                size={64} 
                color={colors.textSecondary} 
              />
              <Text style={styles.emptyStateTitle}>No travelers found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters to find more results
              </Text>
              {activeFilterCount > 0 && (
                <TouchableOpacity 
                  style={styles.clearFiltersButton}
                  onPress={clearFilters}
                >
                  <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredTravelers.map((traveler, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity 
                  style={styles.travelerCard}
                  activeOpacity={0.7}
                  onPress={() => handleTravelerPress(traveler.id)}
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
                      <View style={styles.nameRow}>
                        <Text style={styles.travelerName}>{traveler.name}</Text>
                        {traveler.verified && (
                          <IconSymbol 
                            ios_icon_name="checkmark.seal.fill" 
                            android_material_icon_name="verified" 
                            size={16} 
                            color={colors.secondary} 
                          />
                        )}
                      </View>
                      <View style={styles.ratingContainer}>
                        <IconSymbol 
                          ios_icon_name="star.fill" 
                          android_material_icon_name="star" 
                          size={14} 
                          color={colors.accent} 
                        />
                        <Text style={styles.ratingText}>{traveler.rating}</Text>
                        <Text style={styles.tripsText}>• {traveler.completedTrips} trips</Text>
                      </View>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Fee</Text>
                      <Text style={styles.priceText}>${traveler.price}</Text>
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
                          ios_icon_name="location.fill" 
                          android_material_icon_name="place" 
                          size={16} 
                          color={colors.primary} 
                        />
                        <View style={styles.destinationInfo}>
                          <Text style={styles.locationText}>{traveler.to}</Text>
                          {traveler.canDeliverAtFirstDestination && (
                            <View style={styles.deliveryBadge}>
                              <Text style={styles.deliveryBadgeText}>Can deliver here</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      {traveler.finalDestination !== traveler.to && (
                        <>
                          <View style={styles.routeLine} />
                          <View style={styles.locationRow}>
                            <IconSymbol 
                              ios_icon_name="airplane.arrival" 
                              android_material_icon_name="flight-land" 
                              size={16} 
                              color={colors.accent} 
                            />
                            <View style={styles.destinationInfo}>
                              <Text style={styles.locationText}>{traveler.finalDestination}</Text>
                              <Text style={styles.finalDestLabel}>(Final destination)</Text>
                            </View>
                          </View>
                        </>
                      )}
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
                        <Text style={styles.detailText}>{traveler.weight} kg available</Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity 
                    style={styles.contactButton} 
                    activeOpacity={0.8}
                    onPress={() => handleTravelerPress(traveler.id)}
                  >
                    <Text style={styles.contactButtonText}>View Details & Send Request</Text>
                    <IconSymbol 
                      ios_icon_name="chevron.right" 
                      android_material_icon_name="chevron-right" 
                      size={16} 
                      color="#FFFFFF" 
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </React.Fragment>
            ))
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill" 
                  android_material_icon_name="cancel" 
                  size={28} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Date Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Travel Date</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <IconSymbol 
                    ios_icon_name="calendar" 
                    android_material_icon_name="calendar-today" 
                    size={20} 
                    color={colors.primary} 
                  />
                  <Text style={styles.dateButtonText}>
                    {selectedDate ? selectedDate.toDateString() : 'Select date'}
                  </Text>
                </TouchableOpacity>
                {selectedDate && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setSelectedDate(null)}
                  >
                    <Text style={styles.clearButtonText}>Clear date</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Weight Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Minimum Weight (kg)</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="e.g., 3"
                  placeholderTextColor={colors.textSecondary}
                  value={minWeight}
                  onChangeText={setMinWeight}
                  keyboardType="numeric"
                />
              </View>

              {/* Price Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Maximum Price ($)</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="e.g., 50"
                  placeholderTextColor={colors.textSecondary}
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                />
              </View>

              {/* Rating Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Minimum Rating</Text>
                <View style={styles.ratingOptions}>
                  {[0, 4.0, 4.5, 4.8].map((rating, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.ratingOption,
                        minRating === rating && styles.ratingOptionActive
                      ]}
                      onPress={() => setMinRating(rating)}
                    >
                      <IconSymbol 
                        ios_icon_name="star.fill" 
                        android_material_icon_name="star" 
                        size={16} 
                        color={minRating === rating ? colors.card : colors.accent} 
                      />
                      <Text style={[
                        styles.ratingOptionText,
                        minRating === rating && styles.ratingOptionTextActive
                      ]}>
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Verified Filter */}
              <View style={styles.filterSection}>
                <TouchableOpacity 
                  style={styles.verifiedToggle}
                  onPress={() => setVerifiedOnly(!verifiedOnly)}
                >
                  <View style={styles.verifiedToggleLeft}>
                    <IconSymbol 
                      ios_icon_name="checkmark.seal.fill" 
                      android_material_icon_name="verified" 
                      size={20} 
                      color={verifiedOnly ? colors.secondary : colors.textSecondary} 
                    />
                    <Text style={styles.verifiedToggleText}>Verified travelers only</Text>
                  </View>
                  <View style={[styles.toggleSwitch, verifiedOnly && styles.toggleSwitchActive]}>
                    <View style={[styles.toggleThumb, verifiedOnly && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearAllButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
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
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  filterButtonTextActive: {
    color: colors.card,
  },
  sortContainer: {
    flex: 1,
  },
  sortContent: {
    gap: 8,
  },
  sortChip: {
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortChipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  sortChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  sortChipTextActive: {
    color: colors.card,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  clearFiltersButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.card,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  travelerName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
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
  tripsText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priceContainer: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceText: {
    fontSize: 18,
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
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 4,
  },
  locationText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  destinationInfo: {
    flex: 1,
  },
  deliveryBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  deliveryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.card,
  },
  finalDestLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  contactButtonText: {
    fontSize: 15,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
  modalScroll: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonText: {
    fontSize: 15,
    color: colors.text,
  },
  clearButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '500',
  },
  filterInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingOptionActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  ratingOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  ratingOptionTextActive: {
    color: colors.card,
  },
  verifiedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  verifiedToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verifiedToggleText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: colors.secondary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearAllButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  applyButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
});
