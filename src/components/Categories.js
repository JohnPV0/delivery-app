import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Toast from 'react-native-toast-message'


export default function Categories({ categories, filterRestaurants, setFilterRestaurants }) {
  const [selectedCategory, setSelectedCategory] = React.useState(null)

  const showToast = (messaje) => {
    Toast.show({
      text1: messaje,
      position: 'top',
      type: 'info',
      visibilityTime: 1500,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    })
  }

  return (
    <View className="mt-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="overflow-visible"
        contentContainerStyle={{
          paddingHorizontal: 20,
          
        }}
      >
        {
          categories.map((category, index) => (
            
            <View key={category.id} className="flex justify-center items-center mr-6">
              <TouchableOpacity className="flex flex-col items-center"
                onPress={() => {
                  setSelectedCategory(category.id === selectedCategory ? null : category.id)
                  setFilterRestaurants(prevState => ({...prevState, selectedCategory: category.name === filterRestaurants.selectedCategory ? null : category.name}))
                }}
                onLongPress={() => showToast(category.name)}
              >
                <View  className={"p-1 rounded-full shadow bg-gray-200" + (category.id === selectedCategory ? " bg-gray-600" : "")}>
                  <Image style={{width: 45, height: 45}} source={{ uri: category.image }} />
                </View>
              </TouchableOpacity>
              <View className="h-5 w-16 items-center overflow-auto">
                <Text className={"text-sm " + (category.id === selectedCategory ? " font-semibold text-gray-800" : "text-gray-500")}>{category.name}</Text>
              </View>
            </View>
          ))
        }
      </ScrollView>
      
    </View>
  )
}