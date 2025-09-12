import React from 'react'

const UploadingSpace = ({
    fileInputRef,
    handleFileSelect
}) => {
    return (
        <div className="bg-white  overflow-hidden mb-4">
            <label for="uploadFile1"
                class="bg-[#E9E5FE]  text-[#6A4BFF] font-semibold  rounded-xl  h-42 flex flex-col items-center justify-center cursor-pointer border-2 border-[#6A4BFF] border-dashed mx-auto tracking-wide text-sm ">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-11 mb-3 fill-[#6A4BFF] " viewBox="0 0 32 32">
                    <path
                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                        data-original="#000000" />
                    <path
                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                        data-original="#000000" />
                </svg>
                Upload File 
                <input type="file" ref={fileInputRef} id='uploadFile1' className="hidden" multiple  onChange={handleFileSelect} />
                <p class="text-xs font-medium text-slate-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
            </label>
        </div>
    )
}

export default UploadingSpace
