/*
Swapping script, the core functionality. Please defer it.
*/

/**
 * CONFIGURATION SECTION
 * Read README.md for more details
 */
const staticProvider = '';
const pairs = [
	{
		oldTokenContract: '',
		newTokenContract: '',
		burnAMintContract: '',
		ratio: '10/1',
		inversed: false
	}
];

/******************************************************************************************************************
******************************************     END OF THE CONFIG     **********************************************
******************************************     USERS DO NOT PASS     *********************************************/

window.web3 = new Web3(staticProvider);

/**
 * @function $
 * This function is a shorthand for document.querySelector[All]
 */
window.$ = (selector) => {
	let els = document.querySelectorAll(selector);
	if (els.length == 1) return els[0];
	else return els;
};

/**
 * @function Number.toFixed
 * This function is overloaded to not round the numbers
 */
Number.prototype.toFixed = function(n) {
	// Original src: https://helloacm.com/javascripts-tofixed-implementation-without-rounding/
	// Some code altered.

	const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
	let a = this.toLocaleString('fullwide', {useGrouping: 0}).match(reg);
	a = a ? a[0] : '0';

	const dot = a.indexOf(".");
	if (dot === -1) { // integer, insert decimal dot and pad up zeros
		return a + "." + "0".repeat(n);
	}
	const b = n - (a.length - dot) + 1;
	return b > 0 ? (a + "0".repeat(b)) : a;
}

async function allowance(tokenAddress, spenderAddress, amount) {
	if (!senderAccount) return false;

	let token = new web3.eth.Contract(erc20ABI, tokenAddress);
	let allowed = await token.methods.allowance(senderAccount, spenderAddress).call();
	if (allowed < amount) {
		// Request allowance
		try {
			await token.methods.approve(spenderAddress, amount).send({
				from: senderAccount
			}).on('transactionhash', (hash) => {
				alert('Success', `The transaction hash is ${hash}`);
			});

			return true;
		} catch (e) {
			return false;
		}
	}
}

// Initialize pairs dropdown
(async () => {
	for (let i = 0; i < pairs.length; i++) {
		let pair = pairs[i];
		let opt = document.createElement('div');


		// Create attributes
		// 'value' attribute
		let attr = document.createAttribute('value');
		attr.value = i.toString();
		opt.attributes.setNamedItem(attr);
		// 'selected' attribute
		// only for the first option
		if (i == 0) {
			attr = document.createAttribute('selected');
			opt.attributes.setNamedItem(attr);
		}


		// Assign option display
		if (!pair.oldTokenContract || !pair.newTokenContract) continue;

		let ot = new web3.eth.Contract(erc20ABI, pair.oldTokenContract);
		let nt = new web3.eth.Contract(erc20ABI, pair.newTokenContract);
		// Get oldToken and newToken symbol
		let otSymbol = await ot.methods.symbol().call();
		let ntSymbol = await nt.methods.symbol().call();
		// Assign to innerText
		opt.innerText = `${otSymbol} -> ${ntSymbol}`;


		// Append option to dropdown
		$('#pair').appendChild(opt);
	}

	$('#pair').render();
})();

// Select pair dropdown onchange event
$('#pair').addEventListener('changed', async function(newValue) {
	if (isNaN(+newValue)) return;

	// Reassign contracts
	window.burnAMint = new web3.eth.Contract(burnAMintABI, pairs[+newValue].burnAMintContract);
	window.oldToken = new web3.eth.Contract(erc20ABI, pairs[+newValue].oldTokenContract);
	window.newToken = new web3.eth.Contract(erc20ABI, pairs[+newValue].newTokenContract);


	// Rerender display
	$('#pairName').innerText = $('#pair').options[+newValue].innerText;
	$('#ratio').innerText = pairs[+newValue].ratio;
	// Check balances
	if (senderAccount) {
		let symbols = $('#pairName').innerText.split(' -> ');
		// Fetch balances
		let oldBalance = await oldToken.methods.balanceOf(senderAccount).call();
		let newBalance = await newToken.methods.balanceOf(senderAccount).call();
		// Normalize numbers
		oldBalance = +(web3.utils.fromWei(oldBalance)).toFixed(4);
		newBalance = +(web3.utils.fromWei(newBalance)).toFixed(4);
		// Assign to innerTextes
		$('#myOldBalance').innerText = `${oldBalance} ${symbols[0]}`;
		$('#myNewBalance').innerText = `${newBalance} ${symbols[1]}`;
	} else {
		// Assign defaults to innerTextes
		$('#myOldBalance').innerText = `0.0000 ${symbols[0]}`;
		$('#myNewBalance').innerText = `0.0000 ${symbols[1]}`;
	}
});

// Swap Now button onclick
$('#swapButton').addEventListener('click', async function() {
	// Assign variables
	let pair = pairs[+($('#pair').value)];
	let oldAmount = $('#oldAmount').value;
	let newAmount = $('#newAmount').value;


	// Checks
	// User input checks
	if (!pair) {
		return alert('Error', 'Pair not available');
	} else if (isNaN(+oldAmount) || +oldAmount < 0) {
		return alert('Error', 'Old token amount invalid');
	} else if (isNaN(+newAmount) || +newAmount < 0) {
		return alert('Error', 'New token amount invalid');
	}
	// Web3 checks
	if (!senderAccount && window.ethereum !== undefined) {
		// Do login procedure
		// 'ethereum' global variable provided by Metamask
		let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		window.senderAccount = accounts[0];
		// Reinit provider
		window.web3 = new Web3(ethereum);
	} else if (window.ethereum === undefined) {
		// Tell user to install metamask
		return alert(
			'Error',
			'Please install metamask before using this service. Other wallet will be supported'
		);
	}
	// Check contracts
	if (!window.oldToken || !window.newToken || !window.burnAMint) {
		// Emit onchange event
		$('#pair').emitonchange();
	}
	// Check allowance
	// Only check the oldToken because burnAMint contract doesn't do
	// any transferFrom call to newToken
	let res = allowance(pair.oldTokenContract, pair.burnAMintContract, 1 + '0'.repeat(69));
	if (!res) {
		return alert('Error', 'Failed creating transaction for token approval request');
	}


	// Do transaction
	try {
		await burnAMint.methods.burnamint(
			pair.oldTokenContract, pair.newTokenContract,
			pair.inversed, senderAccount, oldAmount
		).send({
			from: senderAccount,
			value: '0'
		}).on('transactionhash', (hash) => {
			alert('Success', `The transaction hash is ${hash}`);
		});
	} catch (e) {
		alert('Error', 'Failed creating transaction for token swap');
	}
});
