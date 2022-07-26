import React, { useState, useEffect} from 'react';
import Range from './Range';
import PriceChart from './PriceChart';
import {useParams} from 'react-router-dom'



export default function Stockpage() {

  const [selectedRange, setSelectedRange] = useState(0)
  const [selectedTab, setSelectedTab] = useState(1)
  const [coinData, setCoinData] = useState({})
  const [buyAmount, setBuyAmount] = useState(0)
  const {id} = useParams()

  
  useEffect(() => {
    async function getCoinData(){
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
      const data = await res.json()
      setCoinData(data[0])
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

  if(coinData.id === undefined){
    return ''
  }

  function buy(){
    console.log(`you bought ${buyAmount} ${coinData.name} for $${buyAmount * coinData.current_price} `)
  }



  return (
    <div className="coin-page">
      <div className='heading'>
        <h1 className='name'>{coinData.name}</h1>
        <div className="flex">
          <h2 className="price">{coinData.current_price}</h2>
          <h4 className='currency'>USD</h4>
        </div>
      </div>
      <h5 className='change' style={priceChangeStyle}>{`${coinData.price_change_24h.toFixed(2)} (${coinData.price_change_percentage_24h.toFixed(2)}%)`}</h5>
      {/* <div className="tabs">
        {tabButtons}
      </div> */}
      <hr />
      <div className="flex">
        <div>
          <div className="ranges">
            {rangeButtons}
          </div>
          <div >
            <PriceChart id={id} range={selectedRange}/>
          </div>
        </div>
        <div>
          <div className="flex">
            <button onClick={()=> changeBuyAmount('minus')}>-</button>
            <input value={buyAmount} onChange={(e) => changeBuyAmount('set',e.target.value)} type='text'/>
            <button onClick={()=> changeBuyAmount('plus')}>+</button>
          </div>
          <button onClick={buy}>Buy</button>
        </div>
      </div>


      
    </div>
  );
}

