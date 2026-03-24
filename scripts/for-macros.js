import { MODULE_ID } from "./constants.js";
import { createImageChatMessage } from "./main.js";

export async function sendTokenActorImageToChat(token) {
	if (!token) {
		ui.notifications.warn(
			game.i18n.localize(`${MODULE_ID}.token-selection-error-message`),
		);
		return;
	}

	const tokenImages = await token.actor.getTokenImages();
	const tokenName = token.name;
	const actorThumbnail = token.actor.thumbnail;
	let imageSrc = "";
	let imageBorderHidden = false;
	console.log(tokenImages.length);

	if (!actorThumbnail || tokenImages.length > 1) {
		imageSrc = token.document.texture.src;
		imageBorderHidden = true;
	} else {
		imageSrc = actorThumbnail;
	}

	createImageChatMessage(imageSrc, tokenName, imageBorderHidden);
}

export function sendFileImageToChat() {
	const picker = new FilePicker({
		callback: (filePath) => {
			createImageChatMessage(
				filePath,
				game.i18n.localize(`${MODULE_ID}.image-popout-default-title`),
			);
		},
	});
	picker.render(true);
}
