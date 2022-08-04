import React, { useState, useEffect, useContext} from 'react';
import Range from './Range';
import PriceChart from './PriceChart';
import {useParams} from 'react-router-dom'
import { PortfolioContext } from '../context/PortfolioContext'
import { WatchlistContext } from '../context/WatchlistContext'
import OrderPopup from './OrderPopup';




export default function Stockpage() {

  const [selectedRange, setSelectedRange] = useState(0)
  const [selectedTab, setSelectedTab] = useState(1)
  const [coinData, setCoinData] = useState({})
  const [buyAmount, setBuyAmount] = useState(0)
  const {id} = useParams()
  const {order, usdBalance} = useContext(PortfolioContext)
  const { watchlist, isWatchlist} = useContext(WatchlistContext)
  const [displayOrder, setDisplayOrder] = useState('closed')
  const [tradeStatus, setTradeStatus] = useState('')

  
  useEffect(() => {
    async function getCoinData(){
      try{
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
        const data = await res.json()
        setCoinData(data[0])
      }
      catch(err){
        console.log(err)
      }
    }
    
    getCoinData()
  },[id])
  const ranges = ['1d','3d','1w','1m','6m','1y','max']
  const rangeButtons = ranges.map((range,index) => {
    return(
      <Range selected={selectedRange} range={range} key={index} index={index} selectRange={selectRange} />
    )
  })

  function selectRange(index){
    setSelectedRange(index)
  }
  function selectTab(index){
    setSelectedTab(index)
  }

  const tabs = ['Summary', 'Chart','Statistics', 'Analysis','Settings ']
  const tabButtons = tabs.map((tab,index) => {
    const style = {
      borderBottom: selectedTab===index? 'solid 3px #4B40EE' : ''
    }

    return(
      <button className='tab' style={style} onClick={() => selectTab(index)} key={index}>{tab}</button>
    )
  })

  const priceChangeStyle = {
    color: coinData.price_change_24h >= 0? 'rgb(0, 231, 0)' : 'red'
  }

  function changeBuyAmount(action,e){
    if(action==='minus' && buyAmount !== 0){
      setBuyAmount(prevBuyAmount => prevBuyAmount - 1 )
    }
    else if(action==='plus'){
      setBuyAmount(prevBuyAmount => prevBuyAmount + 1 )
    }
    else if(action==='set' && !isNaN(e)){
      setBuyAmount(Number(e))
    }
  }

  
  function buy(){
    const minBuyPrice = 10
    if(buyAmount*coinData.current_price > minBuyPrice){
      if(usdBalance >= buyAmount*coinData.current_price){
        order('buy',id,coinData,buyAmount,(buyAmount*coinData.current_price).toFixed(2))
        setDisplayOrder('closed')
        setTradeStatus('finished')
        setTimeout(() => {
          setTradeStatus('')
        }, 2000);
      }
      else{
        alert('brokey')
      }
    }
  }
  
  
  if(coinData.id === undefined){
    return ''
  }
  const iconClass = isWatchlist(coinData)? "ri-star-fill" :"ri-star-line"

  const buyField = (
    <div className={`flex-vert gap-0 order-container order-${displayOrder} card bg-black`}>
      <div className="flex gap-0">
        <button className='count-button fs-3 text-white bg-blue' onClick={()=> changeBuyAmount('minus')}>-</button>
        <input className='count-input fs-5' value={buyAmount} onChange={(e) => changeBuyAmount('set',e.target.value)} type='text'/>
        <button className='count-button fs-3 text-white bg-blue' onClick={()=> changeBuyAmount('plus')}>+</button>
      </div>
      <p className='order bg-blue text-white fs-3'>${(buyAmount * coinData.current_price).toFixed(2)}</p>
      <button className='order bg-blue text-white fs-3' onClick={buy}>Buy</button>
    </div>
  )

  const fog = (
    <div className={`fog fog-${displayOrder}`} onClick={() => setDisplayOrder('closed')}></div>
)

  return (
    <div className="container flex gap-2">
      <div className="card bg-white coin-page">
        <div className='flex gap-1 align-center'>
          <img className='large-img' src={coinData.image} alt="" />
          <div className='flex align-baseline gap-1'>
            <h1 className='name fs-1'>{coinData.name}</h1>
            <div className="flex align-baseline ">
              <h2 className='fs-2'>{coinData.current_price}</h2>
              <h4 className='text-grey fs-5'>USD</h4>
            </div>
            <h5 className='change fs-4' style={priceChangeStyle}>{`${coinData.price_change_24h.toFixed(2)} (${coinData.price_change_percentage_24h.toFixed(2)}%)`}</h5>
            <button className='fs-5 text-blue' onClick={() => watchlist(coinData)}><i className={`star-icon ${iconClass}`}></i></button>
          </div>

        </div>
        <hr />
        <div className="flex align-center">
          <div>
            <div className="ranges">
              {rangeButtons}
            </div>
            <PriceChart id={id} range={selectedRange} large={true}/>
          </div>
          <td className="text-white bg-blue order-button" onClick={() => setDisplayOrder('open')}>Buy</td>
        </div>
      </div>
      {buyField}
      {fog}
      <OrderPopup status={tradeStatus} 
        traded={'bought'} 
        amount={buyAmount} 
        currency={coinData.symbol} 
        price={(coinData.current_price * buyAmount).toFixed(2)
      }/>
    </div>
  );
}

