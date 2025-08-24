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
          h-[100%] backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden grid relative
          ${selectedUser 
            ? 'grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' 
            : 'grid-cols-1 md:grid-cols-2'
          }
        `}
      >
        {/* Mobile ≤425px: show only sidebar if no user, chat if user selected */}
        <div className={`${selectedUser ? 'hidden sm:block' : 'block'}`}>
          <SideBar />
        </div>

        {/* Chat container: only visible when user selected on mobile */}
        {selectedUser && (
          <div className='block sm:block'>
            <ChatContainer />
          </div>
        )}

        {/* RightSideBar: hide on mobile */}
        <div className='hidden sm:block'>
          <RightSideBar />
        </div>
      </div>
    </div>
  )
}

export default HomePage
