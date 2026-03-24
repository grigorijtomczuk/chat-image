import {
	CHAT_MESSAGE_IMAGE_CLASS,
	MODULE_ID,
	MODULE_NAMESPACE,
} from "./constants.js";

export async function createImageChatMessage(
	imageSrc,
	imageTitle = game.i18n.localize(`${MODULE_ID}.image-popout-default-title`),
	imageBorderHidden = false,
) {
	await ChatMessage.create(
		{
			content: `
				<div class="ci-message">
					<img class="${CHAT_MESSAGE_IMAGE_CLASS}" src="${imageSrc}" \
					data-title="${imageTitle}" style="width: 100%; cursor: pointer; \
					${imageBorderHidden ? "border: 1px solid transparent" : ""}"
					/>
			   	</div>
			   	`,
		},
		{},
	);
}

export function onRenderChatMessage(message, html, messageData) {
	const image = html.find(`img.${CHAT_MESSAGE_IMAGE_CLASS}`);
	image.click((event) => {
		event.preventDefault();
		const imagePopout = new ImagePopout({
			src: image.attr("src"),
			window: { title: image.data("title") },
		});
		imagePopout.options.classes.push(CHAT_MESSAGE_IMAGE_CLASS);
		imagePopout.render(true);
	});
}

export function addOptionToImagePopoutHeader() {
	function addOptionToImagePopoutHeaderWrapper(wrapped, ...args) {
		const headerOptions = wrapped.apply(this, args);
		if (this.options.classes.includes(CHAT_MESSAGE_IMAGE_CLASS)) {
			// Remove options for images sent via this feature
			return [];
		}

		const image = this.element.querySelector("img");
		const option = {
			label: game.i18n.localize(`${MODULE_ID}.button-label`),
			action: "sendToChat",
			icon: "fas fa-image",
			onClick: async () => {
				createImageChatMessage(image.src, this.window.title.innerText);
				this.close();
			},
		};

		headerOptions.unshift(option);
		return headerOptions;
	}

	libWrapper.register(
		MODULE_ID,
		"ImagePopout.prototype._getHeaderControls",
		addOptionToImagePopoutHeaderWrapper,
		"WRAPPER",
	);
}

export function addEntryToInventoryItemContextMenu() {
	function addEntryToInventoryItemContextMenuWrapper(wrapped, ...args) {
		const entry = {
			name: game.i18n.localize(`${MODULE_ID}.button-label`),
			icon: `<i class="fas fa-image"></i>`,
			callback: (li) => {
				const itemId = li.data("item-id");
				const appId = li.closest(".app").data("appid");
				const app = ui.windows[appId];

				const actor = app?.actor;
				const item = actor?.items.get(itemId);

				if (item) {
					createImageChatMessage(item.img, item.name);
				} else {
					console.error(`Item with ID ${itemId} not found.`);
				}
			},
		};
		const contextMenuEntries = wrapped.apply(this, args);
		contextMenuEntries.splice(1, 0, entry);
		return contextMenuEntries;
	}

	libWrapper.register(
		MODULE_ID,
		"dnd5e.applications.components.InventoryElement.prototype._getContextOptions",
		addEntryToInventoryItemContextMenuWrapper,
		"WRAPPER",
	);
}

export function addMacroFunctions(functions) {
	const functionsObject = functions.reduce((object, func) => {
		object[func.name] = func;
		return object;
	}, {});
	window[MODULE_NAMESPACE] = functionsObject;
}
