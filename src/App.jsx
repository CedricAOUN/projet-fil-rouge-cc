import { Route, BrowserRouter, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import SingleRecipePage from './pages/SingleRecipePage/SingleRecipePage'
import RecipeCreateForm from './pages/RecipeCreateForm/RecipeCreateForm'
import PremiumCard from './components/PremiumCard/PremiumCard'

function App() {

  return (
    <>
      <Header />
      <main>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<PremiumCard></PremiumCard>} />
            <Route path='/recipes' element={<></>} />
            <Route path='/recipe/:id' element={<SingleRecipePage />} />
            <Route path='/recipe-create' element={<RecipeCreateForm />} />
            <Route path='/experts' element={<></>} />
            <Route path='/experts/:id' element={<></>} />
            <Route path='/premium' element={<></>} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  )
}

export default App
