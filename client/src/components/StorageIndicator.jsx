import React, { useEffect, useState } from 'react'
import { formatSize } from './DetailsPopup'
import { userStorage } from '../apis/UserApi.js'
import { max } from 'date-fns'

const StorageIndicator = ({userId }) => {
  const [maxStorageInBytes,setMaxStorageInBytes]=useState("")
  const [usedStorageInBytes,setUsedStorageInBytes]=useState("")

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const res = await userStorage(userId)
        setMaxStorageInBytes(res?.maxStorageInBytes)
        setUsedStorageInBytes(res?.usedStorageInBytes)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchStorage()
  }, [])

  // Calculate percentage and color
  const storageUsed = usedStorageInBytes
  const totalStorage = maxStorageInBytes;
  const freeStorage = totalStorage - storageUsed ;
  const percentageUsed = (storageUsed / totalStorage) * 100;

  // Calculate stroke-dasharray values
  const circumference = 2 * Math.PI * 16; // r="16" in the SVG
  const dashValue = (percentageUsed / 100) * circumference;

  let progressColor = `text-indigo-500`;
  let bgColor = 'text-white';
  if (percentageUsed >= 50 && percentageUsed < 80) {
    progressColor = 'text-orange-500';
    bgColor = 'text-orange-200';
  } else if (percentageUsed >= 80) {
    progressColor = 'text-red-600';
    bgColor = 'text-red-200';
  }



  return (
    <div className="bg-gradient-to-b from-[#fff] to-[#6A4BFF] rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-indigo-800 ">Storage</h1>
      </div>


      {/* Circular Storage Indicator */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="size-full transform -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            {/* Background Circle */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className={`stroke-current ${bgColor}`}
              strokeWidth="3"
              strokeDasharray="100 100"
            ></circle>

            {/* Progress Circle */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className={`stroke-current ${progressColor}`}
              strokeWidth="3"
              strokeDasharray={`${dashValue} ${circumference}`}
              strokeLinecap="round"
            ></circle>
          </svg>

          {/* Value Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-lg font-bold text-white">{formatSize(freeStorage.toFixed(2))}</span>
            <span className="text-white block text-sm">Free</span>
          </div>
        </div>
      </div>

      {/* Storage usage details */}
      <div className="space-y-4 ">
        <div className="flex  justify-between items-center">
          {/* <span className="text-md text-white font-bold  ">
            Used Storage
          </span> */}
          <div className='p-4 border-3 rounded-md border-indigo-300 flex flex-col items-center justify-center gap-1'>
            <p className='font-bold text-indigo-200 text-sm'>Used storage</p>
            <span className="text-sm font-bold text-white tracking-widest ">{formatSize(storageUsed)} </span>
          </div>
          <div className='p-4 border-3 rounded-md border-indigo-300 flex flex-col items-center justify-center gap-1'>
            <p className='font-bold text-indigo-200 text-sm'>Total storage</p>
            <span className="text-sm font-bold text-white tracking-widest ">{formatSize(totalStorage)} </span>
          </div>
        </div>

        {/* premimum */}
        {/* <div className="flex justify-between items-center">
          <span className="text-xl text-white font-bold">
            <span className="text-white mr-2">•</span>
            Total
          </span>
          <span className="text-xl font-medium text-white">{totalStorage} GB</span>
        </div> */}
      </div>
    </div>
  )
}

export default StorageIndicator