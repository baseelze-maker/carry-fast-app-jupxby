
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Switch } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, buttonStyles } from "@/styles/commonStyles";

export default function PostTripScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    finalDestination: '',
    date: '',
    weight: '',
    price: '',
    notes: '',
    canDeliverAtMainDestination: true,
    canDeliverAtFinalDestination: true,
  });

  const handleSubmit = () => {
    console.log('Trip posted:', formData);
    // TODO: Save trip data
    router.back();
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
        <Text style={styles.headerTitle}>Post a Trip</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <IconSymbol 
            ios_icon_name="info.circle" 
            android_material_icon_name="info" 
            size={24} 
            color={colors.secondary} 
          />
          <Text style={styles.infoText}>
            Share your travel details to connect with people who need to send items to your destination.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Departure City/Country</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., New York, USA"
              placeholderTextColor={colors.textSecondary}
              value={formData.from}
              onChangeText={(text) => setFormData({...formData, from: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Destination City/Country</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., London, UK"
              placeholderTextColor={colors.textSecondary}
              value={formData.to}
              onChangeText={(text) => setFormData({...formData, to: text})}
            />
            
            {/* Delivery Toggle for Main Destination */}
            <View style={styles.deliveryToggle}>
              <View style={styles.deliveryToggleLeft}>
                <IconSymbol 
                  ios_icon_name="shippingbox" 
                  android_material_icon_name="local-shipping" 
                  size={20} 
                  color={formData.canDeliverAtMainDestination ? colors.primary : colors.textSecondary} 
                />
                <Text style={[styles.deliveryToggleText, !formData.canDeliverAtMainDestination && styles.deliveryToggleTextDisabled]}>
                  Can deliver at this destination
                </Text>
              </View>
              <Switch
                value={formData.canDeliverAtMainDestination}
                onValueChange={(value) => setFormData({...formData, canDeliverAtMainDestination: value})}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'android' ? colors.card : undefined}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Final Destination (Optional)</Text>
            <Text style={styles.sublabel}>
              Specific province, city, or area within the destination country
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Manchester, England"
              placeholderTextColor={colors.textSecondary}
              value={formData.finalDestination}
              onChangeText={(text) => setFormData({...formData, finalDestination: text})}
            />
            
            {/* Delivery Toggle for Final Destination */}
            {formData.finalDestination.length > 0 && (
              <View style={styles.deliveryToggle}>
                <View style={styles.deliveryToggleLeft}>
                  <IconSymbol 
                    ios_icon_name="shippingbox" 
                    android_material_icon_name="local-shipping" 
                    size={20} 
                    color={formData.canDeliverAtFinalDestination ? colors.primary : colors.textSecondary} 
                  />
                  <Text style={[styles.deliveryToggleText, !formData.canDeliverAtFinalDestination && styles.deliveryToggleTextDisabled]}>
                    Can deliver at final destination
                  </Text>
                </View>
                <Switch
                  value={formData.canDeliverAtFinalDestination}
                  onValueChange={(value) => setFormData({...formData, canDeliverAtFinalDestination: value})}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={Platform.OS === 'android' ? colors.card : undefined}
                />
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Travel Date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={colors.textSecondary}
              value={formData.date}
              onChangeText={(text) => setFormData({...formData, date: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Available Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={formData.weight}
              onChangeText={(text) => setFormData({...formData, weight: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Suggested Price (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., $50"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any special conditions or preferences..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              value={formData.notes}
              onChangeText={(text) => setFormData({...formData, notes: text})}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Post Trip</Text>
        </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  infoCard: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: -4,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  deliveryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  deliveryToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  deliveryToggleText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  deliveryToggleTextDisabled: {
    color: colors.textSecondary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(76, 175, 80, 0.3)',
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
