import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import { buildImagePath } from '../../util/buildImagePath';
import { connectToDatabase } from "../../util/mongodb";
import { cardInformation } from "../../util/interfaces";

// currentPage:int default 1
// loop i=currentPage-1 -> currentPage*pageSize

const SearchLayout = ({cards}) => {
  const [cardInfo, setCardInfo] = useState<Array<cardInformation>>(null);
  const [pathUpdated, setPathUpdated] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const router=useRouter();

  useEffect(()=>{
    if(Array.isArray(cards)){
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
        <div className="my-8 p-4 rounded-lg h-full bg-white shadow-md flex flex-col sm:flex-row max-w-7xl">
          <div className='pr-2'>
            {cardInfo.map((card)=>{
              return (
                <Image
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

export async function getStaticPaths() {
  return {
    paths: [
      { params: { query:'null' } } // See the "paths" section below
    ],
    fallback: true // See the "fallback" section below
  };
}

export async function getStaticProps(context) {
  if(context.params.query==='null')
    return {props:{cards:null}};

  const { db } = await connectToDatabase();

  const cards = await db
      .collection("Year 1 & 2")
      .find({ Name:/Mark/ } )
      .sort({})
      .toArray();

  return {
    props: {
      cards: JSON.parse(JSON.stringify(cards)),
    },
  };
}

export default SearchLayout;