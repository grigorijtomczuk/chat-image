import { MODULE_ID } from "./constants.js";
import { createImageChatMessage } from "./main.js";

export async function sendTokenActorImageToChat(token) {
	if (!token) {
		ui.notifications.warn(
			game.i18n.localize(`${MODULE_ID}.token-selection-error-message`)
		);
		return;
	}

	const tokenImages = await token.actor.getTokenImages();
	const actorThumbnail = await token.actor.thumbnail;
	let imageSrc = "";
	let imageBorderHidden = false;

	if (!actorThumbnail || tokenImages.length > 1) {
		imageSrc = token.document.texture.src;
		imageBorderHidden = true;
	} else {
		imageSrc = actorThumbnail;
	}

	createImageChatMessage(imageSrc, imageBorderHidden);
}

export function sendFileImageToChat() {
	let imageSrc = "";
	const picker = new FilePicker({
		callback: (filePath) => {
			imageSrc = filePath;
			createImageChatMessage(imageSrc);
		},
	});
	picker.render(true);
}
