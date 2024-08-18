export function PulseVideoList() {
    return (
    <div className=" flex flex-col sm:flex-row mb-7 sm:mb-4 w-full">
        <div>
            <div className="relative pt-[58%] sm:pt-[180px] w-full sm:w-[280px]">
                <div className="absolute inset-0 bg-slate-700 animate-pulse"></div>
            </div>
        </div>

        <div className="hidden sm:block ml-2 mt-1 sm:mt-0 sm:ml-3 w-full">  
            <div className="bg-slate-700 animate-pulse h-[22px] max-w-[500px] w-[70%] rounded-md"></div>
            <div className="flex items-center mt-[8px]">
                <div>
                    <div className="bg-slate-700 animate-pulse w-12 h-12 rounded-full mt-1"></div>
                </div>
                <div className="bg-slate-700 animate-pulse w-[140px] h-[20px] rounded-md ml-3 mt-1"></div>
            </div>
            <div className="bg-slate-700 animate-pulse w-[160px] h-[18px] max-w-[210px] rounded-md mt-2"></div>
            <div className="bg-slate-700 animate-pulse w-[90%] max-w-[600px] h-[18px] rounded-md mt-4"></div>  
            <div className="bg-slate-700 animate-pulse w-[75%] max-w-[500px] h-[18px] rounded-md mt-2"></div>  
        </div>

        {/* pulse for smaller screen */}
        <div className="mt-1 sm:hidden flex items-start justify-start w-full">
            <div className="ml-2">
                <div className="bg-slate-700 animate-pulse w-12 h-12 rounded-full mt-1"></div>
            </div>
            <div className="mt-[6px] mr-2 ml-3 w-full">
                <div className="bg-slate-700 animate-pulse w-full h-[20px] rounded-md"></div>
                <div className="bg-slate-700 animate-pulse w-[280px] h-[17px] rounded-md mt-[5px]"></div>
                <div className="bg-slate-700 animate-pulse w-[200px] h-[16px] rounded-md mt-[5px]"></div>
            </div>
        </div>
    </div>
    )
}

// without avatar
export function PulseVideoCard() {
    return (
    <div className="mb-7 animate-pulse ">
        <div className="bg-slate-700 h-[330px] w-full sm:h-[240px] "></div>
        <div className="bg-slate-700 h-[30px] w-[100%] rounded-md mt-1"></div>
        <div className="bg-slate-700 w-[100%] h-[20px] rounded-md mt-1"></div>
    </div>
    )
}

// subscribed channels
export function PulseSubscribedChannel() {
    return (
        <div className="animate-pulse mb-4 relative">
            <div className="flex items-center">
                <div className="w-[50px] rounded-full h-[50px] md:h-[60px] md:w-[60px] bg-slate-700"></div>
                <div className="w-[90%] ml-3">
                    <div className="w-[35%] h-[20px] bg-slate-700 rounded-md"></div>
                    <div className="w-[20%] h-[15px] bg-slate-700 mt-[5px] rounded-md"></div>
                </div>
            </div>
            <div className="w-[100px] h-[38px] md:h-[40px] bg-slate-700 rounded-sm absolute right-1 top-[9px] md:top-[8px]"></div>
        </div>
    )
}

//channel
export function PulseChannel() {
    return (
        <div className="animate-pulse">
            <div className="bg-slate-700 h-[170px] sm:h-[200px]"></div>

            <div className="relative top-[-15px] flex items-center ml-1">
                <div className="bg-slate-500 opacity-80 w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] overflow-hidden rounded-full"></div>

                <div className="ml-[15px] mt-1">
                    <div className="bg-slate-700 mt-4 sm:mt-1 w-[200px] h-[23px] rounded-md"></div>
                    <div className="bg-slate-700 w-[110px] h-[16px] rounded-[5px] mt-2"></div>
                    <div className="bg-slate-700 w-[150px] h-[16px] rounded-[5px] mt-2"></div>
                    <div className="bg-slate-700 absolute h-[35px] w-[90px] right-[20px] top-[40px] md:right-[30px]"></div>
                </div>
            </div>

            <div className="flex items-center justify-evenly w-full mb-[8px]">
                <div className="w-1/5 mx-[3px] bg-slate-700 h-[40px] border-b-[0.13rem] border-b-[#b5b4b4]"></div>
                <div className="w-1/5 mx-[3px] bg-slate-700 h-[40px] border-b-[0.13rem] border-b-[#b5b4b4]"></div>
                <div className="w-1/5 mx-[3px] bg-slate-700 h-[40px] border-b-[0.13rem] border-b-[#b5b4b4]"></div>
                <div className="w-1/5 mx-[3px] bg-slate-700 h-[40px] border-b-[0.13rem] border-b-[#b5b4b4]"></div>
                <div className="w-1/5 mx-[3px] bg-slate-700 h-[40px] border-b-[0.13rem] border-b-[#b5b4b4]"></div>
            </div>

            <hr className="border-[0.01rem] border-[#b5b4b4]"/>

            <div className="bg-slate-700 h-[250px] mb-[10px]"></div>
        </div>
    )
}

// without avatar (without avatar hi chahiye even if our channel or else's channel)
export function PulsePlaylistCard() {
    return (
    <div className="animate-pulse">
        <div className="bg-slate-700 h-[330px] w-full sm:h-[240px] relative">
            <div className="px-2 h-[100px] bg-slate-800 border-t-[0.01rem] border-[#b5b4b4] w-full absolute bottom-0 flex items-center">
                <div className="w-full">
                    <div className="bg-slate-700 h-[20px] w-[67%] rounded-md"></div>
                    <div className="bg-slate-700 h-[20px] w-[57%] mt-1 rounded-md"></div>
                    <div className="bg-slate-700 h-[15px] w-[40%] mt-2 rounded-md"></div>
                </div>

                <div className="bg-slate-700 h-6 w-[22%] absolute right-2 top-[16px] rounded-md"></div>
            </div>
        </div>
    </div>
    )
}

//settings
export function PulseSettings() {
    return (
        <div className="animate-pulse">
            <div className="bg-slate-700 h-[170px] sm:h-[200px]"></div>

            <div className="relative top-[-15px] flex items-center ml-1">
                <div className="bg-slate-500 opacity-80 w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] overflow-hidden rounded-full"></div>

                <div className="ml-[15px]">
                    <div className="bg-slate-700 mt-4 sm:mt-1 w-[150px] h-[20px] rounded-[3px]"></div>
                    <div className="bg-slate-700 w-[100px] h-[19px] rounded-[3px] mt-1"></div>
                    <div className="bg-slate-700 absolute h-[38px] w-[110px] right-[20px] top-[40px] md:right-[30px]"></div>
                </div>
            </div>

            <div className="flex items-center justify-evenly w-full mb-[6px]">
                <div className="w-1/3 mx-[3px] bg-slate-700 h-[35px]"></div>
                <div className="w-1/3 mx-[3px] bg-slate-700 h-[35px]"></div>
                <div className="w-1/3 mx-[3px] bg-slate-700 h-[35px]"></div>
            </div>

            <hr className="mb-[6px] border-[0.01rem] border-[#b5b4b4]"/>

            <div className="bg-slate-700 h-[250px] mb-[10px]"></div>
        </div>
    )
}

//about
export function PulseChannelAbout() {
    return (
        <div className='w-full py-3 px-12 animate-pulse'>
          <div className='h-10 w-[180px] rounded-md bg-slate-700'></div>
          <div className='mt-4 h-5 min-w-[400px] w-[55%] bg-slate-700 rounded-md'></div>
          <div className='mt-[6px] h-5 min-w-[300px] w-[45%] bg-slate-700 rounded-md'></div>
          <div className='mt-6 h-9 w-[230px] rounded-md bg-slate-700'></div>

          <div className='w-full mt-5'>
            <p className='flex items-center mb-2 gap-3 text-[1.1rem]'>
              <span className='size-[35px] rounded-full bg-slate-700'></span> 
              <span className='h-5 w-[35%] rounded-md bg-slate-700'></span> 
            </p>
            <p className='flex items-center mb-2 gap-3 text-[1.1rem]'>
                <span className='size-[35px] rounded-full bg-slate-700'></span> 
                <span className='h-5 w-[35%] rounded-md bg-slate-700'></span>  
            </p>
            <p className='flex items-center mb-2 gap-3 text-[1.1rem]'>
                <span className='size-[35px] rounded-full bg-slate-700'></span> 
                <span className='h-5 w-[35%] rounded-md bg-slate-700'></span> 
            </p>
            <p className='flex items-center mb-2 gap-3 text-[1.1rem]'>
                <span className='size-[35px] rounded-full bg-slate-700'></span> 
                <span className='h-5 w-[35%] rounded-md bg-slate-700'></span> 
            </p>
            <p className='flex items-center mb-2 gap-3 text-[1.1rem]'>
                <span className='size-[35px] rounded-full bg-slate-700'></span> 
                <span className='h-5 w-[35%] rounded-md bg-slate-700'></span> 
            </p>
            <p className='flex items-center mb-2 gap-3 text-[1.1rem]'>
                <span className='size-[35px] rounded-full bg-slate-700'></span> 
                <span className='h-5 w-[35%] rounded-md bg-slate-700'></span> 
            </p>
            <p className='flex items-center mb-2 gap-3 text-[1.1rem]'>
                <span className='size-[35px] rounded-full bg-slate-700'></span> 
                <span className='h-5 w-[35%] rounded-md bg-slate-700'></span> 
            </p>
          </div>
        </div>
    )
}

//random video card
export function PulseRandomVideoCard() {
    return (
        <div className="">
            <div className="bg-slate-700 animate-pulse relative w-full pt-[56%]"></div>
            <div className="flex items-start gap-3">
                <div className="">
                    <div className="h-11 w-11 rounded-full bg-slate-700 animate-pulse mt-2"></div>
                </div>
                <div className="w-full">
                    <div className="bg-slate-700 animate-pulse h-[20px] w-full mt-2 rounded-md"></div>
                    <div className="bg-slate-700 animate-pulse h-[18px] w-[210px] mt-[5px] rounded-md"></div>
                    <div className="bg-slate-700 animate-pulse h-4 mt-[5px] rounded-md w-[170px]"></div>
                </div>
            </div>
        </div>
    )
}

//videoPage side video list
export function PulseRecemendationVideoList() {
    return (
        <div className="animate-pulse mb-4 w-full flex items-start justify-start">
            <div className="bg-slate-700 w-[210px] h-[140px] rounded-xl"></div>
            <div className="flex flex-col justify-start items-start w-[calc(100%-220px)] ml-3 mt-1">
                <div className="bg-slate-700 w-full h-[19px] mb-[8px] rounded-md"></div>
                <div className="bg-slate-700 w-[85%] h-[19px] mb-[17px] rounded-md"></div>
                <div className="bg-slate-700 w-[65%] h-[17px] mb-[8px] rounded-md"></div>
                <div className="bg-slate-700 w-[50%] h-[17px] rounded-md"></div>
            </div>
        </div>
    )
}

//video page
export function PulseVideoPage() {
    const comments = [];
    for(let i=0;i<3;i++){
        comments.push(
            <div key={i}>
                <hr className="my-6"/>
                <div className="flex items-start justify-start gap-3 w-full">
                    <div>
                        <div className="rounded-full size-[43px] animate-pulse bg-slate-600"></div>
                    </div>
                    <div className="w-full">
                        <div className="animate-pulse bg-slate-600 rounded-md w-[30%] h-[16px]"></div>
                        <div className="animate-pulse bg-slate-600 rounded-[5px] w-[100px] h-[15px] mt-2"></div>
                        <div className="animate-pulse bg-slate-600 w-[100%] h-[16px] rounded-md mt-4"></div>
                        <div className="animate-pulse bg-slate-600 w-[80%] h-[16px] rounded-md mt-[7px]"></div>
                        <div className="animate-pulse flex items-center justify-start w-[30%] overflow-hidden border-[0.01rem] border-[#b5b4b4] rounded-lg mt-4">
                            <div className="bg-slate-600 h-[35px] w-[50%] border-r-[0.01rem] border-r-[#b5b4b4]"></div>
                            <div className="bg-slate-600 h-[35px] w-[50%]"></div>
                        </div>
                    </div>
                </div>
            </div>    
        );
    }   
    return (
        <div className="flex flex-col gap-6 items-start justify-start lg:flex-row w-full h-full">
            <div className="lg:w-[80%] w-full">
                <div className="relative w-full pt-[55%]">
                    <div className="absolute inset-0 animate-pulse mx-auto bg-slate-700 max-w-[900px] lg:max-w-full h-full rounded-xl"></div>
                </div>
                <div className="border-[0.01rem] border-[#b5b4b4] h-[300px] w-full rounded-lg mt-2 p-4">
                    <div className="animate-pulse bg-slate-600 h-[22px] w-full rounded-md"></div>
                    <div className="animate-pulse bg-slate-600 h-[17px] w-[200px] rounded-md mt-2"></div>
                    <div className="mt-6 flex items-center justify-between">
                        <div className="animate-pulse flex items-center justify-start w-[135px] overflow-hidden border-[0.01rem] border-[#b5b4b4] rounded-lg">
                            <div className="bg-slate-600 h-[36px] w-[50%] border-r-[0.01rem] border-r-[#b5b4b4]"></div>
                            <div className="bg-slate-600 h-[36px] w-[50%]"></div>
                        </div>
                        <div className="animate-pulse bg-slate-600 border-[0.01rem] border-[#b5b4b4] rounded-lg h-[36px] w-[90px]"></div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center justify-start">
                            <div className="">
                                <div className="rounded-full animate-pulse bg-slate-600 size-[50px]"></div>
                            </div>
                            <div className="ml-3">
                                <div className="animate-pulse bg-slate-600 h-[18px] w-[120px] rounded-md"></div>
                                <div className="animate-pulse bg-slate-600 h-[15px] mt-2 w-[150px] rounded-[5px]"></div>
                            </div>
                        </div>
                        <div className="animate-pulse bg-slate-600 w-[110px] h-[38px]"></div>
                    </div>
                    <hr className="my-4"/>
                    <div className="animate-pulse bg-slate-600 w-full h-[20px] rounded-md"></div>
                    <div className="animate-pulse bg-slate-600 w-[80%] h-[20px] mt-2 rounded-md"></div>
                </div>
                <div className="h-full hidden lg:block border-[0.01rem] border-[#b5b4b4] w-full rounded-lg mt-2 p-4">
                    <div>
                        <div className="animate-pulse bg-slate-600 w-[30%] h-[23px] rounded-md"></div>
                        <div className="relative px-2 w-full h-[43px] rounded-lg border-[0.01rem] border-[#b5b4b4] mt-4">
                            <div className="flex items-center justify-end h-full gap-2">
                                <div className="animate-pulse bg-slate-600 rounded-full h-[30px] w-[85px]"></div>
                                <div className="animate-pulse bg-slate-600 rounded-full h-[30px] w-[100px]"></div>
                            </div>
                        </div>
                    </div>
                    <div className="">{comments}</div>
                </div>
            </div>
            <div className="w-full max-w-[700px] lg:w-[35%]">
                <PulseRecemendationVideoList/>
                <PulseRecemendationVideoList/>
                <PulseRecemendationVideoList/>
                <PulseRecemendationVideoList/>
                <PulseRecemendationVideoList/>
            </div>
        </div>
    )
}

export function PulseAdminPage() {
    return (
        <div>
            <div className="flex flex-col items-start justify-between sm:flex-row gap-5">
                <div>
                    <div className="animate-pulse h-7 rounded-md w-[250px] bg-slate-700"></div>
                    <div className="animate-pulse h-6 rounded-md w-[350px] mt-2 bg-slate-700"></div>
                </div>
                <div className="animate-pulse bg-slate-700 h-[48px] rounded-sm w-[160px] mt-1"></div>
            </div>

            <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-7">
                <div className="animate-pulse bg-slate-700 border-[0.1rem] border-[#b5b4b4] h-[150px] w-full rounded-[5px]"></div>
                <div className="animate-pulse bg-slate-700 border-[0.1rem] border-[#b5b4b4] h-[150px] w-full rounded-[5px]"></div>
                <div className="animate-pulse bg-slate-700 border-[0.1rem] border-[#b5b4b4] h-[150px] w-full rounded-[5px]"></div>
                <div className="animate-pulse bg-slate-700 border-[0.1rem] border-[#b5b4b4] h-[150px] w-full rounded-[5px]"></div>
            </div>

            <div className="my-8 animate-pulse bg-slate-700 w-full max-w-[600px] h-10 rounded-full border-[0.1rem] border-[#b5b4b4]">
                <div className="w-12 flex items-center justify-center h-full">
                    <div className="text-[1.2rem] text-[#b5b4b4]"><i className="fa-solid fa-magnifying-glass"></i></div>
                </div>
            </div>

            <div className="overflow-x-scroll w-full">
                <table className="border-[0.1rem] border-[#b5b4b4] w-full">
                    <tr className="border-b-[0.1rem] border-[#b5b4b4] h-[65px]">
                        <td className="animate-pulse bg-slate-700 w-full"></td>
                    </tr>
                    <tr className="px-8 border-b-[0.01rem] border-b-slate-600 h-[75px] flex items-center justify-evenly gap-14">
                        <td className="animate-pulse bg-slate-700 w-[60px] h-[30px] rounded-full "></td>
                        <td className="animate-pulse bg-slate-700 w-[100px] rounded-full h-[30px]"></td>
                        <td className="flex items-center justify-center">
                            <div><div className="animate-pulse bg-slate-700 size-[43px] rounded-full"></div></div>
                            <div className="animate-pulse bg-slate-700 w-[200px] h-[26px] rounded-md ml-4"></div>
                        </td>
                        <td className="animate-pulse bg-slate-700 w-[120px] h-[30px] rounded-md"></td>
                        <td className="animate-pulse bg-slate-700 w-[45px] h-[30px] rounded-md"></td>
                        <td className="animate-pulse bg-slate-700 w-[45px] h-[30px] rounded-md"></td>
                        <td className="flex items-center justify-center gap-4">
                            <div className="animate-pulse bg-[#d4ffd4] brightness-[0.7] w-[80px] h-[37px] rounded-[12px]"></div>
                            <div className="animate-pulse bg-[#ffd2d2] brightness-[0.7] w-[80px] h-[37px] rounded-[12px]"></div>
                        </td>
                        <td className="flex items-center justify-center gap-4">
                            <div className="animate-pulse bg-slate-700 w-[40px] h-[37px] rounded-[10px]"></div>
                            <div className="animate-pulse bg-slate-700 w-[40px] h-[37px] rounded-[10px]"></div>
                        </td>
                    </tr>
                    <tr className="px-8 border-b-[0.01rem] border-b-slate-600 h-[75px] flex items-center justify-evenly gap-14">
                        <td className="animate-pulse bg-slate-700 w-[60px] h-[30px] rounded-full "></td>
                        <td className="animate-pulse bg-slate-700 w-[100px] rounded-full h-[30px]"></td>
                        <td className="flex items-center justify-center">
                            <div><div className="animate-pulse bg-slate-700 size-[43px] rounded-full"></div></div>
                            <div className="animate-pulse bg-slate-700 w-[200px] h-[26px] rounded-md ml-4"></div>
                        </td>
                        <td className="animate-pulse bg-slate-700 w-[120px] h-[30px] rounded-md"></td>
                        <td className="animate-pulse bg-slate-700 w-[45px] h-[30px] rounded-md"></td>
                        <td className="animate-pulse bg-slate-700 w-[45px] h-[30px] rounded-md"></td>
                        <td className="flex items-center justify-center gap-4">
                            <div className="animate-pulse bg-[#d4ffd4] brightness-[0.7] w-[80px] h-[37px] rounded-[12px]"></div>
                            <div className="animate-pulse bg-[#ffd2d2] brightness-[0.7] w-[80px] h-[37px] rounded-[12px]"></div>
                        </td>
                        <td className="flex items-center justify-center gap-4">
                            <div className="animate-pulse bg-slate-700 w-[40px] h-[37px] rounded-[10px]"></div>
                            <div className="animate-pulse bg-slate-700 w-[40px] h-[37px] rounded-[10px]"></div>
                        </td>
                    </tr>
                    <tr className="px-8 border-b-[0.01rem] border-b-slate-600 h-[75px] flex items-center justify-evenly gap-14">
                        <td className="animate-pulse bg-slate-700 w-[60px] h-[30px] rounded-full "></td>
                        <td className="animate-pulse bg-slate-700 w-[100px] rounded-full h-[30px]"></td>
                        <td className="flex items-center justify-center">
                            <div><div className="animate-pulse bg-slate-700 size-[43px] rounded-full"></div></div>
                            <div className="animate-pulse bg-slate-700 w-[200px] h-[26px] rounded-md ml-4"></div>
                        </td>
                        <td className="animate-pulse bg-slate-700 w-[120px] h-[30px] rounded-md"></td>
                        <td className="animate-pulse bg-slate-700 w-[45px] h-[30px] rounded-md"></td>
                        <td className="animate-pulse bg-slate-700 w-[45px] h-[30px] rounded-md"></td>
                        <td className="flex items-center justify-center gap-4">
                            <div className="animate-pulse bg-[#d4ffd4] brightness-[0.7] w-[80px] h-[37px] rounded-[12px]"></div>
                            <div className="animate-pulse bg-[#ffd2d2] brightness-[0.7] w-[80px] h-[37px] rounded-[12px]"></div>
                        </td>
                        <td className="flex items-center justify-center gap-4">
                            <div className="animate-pulse bg-slate-700 w-[40px] h-[37px] rounded-[10px]"></div>
                            <div className="animate-pulse bg-slate-700 w-[40px] h-[37px] rounded-[10px]"></div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export function PulsePlaylistPage() {
    return (
        <div className="flex flex-col xl:flex-row gap-y-[40px] gap-x-[30px]">
            <div className="w-full max-w-[450px]">
                <div className="sm:max-w-[450px]">
                    <div className="animate-pulse ">
                        <div className="bg-slate-700 h-[320px] w-full sm:h-[280px] relative">
                            <div className="px-2 h-[90px] bg-slate-800 border-t-[0.01rem] border-[#b5b4b4] w-full absolute bottom-0 flex items-center">
                                <div className="w-full">
                                    <div className="bg-slate-700 h-[20px] w-[67%] rounded-md"></div>
                                    <div className="bg-slate-700 h-[20px] w-[57%] mt-2 rounded-md"></div>
                                    <div className="bg-slate-700 h-[15px] w-[40%] mt-2 rounded-[5px]"></div>
                                </div>

                                <div className="bg-slate-700 h-6 w-[22%] absolute right-2 top-[16px] rounded-md"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div className="bg-slate-700 animate-pulse w-full h-[22px] rounded-md mt-4"></div>
                        <div className="bg-slate-700 animate-pulse w-[75%] h-[22px] rounded-md mt-2"></div>
                    </div>

                    <div className="mt-6 flex items-center justify-start">
                        <div>
                            <div className="size-[50px] rounded-full bg-slate-700 animate-pulse"></div>
                        </div>
                        <div className="ml-3">
                            <div className="w-[200px] bg-slate-700 animate-pulse h-[20px] rounded-md"></div>
                            <div className="w-[140px] bg-slate-700 animate-pulse h-[17px] mt-2 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="flex flex-col items-start justify-start w-full gap-6">
                    <div className=" flex flex-col sm:flex-row border-[0.01rem] border-[#b5b4b4] w-full">
                        <div>
                            <div className="relative pt-[58%] sm:pt-[180px] w-full sm:w-[280px]">
                                <div className="absolute inset-0 bg-slate-700 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="hidden sm:block ml-2 mt-1 sm:mt-0 sm:ml-3 w-full pt-[6px]">  
                            <div className="bg-slate-700 animate-pulse h-[22px] max-w-[500px] w-[70%] rounded-md"></div>
                            <div className="flex items-center mt-[8px]">
                                <div>
                                    <div className="bg-slate-700 animate-pulse w-12 h-12 rounded-full mt-1"></div>
                                </div>
                                <div className="bg-slate-700 animate-pulse w-[140px] h-[20px] rounded-md ml-3 mt-1"></div>
                            </div>
                            <div className="bg-slate-700 animate-pulse w-[160px] h-[18px] max-w-[210px] rounded-md mt-2"></div>
                            <div className="bg-slate-700 animate-pulse w-[90%] max-w-[600px] h-[18px] rounded-md mt-4"></div>  
                            <div className="bg-slate-700 animate-pulse w-[75%] max-w-[500px] h-[18px] rounded-md mt-2"></div>  
                        </div>

                        {/* pulse for smaller screen */}
                        <div className="mt-1 sm:hidden flex items-start justify-start w-full pb-3">
                            <div className="ml-2">
                                <div className="bg-slate-700 animate-pulse w-12 h-12 rounded-full mt-1"></div>
                            </div>
                            <div className="mt-[6px] mr-2 ml-3 w-full">
                                <div className="bg-slate-700 animate-pulse w-full h-[20px] rounded-md"></div>
                                <div className="bg-slate-700 animate-pulse w-[280px] h-[17px] rounded-md mt-[5px]"></div>
                                <div className="bg-slate-700 animate-pulse w-[200px] h-[16px] rounded-md mt-[5px]"></div>
                            </div>
                        </div>
                    </div>
                
                    <div className=" flex flex-col sm:flex-row border-[0.01rem] border-[#b5b4b4] w-full">
                        <div>
                            <div className="relative pt-[58%] sm:pt-[180px] w-full sm:w-[280px]">
                                <div className="absolute inset-0 bg-slate-700 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="hidden sm:block ml-2 mt-1 sm:mt-0 sm:ml-3 w-full  pt-[6px]">  
                            <div className="bg-slate-700 animate-pulse h-[22px] max-w-[500px] w-[70%] rounded-md"></div>
                            <div className="flex items-center mt-[8px]">
                                <div>
                                    <div className="bg-slate-700 animate-pulse w-12 h-12 rounded-full mt-1"></div>
                                </div>
                                <div className="bg-slate-700 animate-pulse w-[140px] h-[20px] rounded-md ml-3 mt-1"></div>
                            </div>
                            <div className="bg-slate-700 animate-pulse w-[160px] h-[18px] max-w-[210px] rounded-md mt-2"></div>
                            <div className="bg-slate-700 animate-pulse w-[90%] max-w-[600px] h-[18px] rounded-md mt-4"></div>  
                            <div className="bg-slate-700 animate-pulse w-[75%] max-w-[500px] h-[18px] rounded-md mt-2"></div>  
                        </div>

                        {/* pulse for smaller screen */}
                        <div className="mt-1 sm:hidden flex items-start justify-start w-full pb-3">
                            <div className="ml-2">
                                <div className="bg-slate-700 animate-pulse w-12 h-12 rounded-full mt-1"></div>
                            </div>
                            <div className="mt-[6px] mr-2 ml-3 w-full">
                                <div className="bg-slate-700 animate-pulse w-full h-[20px] rounded-md"></div>
                                <div className="bg-slate-700 animate-pulse w-[280px] h-[17px] rounded-md mt-[5px]"></div>
                                <div className="bg-slate-700 animate-pulse w-[200px] h-[16px] rounded-md mt-[5px]"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className=" flex flex-col sm:flex-row border-[0.01rem] border-[#b5b4b4] w-full">
                        <div>
                            <div className="relative pt-[58%] sm:pt-[180px] w-full sm:w-[280px]">
                                <div className="absolute inset-0 bg-slate-700 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="hidden sm:block ml-2 mt-1 sm:mt-0 sm:ml-3 w-full pt-[5px]">  
                            <div className="bg-slate-700 animate-pulse h-[22px] max-w-[500px] w-[70%] rounded-md"></div>
                            <div className="flex items-center mt-[8px]">
                                <div>
                                    <div className="bg-slate-700 animate-pulse w-12 h-12 rounded-full mt-1"></div>
                                </div>
                                <div className="bg-slate-700 animate-pulse w-[140px] h-[20px] rounded-md ml-3 mt-1"></div>
                            </div>
                            <div className="bg-slate-700 animate-pulse w-[160px] h-[18px] max-w-[210px] rounded-md mt-2"></div>
                            <div className="bg-slate-700 animate-pulse w-[90%] max-w-[600px] h-[18px] rounded-md mt-4"></div>  
                            <div className="bg-slate-700 animate-pulse w-[75%] max-w-[500px] h-[18px] rounded-md mt-2"></div>  
                        </div>

                        {/* pulse for smaller screen */}
                        <div className="mt-1 sm:hidden flex items-start justify-start w-full pb-3">
                            <div className="ml-2">
                                <div className="bg-slate-700 animate-pulse w-12 h-12 rounded-full mt-1"></div>
                            </div>
                            <div className="mt-[6px] mr-2 ml-3 w-full">
                                <div className="bg-slate-700 animate-pulse w-full h-[20px] rounded-md"></div>
                                <div className="bg-slate-700 animate-pulse w-[280px] h-[17px] rounded-md mt-[5px]"></div>
                                <div className="bg-slate-700 animate-pulse w-[200px] h-[16px] rounded-md mt-[5px]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}