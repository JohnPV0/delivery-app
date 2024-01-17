import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../theme';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { selectUser, setUser } from '../slices/userSlice';

export default function SignupScreen() {
  const navigation = useNavigation()
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  const initialValues = {
    email: '',
    password: '',
    repeatPassword: ''
  }

  const [formData, setFormData] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    if (formData.email.length === 0 || formData.password.length === 0 || formData.repeatPassword.length === 0) {
      alert('Todos los campos son obligatorios')
      return
    }

    if(!formData.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
      alert('El correo electrónico no es válido')
      return
    }

    if (formData.password !== formData.repeatPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    setLoading(true)
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false)
        setFormData(initialValues)
        dispatch(setUser(user.toJSON()))
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode != undefined) {
          alert('Ha ocurrido un error al registrarse')
        }
        setLoading(false)
        dispatch(setUser(null))
      })
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
      <View className="h-full w-full flex justify-around pt-48">
        {/* Title */}
        <View className="flex items-center mt-5">
          <Animated.Text entering={FadeInUp.delay(1000).springify()} className="text-white font-bold tracking-wider text-5xl">
            Sign Up
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
          <Animated.View  entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput 
              className="text-gray text-xl" 
              placeholder="Password" 
              placeholderTextColor={'gray'}
              secureTextEntry
              onChange={(e) => setFormData({...formData, password: e.nativeEvent.text})}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput 
              className="text-gray text-xl" 
              placeholder="Confirm Password" 
              placeholderTextColor={'gray'} 
              secureTextEntry
              onChange={(e) => setFormData({...formData, repeatPassword: e.nativeEvent.text})}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="w-full">
            {!loading ? (
              <TouchableOpacity 
                onPress={() => onSubmit()}
                className="w-full p-3 rounded-2xl mb-3" 
                style={{backgroundColor: themeColors.bgColor(1)}} >
                <Text className="text-white text-center text-xl font-bold">
                  Sign Up
                </Text>
              </TouchableOpacity>  
            ) : (
              <ActivityIndicator size="large" color={themeColors.bgColor(1)} />
            )}
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className="flex-row justify-center">
            <Text>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="font-bold ml-2" style={{color: themeColors.bgColor(1)}}>Log In</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  )
}