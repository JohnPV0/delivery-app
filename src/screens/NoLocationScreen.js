import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { themeColors } from '../theme'
import { StatusBar } from 'expo-status-bar'
import { useDispatch } from 'react-redux'
import { setCurrentLocation } from '../slices/locationSlice'
import * as Location from 'expo-location';
import {  GOOGLE_API_KEY } from '@env'

export default function NoLocationScreen({ route }) {

    const dispatch = useDispatch()


   //Obtener ubicación actual y requerir permisos y colocarla en el estado
   const getLocation = async () => {
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
       // Construye la URL con las coordenadas
       const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

       // Hace la solicitud a la API de Google Maps
       const response = await fetch(apiUrl);
       const data = await response.json();
       // Verifica si hay resultados en la respuesta
        if (data.results && data.results.length > 0) {
          // Extrae los datos de la respuesta
          const addressInfo = data.results[0].address_components;

          const getComponentLongName = (type) => {
            const component = addressInfo.find((component) => component.types.includes(type));
            return component ? component.long_name : '';
          };

          const country = getComponentLongName('country');
          const state = getComponentLongName('administrative_area_level_1');
          const city = getComponentLongName('locality');
          const neighborhood = getComponentLongName('sublocality_level_1');
          const postalCode = getComponentLongName('postal_code');
          const street = getComponentLongName('route');

          console.log(country)


          dispatch(setCurrentLocation({
            latitude, longitude, country, state, city, neighborhood, postalCode, street
          }))
        } else {
          console.error('No se encontraron resultados de la dirección.');
          dispatch(setCurrentLocation(null))
        }
      } else {
        console.error('Permiso de ubicación no concedido');
        dispatch(setCurrentLocation(null))
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      dispatch(setCurrentLocation(null))
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <StatusBar  style='dark' />
      <Image source={require('../../assets/images/bikeGuy.png')} className="w-64 h-64" />
      <Text className="text-2xl font-bold text-center">Ha ocurrido un error al obtener la ubicación</Text>
      <TouchableOpacity onPress={getLocation}>
        <Text style={{color: themeColors.bgColor(1)}} className="text-center text-sm font-bold">Reintentar</Text>
      </TouchableOpacity>
    </View>
  )
}