import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import HTMLView from 'react-native-htmlview';

const styles = StyleSheet.create({
	htmlView: { padding: 10 },
	mainView: { alignItems: 'center', justifyContent: 'center' },
});

// TODO: Add multi language support, load from backend (api module LEGALS with query LANGUAGE)

export default function DMCAScreen() {
	const htmlText = `<span>
	<H3>DMCA and Abuses</H3>
	Telerank is a directory of Telegram Channels, Groups and Bots submitted by the Telegram users. <b>This application is not affiliated with Telegram.</b>

	All Channels, Groups, Bots, and Stickers <b>are added by users and we're NOT responsible</b> for the content on their links. We don't host any content of them. 
	
	You should contact the <a href="https://telegram.org/">Telegram Official Team</a> if you think something is wrong about a channel or group. 
	Once the channel or group is removed from Telegram, it will be removed automatically from this application in 24-48 hours.

	Please read the Telegram's FAQ at <a href="https://telegram.org/faq#q-there-39s-illegal-content-on-telegram-how-do-i-take-it-down">Telegram.org</a>

	<H4>A bot or channel is infringing on my copyright. What do I do?</H4>
All Telegram chats and group chats are private amongst their participants. We do not process any requests related to them. But sticker sets, channels, and bots on Telegram are publicly available.

If you see a bot, channel, or sticker set that is infringing on your copyright, kindly submit a complaint to <b>dmca@telegram.org</b>
Please note that such requests should only be submitted by the copyright owner or an agent authorized to act on the owner’s behalf.
	
<H4>There's illegal content on Telegram. How do I take it down?</H4>
All Telegram chats and group chats are private amongst their participants. We do not process any requests related to them.

But sticker sets, channels, and bots on Telegram are publicly available. If you find sticker sets or bots on Telegram that you think are illegal, please report to <b>abuse@telegram.org</b>

You can also use the ‘report’ buttons right inside our app or inside Telegram's app.

Also you can tell Telegram about scams here: <a href="https://t.me/notoscam">https://t.me/notoscam</a>

	If you think there is an issue related to our application, please contact us from the menu option 'Contact'


	</span>`;

	return (
		<ScrollView contentContainerStyle={styles.mainView}>
			<HTMLView value={htmlText} style={styles.htmlView} />
		</ScrollView>
	);
}
