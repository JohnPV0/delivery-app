import { View, Text, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

export default function SplashScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <StatusBar style='dark' />
      <Image source={require('../../assets/images/bikeGuy.png')} className="w-96 h-96" /> 
    </View>
  )
}