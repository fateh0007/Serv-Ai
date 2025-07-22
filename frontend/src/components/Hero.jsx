import React from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Hero = () => {

    const navigate = useNavigate();

  return (
    <div className='px-4 sm:px-10 xl:px-32 relative inline-flex flex-col w-full 
        bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen justify-center'>
        
        <div className='text-center mb-6'>
            <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]'>Crete Amazing content <br /> with
                <span className='pl-2 text-primary'>AI Tools</span>
            </h1>
            <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur doloribus at excepturi corporis harum obcaecati quae adipisci maxime sint quia!
            </p>
        </div>

        <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
            <button onClick={() => navigate('/ai')} className='bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95
            transition cursor-pointer '>Start Creating now</button>
            <button className='bg-white px-10 py-3 rounded-lg border border-gray hover:scale-102 acitve:scale-95
            transition cursor-pointer'>Watch Demo</button>
        </div>

        <div className='flex items-center gap-4 mt-8 mx-auto text-gray-600'>
            <img src={assets.user_group} alt="" className='h-8'/>
            Trusted by 100+ people
        </div>

    </div>
  )
}

export default Hero