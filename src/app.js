const express = require("express");
const app = express();
app.use(express.json());
const { ethers } = require("ethers");
const ERC20_ETH_ABI = require("./BridgeEthUsdc.json");
const ERC20_FIL_ABI = require("./BridgeFilUsdc.json");
const WETH_FIL_ABI = require("./BridgeFilwEth.json");
const admin = "0x60f94DBa25380610Dc4cBa80eEE249B6F1007E60";
const ERC20_ETH_ADDRESS = "0x53af486fA636469F3833102f57eD82CAe26ADfD2";
const ERC20_FIL_ADDRESS = "0x7D574C8Fc975afCeb6068a93a0B28F70138c92a7";
const WETH_FIL_ADDRESS = "0xc9C214a1BA1c266e632C3274B2c2d33422f3963b";
const pvtkey =
	"84a239ff5b2917efd3feaa57dbfcb3e05be804c91fcbae6cff5f1124811f78c2";
const providerETH = new ethers.providers.WebSocketProvider(
	"wss://eth-goerli.g.alchemy.com/v2/OeUzKKKE9hMPV5i2-udahf0zD8YfOPoH"
);
const providerFIL = new ethers.providers.JsonRpcProvider(
	"https://api.hyperspace.node.glif.io/rpc/v1"
);
const wallet = new ethers.Wallet(pvtkey);
// const SignerEth = wallet.connect(providerETH);
const SignerFIL = wallet.connect(providerFIL);

const ERC20_ETH_CONTRACT = new ethers.Contract(
	ERC20_ETH_ADDRESS,
	ERC20_ETH_ABI,
	providerETH
);
const ERC20_FIL_CONTRACT = new ethers.Contract(
	ERC20_FIL_ADDRESS,
	ERC20_FIL_ABI,
	SignerFIL
);
const WETH_ETH_CONTRACT = new ethers.Contract(
	WETH_FIL_ADDRESS,
	WETH_FIL_ABI,
	SignerFIL
);

ERC20_ETH_CONTRACT.on("Transfer", async (from, to, amount) => {
	if (to == "0x0000000000000000000000000000000000000000") {
		console.log("from :", from);
		console.log("to :", to);
		console.log("amount :", amount);
		amount = amount.toString();
		const tx = await ERC20_FIL_CONTRACT.mint(from, amount);
		console.log("Tx Hash :", tx);
		await tx.wait();
		console.log("Success 🥳🥳🥳");
	}
});

ERC20_ETH_CONTRACT.on("eth", async (from, amount) => {
	amount = amount.toString();
	const tx = await WETH_ETH_CONTRACT.mint(from, amount);
	console.log("Tx Hash :", tx);
	await tx.wait();
	console.log("Success 🥳🥳🥳");
});

console.log("Server Started..........✅✅✅✅✅");

app.get("/", (req, res, next) => {
	res.status(200).json({ message: "Hello Everyone 👋" });
});

module.exports = app;
