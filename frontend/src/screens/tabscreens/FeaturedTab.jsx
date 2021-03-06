import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Checkbox, Button } from 'react-native-paper';
import { ListItem, CheckBox, Body } from 'native-base';
import Stats from '../../components/entries/Stats';
import GlobalSearch from '../../components/entries/GlobalSearch';
import VerticalList from '../../components/entries/VerticalList';
import SectionTitle from '../../components/SectionTitle';
import { getModuleData } from '../../lib/API';
import HorizontalList from '../../components/entries/HorizontalList';
import AddMediaInfoBanner from '../../components/infobanners/AddMediaInfoBanner';
import FeatureInfoBanner from '../../components/infobanners/FeatureInfoBanner';
import { colors, commonStyles } from '../../config/Styles';
import InfoBanner from '../../components/infobanners/InfoBanner';
import Filters from '../../components/entries/Filters';

const tabStyles = StyleSheet.create({
	btn: (color, active) => ({
		borderBottomWidth: active ? 2 : 0,
		borderColor: color,
		paddingBottom: 0,
	}),
	btnContent: { marginHorizontal: -5, marginVertical: 5, paddingBottom: 5, top: 5 },
	btnText: {
		color: colors.grayAlt2,
		top: 6,
	},
	mainView: { alignItems: 'center', backgroundColor: 'white', elevation: 3, width: '100%' },
	scrollView: {},
});

const styles = StyleSheet.create({
	labelsContainer: {
		elevation: 1,
		marginBottom: -5,
		paddingBottom: 3,
		padding: 15,
	},
	subtitleText: {
		color: colors.grayAlt,
		fontSize: 15,
		marginBottom: 10,
		textAlign: 'center',
	},
	titleText: {
		color: colors.main,
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 5,
		textAlign: 'center',
	},
});

export default function MostRated() {
	const navigation = useNavigation();

	const tabs = {
		featured: { apiModule: 'home', title: 'Featured', icon: 'star', color: colors.featured, subtitle: 'Premium channels and groups' },
		mostRated: { apiModule: 'home', title: 'Top Rated', icon: 'crown', color: colors.grayAlt2, subtitle: 'Tell your community to rate you to get better rankings!' },
		mostMembers: { apiModule: 'home', title: 'Popular', icon: 'fire', color: colors.grayAlt2, subtitle: 'Most-viewed channels, bots, groups and stickers' },
		mostViewed: { apiModule: 'home', title: 'Biggest', icon: 'account-group', color: colors.grayAlt2, subtitle: 'Biggest channels and groups by members' },
	};

	const [currTab, setCurrTab] = useState('featured');

	function CustomTabs() {
		return (
			<View style={tabStyles.mainView}>
				<ScrollView showsHorizontalScrollIndicator={false} horizontal style={tabStyles.scrollView}>
					{Object.keys(tabs).map((q) => {
						const t = tabs[q];
						const isActive = currTab === q;
						return (
							<Button key={q} icon={t.icon} contentStyle={tabStyles.btnContent} style={tabStyles.btn(t.color, isActive)} color={t.color} onPress={() => setCurrTab(q)}>
								<Text style={tabStyles.btnText}>{t.title}</Text>
							</Button>
						);
					})}
				</ScrollView>
			</View>
		);
	}

	function HeaderRenderer() {
		return (
			<View>
				<CustomTabs />
				<View style={styles.labelsContainer}>
					<Text style={styles.titleText}>{tabs[currTab].title}</Text>
					<Text style={styles.subtitleText}>{tabs[currTab].subtitle}</Text>
					<Filters />
				</View>
			</View>
		);
	}

	function FooterRenderer() {
		return <View />;
	}

	return (
		<View style={commonStyles.flex}>
			<VerticalList Header={HeaderRenderer} Footer={FooterRenderer} apiModule={tabs[currTab].apiModule} />
		</View>
	);
}
