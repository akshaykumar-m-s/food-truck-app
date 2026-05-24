import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { View } from 'react-native';

function SearchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AppText style={{ color: Colors.primary  }}>Search Screen</AppText>
    </View>
  );
}

export default SearchScreen;