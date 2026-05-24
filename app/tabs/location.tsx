import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { View } from 'react-native';

function LocationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AppText style={{ color: Colors.primary }}>Location / Map Screen</AppText>
    </View>
  );
}

export default LocationScreen;