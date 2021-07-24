# FineSwap
Token swap escrow front-end with burnAMint contract backend

# Installation
1. Git clone to your server
2. Set up pairs in `js/index.js` file ([See how](#setting-up-pairs))
3. Fan up your webserver, done!

# Setting Up Pairs
In `js/index.js` file, you will be greeted by this configuration lines

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
### Variable `staticProvider`
This variable provides your visitor data from the web3 ecosystem. Without this, they need to be logged in before accessing those data. This variable only supports read-only methods from a contract, therefore requiring no account to be assigned. (ex. https://bsc-dataseed3.defibit.io/)

### Variable `pairs`
This variable is an array of your pairs, the object explanation is as follow:
 - oldTokenContract: The contract address of your old token (to be swapped)
 - newTokenContract: The contract address of your new token (to be received)
 - burnAMintContract: The contract address where your pair is hosted ([example contract](https://etherscan.io/address/0x4efa063ce441a35c0b92c5600a29b50678a9c17c))
 - ratio: String/Text variable where the first digit is your old token and the second is the new token, both are in real number (ex. '0.1/1' or '10/1' or '100/1')
 - inverted: If the operation is converting oldToken to newToken, this should be `false`, otherwise it should be `true`
**Adding more pairs**
Just duplicate the object inside the array and give commas between each other. Practical example:
```javascript
const pairs = [
	{
		oldTokenContract: '',
		newTokenContract: '',
		burnAMintContract: '',
		ratio: '10/1',
		inversed: false
	}, // We just added comma between each other
	... // Add more, not just 1 or 2 is allowed
	{
		oldTokenContract: '',
		newTokenContract: '',
		burnAMintContract: '',
		ratio: '10/1',
		inversed: true // Different values is allowed
	}, // Additional comma? no worries, its ok
];
```
Use this advantage anyway you like

# Branding Your Site
Many options are available:
1. You can edit the `imgs/favicon.svg` for your tab icon
2. You can edit the `<footer>` element on the `index.html` file to put something related to your brand
3. You can edit the page title or any other meta tags for SEO optimizations
4. You can do anything you want (see [LICENSE](LICENSE.md))

# End Notes
Join our [official telegram group](httpsL//t.me/dfin33) and follow [our twitter](https://twitter.com/Dfine2021) or visit our [website](https://dalecoin.finance) to get more information about us. Thank you for visiting our online repository
