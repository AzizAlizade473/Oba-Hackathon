// components/InstructionsModal.tsx

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface InstructionsModalProps {
  visible: boolean;
  onClose: () => void;
  getText: (key: string) => string;
}

function useEnterAnimation(trigger: boolean) {
  const translateY = useRef(new Animated.Value(10)).current;
  const scale = useRef(new Animated.Value(0.98)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (trigger) {
      translateY.setValue(10);
      scale.setValue(0.98);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 300 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 300 }),
        Animated.timing(opacity, { toValue: 1, useNativeDriver: true, duration: 180 }),
      ]).start();
    }
  }, [trigger]);
  return { translateY, scale, opacity };
}

export function InstructionsModal({ visible, onClose, getText }: InstructionsModalProps) {
  const { translateY, scale, opacity } = useEnterAnimation(visible);

  const steps = [
    {
      num: '1',
      // Step 1: bg-green-50 text-brand-green
      numBg: '#F0FDF4', // bg-green-50
      numColor: '#004D3B', // text-brand-green
      title: getText('instr_step1_title'),
      desc: getText('instr_step1_desc'),
    },
    {
      num: '2',
      // Step 2: bg-orange-50 text-orange-500
      numBg: '#FFF7ED', // bg-orange-50
      numColor: '#F97316', // text-orange-500
      title: getText('instr_step2_title'),
      desc: getText('instr_step2_desc'),
    },
    {
      num: '3',
      // Step 3: bg-brand-lime/20 text-brand-green
      numBg: 'rgba(212, 242, 56, 0.2)', // bg-brand-lime/20
      numColor: '#004D3B', // text-brand-green
      title: getText('instr_step3_title'),
      desc: getText('instr_step3_desc'),
    },
  ];

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent onRequestClose={onClose}>
      {/* fixed inset-0 z-[70] flex items-center justify-center p-6 */}
      <View style={styles.overlay}>
        {/* absolute inset-0 bg-brand-black/60 backdrop-blur-sm */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        {/* bg-white w-full max-w-sm rounded-[32px] p-8 animate-enter overflow-hidden */}
        <Animated.View
          style={[
            styles.card,
            { opacity, transform: [{ translateY }, { scale }] },
          ]}
        >
          {/* Header row */}
          <View style={styles.headerRow}>
            {/* text-xl font-bold */}
            <Text style={styles.title}>{getText('instr_title')}</Text>
            {/* w-8 h-8 bg-gray-50 rounded-full */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <FontAwesome5 name="times" size={12} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Steps: space-y-5 */}
          <View style={styles.stepsList}>
            {steps.map((step) => (
              /* flex items-start gap-4 */
              <View key={step.num} style={styles.stepRow}>
                {/* w-10 h-10 rounded-xl flex items-center justify-center */}
                <View style={[styles.stepNumBox, { backgroundColor: step.numBg }]}>
                  <Text style={[styles.stepNumText, { color: step.numColor }]}>{step.num}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  {/* font-bold text-sm text-gray-900 */}
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  {/* text-xs text-gray-500 mt-1 leading-relaxed */}
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Done button: bg-brand-black text-white font-bold py-4 rounded-2xl shadow-xl */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.9}>
            <Text style={styles.doneBtnText}>{getText('instr_btn')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // fixed inset-0 z-[70] flex items-center justify-center p-6
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24, // p-6
  },
  // absolute inset-0 bg-brand-black/60 backdrop-blur-sm
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.6)', // bg-brand-black/60
  },
  // bg-white w-full max-w-sm rounded-[32px] p-8 animate-enter overflow-hidden
  card: {
    backgroundColor: '#FFFFFF', // bg-white
    width: '100%',
    maxWidth: 384, // max-w-sm
    borderRadius: 32, // rounded-[32px]
    padding: 32, // p-8
    overflow: 'hidden',
  },
  // flex justify-between items-center mb-5
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // mb-5
  },
  // text-xl font-bold
  title: {
    fontSize: 20, // text-xl
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
  },
  // w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center
  closeBtn: {
    width: 32, // w-8
    height: 32, // h-8
    backgroundColor: '#F9FAFB', // bg-gray-50
    borderRadius: 9999, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
  },
  // space-y-5
  stepsList: {
    gap: 20, // space-y-5
  },
  // flex items-start gap-4
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16, // gap-4
  },
  // w-10 h-10 rounded-xl flex items-center justify-center
  stepNumBox: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 12, // rounded-xl
    alignItems: 'center',
    justifyContent: 'center',
  },
  // font-bold text-base
  stepNumText: {
    fontWeight: '700', // font-bold
    fontSize: 16, // text-base
  },
  // font-bold text-sm text-gray-900
  stepTitle: {
    fontWeight: '700', // font-bold
    fontSize: 14, // text-sm
    color: '#111827', // text-gray-900
  },
  // text-xs text-gray-500 mt-1 leading-relaxed
  stepDesc: {
    fontSize: 12, // text-xs
    color: '#6B7280', // text-gray-500
    marginTop: 4, // mt-1
    lineHeight: 18, // leading-relaxed
  },
  // bg-brand-black text-white font-bold py-4 rounded-2xl shadow-xl mt-6
  doneBtn: {
    backgroundColor: '#1A1A1A', // bg-brand-black
    paddingVertical: 16, // py-4
    borderRadius: 16, // rounded-2xl
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24, // mt-6
    shadowColor: '#000', // shadow-xl
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  // text-white font-bold
  doneBtnText: {
    color: '#FFFFFF', // text-white
    fontWeight: '700', // font-bold
    fontSize: 16,
  },
});
