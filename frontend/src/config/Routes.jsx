import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationHeader from '../components/navigation/NavigationHeader';
import MainScreen from '../screens/MainScreen';
import DetailsScreen from '../screens/DetailsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import ContactScreen from '../screens/ContactScreen';
import AddMediaScreen from '../screens/AddMediaScreen';
import PromoteScreen from '../screens/PromoteScreen';
import DMCAScreen from '../screens/DMCAScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import SearchResultScreen from '../screens/SearchResultScreen';

const Stack = createStackNavigator();

const DEFAULT_ROUTE = 'Home';

const ROUTES = [
	{
		name: 'Home',
		component: MainScreen,
		title: 'Home',
		extendHeaderGradient: false,
	},
	{
		name: 'Details',
		component: DetailsScreen,
		title: 'Details',
		extendHeaderGradient: true,
	},
	{
		name: 'PrivacyPolicy',
		component: PrivacyPolicyScreen,
		extendHeaderGradient: false,
		title: 'Privacy Policy',
	},
	{
		name: 'TermsOfService',
		component: TermsOfServiceScreen,
		extendHeaderGradient: false,
		title: 'Terms of Service',
	},
	{
		name: 'Contact',
		component: ContactScreen,
		extendHeaderGradient: false,
		title: 'Contact',
	},
	{
		name: 'AddMedia',
		component: AddMediaScreen,
		extendHeaderGradient: false,
		title: 'Add to Directory',
	},
	{
		name: 'Promote',
		component: PromoteScreen,
		extendHeaderGradient: false,
		title: 'Promote/Feature',
	},
	{
		name: 'DMCA',
		component: DMCAScreen,
		extendHeaderGradient: false,
		title: 'DMCA and Abuses',
	},
	{
		name: 'SearchResult',
		component: SearchResultScreen,
		extendHeaderGradient: false,
		title: 'Search Results',
	},
];

export function getRouteInfo(route) {
	return ROUTES.find((q) => q.name === route.name);
}

export function Navigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName={DEFAULT_ROUTE} screenOptions={{ header: (props) => <NavigationHeader {...props} routeInfo={getRouteInfo} /> }}>
				{ROUTES.map((q) => (
					<Stack.Screen key={q.name} name={q.name} component={q.component} screenOptions={{ title: q.title }} />
				))}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
