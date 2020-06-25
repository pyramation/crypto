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
import * as wif from 'wif';

// https://github.com/bitcoin/bitcoin/blob/master/src/chainparams.cpp#L126-L132
// https://github.com/bitgreen/bitgreen/blob/master/src/chainparams.cpp#L227-L233

// just treat it as a 4 byte hex, like uint32_t
// bip32 pub is {0x04, 0x88, 0xB2, 0x1E} => 0x0488B21E => 76067358
// bip32 priv is {0x04, 0x88, 0xAD, 0xE4} => 0x0488ADE4 => 76066276

const network = {
  messagePrefix: '\x19MyCoin Signed Message:\n',
  bech32: 'bg',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x26,
  scriptHash: 0x6,
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
