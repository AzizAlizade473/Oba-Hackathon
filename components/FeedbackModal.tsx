// components/FeedbackModal.tsx

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TranslationDict } from '../i18n/useTranslation';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  feedbackReason: string;
  feedbackComment: string;
  onReasonChange: (reason: string) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: () => void;
  getText: (key: string) => string;
  t: TranslationDict;
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

export function FeedbackModal({
  visible,
  onClose,
  feedbackReason,
  feedbackComment,
  onReasonChange,
  onCommentChange,
  onSubmit,
  getText,
  t,
}: FeedbackModalProps) {
  const { translateY, scale, opacity } = useEnterAnimation(visible);
  const feedbackOptions = t.feedbackOptions as string[] | undefined;

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent onRequestClose={onClose}>
      {/* fixed inset-0 z-[80] flex items-end justify-center */}
      <View style={styles.overlay}>
        {/* backdrop */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        {/* bg-white w-full max-w-md rounded-t-[32px] p-8 animate-enter shadow-2xl */}
        <Animated.View
          style={[
            styles.card,
            { opacity, transform: [{ translateY }, { scale }] },
          ]}
        >
          {/* w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 */}
          <View style={styles.dragHandle} />

          {/* Title: text-xl font-bold mb-4 */}
          <Text style={styles.title}>{getText('reason')}</Text>

          {/* Feedback options: flex flex-wrap gap-2 mb-4 */}
          <View style={styles.optionsRow}>
            {(feedbackOptions || []).map((opt: string) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionChip,
                  feedbackReason === opt && styles.optionChipActive,
                ]}
                onPress={() => onReasonChange(opt)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    feedbackReason === opt && styles.optionTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Comment textarea */}
          <TextInput
            style={styles.textArea}
            placeholder={getText('comment')}
            placeholderTextColor="#9CA3AF" // text-gray-400
            multiline
            numberOfLines={3}
            value={feedbackComment}
            onChangeText={onCommentChange}
          />

          {/* Submit: bg-brand-green text-white font-bold py-4 rounded-2xl */}
          <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} activeOpacity={0.9}>
            <Text style={styles.submitBtnText}>{getText('submit')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // fixed inset-0 z-[80] flex items-end justify-center
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  // backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.6)', // bg-brand-black/60
  },
  // bg-white w-full max-w-md rounded-t-[32px] p-8 animate-enter shadow-2xl
  card: {
    backgroundColor: '#FFFFFF', // bg-white
    width: '100%',
    maxWidth: 448, // max-w-md
    borderTopLeftRadius: 32, // rounded-t-[32px]
    borderTopRightRadius: 32,
    padding: 32, // p-8
    shadowColor: '#000', // shadow-2xl
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
  },
  // w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6
  dragHandle: {
    width: 48, // w-12
    height: 4, // h-1
    backgroundColor: '#E5E7EB', // bg-gray-200
    borderRadius: 9999, // rounded-full
    alignSelf: 'center',
    marginBottom: 24, // mb-6
  },
  // text-xl font-bold mb-4
  title: {
    fontSize: 20, // text-xl
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
    marginBottom: 16, // mb-4
  },
  // flex flex-wrap gap-2 mb-4
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // gap-2
    marginBottom: 16, // mb-4
  },
  // px-4 py-2.5 rounded-xl border border-gray-200 bg-white
  optionChip: {
    paddingHorizontal: 16, // px-4
    paddingVertical: 10, // py-2.5
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: '#E5E7EB', // border-gray-200
    backgroundColor: '#FFFFFF', // bg-white
  },
  // active: bg-brand-black border-brand-black
  optionChipActive: {
    backgroundColor: '#1A1A1A', // bg-brand-black
    borderColor: '#1A1A1A', // border-brand-black
  },
  // text-xs font-semibold text-gray-600
  optionText: {
    fontSize: 12, // text-xs
    fontWeight: '600', // font-semibold
    color: '#4B5563', // text-gray-600
  },
  // active: text-white
  optionTextActive: {
    color: '#FFFFFF', // text-white
  },
  // bg-gray-50 border-0 rounded-2xl p-4 text-sm
  textArea: {
    backgroundColor: '#F9FAFB', // bg-gray-50
    borderWidth: 0,
    borderRadius: 16, // rounded-2xl
    padding: 16, // p-4
    fontSize: 14, // text-sm
    fontWeight: '500', // font-medium
    color: '#111827', // text-gray-900
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  // bg-brand-green text-white font-bold py-4 rounded-2xl
  submitBtn: {
    backgroundColor: '#004D3B', // bg-brand-green
    paddingVertical: 16, // py-4
    borderRadius: 16, // rounded-2xl
    alignItems: 'center',
    justifyContent: 'center',
  },
  // text-white font-bold
  submitBtnText: {
    color: '#FFFFFF', // text-white
    fontWeight: '700', // font-bold
    fontSize: 16,
  },
});
