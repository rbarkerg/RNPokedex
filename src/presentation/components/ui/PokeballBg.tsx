import { useContext } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native'
import { ThemeContext } from '../../context/ThemeContext';

interface Props {
  style: StyleProp<ImageStyle>;
}
const PokeballBg = ({ style }: Props) => {

  const { isDark } = useContext(ThemeContext);
  const pokemonImg = isDark ?
    require('../../../assets/pokeball-light.png') :
    require('../../../assets/pokeball-dark.png');

  return (
    <Image
      source={pokemonImg}
      style={[styles.img, style]}
    />
  )
}

export default PokeballBg

const styles = StyleSheet.create({
  img: {
    width: 300,
    height: 300,
    opacity: 0.3
  }
})