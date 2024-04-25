
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { FlatList, StyleSheet, View } from 'react-native'
import { FAB, Text } from 'react-native-paper';
import { getPokemos } from '../../../actions/pokemons';
import PokeballBg from '../../components/ui/PokeballBg';
import { GlobalTheme } from '../../../config/theme/global-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PokemonCard from '../../components/pokemons/PokemonCard';
import { useTheme } from '@react-navigation/native';
import { RootStackParams } from '../../navigator/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import FullScreenLoading from '../../components/ui/FullScreenLoading';

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> { }

const HomeScreen = ({ navigation }: Props) => {

  //   Normal way to call a api
  //   const { isLoading, data: pokemons } = useQuery({
  //     queryKey: ['pokemons'],
  //     queryFn: () => getPokemos(0),
  //     staleTime: 1000 * 60 * 60, // 60 min
  //   });

  const queryClient = useQueryClient();

  const { isLoading, data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['pokemons', 'infinite'],
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60, // 60 min
    queryFn: async ({ pageParam }) => {
      const pokemons = await getPokemos(pageParam);
      pokemons.forEach(pokemon => {
        queryClient.setQueryData(['pokemon', pokemon.id], pokemon);
      });
      return pokemons;

    },
    getNextPageParam: (lastPage, pages) => pages.length,

  });

  const { top } = useSafeAreaInsets();
  const theme = useTheme();

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <View style={GlobalTheme.margin}>
      <PokeballBg style={styles.imgPosition} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data?.pages.flat() ?? []}
        keyExtractor={(pokemon, index) => `${pokemon.id.toString()}`}
        numColumns={2}
        style={{ paddingTop: top }}
        ListHeaderComponent={() => <Text variant='displayMedium'>Pokedex</Text>}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        onEndReachedThreshold={0.6}
        onEndReached={() => fetchNextPage()}
      />

      <FAB
        label='Search'
        style={[GlobalTheme.fab, { backgroundColor: theme.colors.primary }]}
        mode='elevated'
        onPress={() => navigation.push('SearchScreen')}
        color={theme.dark ? 'black' : 'white'}
      />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100
  }
})