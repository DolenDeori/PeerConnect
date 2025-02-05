import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import { ChevronDownIcon } from 'react-native-heroicons/outline';

interface LocationPickerProps {
  label: string;
  value: string;
  placeholder: string;
  onLocationSelect: (location: string) => void;
  apiKey: string;
}

interface Prediction {
  place_id: string;
  description: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  label,
  value,
  placeholder,
  onLocationSelect,
  apiKey,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPlaces = async (text: string) => {
    if (text.length < 2) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}&key=${apiKey}&types=(cities)`
      );

      const data = await response.json();
      
      if (data.status === 'OK') {
        setPredictions(data.predictions);
      } else {
        console.error('Places API Error:', data.status);
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    searchPlaces(text);
  };

  const handleSelect = (prediction: Prediction) => {
    onLocationSelect(prediction.description);
    setModalVisible(false);
    setSearchText('');
    setPredictions([]);
  };

  return (
    <View className="mb-6">
      <Text className="text-lg font-medium mb-2 font-DMSansSemiBold">{label}</Text>
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-100 rounded-lg p-4"
        onPress={() => setModalVisible(true)}
      >
        <Text className={`text-lg ${value ? 'text-black' : 'text-gray-400'}`}>
          {value || placeholder}
        </Text>
        <ChevronDownIcon size={20} color="black" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setSearchText('');
          setPredictions([]);
        }}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Select Location</Text>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  setSearchText('');
                  setPredictions([]);
                }}
              >
                <Text className="text-blue-500 text-lg">Close</Text>
              </TouchableOpacity>
            </View>

            <View className="relative">
              <TextInput
                className="bg-gray-100 rounded-lg p-4 text-lg mb-4"
                placeholder="Search location..."
                value={searchText}
                onChangeText={handleTextChange}
                autoFocus={true}
              />
              {loading && (
                <View className="absolute right-4 top-4">
                  <ActivityIndicator size="small" color="#0000ff" />
                </View>
              )}
            </View>

            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-3 border-b border-gray-200"
                  onPress={() => handleSelect(item)}
                >
                  <Text className="text-lg">{item.description}</Text>
                </TouchableOpacity>
              )}
              className="max-h-72"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LocationPicker;