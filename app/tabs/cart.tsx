import { AppText } from '@/src/components/forms/global-text';
import Colors from '@/src/constants/colors';
import { View } from 'react-native';

function CartScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AppText style={{ color: Colors.primary }}>Shopping Cart Screen</AppText>
    </View>
  );
}

export default CartScreen;