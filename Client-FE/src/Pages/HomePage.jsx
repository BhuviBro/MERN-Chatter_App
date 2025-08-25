import React, { useContext } from 'react'
import SideBar from '../Components/SideBar'
import RightSideBar from '../Components/RightSideBar'
import ChatContainer from '../Components/ChatContainer'
import { ChatContext } from '../../Context/ChatContext'

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext)

  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
      <div
        className={`
          h-full backdrop-blur-xl border-2 border-gray-600 rounded-2xl 
          grid relative
          ${selectedUser 
            ? 'grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' 
            : 'grid-cols-1 md:grid-cols-2'
          }
        `}
      >
        {/* Sidebar */}
        <div className={`${selectedUser ? 'hidden sm:block' : 'block'} h-full overflow-y-auto`}>
          <SideBar />
        </div>

        {/* Chat container: scrollable area */}
        {selectedUser && (
          <div className='block sm:block h-full overflow-y-auto'>
            <ChatContainer />
          </div>
        )}

        {/* RightSideBar */}
        <div className='hidden sm:block h-full overflow-y-auto'>
          <RightSideBar />
        </div>
      </div>
    </div>
  )
}

export default HomePage
