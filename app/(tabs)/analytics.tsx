
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import OCRCamera from '../../components/OCRCamera';

// Dummy data for analytics history
const initialAnalyticsHistory = [
  {
    id: '1',
    title: 'Analítica - 15/05/2024',
    snippet: 'Glucosa: 98 mg/dL, Colesterol: 190 mg/dL...',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Medical_record_form.svg/1024px-Medical_record_form.svg.png'
  },
  {
    id: '2',
    title: 'Analítica - 10/01/2024',
    snippet: 'Triglicéridos: 150 mg/dL, Hierro: 80 mcg/dL...',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Medical_record_form.svg/1024px-Medical_record_form.svg.png'
  },
];

const AnalyticsScreen = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [analyticsHistory, setAnalyticsHistory] = useState(initialAnalyticsHistory);

  const handleTextRecognized = (text: string) => {
    setShowCamera(false);
    const newAnalysis = {
        id: Date.now().toString(),
        title: `Analítica - ${new Date().toLocaleDateString()}`,
        snippet: text.split('\n').join(', '),
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Medical_record_form.svg/1024px-Medical_record_form.svg.png'
    };
    setAnalyticsHistory([newAnalysis, ...analyticsHistory]);
  };

  if (showCamera) {
    return <OCRCamera onTextRecognized={handleTextRecognized} />;
  }

  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Análisis de Laboratorio</Text>
        </View>
      <ScrollView>
        <View style={styles.mainContent}>
          {/* Scan Button */}
          <TouchableOpacity style={styles.scanButton} onPress={() => setShowCamera(true)}>
            <MaterialIcons name="camera-alt" size={32} color={theme.palette.white} />
            <Text style={styles.scanButtonText}>Digitalizar nueva analítica</Text>
          </TouchableOpacity>

          {/* History Section */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Historial de Analíticas</Text>
            {analyticsHistory.length > 0 ? (
              <View style={styles.historyList}>
                {analyticsHistory.map(item => (
                  <TouchableOpacity key={item.id} style={styles.historyCard}>
                    <Image source={{ uri: item.image }} style={styles.historyImage} />
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyTitle}>{item.title}</Text>
                      <Text style={styles.historySnippet}>{item.snippet}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="folder-open" size={64} color="#e0e0e0" />
                <Text style={styles.emptyStateText}>Aún no has digitalizado ninguna analítica.</Text>
                <Text style={styles.emptyStateSubText}>Usa el botón superior para empezar.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.palette.backgroundLight,
    },
    header: {
        backgroundColor: theme.palette.white,
        padding: theme.spacing.spacingLarge,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: theme.typography.fontFamily,
    },
    mainContent: {
        padding: theme.spacing.spacingLarge,
    },
    scanButton: {
        backgroundColor: theme.palette.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.spacingLarge,
        borderRadius: theme.borders.borderRadiusLarge,
        ...theme.shadows.shadow,
        gap: theme.spacing.spacingMedium,
        marginBottom: theme.spacing.spacingExtraLarge,
    },
    scanButtonText: {
        color: theme.palette.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    historySection: {},
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.spacingLarge,
    },
    historyList: {
        gap: theme.spacing.spacingMedium,
    },
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.palette.white,
        padding: theme.spacing.spacingMedium,
        borderRadius: theme.borders.borderRadiusLarge,
        ...theme.shadows.shadow,
    },
    historyImage: {
        width: 60,
        height: 60,
        borderRadius: theme.borders.borderRadiusMedium,
        backgroundColor: '#f0f0f0',
    },
    historyInfo: {
        flex: 1,
        marginHorizontal: theme.spacing.spacingMedium,
    },
    historyTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    historySnippet: {
        fontSize: 14,
        color: '#666',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.spacingExtraLarge,
        marginTop: theme.spacing.spacingLarge,
        backgroundColor: theme.palette.white,
        borderRadius: theme.borders.borderRadiusLarge,
    },
    emptyStateText: {
        marginTop: theme.spacing.spacingMedium,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#888',
    },
    emptyStateSubText: {
        fontSize: 14,
        color: '#aaa',
    },
});

export default AnalyticsScreen;
