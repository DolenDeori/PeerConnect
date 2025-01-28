import React from 'react';
import { View, Text } from 'react-native';
import { InformationCircleIcon } from 'react-native-heroicons/outline';

interface ImportantNoticeProps {
  message: string;
}

const ImportantNotice: React.FC<ImportantNoticeProps> = ({ message }) => {
  return (
    <View className="bg-gray-100 rounded-lg p-4 my-6">
      <View className="flex-row items-center mb-2">
        <InformationCircleIcon size={24} color="black" />
        <Text className="text-lg font-semibold ml-2">Important</Text>
      </View>
      <Text className="text-sm text-gray-600 leading-5">{message}</Text>
    </View>
  );
};

export default ImportantNotice;
