import { View, Text, TextInput, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as Icon from 'react-native-feather'
import { themeColors } from '../theme'
import Categories from '../components/Categories'
import Featured from '../components/Featured'
import { app, auth } from '../firebase/firebase'
import { getFirestore, collection, getDocs, getDoc, query, where } from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/firebase'
import Toast from 'react-native-toast-message'
import { signOut } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../slices/userSlice'
import { selectCurrentLocation } from '../slices/locationSlice'
import FilteredRestaurants from '../components/FilteredRestaurants'

export default function HomeScreen({ restaurants }) {

  const [categories, setCategories] = React.useState([])
  const [loadingCategories, setLoadingCategories] = React.useState(false)
  const [featured, setFeatured] = React.useState([])
  const [loadingFeatured, setLoadingFeatured] = React.useState(false)
  const [loginOut, setLoginOut] = React.useState(false)
  const dispatch = useDispatch()
  const currentLocation = useSelector(selectCurrentLocation)
  const [filterRestaurants, setFilterRestaurants] = React.useState({
    searchText: '',
    selectedCategory: null
  })
  const [restaurantsFiltered, setRestaurantsFiltered] = React.useState([])
  const [loadingRestaurants, setLoadingRestaurants] = React.useState(false)

  const onSearchRestaurant = async () => {
    setLoadingRestaurants(true)
    try {
      const db = getFirestore(app)
      const querySnapshot = await getDocs(query(collection(db, "restaurants")))
      const restaurantsData = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
      let filteredRestaurants = restaurantsData.filter(restaurant => restaurant.name.toLowerCase().includes(filterRestaurants.searchText.toLowerCase()))
      if (filterRestaurants.selectedCategory) {
        filteredRestaurants = filteredRestaurants.filter(restaurant => {
          const cetgories = restaurant.type
          return cetgories.includes(filterRestaurants.selectedCategory)
        })
      }
      const restaurants = filteredRestaurants.map(async (restaurant) => {
        const restaurantImageRef = ref(storage, restaurant.image)
        const restaurantImageUrl = await getDownloadURL(restaurantImageRef)
        const dishes = restaurant.dishes
        const dishesPromises = dishes.map(async (dish) => {
          const dishImageRef = ref(storage, dish.image)
          const dishImageUrl = await getDownloadURL(dishImageRef)
          return {...dish, image: dishImageUrl}
        })
        const dishesData = await Promise.all(dishesPromises)
        return {...restaurant, image: restaurantImageUrl, dishes: dishesData}
      })
      const restaurantData = await Promise.all(restaurants)
      setRestaurantsFiltered(restaurantData)
      setLoadingRestaurants(false)
    } catch (error) {
      console.log(error)
      setLoadingRestaurants(false)
    }
  }

  useEffect(() => {
    onSearchRestaurant()
  }, [filterRestaurants])

  useEffect(() => {
    const getCategories = async () => {
      setLoadingCategories(true)
      const db = getFirestore(app)
      const querySnapshot = await getDocs(collection(db, "categories"))
      const promises = querySnapshot.docs.map(async (doc) => {
        const storageRef = ref(storage, doc.data().image);
        const url = await getDownloadURL(storageRef);
        return { ...doc.data(), image: url, id: doc.id };
      });

      const newCategories = await Promise.all(promises);
      setCategories(newCategories);
      setLoadingCategories(false);
    }

    const getFeatured = async () => {
      setLoadingFeatured(true)
      const db = getFirestore(app)
      const querySnapshot = await getDocs(collection(db, "featured"))
      const promises = querySnapshot.docs.map(async (doc) => {
        const featuredData = doc.data()
        const restaurants = featuredData.restaurants.map(async (restaurantRef ) => {
          const restaurantSnapshot = await getDoc(restaurantRef)
          const restaurantImageRef = ref(storage, restaurantSnapshot.data().image)
          const restaurantImageUrl = await getDownloadURL(restaurantImageRef)
          const dishes = restaurantSnapshot.data().dishes
          const dishesPromises = dishes.map(async (dish) => {
            const dishImageRef = ref(storage, dish.image)
            const dishImageUrl = await getDownloadURL(dishImageRef)
            return {...dish, image: dishImageUrl}
          })
          const dishesData = await Promise.all(dishesPromises)
          return {...restaurantSnapshot.data(), image: restaurantImageUrl, dishes: dishesData, id: restaurantRef.id}
        })
        const restaurantData = await Promise.all(restaurants)
        return {...featuredData, restaurants: restaurantData, id: doc.id}
      });

      const newFeatured = await Promise.all(promises); 
      setFeatured(newFeatured);
      setLoadingFeatured(false);
    }

    getFeatured()
    getCategories()
  }, [])
  
  // console.log(featured)

  
  const logout = () => {
    setLoginOut(true)
    signOut(auth).then(() => {
      // console.log("Logout success")
      dispatch(setUser(null))
      setLoginOut(false)
    }).catch((error) => {
      // console.log(error)
      alert("Ha ocurrido un error al cerrar sesión")
      setLoginOut(false)
    })
  }

  return (
    <SafeAreaView className="bg-white">

      <StatusBar style="dark" />
      <View className="flex-row items-center space-x-2 px-4 pb-2">
        <View className="flex-row flex-1 items-center p-3 ga rounded-full border border-gray-300">
          <Icon.Search height="25" width="25" stroke='gray' />
          <TextInput 
            className="flex-1 ml-2" 
            placeholder="Restaurantes"
            value={filterRestaurants.searchText}
            onChange={e => setFilterRestaurants({...filterRestaurants, searchText: e.nativeEvent.text})}
          />
          { (filterRestaurants.searchText.length > 0) && (
            <TouchableOpacity onPress={() => setFilterRestaurants(prevState => ({...prevState, searchText: ''}))}>
              <Icon.X height="30" width="30" stroke='gray' />
            </TouchableOpacity>
          )}
        
          <View className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 pr-4 border-l-gray-300 overflow-clip w-28">
            <Icon.MapPin height="20" width="20" stroke='gray' />
            <Text className="text-gray-600 text-xs">{`${currentLocation.city}, ${currentLocation.country}`}</Text>
          </View>
        </View>
        {loginOut ? (
          <View className="flex justify-center items-center">
            <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={logout}
            style={{backgroundColor: themeColors.bgColor(1)}}
            className="p-3 ga rounded-full">
            <Icon.LogOut height="20" width="20" strokeWidth={2.5} stroke='white' />
          </TouchableOpacity>
        )}
      </View>

      {/* main */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        
      >
        {/* Categories */}
        {loadingCategories ? (
          <View className="flex justify-center items-center mt-10">
            <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
          </View>
        ) : (<Categories categories={categories} filterRestaurants={filterRestaurants} setFilterRestaurants={setFilterRestaurants}/>)}

        {(filterRestaurants.searchText.length > 0 || filterRestaurants.selectedCategory != null) 
          ? (
            <FilteredRestaurants restaurants={restaurantsFiltered} loadingRestaurants={loadingRestaurants}/>
          ) : (
            <View style={{
              flex: 1,
              flexGrow: 1,
              minHeight: Dimensions.get('window').height - 120,
          }}>
              {loadingFeatured ? (
                <View className="flex-1 h-full justify-center items-center">
                  <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
                </View>
              ) : (
                <Featured featured={featured}/>
              )}
            </View>
          )}
      </ScrollView>
      <Toast />
    </SafeAreaView>
  )
}