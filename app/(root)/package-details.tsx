import React, { useState } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Text, View, Modal, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon, ChevronDownIcon } from 'react-native-heroicons/outline';
import CustomButton from '@/components/customButton';
import ImportantNotice from '@/components/importantNotice';

// Define option types
type DropdownOption = {
  label: string;
  value: string;
};

function PackageDetailsScreen() {
  const router = useRouter();
  
  // State for form values
  const [packageType, setPackageType] = useState('');
  const [packageSize, setPackageSize] = useState('');
  const [packageWeight, setPackageWeight] = useState('');
  const [packageContent, setPackageContent] = useState('');
  const [pickupPoint, setPickupPoint] = useState('');
  const [deliveryPoint, setDeliveryPoint] = useState('');
  const [waitingPeriod, setWaitingPeriod] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  
  // State for dropdown modal
  const [modalVisible, setModalVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Dropdown options
  const dropdownOptions = {
    packageType: [
      { label: 'Regular Package', value: 'regular' },
      { label: 'Express Package', value: 'express' },
      { label: 'Fragile Package', value: 'fragile' },
    ],
    packageSize: [
      { label: 'Small (up to 30x30x30 cm)', value: 'small' },
      { label: 'Medium (up to 50x50x50 cm)', value: 'medium' },
      { label: 'Large (up to 100x100x100 cm)', value: 'large' },
    ],
    packageWeight: [
      { label: 'Light (1-5 kg)', value: '1-5' },
      { label: 'Medium (5-10 kg)', value: '5-10' },
      { label: 'Heavy (10-20 kg)', value: '10-20' },
    ],
    packageContent: [
      { label: 'Clothes', value: 'clothes' },
      { label: 'Electronics', value: 'electronics' },
      { label: 'Documents', value: 'documents' },
      { label: 'Books', value: 'books' },
    ],
    waitingPeriod: [
      { label: '1-2 days', value: '1-2' },
      { label: '3-5 days', value: '3-5' },
      { label: '1 week', value: '7' },
    ],
  };

  // Function to handle dropdown selection
  const handleSelect = (value: string) => {
    if (!activeDropdown) return;
    
    switch (activeDropdown) {
      case 'packageType':
        setPackageType(value);
        break;
      case 'packageSize':
        setPackageSize(value);
        break;
      case 'packageWeight':
        setPackageWeight(value);
        break;
      case 'packageContent':
        setPackageContent(value);
        break;
      case 'waitingPeriod':
        setWaitingPeriod(value);
        break;
    }
    setModalVisible(false);
    setActiveDropdown(null);
  };

  // Custom Dropdown Component
  const CustomDropdown = ({ 
    label, 
    value, 
    placeholder, 
    dropdownKey 
  }: { 
    label: string;
    value: string;
    placeholder: string;
    dropdownKey: string;
  }) => (
    <View className="mb-6">
      <Text className="text-lg font-medium mb-2 font-DMSansSemiBold">{label}</Text>
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-100 rounded-lg p-4"
        onPress={() => {
          setActiveDropdown(dropdownKey);
          setModalVisible(true);
        }}
      >
        <Text className={`text-lg ${value ? 'text-black' : 'text-gray-400'}`}>
          {value || placeholder}
        </Text>
        <ChevronDownIcon size={20} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <TouchableOpacity
          className="flex-row items-center p-4"
          onPress={() => router.back()}
        >
          <ChevronLeftIcon size={24} color="black" />
          <Text className="text-lg ml-2 font-DMSansSemiBold">Go back</Text>
        </TouchableOpacity>

        {/* Main Content */}
        <View className="p-4">
          <Text className="text-black font-HostGorteskBold text-4xl">Please Provide{'\n'}The Package Details</Text>
          <Text className="text-lg text-gray-600 mb-6 font-DMSansMedium">
            We need some information about your package to ship it properly through a traveler.
          </Text>

          {/* Package Details Section */}
          <Text className="text-xl font-semibold mb-4 font-DMSansSemiBold">Describe Your Package</Text>

          <CustomDropdown
            label="Package Type"
            value={packageType}
            placeholder="Select Package Type"
            dropdownKey="packageType"
          />

          <CustomDropdown
            label="Package Size"
            value={packageSize}
            placeholder="Choose Size"
            dropdownKey="packageSize"
          />

          <CustomDropdown
            label="Package Weight"
            value={packageWeight}
            placeholder="Choose Weight"
            dropdownKey="packageWeight"
          />

          <CustomDropdown
            label="Package Content"
            value={packageContent}
            placeholder="Choose Content"
            dropdownKey="packageContent"
          />

          {/* Location Details */}
          <CustomDropdown
            label="Pickup Point"
            value={pickupPoint}
            placeholder="Choose Pickup Point"
            dropdownKey="pickupPoint"
          />

          <CustomDropdown
            label="Delivery Point"
            value={deliveryPoint}
            placeholder="Choose Delivery Point"
            dropdownKey="deliveryPoint"
          />

          <CustomDropdown
            label="Waiting Period"
            value={waitingPeriod}
            placeholder="Choose Waiting Time"
            dropdownKey="waitingPeriod"
          />

          <ImportantNotice
            message="If no one pickup your package till waiting period runs out your listed package will be automatically cancelled and you have to repost again. 
            Any payment made will be refunded to your original payment method."
          />

          {/* Receiver Details Section */}
          <Text className="text-4xl font-bold mb-2 mt-6">Please Provide{'\n'}A Receiver's Detail</Text>
          <Text className="text-lg text-gray-600 mb-6">
            We need some information about the receiver for smooth delivery.
          </Text>

          <ImportantNotice
            message="An OTP will be sent to the receiver's phone number, which must be shared with the traveler during the delivery process. Please ensure the receiver is present at the delivery point for a smooth process."
          />

          <View className="mb-6">
            <Text className="text-lg font-medium mb-2">Receiver's Name</Text>
            <TextInput
              className="bg-gray-100 rounded-lg p-4 text-lg"
              placeholder="Enter Name"
              value={receiverName}
              onChangeText={setReceiverName}
            />
          </View>

          <View className="mb-6">
            <Text className="text-lg font-medium mb-2">Receiver's Phone Number</Text>
            <TextInput
              className="bg-gray-100 rounded-lg p-4 text-lg"
              placeholder="Phone Number"
              value={receiverPhone}
              onChangeText={setReceiverPhone}
              keyboardType="phone-pad"
            />
          </View>

          <CustomButton
            title="Next"
            onPress={() => {
              console.log('Next button pressed');
            }}
            bgVariant="secondary"
            textVariant="primary"
            className="mt-6 mb-8"
          />
        </View>
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setActiveDropdown(null);
        }}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Select Option</Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setActiveDropdown(null);
              }}>
                <Text className="text-blue-500 text-lg">Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={activeDropdown ? dropdownOptions[activeDropdown as keyof typeof dropdownOptions] : []}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-3 border-b border-gray-200"
                  onPress={() => handleSelect(item.label)}
                >
                  <Text className="text-lg">{item.label}</Text>
                </TouchableOpacity>
              )}
              className="max-h-72"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default PackageDetailsScreen;