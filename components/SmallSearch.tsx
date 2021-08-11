import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';

const FullPageSearch = ({type, query, setQuery}) => {

  const router = useRouter();

  return (
    <form
      className="p-1 flex flex-row w-full bg-white rounded-md shadow-sm border-2 placeholder-gray-400 border-blue-500 focus:ring-blue-700 focus:border-blue-700"
      onSubmit={ (e)=>{e.preventDefault();document.location.href=`/${type}/${query}`} }
    >
      <input 
        className="px-3 py-2 w-10/12 focus:outline-none"
        value={query}
        onChange={ (e)=>{setQuery(e.target.value)} }
      />
      <div
        className='sm:ml-4 md:ml-6 lg:ml-8 w-4 flex items-center cursor-pointer md:pl-2 lg:pl-4'
        onClick={ ()=>{document.location.href=`/${type}/${query}`} }
      >
        <FontAwesomeIcon 
          icon={faSearch}
        />
      </div>
    </form>
  )
}

export default FullPageSearch;