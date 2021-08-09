import { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import classNames from 'classnames';
import { buildImagePath } from '../../util/buildImagePath';
import { connectToDatabase } from "../../util/mongodb";


const CardLayout = ({cards}) => {
  const [cardInfo, setCardInfo] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [pathUpdated, setPathUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(Array.isArray(cards)){
      setCardInfo(cards[0])
    }
  }, [cards])

  useEffect(()=>{
    buildImagePath(cardInfo).then((path)=>{
      setFilePath(path);
      setPathUpdated(true);
    })
  }, [cardInfo])

  useEffect(()=>{
    if(pathUpdated)
      setLoading(false);
  },[filePath])

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
            {filePath && (<img src={filePath} width={.8*375} height={.8*518} alt={cardInfo?.Name ?? 'Loading'}/>)}
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

export async function getStaticPaths() {
  return {
    paths: [
      { params: { cardId:'null' } } // See the "paths" section below
    ],
    fallback: true // See the "fallback" section below
  };
}

export async function getStaticProps(context) {
  if(context.params.cardId==='null')
    return {props:{cards:null}};

  const { db } = await connectToDatabase();

  const cards = await db
      .collection("Year 1 & 2")
      .find({ _id:require('mongodb').ObjectID(context.params.cardId)} )
      .sort({})
      .toArray();

  return {
    props: {
      cards: JSON.parse(JSON.stringify(cards)),
    },
  };
}

export default CardLayout;