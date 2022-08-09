import { useState, useContext,useEffect } from "react"
import { PortfolioContext } from "../context/PortfolioContext"
import { useMobileOnly } from "../hooks/useMobileOnly";
import OrderPopup from './OrderPopup';



export default function Portfolio(){

    const {mobileOnly} = useMobileOnly()

    const {portfolioArray, usdBalance, totalBalance, order} = useContext(PortfolioContext)
    const [displayOrder, setDisplayOrder] = useState('closed')
    const [sellAmount, setSellAmount] = useState()
    const [sellAsset, setSellAsset] = useState()
    const [tradeStatus, setTradeStatus] = useState('')

    const assets = portfolioArray.map((asset,index) => {
        const allocation = ((asset.value/totalBalance) * 100).toFixed(2)
        return(
            <tr key={index} className='fs-4'>
                <td className="flex gap-0 align-center">
                    <img src={asset.coinData.image} className='small-img'/>
                    <div>
                        <p>{asset.coinData.name}</p>
                        <p className="text-grey uppercase">{asset.coinData.symbol}</p>
                    </div>
                </td>
                <td>
                    <div>
                        <p className="text-blue">${asset.value.toFixed(2)}</p>
                        <p className="text-grey uppercase">{asset.amount} {asset.coinData.symbol}</p>
                    </div>
                </td>
                <td className="large-only">${asset.coinData.current_price}</td>
                <td className="large-only">{allocation}%</td>
                <td className="text-white bg-blue order-button" onClick={() => {setSellAsset(asset);setDisplayOrder('open'); setSellAmount(asset.amount) }}>Sell</td>
            </tr>
        )
    })

    function sell(){
        order('sell',sellAsset.id,sellAsset.coinData ,sellAmount , sellAsset.coinData.current_price * sellAmount)
        setDisplayOrder('closed')
        setTradeStatus('finished')
        setTimeout(() => {
            setTradeStatus('')
          }, 2000);
    }


    const sellField = (
         <div className={`flex-vert gap-0 order-container order-${displayOrder} bg-black`}>
          {!mobileOnly && <div className="flex gap-0">
            <button className='count-button fs-3 text-white bg-blue' onClick={()=> changeSellAmount('minus')}>-</button>
            <input className='count-input fs-5' value={sellAmount} onChange={(e) => changeSellAmount('set',e.target.value)} type='text'/>
            <button className='count-button fs-3 text-white bg-blue' onClick={()=> changeSellAmount('plus')}>+</button>
          </div>}
          <p className='order bg-blue text-white fs-3'>${(sellAmount * sellAsset?.coinData.current_price).toFixed(2)}</p>
          {mobileOnly && <div>
            <p className='order bg-blue text-white fs-3'>{sellAmount}</p>
            <div className="grid number-grid">
                <button className="text-white fs-2" onClick={() => changeSellAmount('type',1,'1')}>1</button>
                <button className="text-white fs-2" onClick={() => changeSellAmount('type',1,'2')}>2</button>
                <button className="text-white fs-2" onClick={() => changeSellAmount('type',1,'3')}>3</button>
                <button className="text-white fs-2" onClick={() => changeSellAmount('type',1,'4')}>4</button>
                <button className="text-white fs-2" onClick={() => changeSellAmount('type',1,'5')}>5</button>
                <button className="text-white fs-2" onClick={() => changeSellAmount('type',1,'6')}>6</button>
                <button className="text-white fs-2" onClick={() => changeSellAmount('type',1,'7')}>7</button>
                <button className="text-white fs-2" onClick={() => changeSellAmount('type',1,'8')}>8</button>
                <button className="text-white fs-2" onClick={() => changeSellAmount('type',1,'9')}>9</button>
                <button className="bg-black"></button>
                <button className="text-white fs-2" onClick={() => changeSellAmount('type',1,'0')}>0</button>
                <button className="text-white fs-2" onClick={() => changeSellAmount('backspace')}><i class="ri-arrow-left-fill"></i></button>

            </div>
          </div>}
          <button className='order bg-blue text-white fs-3' onClick={sell}>Sell</button>
          {mobileOnly && <button onClick={() => setDisplayOrder('closed')} className="text-white fs-3 go-back"><i class="ri-arrow-left-fill"></i>Go back</button>}
        </div>
    )

    const fog = (
        <div className={`large-only fog fog-${displayOrder}`} onClick={() => setDisplayOrder('closed')}></div>
    )

    function changeSellAmount(action,e,i){
        if(action==='minus' && sellAmount !== 0){
            setSellAmount(prevSellAmount => prevSellAmount - 1 )
        }
        else if(action==='plus' && sellAmount !== sellAsset.amount){
            setSellAmount(prevSellAmount => prevSellAmount + 1 )
        }
        else if(action ==='type'){
            setSellAmount(prevSellAmount =>{
                if(Number(String(prevSellAmount) + i) > sellAsset.amount){
                    return prevSellAmount
                }else{
                    return Number(String(prevSellAmount) + i) 
                }
            } )
        }else if(action === 'backspace'){
            setSellAmount(prevSellAmount =>{
                if(String(prevSellAmount).slice(0,-1).length === 0){
                    return 0
                }else{
                    return Number(String(prevSellAmount).slice(0,-1)) 
                }
            } )
        }
        else if(action==='set' && !isNaN(e)){
            setSellAmount(Number(e) > sellAsset.amount? sellAsset.amount : Number(e))
        }
        
      }

    return(
        <div className="container flex gap-2">
            <div className="portfolio-page">
                <h2>Total balance: ${totalBalance}</h2>
                <div className="flex gap-1 portfolio-grid">
                    <table className="card table bg-white">
                        <thead>
                            <tr className='fs-5 text-grey' >
                                <th>Name</th>
                                <th>Balance</th>
                                <th>Price</th>
                                <th className="large-only">Allocation</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="fs-4 text-blue">
                                <td>USD</td>
                                <td>${usdBalance.toFixed(2)}</td>
                            </tr>
                            {assets}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="overflow-wrapper">
                {sellField}
            </div>
            {fog}
            {sellAsset &&<OrderPopup status={tradeStatus} traded={'sold'} amount={sellAmount} currency={sellAsset.coinData.symbol} price={sellAsset.coinData.current_price * sellAmount}/>}
        </div>
    )
}