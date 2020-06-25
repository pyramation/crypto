import allCoins from '@pyramation/crypto-coins';
import * as bitcoin from 'bitcoinjs-lib';
import * as bs58check from 'bs58check';

export const getNetworkFromHashAndWifVersion = (pubKeyHash, wif) => {
  return {
    messagePrefix: '\x19MyCoin Signed Message:\n',
    bip32: {
      public: 0x0, // TODO DONT USE
      private: 0x0 // TODO DONT USE
    },
    pubKeyHash,
    scriptHash: 0x0, // TODO DONT USE
    wif
  };
};

export const getChars = (pubKeyHash, wif) => {
  const network = getNetworkFromHashAndWifVersion(pubKeyHash, wif);

  const cmp = {};
  for (let i = 0; i < 250; i++) {
    const pair = bitcoin.ECPair.makeRandom({ network, compressed: true });
    cmp[pair.toWIF()[0]] = 1;
  }

  const uncmp = {};
  for (let i = 0; i < 250; i++) {
    const pair = bitcoin.ECPair.makeRandom({ network, compressed: false });
    uncmp[pair.toWIF()[0]] = 1;
  }

  return {
    compressed: Object.keys(cmp).sort(),
    uncompressed: Object.keys(uncmp).sort()
  };
};

export const pubToNetworkPrefix = (publicAddr) => {
  return bitcoin.address.fromBase58Check(publicAddr).version.toString(16);
};

export const privToPrivPrefix = (privateKey) => {
  return bs58check.decode(privateKey)[0].toString(16);
};

export const networkInfoFromKeys = function (pub, priv) {
  const networkVersion = pubToNetworkPrefix(pub);
  const privateKeyPrefix = privToPrivPrefix(priv);

  let { compressed, uncompressed } = getChars(
    parseInt(networkVersion, 16),
    parseInt(privateKeyPrefix, 16)
  );

  if (uncompressed.length > 1) uncompressed = `[${uncompressed.join('')}]`;
  else uncompressed = uncompressed[0];
  if (compressed.length > 1) compressed = `[${compressed.join('')}]`;
  else compressed = compressed[0];

  return {
    networkVersion,
    privateKeyPrefix,
    uncompressed,
    compressed
  };
};

export const infoForWalletNet = function (pub, priv) {
  const {
    networkVersion,
    privateKeyPrefix,
    uncompressed,
    compressed
  } = networkInfoFromKeys(pub, priv);

  const similar = allCoins
    .filter((c) => {
      if (
        c[1] === parseInt(networkVersion, 16) &&
        c[2] === parseInt(privateKeyPrefix, 16)
      ) {
        return true;
      }
    })
    .map((c) => c[0]);

  return {
    networkVersion,
    privateKeyPrefix,
    compressed,
    uncompressed,
    similar,
    message: `array to add to WalletGenerator.net:
<nameOfCoin>
0x${networkVersion}
0x${privateKeyPrefix}
${uncompressed}
${compressed}
<donationAddr>
    `
  };
};

export const networkFromCurrencyGeneratorArray = (array) => {
  return getNetworkFromHashAndWifVersion(array[1], array[2]);
};

export const newWallet = (network) => {
  const pair = bitcoin.ECPair.makeRandom({ network });
  return {
    public: getAddress(pair, network),
    private: pair.toWIF(),
    pair
  };
};

export const getAddress = (pair, network) => {
  return bitcoin.payments.p2pkh({ pubkey: pair.publicKey, network }).address;
};

export const verifyPrivate = (privateKey, network) => {
  const pair = bitcoin.ECPair.fromWIF(privateKey, network);
  return getAddress(pair, network);
};
