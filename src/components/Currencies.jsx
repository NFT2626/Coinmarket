import React,{useState, useEffect, useContext} from "react";
import {useNavigate} from 'react-router-dom'

import { WatchlistContext } from '../context/WatchlistContext'
import { useMobileOnly } from "../hooks/useMobileOnly";

import PriceChart from "./PriceChart";


export default function Currencies(){
    const [coinsData, setCoinsData] = useState(localStorage.getItem('coinsData')? JSON.parse(localStorage.getItem('coinsData')) : [])
    // const [coinsData, setCoinsData] = useState([])
    const { watchlist, isWatchlist} = useContext(WatchlistContext)
    const  {mobileOnly} = useMobileOnly()
    const lastFetch = Number(localStorage.getItem('lastFetch'))
    if(!lastFetch){
        localStorage.setItem('lastFetch', Date.now()+60000)
    }
    useEffect(()=> {
        if(Date.now() - lastFetch - 60000 > 0){
            fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false`)
            .then(res => res.json())
            .then(data => {
                setCoinsData(data)
                localStorage.setItem('coinsData',JSON.stringify(data))
                localStorage.setItem('lastFetch', Date.now())
            })
        }
    },[])

    const navigate = useNavigate()

    const currencies = coinsData?.map((coin,index) =>{ 
        const iconClass = isWatchlist(coin)? "ri-star-fill" :"ri-star-line"
        const priceChangeStyle = {
            color: coin.price_change_24h >= 0? 'rgb(0, 231, 0)' : 'red'
        }
        const marketCap = coin.market_cap.toString().split('').reverse().map((v,i,a) => i%3===0 && i !== 0 ?v+',': v).reverse().join('')
        const green = coin.price_change_24h >= 0
        return(
            <tr key={index} className='fs-5 pointer' onClick={()=>  navigate(`/currencies/${coin.id}`)}  >
                {!mobileOnly &&  <td className=" fs-1" onClick={(e)=>{e.stopPropagation(); watchlist(coin)}}><i className={`star-icon ${iconClass}`}></i></td>}
               {!mobileOnly &&  <td className="">{coin.market_cap_rank}</td>}
                <td className="flex fw-600 gap-0 align-center">
                    <img src={coin.image} className='small-img'/>
                    <div>
                        <p>{coin.name}</p>
                        <p className="fs-5 text-grey uppercase">{coin.symbol}</p>
                    </div>
                </td>
                <td><PriceChart id={coin.id} range={0} large={false} green={green} /></td>
                <td className="text-left">
                    <div>
                        <p>${coin.current_price}</p>
                        <p style={priceChangeStyle}>{coin.price_change_percentage_24h.toFixed(2)}%</p>
                    </div>
                </td>
                {!mobileOnly &&  <td className="text-left">${marketCap}</td>}
            </tr>
        )
    })

    return(
        <div className="container">
            <h2>Top currencies</h2>
            <table className=" card bg-white table currency--table">
                <thead className="">
                    <tr className="fs-5 text-grey">
                        {!mobileOnly &&  <th className=""></th>}
                        {!mobileOnly &&  <th className="">#</th>}
                        <th>Name</th>
                        <th></th>
                        <th className="text-left">Price</th>
                        {!mobileOnly &&  <th className="text-left">Market Cap</th>}
                    </tr>
                </thead>
                <tbody>
                    {currencies}
                </tbody>
            </table>
        </div>
    )
}