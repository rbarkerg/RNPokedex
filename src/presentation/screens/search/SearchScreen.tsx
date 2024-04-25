import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native'
import { GlobalTheme } from '../../../config/theme/global-theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ActivityIndicator, TextInput } from 'react-native-paper'
import PokemonCard from '../../components/pokemons/PokemonCard'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from '../../navigator/StackNavigator'
import IonIcon from '../../components/ui/IonIcon'
import { useContext, useMemo, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import { getPokemonsByIds, getPokemosToSearch } from '../../../actions/pokemons'
import FullScreenLoading from '../../components/ui/FullScreenLoading'
import useDebouncedValue from '../../hooks/useDebouncedValue'

interface Props extends StackScreenProps<RootStackParams, 'SearchScreen'> { }

const SearchScreen = ({ navigation }: Props) => {

  const { top } = useSafeAreaInsets()
  const { isDark } = useContext(ThemeContext);

  const [term, setTerm] = useState('');

  const debounceValue = useDebouncedValue(term);

  const { isLoading, data: pokemonNameList = [] } = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: () => getPokemosToSearch()
  });

  const pokemonNameListSearched = useMemo(() => {
    // check if issearching by id 
    if (!isNaN(Number(debounceValue))) {
      const pokemon = pokemonNameList.find(pokemon => pokemon.id === Number(debounceValue));
      return pokemon ? [pokemon] : [];
    }

    if (debounceValue.length === 0 || debounceValue.length < 3) return [];

    return pokemonNameList.filter(pokemon =>
      pokemon.name.includes(debounceValue.toLocaleLowerCase()));

  }, [debounceValue]);

  const { isLoading: isLoadingPokemons, data: pokemons = [] } = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameListSearched],
    queryFn: () => getPokemonsByIds(pokemonNameListSearched.map(item => item.id)),
    staleTime: 1000 * 60 * 5, // 5 min 
  });

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <View style={[GlobalTheme.margin, { marginTop: top + 10 }]}>
      <Pressable
        onPress={() => navigation.pop()}
      >
        <IonIcon name='arrow-back-sharp' color={isDark ? 'white' : 'black'} size={30} />
      </Pressable>

      <TextInput
        placeholder='Search pokemon'
        mode='flat'
        autoFocus
        autoCorrect={false}
        onChangeText={(value) => setTerm(value)}
        value={term}
        style={styles.input}
      />

      {isLoadingPokemons && <ActivityIndicator style={{ paddingTop: 20 }} />}

      <FlatList
        showsVerticalScrollIndicator={false}
        data={pokemons}
        keyExtractor={(pokemon, index) => `${pokemon.id.toString()}`}
        numColumns={2}
        style={{ paddingTop: top }}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        ListFooterComponent={<View style={{ height: Platform.OS === 'ios' ? 150 : 100 }} />}
      />

    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  input: {
    marginBottom: 8
  }
})