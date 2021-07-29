import Image from 'next/image';
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

const SearchLayout = ({cards, initialized=false}) => {
  const [cardInfo, setCardInfo] = useState<Array<cardInformation>>(null);
  const [pathUpdated, setPathUpdated] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [query, setQuery] = useState(null);
  const router=useRouter();

  useEffect(()=>{
    if(initialized){
      let buildingArray = [];
      cards.forEach((entry,index)=>{
        buildImagePath(entry).then((result)=>{
          buildingArray.push({
            filePath: result,
            ...entry
          })
          if(buildingArray.length===cards?.length){
            console.log('updating state')
            setCardInfo(buildingArray);
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
        <ReactLoading type='spinningBubbles' color='#FFFFFF' height={96} width={96}/>
      </div>
    )

  else
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
              Found {cardInfo.length} cards.
            </p>
          </div>
          <div className='flex justify-center flex-wrap'>
            {cardInfo.map((card)=>{
              return (
                <Image
                  priority
                  // loading='eager'
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
  const mongoDBQueryObject=await joinTerms(splitTerms(context.params.query.replaceAll('  ',' ')))

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

  console.log('ready to return')
  return {
    props: {
      cards: JSON.parse(JSON.stringify(cards)),
      initiailized: true
    },
  };
}

export default SearchLayout;