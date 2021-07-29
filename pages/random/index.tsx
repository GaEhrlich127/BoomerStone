import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import { buildImagePath } from '../../util/buildImagePath';
import { connectToDatabase } from "../../util/mongodb";
import { cardInformation } from "../../util/interfaces";
import SmallSearch from "../../components/SmallSearch";
import { splitTerms, joinTerms } from '../../util/MongoDBBuilders';

// currentPage:int default 1
// loop i=currentPage-1 -> currentPage*pageSize

const RandomLayout = ({cards, initialQuery, initialized=false}) => {
  const [cardInfo, setCardInfo] = useState<Array<cardInformation>>(null);
  const [pathUpdated, setPathUpdated] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [query, setQuery] = useState(null);
  const router=useRouter();

  useEffect(()=>{
    if(initialized && typeof cards!=='undefined'){
      setQuery(initialQuery);
      if(Array.isArray(cards)){
        let buildingArray = [];
        if(cards.length>0){
          cards.forEach((entry,index)=>{
            buildImagePath(entry).then((result)=>{
              buildingArray.push({
                filePath: result,
                ...entry
              })
              if(buildingArray.length===cards?.length){
                setCardInfo(buildingArray);
                const rand=Math.floor(Math.random()*buildingArray.length);
                router.push(`/card/${buildingArray[rand]._id}`);
              }
            })
          })
          setPathUpdated(true);
        } else {
          setPathUpdated(true);
          setCardInfo([]);
        }
      }
    }
  }, [initialized])

  useEffect(()=>{
    if(pathUpdated){
      setLoading(false);
    }
  },[cardInfo])

  if(!loading && cards.length===0){
    return(
      <div className='bg-blue-400 min-w-screen min-h-screen flex justify-center'>
        <div className="my-8 p-4 rounded-lg h-full bg-white shadow-md w-screen md:w-11/12 sm:flex-row max-w-7xl">
          <div className='font-bold text-2xl py-1 flex flex-col items-center'>
            <div className='w-3/6'>
              <SmallSearch
                type='search'
                query={query}
                setQuery={setQuery}
              />
            </div>
            <p>
              Found 0 cards.
            </p>
          </div>
        </div>
      </div>
    )
  }
  else return(
    <div className='bg-blue-400 w-screen h-screen flex justify-center pt-16'>
      <ReactLoading type='spinningBubbles' color='#FFFFFF' height={96} width={96}/>
    </div>
  )
};

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  const cards = await db
      .collection("Year 1 & 2")
      .find({})
      .sort({
        "Token Type":1,
        "Class":1,
        "Name":1
      })
      .toArray();
  
  return {
    props: {
      cards: JSON.parse(JSON.stringify(cards)),
      initialQuery: "",
      initialized: true
    },
  };
}

export default RandomLayout;