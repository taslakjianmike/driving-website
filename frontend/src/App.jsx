import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Topic from './pages/Topic.jsx'
import Question from './pages/Question.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topic/:topicId" element={<Topic />} />
        <Route path="/topic/:topicId/question/:questionId" element={<Question />} />
      </Routes>
    </>
  )
}
