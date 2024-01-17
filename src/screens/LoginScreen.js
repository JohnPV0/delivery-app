import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../theme';
import { auth } from '../firebase/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../slices/userSlice';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  })

  const onSubmitLogin = () => {
    if (formData.email.length === 0 || formData.password.length === 0) {
      alert('Todos los campos son obligatorios')
      return
    }
    setLoading(true)
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        setLoading(false)
        // Signed in 
        const user = userCredential.user;
        dispatch(setUser(user.toJSON()))
        return
      })
      .catch((error) => {
        setLoading(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log( errorCode)
        if(errorCode != undefined) {
          alert('Ha ocurrido un error al iniciar sesión')
        }
      });
  }
  

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style='light' />
      <Image className="h-full w-full absolute" source={require('../../assets/images/background.png')} />

      {/* Lights */}
      <View className="flex-row justify-around w-full absolute">
        <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className="h-[255] w-[90]" source={require('../../assets/images/light.png')} />
        <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className="h-[160] w-[65]" source={require('../../assets/images/light.png')} />
      </View>

      {/* Title and form */}
      <View className="h-full w-full flex justify-around pt-40 pb-10">
        {/* Title */}
        <View className="flex items-center mt-5">
          <Animated.Text entering={FadeInUp.delay(1000).springify()} className="text-white font-bold tracking-wider text-5xl">
            Login
          </Animated.Text>
        </View>

        {/* Form */}
        <View className="flex items-center mx-4 space-y-4">
          <Animated.View  entering={FadeInDown.duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput 
              className="text-gray text-xl" 
              placeholder="Email" 
              placeholderTextColor={'gray'}
              onChange={(e) => setFormData({...formData, email: e.nativeEvent.text})}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput 
              className="text-gray text-xl" 
              placeholder="Password" 
              placeholderTextColor={'gray'} 
              secureTextEntry
              onChange={(e) => setFormData({...formData, password: e.nativeEvent.text})}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="w-full">
            {loading ? (
               <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
            ) : (
              <TouchableOpacity
                onPress={onSubmitLogin} 
                className="w-ful p-3 rounded-2xl mb-3" 
                style={{backgroundColor: themeColors.bgColor(1)}}>
                <Text className="text-white text-center text-xl font-bold">
                  Login
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
            <Text>¿No tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text className="ml-2 font-bold" style={{color: themeColors.bgColor(1)}}>Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  )
}