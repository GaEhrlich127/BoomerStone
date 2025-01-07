import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import { buildImagePath } from '../../util/buildImagePath';
import { connectToDatabase } from "../../util/mongodb";
import { cardInformation } from "../../util/interfaces";
import SmallSearch from '../../components/SmallSearch';
import { splitTerms, joinTerms } from '../../util/MongoDBBuilders';

const SearchLayout = ({cards, initialQuery}) => {
  const [cardInfo, setCardInfo] = useState<Array<cardInformation>>(null);
  const [pathUpdated, setPathUpdated] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [query, setQuery] = useState(null);
  const router=useRouter();

  useEffect(()=>{
    if(Array.isArray(cards)){
      setQuery(initialQuery);
      let buildingArray = [];
      let cardsAdded=0;
      cards.forEach((entry,index)=>{
        buildImagePath(entry).then((result)=>{
          buildingArray.push({
            filePath: result,
            ...entry
          })
          //Adds the 4x weight on class cards
          if(entry.Class!=='Neutral' && cards.length>3){
            for(let i=0;i<3;i++){
              buildingArray.push({
                filePath: result,
                ...entry
              })
            }
          }
          cardsAdded++;
          if(cardsAdded===cards?.length){
            if(cards.length<=3){ setCardInfo(buildingArray) }
            else{
              //Select three cards
              let selectedCards=[]
              for(let i=0;i<3;i++){
                //Select a random card, then add it
                const rand=Math.floor(Math.random()*buildingArray.length)
                selectedCards.push(buildingArray[rand])

                //Remove the card from the selection pool
                //If the card has been weighted
                if(buildingArray[rand].Class!=='Neutral'){
                  //Check a few slots to the left and right
                  for(let j=rand-3;j<=rand+3;j++){
                    //If it's a legal array slot
                    if(j>=0 && j<buildingArray.length){
                      //and we have a match
                      if(buildingArray[j].Name === selectedCards[i].Name) {
                        //Remove it from the building array :)
                        buildingArray.splice(j,1);
                        j--;
                      }
                    }
                  }
                }
                //If the card isn't weighted, just remove it
                else {buildingArray.splice(rand,1);} 
              }
              setCardInfo(selectedCards);
            }
          }
        })
      })
      setPathUpdated(true);
    }
  }, [cards])

  useEffect(()=>{
    if(pathUpdated){
      setLoading(false);
    }
  },[cardInfo])

  if(loading)
    return(
      <div className='bg-blue-400 w-screen h-screen flex justify-center pt-16'>
        
        Loading!
        {/* <ReactLoading type='spinningBubbles' color='#FFFFFF' height={96} width={96}/> */}
      </div>
    )

  else
    return(
      <div className='bg-blue-400 min-w-screen min-h-screen flex justify-center'>
        <div className="my-8 p-4 rounded-lg h-full bg-white shadow-md sm:flex-row max-w-7xl">
          <div className='flex flex-col items-center'>
            <div className='w-3/6 pb-2'>
              <SmallSearch
                type='discover'
                query={query}
                setQuery={setQuery}
              />
            </div>
          </div>
          <div className='flex flex-row pr-2'>
            {cardInfo.map((card)=>{
              return (
                <img
                  className='cursor-pointer'
                  src={card.filePath}
                  width={.8*375}
                  height={.8*518}
                  alt={card.Name ?? 'Loading'}
                  key={card.Name}
                  onClick={()=>{router.push(`/card/${card._id}`)}}
                />
              )
            })}
          </div>
        </div>
      </div>
    )
};

export async function getServerSideProps(context) {
  const mongoDBQueryObject=await joinTerms(splitTerms(context.params.query))

  const { db } = await connectToDatabase();

  const cards = await db
      .collection("Year 1 & 2")
      .find(mongoDBQueryObject)
      .sort({
        "Token Type":1,
        "Class":1,
        "Name":1
      })
      .toArray();
  
  return {
    props: {
      cards: JSON.parse(JSON.stringify(cards)),
      initialQuery: context.params.query,
      initialized: true
    },
  };
}

export default SearchLayout;