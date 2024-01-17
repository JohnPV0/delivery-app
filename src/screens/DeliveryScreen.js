import { View, Text, Image, TouchableOpacity, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { themeColors } from '../theme'
import * as Icon from 'react-native-feather'
import { useDispatch, useSelector } from 'react-redux'
import { selectRestaurant } from '../slices/restaurantSlice'
import { emptyCart } from '../slices/cartSlice'
import { selectCurrentLocation } from '../slices/locationSlice'
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_API_KEY } from '@env'

export default function DeliveryScreen() {
  const restaurant = useSelector(selectRestaurant)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const currentLocation = useSelector(selectCurrentLocation)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [distance, setDistance] = useState(0)

  const destination = {
    latitude: restaurant.lat,
    longitude: restaurant.lng
  }

  const origin = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude
  }

  const minutesToHms = (d) => {
    const hour = Math.floor(d / 60);
    const minute = Math.trunc(d % 60) + 1;
    return `${hour}h ${minute}m`;
  }
  
  const cancelOrder = () => {
    dispatch(emptyCart())
    navigation.navigate('Home')
  }
  
  useEffect(() => {
    const handleBackPress = () => {
      // Personaliza el comportamiento del botón de atrás para que vaya a la pantalla "Home"
      navigation.navigate('Home');
      return true; // Indica que se ha manejado el evento
    };

    // Agrega el manejador de eventos para el botón de atrás del teléfono
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Limpia el manejador de eventos al desmontar el componente
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  return (
    
    <View style={{ flex: 1 }}>
      <MapView
        initialRegion={{
          latitude: restaurant.lat,
          longitude: restaurant.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        style={{ flex: 1 }}
        mapType='standard'
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={{
            latitude: restaurant.lat,
            longitude: restaurant.lng,
          }}
          title={restaurant.name}
          description={restaurant.description}
          pinColor={themeColors.bgColor(1)}
        />
        <Marker 
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title={'Tú ubicación'}
          description={currentLocation.country}
          pinColor={themeColors.bgColor(1)}
        />
        <MapViewDirections 
          origin={origin}
          destination={destination}
          apikey={GOOGLE_API_KEY}
          strokeWidth={3}
          strokeColor={themeColors.bgColor(0.7)}
          onReady={result => {
            setEstimatedTime(result.duration)
            setDistance(result.distance)
          }}
        />
      </MapView>
      <View className="rounded-t-3xl -mt-12 bg-white relative">
        <View className="flex-row justify-between px-5 pt-10">
          <View>
            <Text className="text-lg text-gray-700 font-semibold">Tiempo estimado de entrega</Text>
            <Text className="text-3xl font-extrabold text-gray-700">{ minutesToHms(estimatedTime) }</Text>
            <Text className="mt-2 text-gray-700 font-semibold">Tu pedido estpa en camino</Text>
          </View>
          <Image className="w-24 h-24" source={require('../../assets/images/bikeGuy2.gif')} />
        </View>
        <View
          style={{backgroundColor: themeColors.bgColor(0.8)}}
          className="p-2 flex-row justify-between items-center rounded-full my-5 mx-2" >
            <View 
              className="p-1 rounded-full"
              style={{backgroundColor: 'rgba(255, 255, 255, 0.4)'}} >
                <Image className="h-16 w-16 rounded-full" source={require('../../assets/images/deliveryGuy.jpg')} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-lg font-bold text-white">
                Syed Noman
              </Text>
              <Text className="font-semibold text-white">
                Tu repartidor
              </Text>
            </View>
            <View className="flex-row items-center space-x-3 mr-3">
              <TouchableOpacity className="bg-white p-2 rounded-full">
                <Icon.Phone fill={themeColors.bgColor(1)} stroke={themeColors.bgColor(1)} strokeWidth={1}/>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => cancelOrder()}
                className="bg-white p-2 rounded-full">
                  <Icon.X stroke={'red'} strokeWidth={4}/>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  )
}