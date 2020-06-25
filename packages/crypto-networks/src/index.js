export default {
  // https://github.com/bitcoin/bitcoin/blob/313a081b907bf0a5b56af99ec2d42814ef0638b0/src/chainparams.cpp#L126-L132
  BTC: {
    messagePrefix: '\x19Bitcoin Signed Message:\n',
    bech32: 'bc', // bech32_hrp
    bip32: {
      public: 0x0488b21e, // base58Prefixes[EXT_PUBLIC_KEY]
      private: 0x0488ade4 // base58Prefixes[EXT_SECRET_KEY]
    },
    pubKeyHash: 0x00, // base58Prefixes[PUBKEY_ADDRESS] (0)
    scriptHash: 0x05, // base58Prefixes[SCRIPT_ADDRESS] (5)
    wif: 0x80 // base58Prefixes[SECRET_KEY] (128)
  },
  BITG: {
    // https://github.com/bitgreen/bitgreen/blob/13982be25d11a75d012b2778ac7c85bc11726d78/src/chainparams.cpp#L227-L233  BitGreen: {
    // https://github.com/bitgreen/bitgreen/blob/36e2b1fb3602eda482383b2fd1583a2a7aca9d4d/src/util/validation.cpp#L20
    messagePrefix: '\x19BitGreen Signed Message:\n',
    bech32: 'bg', // bech32_hrp
    bip32: {
      public: 0x0488b21e, // base58Prefixes[EXT_PUBLIC_KEY]
      private: 0x0488ade4 // base58Prefixes[EXT_SECRET_KEY]
    },
    pubKeyHash: 0x26, // base58Prefixes[PUBKEY_ADDRESS] (38)
    scriptHash: 0x06, // base58Prefixes[SCRIPT_ADDRESS] (6)
    wif: 0x2e // base58Prefixes[SECRET_KEY] (46)
  }
};
