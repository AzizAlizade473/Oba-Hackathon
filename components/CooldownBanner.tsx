// components/CooldownBanner.tsx

import React, { useRef, useEffect, useState } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CooldownBannerProps {
  visible: boolean;
  timeText: string;
  onClose: () => void;
  getText: (key: string) => string;
}

export function CooldownBanner({ visible, timeText, onClose, getText }: CooldownBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      setExpanded(false);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 5000);
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visible, opacity]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    if (!expanded && timeoutRef.current) {
      // Clear auto-close if user expands it to read
      clearTimeout(timeoutRef.current);
    } else if (expanded) {
      // Resume auto-close if they collapse it
      timeoutRef.current = setTimeout(() => onClose(), 5000);
    }
  };

  const template = getText('rating_wait_message') || '{time}';
  const displayMessage = template.replace('{time}', timeText);

  if (!visible) return null;

  return (
    <Animated.View style={[s.toastContainer, { opacity }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={toggleExpand} style={s.toast}>
        <View style={s.topRow}>
          <FontAwesome5 name="clock" size={16} solid color="#FBBF24" style={{ marginRight: 8 }} />
          <Text style={s.toastText}>{displayMessage}</Text>
          <FontAwesome5
            name={expanded ? "chevron-up" : "chevron-down"}
            size={12}
            color="#9CA3AF"
            style={{ marginLeft: 12 }}
          />
        </View>

        {expanded && (
          <View style={s.expandedContent}>
            <Text style={s.explanation}>
              {getText('cooldown_explanation')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    maxWidth: '85%',
    zIndex: 400,
  },
  toast: {
    backgroundColor: 'rgba(26,26,26,0.95)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    flexShrink: 1,
    flex: 1,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  explanation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
  },
});
