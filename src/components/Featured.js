import { View, Text } from 'react-native'
import React from 'react'
import FeaturedRow from './FeaturedRow'

export default function Featured({ featured  }) {
  return (
    <View className="mt-5 pb-14">
      {
        featured.map((item, index) => (
          <FeaturedRow
            key={index}
            title={item.title}
            restaurants={item.restaurants}
            description={item.description}
          />
        ))
      }
    </View>
  )
}