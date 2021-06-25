import { useRouter } from "next/router";
import Image from 'next/image';
import { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import classNames from 'classnames';

const CardLayout = () => {
  const [cardInfo, setCardInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const {cardId} = useRouter().query;

  useEffect(()=>{
    //Do some voodoo with actually querying MongoDB here
    if(cardId==='0')
      setCardInfo({
        Name: "Druid of the Claw",
        Rarity: "Common",
        Type: "Minion",
        Class: "Druid",
        Cost: 5,
        Attack: 4,
        Health: 4,
        CardSet: "Classic",
        Keywords: "Choose One",
        Textbox: "Choose One - Transform into a 4/4 with Charge; or a 4/6 with Taunt."
      })
    else if (cardId==='1')
      setCardInfo({
        Name: "Snake Trap",
        Rarity: "Epic",
        Type: "Spell",
        Class: "Hunter",
        Cost: 2,
        CardSet: "Classic",
        Keywords: "Secret",
        Textbox:"Secret: When one of your minions is attacked, summon three 1/1 Snakes."
      })
    else if (cardId==='2')
      setCardInfo({
        Name: "Gorehowl",
        Rarity: "Epic",
        Type: "Weapon",
        Class: "Warrior",
        Cost: 7,
        Attack: 7,
        Health: 1,
        CardSet: "Classic",
        Textbox: "Attacking a minion costs 1 Attack instead of 1 Durability."
      })
    else if (cardId==='3')
      setCardInfo({
        Name: "Rogues Do It...",
        Rarity: "Token",
        Type: "Spell",
        Class: "Neutral",
        Cost: 4,
        Textbox: "Deal 4 damage. Draw a card.",
        TokenType: "Power Chord"
      })
    else if (cardId==='4')
      setCardInfo({
        Name:"Emerald Drake",
        Rarity:"Token",
        Type:"Minion",
        Subtype:"Dragon",
        Class:"Neutral",
        Cost:4,
        Attack:7,
        Health:6,
        TokenType:"Dream"
      })
  }, [cardId])

  useEffect(()=>{
    console.log(cardInfo)
    if(cardInfo===null || typeof cardInfo==='undefined' || cardInfo==={}){
      setLoading(false);
      console.log('Loading Complete!')
    }
  }, [cardInfo])

  const setConverter = {
    "Classic":"Classic",
    "Basic":"Basic",
    "Curse of Naxxramas":"Naxx",
    "Goblins vs Gnomes":"GVG",
    "Blackrock Mountain":"BRM",
    "The Grand Tournament":"TGT",
    "League of Explorers":"LOE",
  }

  const buildImagePath = () => {
    if (typeof cardInfo === 'undefined' || cardInfo === null)
      return `/images/cards/404.png`;
    else if (typeof cardInfo.TokenType === 'undefined')
      return `/images/cards/${cardInfo.Class}/${setConverter[cardInfo.CardSet]}/${cardInfo.Name}.png`;
    else
      return `/images/cards/${cardInfo.TokenType}/${cardInfo.Name}.png`;
  }

  if(loading)
    return(
      <div className='bg-blue-400 w-screen h-screen flex justify-center pt-16'>
        <ReactLoading type='spinningBubbles' color='#FFFFFF' height={96} width={96}/>
      </div>
    )
  else
    return(
      <div className='bg-blue-400 min-w-screen min-h-screen flex justify-center'>
        <div className="my-8 p-4 rounded-lg h-full bg-white shadow-md flex flex-col sm:flex-row">
          <div className='pr-2'>
            <Image src={buildImagePath()} width={.8*375} height={.8*518} alt={cardInfo?.Name ?? 'Loading'}/>
          </div>
          
          <div className='mt-6 flex-col space-y-2'>
            
            {/* Attributes */}
            {/* Name */}
            {/* Cost */}
            {/* Attack IF PRESENT */}
            {/* Health || Weapon -> Durability */}
            <div className='flex-col'>
              <div>
                <p>Name: {cardInfo?.Name}</p>
              </div>
              <div>
                <p>Cost: {cardInfo?.Cost}</p>
              </div>
              {typeof cardInfo?.Attack!=='undefined' && (
                <div>
                  <p>{cardInfo?.Attack}/{cardInfo?.Health}</p>
                </div>
              )}
            </div>

            {/* Card Information */}
            {/* Class */}
            {/* CardSet || Uncollectible -> Token Type */}
            {/* Rarity */}
            {/* Type */}
            {/* Tribe IF PRESENT */}
            <div className='flex-col'>
              <div>
                <p>Class: {cardInfo?.Class}</p>
              </div>
              {typeof cardInfo?.CardSet!=='undefined' && (
                <div>
                  <p>Set: {cardInfo?.CardSet}</p>
                </div>
              )}
              {cardInfo?.Rarity!=='Token' && (
                <div className='flex'>
                  Rarity: 
                  <p className={classNames({
                    'text-gray-500':cardInfo?.Rarity==='Common',
                    'text-blue-600':cardInfo?.Rarity==='Rare',
                    'text-purple-600':cardInfo?.Rarity==='Epic',
                    'text-yellow-600':cardInfo?.Rarity==='Legendary',
                    'ml-1':true
                  })}>
                    {cardInfo?.Rarity}
                  </p>
                </div>  
              )}    
              <div>
                <p>Type: {cardInfo?.Type}</p>
              </div>
              {typeof cardInfo?.Subtype!=='undefined' && (
                <div>
                  <p>Tribe: {cardInfo?.Subtype}</p>
                </div>
              )}
              {typeof cardInfo?.TokenType!=='undefined' && (
                <div>
                  <p>Token Type: {cardInfo?.TokenType}</p>
                </div>
              )}
            </div>

            {/* Keywords */}
            {/* Textbox */}
            <div className='flex-col'>
              {typeof cardInfo?.Keywords!=='undefined' && (
                <div>
                  <p>Keywords: {cardInfo?.Keywords}</p>
                </div>
              )}
              {typeof cardInfo?.Textbox!=='undefined' && (
                <div>
                  Textbox: <br/>
                  <div className='ml-2 w-52 bg-blue-200 p-1 rounded-md shadow-sm'>
                    {cardInfo?.Textbox}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
};

export default CardLayout;