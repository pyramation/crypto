import _createWallet from './commands/create-wallet';
import _customWallet from './commands/custom-wallet';
import _mnemonicWallet from './commands/mnemonic-wallet';
import _newCoinForWalletGeneratorFromKeys from './commands/new-coin-for-wallet-generator-from-keys';
import _signMessage from './commands/sign-message';
import _verifyKey from './commands/verify-key';
import _verifyMessage from './commands/verify-message';
import _walletFromMnemonic from './commands/wallet-from-mnemonic';
const Commands = {};
Commands['createWallet'] = _createWallet;
Commands['customWallet'] = _customWallet;
Commands['mnemonicWallet'] = _mnemonicWallet;
Commands[
  'newCoinForWalletGeneratorFromKeys'
] = _newCoinForWalletGeneratorFromKeys;
Commands['signMessage'] = _signMessage;
Commands['verifyKey'] = _verifyKey;
Commands['verifyMessage'] = _verifyMessage;
Commands['walletFromMnemonic'] = _walletFromMnemonic;

export { Commands };
