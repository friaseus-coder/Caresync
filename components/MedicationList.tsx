
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useMedication, Medication } from '../lib/useMedication';

const MedicationList = () => {
  const { medications } = useMedication();

  const renderItem = ({ item }: { item: Medication }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Text>{item.dosage}</Text>
    </View>
  );

  return (
    <FlatList
      data={medications}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default MedicationList;
