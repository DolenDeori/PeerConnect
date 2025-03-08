import React from 'react';
import { View, Text } from 'react-native';
import { InformationCircleIcon } from 'react-native-heroicons/outline';
import { InfoCardProps } from '@/types/type';

const ImportantNotice = ({message}: InfoCardProps) => {
  return (
<<<<<<< HEAD
    <View className="bg-gray-100 rounded-lg p-4 my-6">
      <View className="flex-row items-center mb-2">
        <InformationCircleIcon size={24} color="black" />
        <Text className="text-lg font-medium mb-1 font-DMSansSemiBold ml-2">Important</Text>
      </View>
      <Text className="text-sm font-medium mb-1 font-DMSansRegular ">{message}</Text>
=======
    <View className='p-4 bg-gray-100 rounded-md my-4'>
      <View className='flex flex-row items-center gap-2'>
        <InformationCircleIcon size={25} color="#333" />
        <Text className='font-DMSansSemiBold'>Info</Text>
      </View>
      <Text className='mt-2 font-DMSansRegular'>
        {message}
      </Text>
>>>>>>> 978818ba377bdbd98d89c5909436237beeec3076
    </View>
  )
}
export default ImportantNotice;

