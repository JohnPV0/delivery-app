import { View, Text, TouchableWithoutFeedback, Image } from 'react-native'
import React from 'react'
import * as Icon from 'react-native-feather'
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setRestaurant } from '../slices/restaurantSlice'

export default function RestaurantCard(props) {
  const { item } = props
  const navigation = useNavigation()
  const dispatch = useDispatch()

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('Restaurant', {...item})}
    >
      <View 
        style={{
          shadowColor: themeColors.bgColor(1),
          shadowRadius: 7,
        }}
        className="mr-6 bg-white rounded-3xl shadow-lg w-64">
        <Image className="h-36 w-64 rounded-t-3xl" source={{'uri': item.image}} />
        <View className="px-3 pb-4 space-y-2">
          <Text className="text-lg font-bold pt-2">{item.name}</Text>
          <View className="flex-row items-center space-x-1">
            <Image source={require('../../assets/images/fullStar.png')} className="h-4 w-4"/>
            <Text className="text-xs">
              <Text className="text-green-700">{item.stars}</Text>
              <Text className="text-gray-700">
                ({item.reviews} review) - <Text className="text-gray-700">{item.category}</Text>
              </Text>
            </Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Icon.MapPin color="gray" height="15" width="15" />
            <Text className="text-xs text-gray-700">Nearby - {item.address}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}