import React from 'react';
import { View, Text } from 'react-native';
import { InformationCircleIcon } from 'react-native-heroicons/outline';
import { InfoCardProps } from '@/types/type';

const ImportantNotice = ({message}: InfoCardProps) => {
  return (
    <View className='p-4 bg-gray-100 rounded-md my-4'>
      <View className='flex flex-row items-center gap-2'>
        <InformationCircleIcon size={25} color="#333" />
        <Text className='font-DMSansSemiBold'>Info</Text>
      </View>
      <Text className='mt-2 font-DMSansRegular'>
        {message}
      </Text>
    </View>
  )
}
export default ImportantNotice;
