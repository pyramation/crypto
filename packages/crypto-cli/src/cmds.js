
import _createWallet from './commands/create-wallet';
import _customWallet from './commands/custom-wallet';
import _mnemonicWallet from './commands/mnemonic-wallet';
import _newCoinForWalletGeneratorFromKeys from './commands/new-coin-for-wallet-generator-from-keys';
import _saltDecrypt from './commands/salt-decrypt';
import _saltEncyrpt from './commands/salt-encyrpt';
import _saltGenerate from './commands/salt-generate';
import _signMessage from './commands/sign-message';
import _verifyKey from './commands/verify-key';
import _verifyMessage from './commands/verify-message';
import _walletFromMnemonic from './commands/wallet-from-mnemonic';
const Commands = {};
Commands['createWallet'] = _createWallet;
Commands['customWallet'] = _customWallet;
Commands['mnemonicWallet'] = _mnemonicWallet;
Commands['newCoinForWalletGeneratorFromKeys'] = _newCoinForWalletGeneratorFromKeys;
Commands['saltDecrypt'] = _saltDecrypt;
Commands['saltEncyrpt'] = _saltEncyrpt;
Commands['saltGenerate'] = _saltGenerate;
Commands['signMessage'] = _signMessage;
Commands['verifyKey'] = _verifyKey;
Commands['verifyMessage'] = _verifyMessage;
Commands['walletFromMnemonic'] = _walletFromMnemonic;

  export { Commands }; 

  