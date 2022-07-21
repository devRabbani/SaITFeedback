import React, { useEffect, useState } from 'react'
import { completeStatus } from '../../utils/firebase'
import './home.style.css'
import { motion } from 'framer-motion'
import TeacherCard from '../../components/teacherCard'
import useData from '../../hooks/useData'
import SkeletonHome from '../../components/skeleton/skeletonHome'
import useTitle from '../../hooks/useTitle'

const usncardVariants = {
  hidden: {
    y: -60,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      mass: 0.5,
      damping: 8,
    },
  },

  exit: {
    y: -200,
    opacity: 0,
    transition: { ease: 'easeInOut' },
  },
}

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
  cse: 'COMPUTER SCIENCE',
  is: 'INFORMATION SCIENCE',
  me: 'MECHANICAL ENGINEERING',
  ece: 'ELECTRONICS AND COMMUNICATION',
  civil: 'CIVIL ENGINEERING',
}

const Home = ({ user }) => {
  useTitle('Home | SaITFeedback')

  // Getting User Data
  const usn = user?.usn
  const { userData, subLists } = useData(usn)
  //-----States-------
  //Teacher List Data
  const completed = userData?.complete || []
  const [isDone, setIsDone] = useState(userData ? userData.status : false)

  // Loading state true means no loading
  const loading = userData && subLists.length

  // Pending Status
  const status = subLists.length - completed.length

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
    if (!isDone && subLists.length && status === 0) {
      addStatus()
    }
  }, [completed, subLists, isDone])

  return (
    <>
      {loading ? (
        <div className='home'>
          <motion.div
            variants={usncardVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='usnCard'
          >
            <p className='deptName'>
              DEPARTMENT OF {deptList[userData.branch]}
            </p>
            <div className='topBar'>
              <p className='usnNumber'>
                <strong>USN :</strong>{' '}
                <span className='usn'>{userData.usn.toUpperCase()}</span>
              </p>
              <p>
                <strong>Sem :</strong> {userData.sem}
              </p>
              <p>
                <strong>Sec :</strong> {userData.sec.toUpperCase()}
              </p>
              <p>
                <strong> Branch :</strong> {userData.branch.toUpperCase()}
              </p>

              {status === 0 ? (
                <p>
                  <strong>Feedback Status :</strong>{' '}
                  <span className='status completed'>Completed</span>
                </p>
              ) : (
                <p>
                  <strong>Pending Feedback :</strong>{' '}
                  <span className='status'>{status}</span>
                </p>
              )}
            </div>
          </motion.div>
          <motion.div
            variants={wrappercardVariants}
            animate='visible'
            initial='hidden'
            exit='exit'
            className='teacherListCard'
          >
            <h1>Teachers</h1>
            <hr />
            <div className='teacherListWrapper'>
              {subLists.map((subject, i) => (
                <TeacherCard
                  key={i}
                  mark={completed.includes(subject.subcode)}
                  subjectData={subject}
                  usn={userData.usn}
                  branch={deptList[userData.branch]}
                />
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <SkeletonHome />
      )}
    </>
  )
}

export default Home