import { View, Text, Image, Dimensions, ActivityIndicator } from 'react-native'
import React from 'react'
import RestaurantCard from './RestaurantCard'
import { themeColors } from '../theme'

export default function FilteredRestaurants(props) {
  const { restaurants, loadingRestaurants } = props
  return (
    <View className="mt-5 pb-8 flex-1 items-center"
      style={{
        height: Dimensions.get('window').height - 200,
      }}
    >
      <View className="flex-row justify-center items-center px-4">
          <Text className="text-2xl font-bold pb-5">Resultados</Text>
      </View>
      <View className={"flex-1" + loadingRestaurants ? " justify-center" : ""}>
          {loadingRestaurants ? (
            <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
          ) : (
            restaurants.map((restaurant, index) => {
              return (
                <View key={index} className="pb-10">
                  <RestaurantCard item={restaurant} />
                </View>
              )
            })
          
          )}
     </View>
    </View>
  )
}