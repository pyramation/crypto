import bitcoin from 'bitcoinjs-lib';
import bs58check from 'bs58check';
import allCoins from '@pyramation/crypto-coins';
export const getNetwork = (pubKeyHash, wif) => {
  return {
    messagePrefix: '',
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
  const network = getNetwork(pubKeyHash, wif);

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

export const infoForWalletNet = function (pub, priv) {
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

  console.log('array to add to WalletGenerator.net:');

  console.log(
    '<nameOfCoin>',
    `0x${networkVersion}`,
    `0x${privateKeyPrefix}`,
    `'${uncompressed}'`,
    `'${compressed}'`,
    '<donationAddr>'
  );

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

  if (similar.length) {
    console.log(`\nyour coin is similar to ${similar.join(', ')}`);
  }
};

export const newWallet = (pubKeyHash, wif) => {
  const network = getNetwork(pubKeyHash, wif);
  var pair = bitcoin.ECPair.makeRandom({ network });
  return {
    public: pair.getAddress(),
    private: pair.toWIF()
  };
};

export const verifyPrivate = (privateKey, pubKeyHash, wif) => {
  const network = require('./get-network')(pubKeyHash, wif);
  const pair = bitcoin.ECPair.fromWIF(privateKey, network);
  console.log(pair.getAddress());
};
