import React, { useEffect, useState } from 'react'
import { completeStatus } from '../../utils/firebase'
import './home.style.css'
import { motion } from 'framer-motion'
import TeacherCard from '../../components/teacherCard'
import useData from '../../hooks/useData'
import SkeletonHome from '../../components/skeleton/skeletonHome'
import useTitle from '../../hooks/useTitle'
import TopInfoBar from '../../components/topInfoBar'

const wrappercardVariants = {
  hidden: {
    y: 160,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      mass: 0.5,
      damping: 8,
      when: 'beforeChildren',
      staggerChildren: 0.4,
    },
  },

  exit: {
    y: 200,
    opacity: 0,
    transition: { ease: 'easeInOut' },
  },
}

const deptList = {
  cse: 'COMPUTER SCIENCE AND ENGINEERING',
  is: 'INFORMATION SCIENCE',
  me: 'MECHANICAL ENGINEERING',
  ece: 'ELECTRONICS AND COMMUNICATION',
  civil: 'CIVIL ENGINEERING',
}

const Home = ({ user }) => {
  useTitle('Home | SaITFeedback')
  // Getting User Data
  const uid = user?.uid
  const { userData, subLists } = useData(uid)
  //-----States-------
  //Teacher List Data
  const completed = userData?.complete || []
  const [isDone, setIsDone] = useState(userData ? userData.status : false)

  // Loading state true means no loading
  const loading = userData && subLists

  // Pending Status
  const status = subLists?.length - completed?.length

  // Function
  //Adding for completed review Toggle Complete
  const addStatus = async () => {
    try {
      await completeStatus(userData?.usn)
    } catch (error) {
      console.error(error)
    }
  }

  // Side Effect
  // Complete status
  useEffect(() => {
    if (!isDone && subLists?.length && status === 0) {
      addStatus()
      console.log('done submit')
    }
  }, [completed, subLists, isDone])

  return (
    <>
      {loading ? (
        <div className="home">
          <TopInfoBar
            dept={deptList[userData.branch]}
            userData={userData}
            status={status}
          />
          <motion.div
            variants={wrappercardVariants}
            animate="visible"
            initial="hidden"
            exit="exit"
            className="teacherListCard"
          >
            <h1>Teachers</h1>
            <hr />
            {subLists?.length > 0 ? (
              <div className="teacherListWrapper">
                {subLists?.map((subject, i) => (
                  <TeacherCard
                    key={i}
                    mark={completed.includes(subject.subcode)}
                    subjectData={subject}
                    usn={userData.usn}
                    branch={deptList[userData.branch]}
                  />
                ))}
              </div>
            ) : (
              <p className="noTeacherData">No Teachers Data Found</p>
            )}
          </motion.div>
        </div>
      ) : (
        <SkeletonHome />
      )}
    </>
  )
}

export default Home
