import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import * as bitcoinMessage from 'bitcoinjs-message';
import * as bs58check from 'bs58check';
import * as wif from 'wif';

import { getAddress, signMessage, verifyMessage } from '../src';

// just treat it as a 4 byte hex, like uint32_t
// bip32 pub is {0x04, 0x88, 0xB2, 0x1E} => 0x0488B21E => 76067358
// bip32 priv is {0x04, 0x88, 0xAD, 0xE4} => 0x0488ADE4 => 76066276

// so ive just signed 'gday hows it going'
// public key GWhXzs3hCWNasa1jX5xaSZ6h3uDgc7Lb9H
// signature HwxUI5nHX63tuudKnNzdYTvir58oMo2/p8s44fEub1B/LiBexpj1c/66stsnShITqGePlV1/SqfIYRA4MUOPyvQ=

const network = {
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

const mnemonic =
  'praise you muffin lion enable neck grocery crumble super myself license ghost';
const seed = bip39.mnemonicToSeedSync(mnemonic);

describe('signing', () => {
  it('hard coded', () => {
    var keyPair = bitcoin.ECPair.fromWIF(
      'L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1'
    );
    var privateKey = keyPair.privateKey;
    var message = 'This is an example of a signed message.';

    var signature = bitcoinMessage.sign(
      message,
      privateKey,
      //https://github.com/bitcoinjs/bitcoinjs-message/issues/24
      false // keyPair.compressed
    );
    expect(signature.toString('base64')).toEqual(
      'G9L5yLFjti0QTHhPyFrZCT1V/MMnBtXKmoiKDZ78NDBjERki6ZTQZdSMCtkgoNmp17By9ItJr8o7ChX0XxY91nk='
    );
  });
  it('simple signature', () => {
    const pair = bip32.fromSeed(seed);

    const message = 'hello there you are correct';
    const signed1 = signMessage(
      message,
      pair,
      //https://github.com/bitcoinjs/bitcoinjs-message/issues/24
      // TODO WHY????????
      true, // pair.compressed
      network
    );

    const signature1 = signed1.toString('base64');
    expect(signature1).toMatchSnapshot();

    expect(
      bitcoinMessage.verify(
        message,
        getAddress(pair),
        signature1,
        network.messagePrefix
      )
    ).toBe(true);
  });

  it('network signature', () => {
    const message = 'gday hows it going';
    expect(
      verifyMessage(
        message,
        'GWhXzs3hCWNasa1jX5xaSZ6h3uDgc7Lb9H',
        'HwxUI5nHX63tuudKnNzdYTvir58oMo2/p8s44fEub1B/LiBexpj1c/66stsnShITqGePlV1/SqfIYRA4MUOPyvQ=',
        network
      )
    ).toBe(true);
  });
  it('verify signature', () => {
    const pair = bip32.fromSeed(seed, network);

    const message = 'hello there';
    const signed1 = signMessage(
      message,
      pair,
      //https://github.com/bitcoinjs/bitcoinjs-message/issues/24
      // TODO WHY????????
      true, // pair.compressed
      network
    );
    const { randomBytes } = require('crypto');
    const signed2 = signMessage(
      message,
      pair,
      //https://github.com/bitcoinjs/bitcoinjs-message/issues/24
      // TODO WHY????????
      true, // pair.compressed
      network,
      { extraEntropy: randomBytes(32) }
    );

    // TODO WHY????????
    expect(typeof pair.compressed === 'undefined').toBe(true);

    const signature1 = signed1.toString('base64');
    const signature2 = signed2.toString('base64');

    // without extraEntropy, it's always the same
    expect(signature1).toMatchSnapshot();

    expect(
      verifyMessage(message, getAddress(pair, network), signature1, network)
    ).toBe(true);
    expect(
      verifyMessage(message, getAddress(pair, network), signature2, network)
    ).toBe(true);
  });
});
