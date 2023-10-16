import { useEffect, useState } from "react";
import { OsmosisChainInfo } from "./constants";
import { AccountData, Key } from "@keplr-wallet/types";
import './App.css'


function App() {
  const [connection, setConnection] = useState<boolean>(false);
  const [accountKey, setAccountKey] = useState<Key['name']>();
  const [allAccounts, setAllAccounts] = useState<AccountData[]>([]);

  const enableKplr = async () => {
    if (!window.keplr) {
      return alert('Установите расширение keplr')
    }
    try {
      await window.keplr?.enable(OsmosisChainInfo.chainId);
    } catch {
      alert('Something went wrong =(')
    } finally {
      setConnection(true);
      alert('Keplr enabled')
    }
  };

  const disableKplr = async () => {
    if (!window.keplr) {
      return alert('Установите расширение keplr')
    }
    try {
      await window.keplr?.disable();
    } catch {
      alert('Something went wrong =(')
    } finally {
      setConnection(false);
      setAccountKey('')
      setAllAccounts([]);
      alert('Keplr disabled');
    }
  };

  const offlineSigner = window.keplr?.getOfflineSigner(OsmosisChainInfo.chainId);

  const getAccounts = async () => {
    if (offlineSigner) {
      const accounts = await offlineSigner.getAccounts();
      setAllAccounts(() => [...accounts])
      console.log(allAccounts)
    }
  }

  const getKeyFromKeplr = async () => {
    const key = await window.keplr?.getKey(OsmosisChainInfo.chainId);
    if (key) {
      setAccountKey(key.name)
    }
  }

  useEffect(() => {
    setConnection(false);
    setAccountKey('');
    setAllAccounts([]);
  }, [])

  return (
    <>
      <div className="buttons">
        <button onClick={getKeyFromKeplr} disabled={!window.keplr || !connection}>Get Wallet name</button>
        <button onClick={getAccounts} disabled={!window.keplr || !connection}>Get Wallets Info</button>
        <button onClick={enableKplr}>Enable Connection</button>
        <button onClick={disableKplr}>Disable Connection</button>
      </div>
      <div className="accounts">
        <p className='accounts__text'>Current Wallet Name: {accountKey || '???'}</p>
        {!!allAccounts && (
          <ol className="list">
            {allAccounts.map((acc) =>
              <li key={acc.address} className="listItem">
                <p className="listItem__text accounts__text">Wallet. adress: <span className="listItem__span">{acc.address}</span></p>
                <p className="listItem__text accounts__text">Wallet. algo: <span className="listItem__span">{acc.algo}</span></p>
              </li>
            )}
          </ol>
        )}
      </div>
    </>

  )
}

export default App
