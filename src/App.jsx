import JsonLogicBenchmark from './components/JsonLogicBenchmark'

function App() {
  console.log("test")
  return (

    < div className="min-h-screen bg-background p-8" >
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">JSONLogic Benchmark</h1>
        <JsonLogicBenchmark />
      </div>
    </div >
  )
}

export default App