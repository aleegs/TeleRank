import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	mainView: { alignItems: 'center', flex: 1, justifyContent: 'center' },
});

export default function SearchResultScreen() {
	return <View style={styles.mainView} />;
}
