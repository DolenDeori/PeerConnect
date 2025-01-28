import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PackageDetailsScreen = () => {
  const router = useRouter();
  const [packageSize, setPackageSize] = useState<string>('');
  const [packageWeight, setPackageWeight] = useState<string>('');
  const [packageContent, setPackageContent] = useState<string>('');
  const [receiverName, setReceiverName] = useState<string>('');
  const [receiverPhone, setReceiverPhone] = useState<string>('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with back button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} />
          <Text style={styles.backText}>Go back</Text>
        </TouchableOpacity>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Please Provide{'\n'}The Package Details</Text>
          <Text style={styles.subtitle}>
            We need some information about your package to ship it in properly through a traveler.
          </Text>

          <Text style={styles.sectionTitle}>Describe Your Package</Text>

          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Select Your Package</Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Choose Your Package Size</Text>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Select Your Package Weight</Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Select Your Package Content</Text>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Package Content</Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Select Your Pickup Point</Text>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Select Your Pickup Point</Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Delivery Point</Text>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Select Your Delivery Point</Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Your waiting period</Text>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Select Your Delivery Point</Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>

          {/* Important Notice Box */}
          <View style={styles.noticeBox}>
            <View style={styles.noticeHeader}>
              <Ionicons name="information-circle-outline" size={24} />
              <Text style={styles.noticeTitle}>Important</Text>
            </View>
            <Text style={styles.noticeText}>
              If no one pickup your package till waiting period runs out your listed package will be automatically cancelled and you have to repost again.{'\n\n'}
              Any payment made will be refunded to your original payment method.
            </Text>
          </View>

          {/* Receiver Details Section */}
          <Text style={styles.title}>Please Provide{'\n'}A Receivers Detail</Text>
          <Text style={styles.subtitle}>
            We need some information about your package to ship it in properly through a traveler.
          </Text>

          <View style={styles.noticeBox}>
            <View style={styles.noticeHeader}>
              <Ionicons name="information-circle-outline" size={24} />
              <Text style={styles.noticeTitle}>Important</Text>
            </View>
            <Text style={styles.noticeText}>
              An OTP will be shared to the receiver's Phone number that has to be shared with the traveler during the delivery process. Ask your receivers to please be present at the delivery point for smooth delivery.
            </Text>
          </View>

          <Text style={styles.inputLabel}>Receivers Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={receiverName}
            onChangeText={setReceiverName}
          />

          <Text style={styles.inputLabel}>Receiver's Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={receiverPhone}
            onChangeText={setReceiverPhone}
            keyboardType="phone-pad"
          />

          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  selectButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectButtonText: {
    color: '#666',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  noticeBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PackageDetailsScreen;