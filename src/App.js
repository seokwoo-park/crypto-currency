import './App.css';
import axios from 'axios';
import { useEffect,useState } from 'react';
import Coin from './components/Coin/Coin';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';

function App() {

  const [coins, setCoins] = useState([])
  const [search, setSearch] = useState('')
  const [money, setMoney] = useState(['eur','€'])
  const [sortState, setSortState] = useState ({'number' : 'desc'})
  
  useEffect(()=>{
    axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${money[0]}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    )
    .then((res)=>{
      setCoins(res.data)
    })
    .catch(error=> console.log(error))
  },[money])

  const handleChange = e => {
    setSearch(e.target.value)
  }

  const moneyChange = () => {
    if(money[0] == 'eur'){
      setMoney(['usd','$'])
    } else {
      setMoney(['eur','€'])
    }

  }

  let filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(search.toLocaleLowerCase())
    )

    const numberSort = () => {
      if (sortState.number ==='desc'){
        const sorted = [...coins].sort((a,b)=>
        b.price_change_percentage_24h - a.price_change_percentage_24h )
        setSortState({number:'asc'})
        setCoins(sorted)
      }
      else 
      {
        const sorted = [...coins].sort((a,b)=>
        a.price_change_percentage_24h - b.price_change_percentage_24h )
        setSortState({number:'desc'})
        setCoins(sorted)
      }
  }


  return (
    <div className="coin-app">
      <div>
        <button className="coin-button" onClick={moneyChange}>{money[1]+money[0].toUpperCase()}</button>
      </div>
      <div className="coin-search">
        <h1 className="coin-text">Search a currency</h1>
        <form>
          <input 
          type="text" 
          placeholder="Search ex) Bitcoin"
          className="coin-input"
          onChange={handleChange}/>
        </form>
      </div>
      <div className="coin-categories">
        <div className="coin">
          <p className="categories-name">Name</p>
          <p className="categories-symbol">Symbol</p>
        </div>
        <div className="coin-data">
          <p className="categories-price">Price</p>
          <p className="categories-volume">Volume</p>
          <p className="categories-percent" onClick={numberSort} >Last 24h 
            {sortState.number === 'desc' ?<TrendingUpIcon className="categories-click" /> : <TrendingDownIcon/>}</p>
          <p className="categories-marketcap" onClick={numberSort}>Market Cap</p>
        </div>
      </div>
      {filteredCoins.map(coin => {
        return(
          <Coin 
          key={coin.id}
          name={coin.name}
          image={coin.image}
          symbol={coin.symbol}
          marketcap={coin.market_cap}
          price={coin.current_price}
          priceChange={coin.price_change_percentage_24h}
          volume={coin.total_volume}
          money={money}
            />
        )
      })}
    </div>
  );
}

export default App;
