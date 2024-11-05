export default `
Deploy Boost Protocol V2, and retrieve base implementation addresses.

Usage: boost <COMMAND>

Commands:
  deploy                  Deploy a new version of the protocol
  seed generate           Generate a new basic Boost seed to stdout
  seed first.json [...]

Options:
  -h, --help     Print help
  -v, --version  Print version

  --chain        Viem chain name, see https://github.com/wevm/viem/tree/main/src/chains/definitions for a list of valid names
  --privateKey   Private key to derive account from to use for contract operations, see https://viem.sh/docs/accounts/local/privateKeyToAccount#generating-private-keys for more information
  --mnemonic     Mnemonic to derive account from to use for contract operations, see https://viem.sh/docs/accounts/local/mnemonicToAccount#generating-private-keys for more information
  --out          Path to file to output command results
  --cacheDir     Path to artifact cache directory
  --force        Bypass cache for given command and configuration, re-running any tasks and re-generating cache artifacts
  --format       Specify command output format, either env or json
`;
