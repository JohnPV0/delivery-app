import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import RestaurantScreen from "./screens/RestaurantScreen";
import CartScreen from "./screens/CartScreen";
import OrderPrepairingScreen from "./screens/OrderPrepairingScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "./slices/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import SplashScreen from "./screens/SplashScreen";
import axios from 'axios';
import * as Location from 'expo-location';
import { selectCurrentLocation, setCurrentLocation } from "./slices/locationSlice";
import NoLocationScreen from "./screens/NoLocationScreen";
import { GOOGLE_API_KEY } from "@env"

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [loading, setLoading] = useState(false)
  const [restaurants, setRestaurants] = useState([]);
  

  const currentLocation = useSelector(selectCurrentLocation)
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

  // Función para cargar datos de restaurantes cercanos
  const loadNearbyRestaurants = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentLocation.latitude},${currentLocation.longitude}&radius=1000&type=restaurant&key=${GOOGLE_API_KEY}`
      );
      const responseDataFiltered = response.data.results.filter(restaurant => !restaurant.permanently_closed) 
      setRestaurants(responseDataFiltered);
    } catch (error) {
      console.error('Error al obtener datos de restaurantes:', error);
    }
  };

  //Verificar sesión una vez que el estado user cambie
  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, (userRes) => {
      if (userRes) {
        const uid = userRes.uid
        // console.log("Usuario logueado")
        setLoading(false)
      } else {
        // console.log("Usuario no logueado")
        setLoading(false)
      }
    });
    return () => unsubscribe();
  }, [user])

  //Verificar sesión al cargar la aplicación
  useEffect(() => { 
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, (userRes) => {
      if (userRes) {
        dispatch(setUser(userRes.toJSON()))
        setLoading(false)
      } else {
        dispatch(setUser(null))
        setLoading(false)
      }
    });
    return () => unsubscribe();
  }, [])

  //Obtener ubicación al cargar la aplicación
  useEffect(() => {
    getLocation()
  }, []);

  //Cargar restaurantes cercanos al obtener la ubicación
  useEffect(() => {
    if (currentLocation) {
      loadNearbyRestaurants();
    }
  }, [currentLocation]);

  const getScreen = () => {
    
    if (currentLocation && user) {
      return (
        <Stack.Navigator 
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} initialParams={{restaurants: restaurants}}/>
          <Stack.Screen name="Restaurant" component={RestaurantScreen} />
          <Stack.Screen name="Cart" options={{
            presentation: 'modal',
          }} component={CartScreen} />
          <Stack.Screen name="OrderPrepairing" options={{
            presentation: 'fullScreenModal'
          }} component={OrderPrepairingScreen} />
          <Stack.Screen name="Delivery" options={{presentation:'fullScreenModal'}} component={DeliveryScreen} />
        </Stack.Navigator>
      )
    } else if ((currentLocation && !user) || (!currentLocation && !user)) {
      return (
        <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
        </Stack.Navigator>
      )
    } else {
      return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="NoLocation" component={NoLocationScreen} />
        </Stack.Navigator>
      )
    }
  }

  if (loading) return <SplashScreen />



  return (
    <NavigationContainer>
      {getScreen()}
    </NavigationContainer>
  )
}
