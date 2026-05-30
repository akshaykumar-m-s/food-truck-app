import Colors from '@/src/constants/colors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

function TabLayout() {

    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: 'transparent',
                tabBarInactiveTintColor: 'transparent',
                gestureEnabled: route.name !== 'cart',
                tabBarStyle: [
                    styles.tabBar,
                    route.name === 'cart' && { display: 'none' },
                ],
            })}
        >
            {[
                { name: 'home', icon: 'home', lib: Feather },
                { name: 'location', icon: 'map-outline', lib: MaterialCommunityIcons },
                { name: 'search', icon: 'search', lib: Feather },
                { name: 'cart', icon: 'shopping-cart', lib: Feather },
                { name: 'account', icon: 'user', lib: Feather },
            ].map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={[styles.iconCircle, focused && styles.activeCircle]}>
                                <tab.lib
                                    name={tab.icon as any}
                                    size={20}
                                    color={focused ? Colors.primary : '#FFF'}
                                />
                            </View>
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        height: Platform.OS === 'ios' ? 95 : 80,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderTopWidth: 0,
        elevation: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        paddingBottom: Constants.statusBarHeight,
    },
    iconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
    },
    activeCircle: {
        backgroundColor: Colors.accent,
        borderWidth: 0,
        transform: [{ scale: 1.1 }],
    },
});

export default TabLayout;