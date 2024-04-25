import { StyleSheet, View } from 'react-native'
import React from 'react'
import { ActivityIndicator, useTheme } from 'react-native-paper'

const FullScreenLoading = () => {

  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.primary} size={50} />
    </View>
  )
}

export default FullScreenLoading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

})