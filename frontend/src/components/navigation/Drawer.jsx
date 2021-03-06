import React, { useRef } from 'react';
import SideMenu from 'react-native-side-menu-updated';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, ScrollView, View, Image, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { List } from 'react-native-paper';
import { colors } from '../../config/Styles';
import { ShareApp, RateApp } from '../../lib/Share';
import LanguageModal from '../modals/LanguageModal';
import StatsModal from '../modals/StatsModal';
import { Languages } from '../../config/Locale';

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';

const styles = StyleSheet.create({
	avatar: {
		borderRadius: 24,
		height: 48,
		width: 48,
	},
	avatarContainer: {
		marginBottom: 0,
		marginTop: 30,
		paddingLeft: 30,
		paddingVertical: 30,
	},
	avatarText: {
		color: 'white',
		left: 10,
		top: 15,
	},
	featuredItemTitle: { color: 'orange', fontWeight: 'bold' },
	headerView: { flexDirection: 'row' },
	listView: { backgroundColor: 'white' },
	scrollView: {
		backgroundColor: colors.main,
		flex: 1,
		height: window.height,
		paddingVertical: 0,
		width: window.width,
	},
});

const Drawer = ({ children, isOpen, setIsOpen, navigation, language }) => {
	const languageModalRef = useRef();
	const statsModalRef = useRef();

	const langObj = Languages.find((q) => q.code === language);
	const langDisplay = langObj ? langObj.displayStr : 'Undefined';

	const onMenuItemSelected = (item) => {
		setIsOpen(false);

		switch (item) {
			case 'PrivacyPolicy':
			case 'DMCA':
			case 'TermsOfService':
			case 'Information':
			case 'AddMedia':
			case 'Promote':
			case 'Contact':
				if (navigation) navigation.navigate(item);
				break;
			case 'ShareApp':
				ShareApp();
				break;
			case 'RateApp':
				RateApp();
				break;
			case 'Stats':
				statsModalRef.current.show();
				break;
			case 'Language':
				languageModalRef.current.show();
				break;
			default:
				break;
		}
	};

	const MenuContent = () => (
		<ScrollView scrollsToTop={false} style={styles.scrollView}>
			<View style={styles.avatarContainer}>
				<TouchableOpacity>
					<View style={styles.headerView}>
						<Image style={styles.avatar} source={{ uri }} />
						<Text style={styles.avatarText}>Telerank</Text>
					</View>
				</TouchableOpacity>
			</View>

			{/* onItemSelected('About') */}
			<View style={styles.listView}>
				<List.Section>
					<List.Subheader>
						<Text>Directory</Text>
					</List.Subheader>
					<List.Item title='Add channels' left={(props) => <List.Icon {...props} icon='bullhorn' />} onPress={() => onMenuItemSelected('AddMedia')} />
					<List.Item title='Add groups' left={(props) => <List.Icon {...props} icon='forum' />} onPress={() => onMenuItemSelected('AddMedia')} />
					<List.Item title='Add bots' left={(props) => <List.Icon {...props} icon='robot' />} onPress={() => onMenuItemSelected('AddMedia')} />
					<List.Item title='Add stickers' left={(props) => <List.Icon {...props} icon='sticker' />} onPress={() => onMenuItemSelected('AddMedia')} />
					<List.Item
						style={{ backgroundColor: colors.featuredLight }}
						titleStyle={styles.featuredItemTitle}
						title='Promote/Feature'
						onPress={() => onMenuItemSelected('Promote')}
						left={(props) => <List.Icon {...props} icon='star' color={colors.featured} />}
					/>
				</List.Section>
				<List.Section>
					<List.Subheader>
						<Text>Telerank</Text>
					</List.Subheader>
					<List.Item title='Language' description={langDisplay} left={(props) => <List.Icon {...props} icon='cog' />} onPress={() => onMenuItemSelected('Language')} />
					<List.Item title='Statistics' left={(props) => <List.Icon {...props} icon='chart-bar' />} onPress={() => onMenuItemSelected('Stats')} />
					{/* TODO: Transformar el componente stats a independiente para poder usarlo aca en un modal */}
					<List.Item title='Contact' left={(props) => <List.Icon {...props} icon='email' />} onPress={() => onMenuItemSelected('Contact')} />
					<List.Item title='Rate our app' left={(props) => <List.Icon {...props} icon='heart' />} onPress={() => onMenuItemSelected('RateApp')} />
					<List.Item title='Share our app' left={(props) => <List.Icon {...props} icon='share-variant' />} onPress={() => onMenuItemSelected('ShareApp')} />
				</List.Section>
				<List.Section>
					<List.Subheader>
						<Text>Legal</Text>
					</List.Subheader>
					<List.Item title='DMCA/Report Abuse' left={(props) => <List.Icon {...props} icon='forum' />} onPress={() => onMenuItemSelected('DMCA')} />
					<List.Item title='Privacy Policy' left={(props) => <List.Icon {...props} icon='forum' />} onPress={() => onMenuItemSelected('PrivacyPolicy')} />
					<List.Item title='Terms of Service' left={(props) => <List.Icon {...props} icon='forum' />} onPress={() => onMenuItemSelected('TermsOfService')} />
				</List.Section>
			</View>
		</ScrollView>
	);

	return (
		<SideMenu menu={<MenuContent />} isOpen={isOpen} onChange={(openState) => setIsOpen(openState)}>
			{children}
			<LanguageModal ref={languageModalRef} />
			<StatsModal ref={statsModalRef} />
		</SideMenu>
	);
};

Drawer.defaultProps = {
	children: null,
	navigation: null,
};

Drawer.propTypes = {
	children: PropTypes.any,
	setIsOpen: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
	navigation: PropTypes.object,
	language: PropTypes.string.isRequired,
};

const mapStateToProps = ({ drawerState, settings }) => ({
	isOpen: drawerState.isOpen,
	navigation: drawerState.navigation,
	language: settings.language,
});

const mapDispatchToProps = (dispatch) => ({
	setIsOpen: dispatch.drawerState.setIsOpen,
});

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
