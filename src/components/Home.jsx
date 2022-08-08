import { useRef, useContext, useEffect } from 'react'
import { PortfolioContext } from '../context/PortfolioContext'
import { WatchlistContext } from '../context/WatchlistContext'
import { Link } from 'react-router-dom'
import PriceChart from './PriceChart'

export default function Home(){

    const {portfolioArray, usdBalance, totalBalance} =  useContext(PortfolioContext)
    const {watchlistArray} =  useContext(WatchlistContext)
    

    
    
    const assets = portfolioArray.map((asset,index) => {
        return(
        <div key={index} className='flex space-between'>
            <div>
                <div className="flex align-center gap-1">
                    <img className='small-img' src={asset.coinData.image}/>
                    <div>
                    <h3>{asset.coinData.name}</h3>
                    <p className='uppercase'>{asset.coinData.symbol}</p>

                    </div>
                </div>
            </div>
            <div className='text-left'>
                <h3>${asset.value.toFixed(2)}</h3>
                <p className='uppercase'>{asset.amount} {asset.coinData.symbol}</p>
            </div>

        </div>
    )})

    const watchlist = watchlistArray.map((coin,index) => {
        const green = coin.price_change_24h >= 0
        return(
        <Link to={`/currencies/${coin.id}`} key={index} className='flex space-between'>
            <div className="flex align-center gap-1">
                    <img className='small-img' src={coin.image}/>
                    <h3>{coin.name}</h3>
            </div>
            <PriceChart id={coin.id} range={0} large={false} green={green} />
            <h3>${coin.current_price}</h3>
        </Link>
    )})


    return(
        <div className="home">
            <div className="container">
                <h2 className='balance'>Balance: ${totalBalance}</h2>
                <div className="home-grid">
                    <div className="watchlist-card card bg-white">
                        <h2>Watchlist</h2>
                        {watchlist}
                        <Link to='/currencies'><h3 className="fs-4 text-blue text-center"><span className='fs-3'>+</span> Explore</h3></Link>
                    </div>
                    <div className='portfolio-card card bg-white'>
                        <h2>Portfolio</h2>
                        <div className="flex space-between text-blue">
                            <h3>USD</h3>
                            <h3>${usdBalance.toFixed(2)}</h3>
                        </div>
                        {assets}
                    </div>
                </div>
            </div>
        </div>
    )
}