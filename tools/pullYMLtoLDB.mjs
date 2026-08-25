import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { promises as fs } from "fs";

const PACKAGE_ID = process.cwd();
const yaml = true;
const folders = true;

const packs = await fs.readdir("./packs/_source");
for (const pack of packs) {
	if (pack.startsWith(".")) continue;
	console.log("Packing " + pack);
	await compilePack(
		`${PACKAGE_ID}/packs/_source/${pack}`,
		`${PACKAGE_ID}/packs/${pack}`,
		{ yaml, recursive: folders },
	);
}
