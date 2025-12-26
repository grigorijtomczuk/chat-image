import {
	CHAT_MESSAGE_IMAGE_CLASS,
	MODULE_ID,
	MODULE_NAMESPACE,
} from "./constants.js";

export async function createImageChatMessage(
	imageSrc,
	imageBorderHidden = false
) {
	await ChatMessage.create(
		{
			content: `
				<div class="ci-message">
					<img class="${CHAT_MESSAGE_IMAGE_CLASS}" src="${imageSrc}" style="width: 100%; cursor: pointer; \
					${imageBorderHidden ? "border: 1px solid transparent" : ""}"
					/>
			   	</div>
			   	`,
		},
		{}
	);
}

export function onRenderChatMessage(message, html, messageData) {
	const image = html.find(`img.${CHAT_MESSAGE_IMAGE_CLASS}`);
	image.click((event) => {
		event.preventDefault();
		const imagePopout = new ImagePopout(image.attr("src"));
		imagePopout.options.classes.push(CHAT_MESSAGE_IMAGE_CLASS);
		imagePopout.render(true);
	});
}

export function addButtonToImagePopoutHeader() {
	function addButtonToImagePopoutHeaderWrapper(wrapped, ...args) {
		const headerButtons = wrapped.apply(this, args);
		if (this.options.classes.includes(CHAT_MESSAGE_IMAGE_CLASS)) {
			// In case of opening an ImagePopout from chat, only show close button
			return headerButtons.filter((button) => button.class == "close");
		}

		const button = {
			label: game.i18n.localize(`${MODULE_ID}.button-label`),
			class: "send-to-chat",
			icon: "fas fa-image",
			onclick: async () => {
				createImageChatMessage(this.object);
				this.close();
			},
		};

		headerButtons.unshift(button);
		return headerButtons;
	}

	libWrapper.register(
		MODULE_ID,
		"ImagePopout.prototype._getHeaderButtons",
		addButtonToImagePopoutHeaderWrapper,
		"WRAPPER"
	);
}

export function addEntryToInventoryItemContextMenu() {
	function addEntryToInventoryItemContextMenuWrapper(wrapped, ...args) {
		const entry = {
			name: game.i18n.localize(`${MODULE_ID}.button-label`),
			icon: `<i class="fas fa-image"></i>`,
			callback: (li) => {
				const itemId = li.data("item-id");
				const actor = game.actors.get(
					li.data("uuid").match(/(?<=Actor\.)[^\.]+/)[0]
				);
				const item = actor.items.get(itemId);

				if (item) {
					const imageSrc = item.img;
					createImageChatMessage(imageSrc);
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
		"WRAPPER"
	);
}

export function addMacroFunctions(functions) {
	const functionsObject = functions.reduce((object, func) => {
		object[func.name] = func;
		return object;
	}, {});
	window[MODULE_NAMESPACE] = functionsObject;
}
