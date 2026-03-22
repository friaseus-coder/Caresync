
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import i18n from '@/lib/i18n';

interface OCRCameraProps {
  onTextRecognized: (text: string) => void;
}

const OCRCamera: React.FC<OCRCameraProps> = ({ onTextRecognized }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedText, setCapturedText] = useState<string | null>(null);
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);

  // Solicitar permisos al montar el componente
  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const captureAndRecognize = useCallback(async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      // Capturar foto con VisionCamera v4
      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
      });

      // Ejecutar OCR sobre la imagen capturada
      const result = await TextRecognition.recognize(`file://${photo.path}`);

      const detectedText = result.blocks
        .map((block) => block.text)
        .join('\n')
        .trim();

      if (detectedText.length > 0) {
        setCapturedText(detectedText);
      } else {
        Alert.alert(i18n.t('analytics.ocr_no_text_alert'));
      }
    } catch (error) {
      console.error('Error durante el OCR:', error);
      Alert.alert(i18n.t('analytics.ocr_error_alert') ?? 'Error al procesar la imagen');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const confirmText = useCallback(() => {
    if (capturedText) {
      onTextRecognized(capturedText);
    }
  }, [capturedText, onTextRecognized]);

  const retakePhoto = useCallback(() => {
    setCapturedText(null);
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.palette.primary} />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="no-photography" size={64} color="#ccc" />
        <Text style={styles.permissionText}>{i18n.t('camera.no_access')}</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="videocam-off" size={64} color="#ccc" />
        <Text style={styles.permissionText}>{i18n.t('camera.no_device')}</Text>
      </View>
    );
  }

  // Estado: texto capturado — mostrar resultado y botones de confirmar/reintentar
  if (capturedText !== null) {
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <MaterialIcons name="article" size={48} color={theme.palette.primary} />
          <Text style={styles.resultTitle}>{i18n.t('analytics.ocr_live_results')}</Text>
          <View style={styles.resultTextBox}>
            <Text style={styles.resultText} numberOfLines={12}>
              {capturedText}
            </Text>
          </View>
          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
              <MaterialIcons name="refresh" size={22} color={theme.palette.primary} />
              <Text style={styles.retakeButtonText}>
                {i18n.t('analytics.ocr_retake') ?? 'Reintentar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={confirmText}>
              <MaterialIcons name="check" size={22} color={theme.palette.white} />
              <Text style={styles.confirmButtonText}>
                {i18n.t('analytics.ocr_confirm_button')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Estado por defecto: viewfinder de cámara
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.overlay}>
        <Text style={styles.hint}>
          {i18n.t('analytics.ocr_aim_hint') ?? 'Apunta al documento con texto'}
        </Text>
        <TouchableOpacity
          style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
          onPress={captureAndRecognize}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={theme.palette.white} />
          ) : (
            <MaterialIcons name="camera-alt" size={32} color={theme.palette.white} />
          )}
        </TouchableOpacity>
        {isProcessing && (
          <Text style={styles.processingText}>
            {i18n.t('analytics.ocr_processing') ?? 'Procesando...'}
          </Text>
        )}
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
    backgroundColor: theme.palette.backgroundLight,
    gap: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.spacingLarge,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    gap: 12,
  },
  hint: {
    color: '#ddd',
    fontSize: 14,
    textAlign: 'center',
  },
  captureButton: {
    backgroundColor: theme.palette.primary,
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  processingText: {
    color: '#bbb',
    fontSize: 13,
  },
  // Pantalla de resultado
  resultContainer: {
    flex: 1,
    backgroundColor: theme.palette.backgroundLight,
    padding: theme.spacing.spacingLarge,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.palette.primary,
  },
  resultTextBox: {
    width: '100%',
    backgroundColor: theme.palette.white,
    borderRadius: theme.borders.borderRadiusLarge,
    padding: theme.spacing.spacingLarge,
    maxHeight: 280,
    elevation: 2,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.palette.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 8,
  },
  retakeButtonText: {
    color: theme.palette.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  confirmButton: {
    backgroundColor: theme.palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
    elevation: 3,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default OCRCamera;
