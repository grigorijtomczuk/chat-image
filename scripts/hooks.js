import {
	addEntryToInventoryItemContextMenu,
	addMacroFunctions,
	addOptionToImagePopoutHeader,
	onRenderChatMessage,
} from "./main.js";
import {
	sendFileImageToChat,
	sendTokenActorImageToChat,
} from "./for-macros.js";

import { MODULE_ID } from "./constants.js";

Hooks.once("init", () => {
	if (typeof Babele !== "undefined") {
		game.babele.register({
			module: MODULE_ID,
			lang: "en",
			dir: "lang/babele/en",
		});
		game.babele.register({
			module: MODULE_ID,
			lang: "ru",
			dir: "lang/babele/ru",
		});
	}
});

Hooks.once("setup", () => {
	Hooks.on("renderChatMessage", onRenderChatMessage);
});

Hooks.once("ready", () => {
	if (!game.modules.get("lib-wrapper")?.active && game.user.isGM) {
		ui.notifications.error(
			game.i18n.localize(`${MODULE_ID}.libwrapper-error-message`),
		);
		return;
	}
	addOptionToImagePopoutHeader();
	addEntryToInventoryItemContextMenu();
	addMacroFunctions([sendTokenActorImageToChat, sendFileImageToChat]);
});
