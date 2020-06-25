import {
  privToPrivPrefix,
  pubToNetworkPrefix,
  verifyPrivate,
  getAddress,
  newWallet,
  infoForWalletNet,
  networkInfoFromKeys
} from '../src';
import * as bitcoin from 'bitcoinjs-lib';
import * as bs58check from 'bs58check';
const wif = require('wif');

const network = {
  messagePrefix: '\x19MyCoin Signed Message:\n',
  bip32: {
    public: 0x0, // NOT YET USED
    private: 0x0 // NOT YET USED
  },
  pubKeyHash: 0x26,
  scriptHash: 0x0, // NOT YET USED
  wif: 0x2e
};
const PRIVATE_KEY = '7ud9qWb9VeiDRYUi68y5H2xogG8eZxztEZ2n1BvNFmdcND5Mrw9Z';
const PUBLIC_KEY = 'GNnjQYyr7tzhe6L3SZwwFWrf4JKR6ZHH97';

describe('test', () => {
  it('pubToNetworkPrefix', () => {
    expect(pubToNetworkPrefix(PUBLIC_KEY)).toMatchSnapshot();
  });
  it('privToPrivPrefix', () => {
    expect(privToPrivPrefix(PRIVATE_KEY)).toMatchSnapshot();
  });
  it('verifyPrivate', () => {
    expect(verifyPrivate(PRIVATE_KEY, network)).toEqual(PUBLIC_KEY);
  });
  it('infoForWalletNet', () => {
    expect(infoForWalletNet(PUBLIC_KEY, PRIVATE_KEY)).toMatchSnapshot();
  });
  it('networkInfoFromKeys', () => {
    expect(networkInfoFromKeys(PUBLIC_KEY, PRIVATE_KEY)).toMatchSnapshot();
  });
  it('newWallet', () => {
    const wallet = newWallet(network);
    expect(wallet.public).toBeTruthy();
    expect(wallet.private).toBeTruthy();
    expect(wallet.pair).toBeTruthy();
    const pair = bitcoin.ECPair.fromWIF(wallet.private, network);
    expect(getAddress(pair, network)).toEqual(wallet.public);
    expect(verifyPrivate(wallet.private, network)).toEqual(wallet.public);
  });
  it('using wif', () => {
    const wifValue = wif.decode(PRIVATE_KEY);
    const pair = bitcoin.ECPair.fromPrivateKey(wifValue.privateKey, {
      compressed: wifValue.compressed,
      network
    });
    // and should be equal
    const test = bitcoin.ECPair.fromWIF(PRIVATE_KEY, network);
    expect(test).toEqual(pair);
    const address = getAddress(pair, network);
    expect(address).toMatchSnapshot();
    expect(address).toEqual(PUBLIC_KEY);
  });
});
