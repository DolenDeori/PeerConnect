import React from 'react';
import { View, Text } from 'react-native';
import { InformationCircleIcon } from 'react-native-heroicons/outline';
import { InfoCardProps } from '@/types/type';

const ImportantNotice = ({message}: InfoCardProps) => {
  return (
    <View className="bg-gray-100 rounded-lg p-4 my-6">
      <View className="flex-row items-center mb-2">
        <InformationCircleIcon size={24} color="black" />
        <Text className="text-lg font-medium mb-1 font-DMSansSemiBold ml-2">Important</Text>
      </View>
      <Text className="text-sm font-medium mb-1 font-DMSansRegular ">{message}</Text>
    </View>
  )
}
export default ImportantNotice;

