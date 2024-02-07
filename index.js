const { AuthProvider } = window.arcana.auth;

let provider;
let solanaP;
const auth = new AuthProvider( // solana app mainnet
  "xar_live_9306202cbac483d3f1840340302282d5c82d5a55", { 
    network: "mainnet",
    theme: "light"
   });

// provider = window.phantom?.solana || window.braveSolana
provider = auth.provider;

window.onload = async () => {
  try {
    console.time("auth_init");
    await auth.init();
    solanaP = auth.solana;
    setHooks();
    console.timeEnd("auth_init");
    console.log("Init auth complete!");
  } catch (e) {
    console.log({ e });
  }

window.Buffer = window.ethereumjs.Buffer.Buffer;
globalThis.Buffer = window.ethereumjs.Buffer.Buffer;

};

const reqElement = document.getElementById("request");
const resElement = document.getElementById("result");
const accElement = document.getElementById("account");

function setRequest(value) {
  reqElement.innerText = value;
  setResult("-");
}

function setResult(value) {
  resElement.innerText = value;
}

function setAccount(value) {
  accElement.innerText = value;
}

// get from eth_accounts
let from = "";

function setHooks() {
  provider.on("connect", async (params) => {
    console.log({ type: "connect", params: params });
  });
  provider.on("accountsChanged", (params) => {
    console.log({ type: "accountsChanged", params: params });
  });
  provider.on("chainChanged", async (params) => {
    console.log({ type: "chainChanged", params: params });
  });
}

async function logout() {
  console.log("Requesting logout");
  try {
    await auth.logout();
    setAccount("-");
  } catch (e) {
    console.log({ e });
  }
}

async function getAccounts() {
  console.log("Requesting accounts");
  try {
    setRequest("getAccounts");
    // const accounts = await provider.request({ method: 'eth_requestAccounts' })
    const accounts = await provider.request({
      method: "getAccounts",
      params: [""],
    });
    console.log({ accounts });
    from = accounts[0];
    provider.publicKey = new window.solanaWeb3.PublicKey(from);
    setAccount(from);
    setResult(from);
  } catch (e) {
    console.error(e);
    setResult(e);
  }
}

async function sign() {
  console.log("Requesting signature");
  setRequest("signMessage");
  const message = `To avoid digital dognappers, sign below to authenticate with CryptoCorgis`;
  const encodedMessage = new TextEncoder().encode(message);
  // const encodedMessage = new TextEncoder().encode(message)
  try {
    const signature = await solanaP.signMessage(encodedMessage, "hex");
    window.solanaSig = signature;
    setResult(JSON.stringify(signature, null, 2));
    console.log(signature);
  } catch (e) {
    console.error(e);
    setResult(e);
  }
}

async function connect() {
  console.log("Requesting connect wallet");
  setRequest("connect_wallet");
  try {
    const provider = await auth.connect();
    console.log({ provider });
    await getAccounts();
  } catch (error) {
    console.log(error);
  }
}

let publicKey;

async function signTransaction() {
  try {
    setRequest("signTransaction");
    // await provider?.connect()
    console.log(provider);
    const pk = new window.solanaWeb3.PublicKey(
      (
        await provider.request({
          method: "getAccounts",
          params: [],
        })
      )[0],
    );
    // const pk = provider.publicKey
    const connection = new window.solanaWeb3.Connection(
      window.solanaWeb3.clusterApiUrl("testnet"),
    );
    let minRent = await connection.getMinimumBalanceForRentExemption(0);
    let blockhash = await connection
      .getLatestBlockhash()
      .then((res) => res.blockhash);

    const payer = solanaP; // Arcana Solana API

    const instructions = [
      window.solanaWeb3.SystemProgram.transfer({
        fromPubkey: pk,
        toPubkey: pk,
        lamports: minRent,
      }),
    ];
    const messageV0 = new window.solanaWeb3.TransactionMessage({
      payerKey: pk,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();
    let transaction = new window.solanaWeb3.VersionedTransaction(messageV0);

    // sign your transaction with the required `Signers`
    const signature = await payer.signTransaction(transaction);
    console.log(signature);
    setResult(JSON.stringify(signature, null, 2));
  } catch (e) {
    console.error(e);
    setResult(e);
  }
}

async function signAndSendTransaction() {
  try {
    setRequest("signAndSendTransaction");

    const pk = new window.solanaWeb3.PublicKey(
      (
        await provider.request({
          method: "getAccounts",
          params: [],
        })
      )[0],
    );
    const connection = new window.solanaWeb3.Connection(
      window.solanaWeb3.clusterApiUrl("testnet"),
    );
    let minRent = await connection.getMinimumBalanceForRentExemption(0);
    let blockhash = await connection
      .getLatestBlockhash()
      .then((res) => res.blockhash);

    const payer = solanaP; // Arcana Solana API

    const instructions = [
      window.solanaWeb3.SystemProgram.transfer({
        fromPubkey: pk,
        toPubkey: pk,
        lamports: minRent,
      }),
    ];

    const messageV0 = new window.solanaWeb3.TransactionMessage({
      payerKey: pk,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();
    let transaction = new window.solanaWeb3.VersionedTransaction(messageV0);

    // sign your transaction with the required `Signers`
    const transactionSent = await payer.signAndSendTransaction(transaction);

    console.log({ transactionSent });
    setResult(JSON.stringify(transactionSent, null, 2));
  } catch (e) {
    console.error(e);
    setResult(e);
  }
}

async function signAllTransactions() {
  try {
    setRequest("signAllTransactions");

    const pk = new window.solanaWeb3.PublicKey(
      (
        await provider.request({
          method: "getAccounts",
          params: [],
        })
      )[0],
    );
    const connection = new window.solanaWeb3.Connection(
      window.solanaWeb3.clusterApiUrl("testnet"),
    );
    let minRent = await connection.getMinimumBalanceForRentExemption(0);
    let blockhash = await connection
      .getLatestBlockhash()
      .then((res) => res.blockhash);

    const payer = solanaP; // Arcana Solana API

    const instructions = [
      window.solanaWeb3.SystemProgram.transfer({
        fromPubkey: pk,
        toPubkey: pk,
        lamports: minRent,
      }),
    ];

    const messageV0 = new window.solanaWeb3.TransactionMessage({
      payerKey: pk,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();
    let transaction = new window.solanaWeb3.VersionedTransaction(messageV0);

    // sign your transaction with the required `Signers`
    const transactionSent = await payer.signAllTransactions([
      transaction,
      transaction,
      transaction,
    ]);

    console.log({ transactionSent });
    setResult(JSON.stringify(transactionSent, null, 2));
  } catch (e) {
    console.error(e);
    setResult(e);
  }
}

