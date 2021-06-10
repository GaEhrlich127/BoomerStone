import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Button from './Button';
import { useRouter } from 'next/router';

const FullPageSearch = () => {

  const [query, setQuery] = useState(null);
  const router = useRouter();

  return (
    <div className='bg-blue-400 w-screen h-screen space-y-4'>
      <div className='w-full h-auto flex justify-center'>
        <div className="flex mt-72 p-1 w-screen md:w-3/6 bg-white rounded-md  shadow-sm border-2 placeholder-gray-400 border-blue-500 focus:ring-blue-700 focus:border-blue-700">
          <input 
            className="px-3 py-2 w-11/12 focus:outline-none"
            onChange={ (e)=>{setQuery(e.target.value)} }
          />
          <div
            className='w-4 flex items-center cursor-pointer md:pl-2 lg:pl-4'
            onClick={ ()=>{router.push(`search/${query}`)} }
          >
            <FontAwesomeIcon 
              icon={faSearch}
            />
          </div>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='flex justify-around w-screen md:w-3/6'>
            <Button text='Random Card' onClick={ ()=>{router.push(`random/${query}`)} }/>
            <Button text='Discover' onClick={ ()=>{router.push(`discover/${query}`)} }/>
            <Button text='Search' onClick={ ()=>{router.push(`search/${query}`)} }/>
        </div>
      </div>
    </div>
  )
}

export default FullPageSearch;