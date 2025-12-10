
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, TextInput } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/contexts/AuthContext";

export default function AppPaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { markCommunicationFeePaid } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const communicationFee = '5.00';
  const travelerName = params.travelerName || 'Traveler';
  const requestId = params.requestId || '';

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Payment Method Required', 'Please select a payment method.');
      return;
    }

    if (selectedMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        Alert.alert('Incomplete Information', 'Please fill in all card details.');
        return;
      }
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      setIsProcessing(false);
      
      // Mark the communication fee as paid for this traveler
      try {
        await markCommunicationFeePaid(requestId as string);
        console.log('Communication fee marked as paid for traveler:', requestId);
        
        Alert.alert(
          'Communication Fee Paid!',
          `Your $${communicationFee} communication fee has been processed.\n\n✓ Messaging with ${travelerName} is now unlocked\n✓ You can discuss pickup details\n✓ Arrange payment for carrying service separately\n\nNote: The carrying service payment to the traveler is separate and will be arranged directly with them (cash or card).`,
          [
            {
              text: 'Message Traveler',
              onPress: () => {
                router.replace(`/chat/${requestId}`);
              },
            },
            {
              text: 'Later',
              onPress: () => router.back(),
            },
          ]
        );
      } catch (error) {
        console.error('Error marking payment:', error);
        Alert.alert('Error', 'Failed to process payment. Please try again.');
      }
    }, 2000);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

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
        <Text style={styles.headerTitle}>App Communication Fee</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Type Badge */}
        <View style={styles.paymentTypeBadge}>
          <IconSymbol 
            ios_icon_name="app.badge" 
            android_material_icon_name="apps" 
            size={20} 
            color={colors.secondary} 
          />
          <Text style={styles.paymentTypeText}>Payment to App (Communication Fee)</Text>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={24} 
            color={colors.secondary} 
          />
          <View style={styles.infoBannerContent}>
            <Text style={styles.infoBannerTitle}>About This Payment</Text>
            <Text style={styles.infoBannerText}>
              This is a one-time communication fee paid to the app to enable messaging with {travelerName}.{'\n\n'}
              <Text style={styles.infoBannerHighlight}>Important:</Text> The carrying service payment to the traveler is separate and will be arranged directly with them (cash or card).
            </Text>
          </View>
        </View>

        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountHeader}>
            <IconSymbol 
              ios_icon_name="message.badge.fill" 
              android_material_icon_name="message" 
              size={32} 
              color="rgba(255, 255, 255, 0.9)" 
            />
          </View>
          <Text style={styles.amountLabel}>Communication Fee</Text>
          <Text style={styles.amountValue}>${communicationFee}</Text>
          <Text style={styles.amountDescription}>
            One-time fee to unlock messaging
          </Text>
        </View>

        {/* Payment Flow Diagram */}
        <View style={styles.flowCard}>
          <Text style={styles.flowTitle}>Payment Flow</Text>
          
          <View style={styles.flowStep}>
            <View style={styles.flowStepNumber}>
              <Text style={styles.flowStepNumberText}>1</Text>
            </View>
            <View style={styles.flowStepContent}>
              <Text style={styles.flowStepTitle}>Pay Communication Fee (Now)</Text>
              <Text style={styles.flowStepText}>$5.00 to the app → Unlocks messaging</Text>
            </View>
            <IconSymbol 
              ios_icon_name="app.badge.checkmark" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.secondary} 
            />
          </View>

          <View style={styles.flowDivider} />

          <View style={styles.flowStep}>
            <View style={[styles.flowStepNumber, styles.flowStepNumberSecondary]}>
              <Text style={styles.flowStepNumberText}>2</Text>
            </View>
            <View style={styles.flowStepContent}>
              <Text style={styles.flowStepTitle}>Pay Traveler (Later)</Text>
              <Text style={styles.flowStepText}>Carrying service fee → Directly to traveler (cash or card)</Text>
            </View>
            <IconSymbol 
              ios_icon_name="person.circle" 
              android_material_icon_name="person" 
              size={24} 
              color={colors.primary} 
            />
          </View>
        </View>

        {/* What You Get */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You Get</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <IconSymbol 
                ios_icon_name="message.fill" 
                android_material_icon_name="message" 
                size={20} 
                color={colors.success} 
              />
              <Text style={styles.benefitText}>Direct messaging with {travelerName}</Text>
            </View>
            <View style={styles.benefitItem}>
              <IconSymbol 
                ios_icon_name="calendar.badge.clock" 
                android_material_icon_name="schedule" 
                size={20} 
                color={colors.success} 
              />
              <Text style={styles.benefitText}>Coordinate pickup time and location</Text>
            </View>
            <View style={styles.benefitItem}>
              <IconSymbol 
                ios_icon_name="creditcard" 
                android_material_icon_name="payment" 
                size={20} 
                color={colors.success} 
              />
              <Text style={styles.benefitText}>Arrange carrying service payment method</Text>
            </View>
            <View style={styles.benefitItem}>
              <IconSymbol 
                ios_icon_name="shield.checkmark.fill" 
                android_material_icon_name="verified-user" 
                size={20} 
                color={colors.success} 
              />
              <Text style={styles.benefitText}>Secure communication platform</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === 'card' && styles.methodCardSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedMethod('card');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.methodIcon}>
              <IconSymbol 
                ios_icon_name="creditcard.fill" 
                android_material_icon_name="credit-card" 
                size={24} 
                color={selectedMethod === 'card' ? colors.primary : colors.textSecondary} 
              />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Credit / Debit Card</Text>
              <Text style={styles.methodSubtitle}>Visa, Mastercard, Amex</Text>
            </View>
            <View style={[
              styles.radioButton,
              selectedMethod === 'card' && styles.radioButtonSelected,
            ]}>
              {selectedMethod === 'card' && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === 'paypal' && styles.methodCardSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedMethod('paypal');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.methodIcon}>
              <IconSymbol 
                ios_icon_name="dollarsign.circle.fill" 
                android_material_icon_name="account-balance-wallet" 
                size={24} 
                color={selectedMethod === 'paypal' ? colors.primary : colors.textSecondary} 
              />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>PayPal</Text>
              <Text style={styles.methodSubtitle}>Pay with your PayPal account</Text>
            </View>
            <View style={[
              styles.radioButton,
              selectedMethod === 'paypal' && styles.radioButtonSelected,
            ]}>
              {selectedMethod === 'paypal' && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Card Details Form */}
        {selectedMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Card Number</Text>
              <View style={styles.inputContainer}>
                <IconSymbol 
                  ios_icon_name="creditcard" 
                  android_material_icon_name="credit-card" 
                  size={20} 
                  color={colors.textSecondary} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={colors.textSecondary}
                  value={cardNumber}
                  onChangeText={(text) => {
                    const formatted = formatCardNumber(text);
                    if (formatted.replace(/\s/g, '').length <= 16) {
                      setCardNumber(formatted);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Cardholder Name</Text>
              <View style={styles.inputContainer}>
                <IconSymbol 
                  ios_icon_name="person" 
                  android_material_icon_name="person" 
                  size={20} 
                  color={colors.textSecondary} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor={colors.textSecondary}
                  value={cardName}
                  onChangeText={setCardName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>Expiry Date</Text>
                <View style={styles.inputContainer}>
                  <IconSymbol 
                    ios_icon_name="calendar" 
                    android_material_icon_name="calendar-today" 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.textSecondary}
                    value={expiryDate}
                    onChangeText={(text) => {
                      const formatted = formatExpiryDate(text);
                      if (formatted.length <= 5) {
                        setExpiryDate(formatted);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>

              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>CVV</Text>
                <View style={styles.inputContainer}>
                  <IconSymbol 
                    ios_icon_name="lock" 
                    android_material_icon_name="lock" 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor={colors.textSecondary}
                    value={cvv}
                    onChangeText={(text) => {
                      if (text.length <= 4) {
                        setCvv(text);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Payment Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Communication Fee (to App)</Text>
            <Text style={styles.breakdownValue}>${communicationFee}</Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownTotalLabel}>Total Due Now</Text>
            <Text style={styles.breakdownTotalValue}>${communicationFee}</Text>
          </View>
          <View style={styles.breakdownNote}>
            <IconSymbol 
              ios_icon_name="info.circle" 
              android_material_icon_name="info" 
              size={16} 
              color={colors.textSecondary} 
            />
            <Text style={styles.breakdownNoteText}>
              Carrying service payment to traveler will be arranged separately (cash or card)
            </Text>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <IconSymbol 
            ios_icon_name="lock.shield.fill" 
            android_material_icon_name="security" 
            size={20} 
            color={colors.success} 
          />
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            (!selectedMethod || isProcessing) && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod || isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <Text style={styles.payButtonText}>Processing...</Text>
          ) : (
            <>
              <IconSymbol 
                ios_icon_name="checkmark.circle.fill" 
                android_material_icon_name="check-circle" 
                size={24} 
                color="#FFFFFF" 
              />
              <Text style={styles.payButtonText}>Pay ${communicationFee} to App</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  paymentTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.secondary}20`,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${colors.secondary}50`,
  },
  paymentTypeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: `${colors.secondary}15`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${colors.secondary}40`,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  infoBannerText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  infoBannerHighlight: {
    fontWeight: '700',
    color: colors.secondary,
  },
  amountCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  amountHeader: {
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  amountDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  flowCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  flowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  flowStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flowStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowStepNumberSecondary: {
    backgroundColor: colors.primary,
  },
  flowStepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  flowStepContent: {
    flex: 1,
  },
  flowStepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  flowStepText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  flowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  benefitsList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  methodCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  methodSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  formGroup: {
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  breakdownCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  breakdownTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  breakdownTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.secondary,
  },
  breakdownNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  breakdownNoteText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: `${colors.success}15`,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: `${colors.success}40`,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'android' ? 20 : 40,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  payButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  payButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
