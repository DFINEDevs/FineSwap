# FineSwap
Token swap escrow front-end with burnAMint contract backend

# Installation
1. Git clone to your server
2. Set up pairs in `index.js` file ([See how](#setting-up-pairs))
3. Fan up your webserver, done!

# Setting Up Pairs
In `index.js` file, you will be welcomed with configuration

```javascript
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
```
### Variable staticProvider
This variable provides your visitor data from the web3 ecosystem. Without this, they need to be logged in before accessing those data. This variable only supports read-only methods from a contract, therefore requiring no account to be assigned. (ex. 

### Variable pairs
This variable is an array of your pairs, the object explanation is as follow:
 - oldTokenContract: The contract address of your old token (to be swapped)
 - newTokenContract: The contract address of your new token (to be received)
 - burnAMintContract: The contract address where your pair is hosted ([example contract](https://etherscan.io/address/0x4efa063ce441a35c0b92c5600a29b50678a9c17c))
 - ratio: String/Text variable where the first digit is your old token and the second is the new token, both are in real number (ex. '0.1/1' or '10/1' or '100/1')
 - inverted: If the operation is converting oldToken to newToken, this should be `false`, otherwise it should be `true`
