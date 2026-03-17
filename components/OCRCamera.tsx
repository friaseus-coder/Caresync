
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { scanOCR } from 'vision-camera-ocr';
import { runOnJS } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import i18n from '@/lib/i18n';

interface OCRCameraProps {
  onTextRecognized: (text: string) => void;
}

const OCRCamera: React.FC<OCRCameraProps> = ({ onTextRecognized }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('back');
  const [ocrResults, setOcrResults] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleOcrResult = useCallback((result: any) => {
    // result contains blocks, lines, etc.
    const detectedText = result.result.blocks.map((b: any) => b.text).join('\n');
    if (detectedText.length > 10) { // Simple filter to avoid noise
      setOcrResults(prev => [...new Set([...prev, detectedText])]);
    }
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const result = scanOCR(frame);
    runOnJS(handleOcrResult)(result);
  }, [handleOcrResult]);

  const confirmText = () => {
    if (ocrResults.length > 0) {
      onTextRecognized(ocrResults.join('\n'));
    } else {
      Alert.alert(i18n.t('analytics.ocr_no_text_alert'));
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>{i18n.t('camera.no_access')}</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>{i18n.t('camera.no_device')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      <View style={styles.overlay}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>{i18n.t('analytics.ocr_live_results')}</Text>
          <Text numberOfLines={5} style={styles.resultsText}>
            {ocrResults.slice(-3).join('\n')}
          </Text>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={confirmText}>
          <MaterialIcons name="check" size={32} color={theme.palette.white} />
          <Text style={styles.confirmButtonText}>{i18n.t('analytics.ocr_confirm_button')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.spacingLarge,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
  },
  resultsContainer: {
    width: '100%',
    marginBottom: theme.spacing.spacingMedium,
  },
  resultsTitle: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 4,
  },
  resultsText: {
    color: 'white',
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: theme.palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default OCRCamera;
