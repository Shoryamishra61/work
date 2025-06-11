import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CreditCard, Lock, Crown, CheckCircle, ArrowLeft } from 'lucide-react-native';

export default function PaymentScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful!',
        'Welcome to Edugram Premium! You now have access to all premium content.',
        [
          {
            text: 'Start Learning',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade to Premium</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={styles.premiumCard}
        >
          <Crown size={48} color="#FFD700" />
          <Text style={styles.premiumTitle}>Edugram Premium</Text>
          <Text style={styles.premiumSubtitle}>Unlock unlimited learning</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>$5.99</Text>
            <Text style={styles.priceUnit}>/month</Text>
          </View>
          
          <Text style={styles.trialText}>7-day free trial • Cancel anytime</Text>
        </LinearGradient>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What's included:</Text>
          
          <View style={styles.feature}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.featureText}>Unlimited access to premium videos</Text>
          </View>
          
          <View style={styles.feature}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.featureText}>Ad-free learning experience</Text>
          </View>
          
          <View style={styles.feature}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.featureText}>Offline downloads</Text>
          </View>
          
          <View style={styles.feature}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.featureText}>Advanced progress tracking</Text>
          </View>
          
          <View style={styles.feature}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.featureText}>Priority customer support</Text>
          </View>
        </View>

        <View style={styles.paymentForm}>
          <Text style={styles.formTitle}>Payment Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="John Doe"
              placeholderTextColor="#666666"
              value={cardholderName}
              onChangeText={setCardholderName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.cardInputContainer}>
              <CreditCard size={20} color="#8B5CF6" />
              <TextInput
                style={styles.cardInput}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#666666"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.textInput}
                placeholder="MM/YY"
                placeholderTextColor="#666666"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.textInput}
                placeholder="123"
                placeholderTextColor="#666666"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.securityNote}>
            <Lock size={16} color="#10B981" />
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={isProcessing ? ['#666666', '#444444'] : ['#8B5CF6', '#7C3AED']}
            style={styles.payButtonGradient}
          >
            <Text style={styles.payButtonText}>
              {isProcessing ? 'Processing...' : 'Start Free Trial'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Your subscription will automatically renew unless cancelled at least 24 hours before the end of the current period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  premiumCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginVertical: 20,
  },
  premiumTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  premiumSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  priceUnit: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
    marginLeft: 4,
  },
  trialText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
  },
  featuresContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginLeft: 12,
  },
  paymentForm: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#CCCCCC',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  cardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  cardInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  securityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginLeft: 8,
    flex: 1,
  },
  payButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 40,
  },
});