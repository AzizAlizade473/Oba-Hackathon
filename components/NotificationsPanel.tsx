// components/NotificationsPanel.tsx

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Notification {
  id: number;
  title: string;
  msg: string;
  time: string;
  type: 'reward' | 'info';
}

interface NotificationsPanelProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  getText: (key: string) => string;
}

export function NotificationsPanel({ visible, onClose, notifications, getText }: NotificationsPanelProps) {
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      slideAnim.setValue(Dimensions.get('window').width);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent onRequestClose={onClose}>
      {/* fixed inset-0 z-[60] flex justify-end */}
      <View style={styles.overlay}>
        {/* absolute inset-0 bg-brand-black/20 backdrop-blur-sm */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        {/* w-3/4 max-w-sm bg-white h-full relative z-10 p-6 flex flex-col shadow-2xl */}
        <Animated.View style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}>
          {/* Header: flex justify-between items-center mb-8 */}
          <View style={styles.header}>
            {/* text-xl font-bold text-gray-900 */}
            <Text style={styles.title}>{getText('settings_notif')}</Text>
            <TouchableOpacity onPress={onClose}>
              {/* fas fa-times text-gray-400 */}
              <FontAwesome5 name="times" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* space-y-4 */}
          <View style={styles.notifList}>
            {notifications.map((notif) => (
              /* bg-gray-50 p-4 rounded-2xl flex gap-4 */
              <View key={notif.id} style={styles.notifCard}>
                {/* w-2 h-2 mt-2 rounded-full shrink-0 */}
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: notif.type === 'reward' ? '#D4F238' : '#3B82F6' },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  {/* font-bold text-sm text-gray-900 */}
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  {/* text-xs text-gray-500 mt-1 */}
                  <Text style={styles.notifMsg}>{notif.msg}</Text>
                  {/* text-[10px] text-gray-300 mt-2 */}
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // fixed inset-0 z-[60] flex justify-end
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  // absolute inset-0 bg-brand-black/20 backdrop-blur-sm
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.2)', // bg-brand-black/20
  },
  // w-3/4 max-w-sm bg-white h-full relative z-10 p-6 flex flex-col shadow-2xl
  panel: {
    width: '75%', // w-3/4
    maxWidth: 384, // max-w-sm
    backgroundColor: '#FFFFFF', // bg-white
    height: '100%', // h-full
    padding: 24, // p-6
    shadowColor: '#000', // shadow-2xl
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
    zIndex: 10,
  },
  // flex justify-between items-center mb-8
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32, // mb-8
  },
  // text-xl font-bold text-gray-900
  title: {
    fontSize: 20, // text-xl
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
  },
  // space-y-4
  notifList: {
    gap: 16, // space-y-4
  },
  // bg-gray-50 p-4 rounded-2xl flex gap-4
  notifCard: {
    backgroundColor: '#F9FAFB', // bg-gray-50
    padding: 16, // p-4
    borderRadius: 16, // rounded-2xl
    flexDirection: 'row',
    gap: 16, // gap-4
  },
  // w-2 h-2 mt-2 rounded-full shrink-0
  dot: {
    width: 8, // w-2
    height: 8, // h-2
    marginTop: 8, // mt-2
    borderRadius: 9999, // rounded-full
    flexShrink: 0,
  },
  // font-bold text-sm text-gray-900
  notifTitle: {
    fontWeight: '700', // font-bold
    fontSize: 14, // text-sm
    color: '#111827', // text-gray-900
  },
  // text-xs text-gray-500 mt-1
  notifMsg: {
    fontSize: 12, // text-xs
    color: '#6B7280', // text-gray-500
    marginTop: 4, // mt-1
  },
  // text-[10px] text-gray-300 mt-2
  notifTime: {
    fontSize: 10, // text-[10px]
    color: '#D1D5DB', // text-gray-300
    marginTop: 8, // mt-2
  },
});
