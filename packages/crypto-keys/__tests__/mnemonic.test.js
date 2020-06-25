import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import * as bs58check from 'bs58check';
import * as wif from 'wif';

import { getAddress } from '../src';

// just treat it as a 4 byte hex, like uint32_t
// bip32 pub is {0x04, 0x88, 0xB2, 0x1E} => 0x0488B21E => 76067358
// bip32 priv is {0x04, 0x88, 0xAD, 0xE4} => 0x0488ADE4 => 76066276

// so ive just signed 'gday hows it going'
// public key GWhXzs3hCWNasa1jX5xaSZ6h3uDgc7Lb9H
// signature HwxUI5nHX63tuudKnNzdYTvir58oMo2/p8s44fEub1B/LiBexpj1c/66stsnShITqGePlV1/SqfIYRA4MUOPyvQ=

const network = {
  //   messagePrefix: 'BitGreen Signed Message:\n',
  messagePrefix: '\x19BitGreen Signed Message:\n',
  bech32: 'bg',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x26,
  scriptHash: 0x6,
  wif: 0x2e
};

describe('bip39', () => {
  it('verify mnemonic', () => {
    const mnemonic =
      'praise you muffin lion enable neck grocery crumble super myself license ghost';
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed, network);
    const strng = node.toBase58();
    const restored = bip32.fromBase58(strng, network);

    expect(getAddress(node, network)).toEqual(getAddress(restored, network)); // same public key
    expect(node.toWIF()).toEqual(restored.toWIF()); // same private key

    expect(mnemonic).toMatchSnapshot();
    expect(getAddress(node, network)).toMatchSnapshot();
    expect(node.toWIF()).toMatchSnapshot();
  });
  it('generate mnemonic', () => {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed, network);
    const strng = node.toBase58();
    const restored = bip32.fromBase58(strng, network);
    expect(getAddress(node, network)).toEqual(getAddress(restored, network)); // same public key
    expect(node.toWIF()).toEqual(restored.toWIF()); // same private key
  });
});
