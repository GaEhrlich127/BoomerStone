import Image from 'next/image';

const NotFound = () => (
  <div className='bg-blue-400 w-screen h-screen flex justify-center'>
    <div className="mt-16">
      <Image src="/images/cards/404.png" width={375} height={518}/>
    </div>
  </div>
)

export default NotFound;