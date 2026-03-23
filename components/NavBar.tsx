// components/NavBar.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type ActiveTab = 'home' | 'products' | 'top10' | 'settings';

interface NavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onBarcodePress: () => void;
}

export function NavBar({ activeTab, onTabChange, onBarcodePress }: NavBarProps) {
  return (
    <View style={styles.nav}>
      {/* home */}
      <TouchableOpacity onPress={() => onTabChange('home')} style={styles.navItem}>
        <FontAwesome5
          name="home"
          size={20}
          solid
          color={activeTab === 'home' ? '#D4F238' : 'rgba(255,255,255,0.5)'}
        />
      </TouchableOpacity>

      {/* search / products */}
      <TouchableOpacity onPress={() => onTabChange('products')} style={styles.navItem}>
        <FontAwesome5
          name="search"
          size={20}
          solid
          color={activeTab === 'products' ? '#D4F238' : 'rgba(255,255,255,0.5)'}
        />
      </TouchableOpacity>

      {/* QR center button — w-14 h-14 bg-white rounded-full -mt-10 border-[6px] border-[#F8F9FB] shadow-xl text-brand-black */}
      <TouchableOpacity onPress={onBarcodePress} style={styles.qrButton} activeOpacity={0.95}>
        <FontAwesome5 name="qrcode" size={24} solid color="#1A1A1A" />
      </TouchableOpacity>

      {/* star / top10 */}
      <TouchableOpacity onPress={() => onTabChange('top10')} style={styles.navItem}>
        <FontAwesome5
          name="star"
          size={20}
          solid
          color={activeTab === 'top10' ? '#D4F238' : 'rgba(255,255,255,0.5)'}
        />
      </TouchableOpacity>

      {/* user / settings */}
      <TouchableOpacity onPress={() => onTabChange('settings')} style={styles.navItem}>
        <FontAwesome5
          name="user"
          size={20}
          solid
          color={activeTab === 'settings' ? '#D4F238' : 'rgba(255,255,255,0.5)'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // nav: fixed bottom-8 left-1/2 -translate-x-1/2 bg-brand-black text-white rounded-full px-6 py-4 shadow-2xl z-50 flex items-center space-x-8
  nav: {
    position: 'absolute',
    bottom: 32, // bottom-8
    alignSelf: 'center',
    backgroundColor: '#1A1A1A', // bg-brand-black
    borderRadius: 9999, // rounded-full
    paddingHorizontal: 24, // px-6
    paddingVertical: 16, // py-4
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32, // space-x-8
    shadowColor: 'rgba(26, 26, 26, 0.3)', // shadow-2xl shadow-brand-black/30
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
    zIndex: 50,
  },
  navItem: {
    // transition-colors (no RN equivalent, just for tap)
  },
  // QR: w-14 h-14 bg-white rounded-full -mt-10 border-[6px] border-[#F8F9FB] shadow-xl text-brand-black
  qrButton: {
    width: 56, // w-14
    height: 56, // h-14
    backgroundColor: '#FFFFFF', // bg-white
    borderRadius: 9999, // rounded-full
    marginTop: -40, // -mt-10
    borderWidth: 6, // border-[6px]
    borderColor: '#F8F9FB', // border-[#F8F9FB]
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // shadow-xl
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
});
