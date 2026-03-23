import React, { useEffect } from 'react'
import Header from './components/Header/Header'
import AgentGrid from './components/AgentGrid/AgentGrid'
import ObserverPanel from './components/ObserverPanel/ObserverPanel'
import useAgentStore from './stores/useAgentStore'
import './App.css'

const App = () => {
  const init = useAgentStore(s => s.init)
  const destroy = useAgentStore(s => s.destroy)
  const selectedAgent = useAgentStore(s => s.selectedAgent)
  const agents = useAgentStore(s => s.agents)
  const selectAgent = useAgentStore(s => s.selectAgent)
  const closePanel = useAgentStore(s => s.closePanel)

  useEffect(() => {
    init()
    return () => destroy()
  }, [init, destroy])

  const agent = agents.find(a => a.id === selectedAgent)

  return (
    <div className="app">
      <Header onMenuToggle={() => console.log('menu toggled')} />

      <main className="app__main">
        <AgentGrid
          selectedId={selectedAgent}
          onSelect={(id) => selectAgent(selectedAgent === id ? null : id)}
        />

        {selectedAgent && agent && (
          <ObserverPanel
            agentId={selectedAgent}
            agentLabel={agent.label}
            agentIcon={agent.icon}
            isActive={agent.status === 'active'}
            onClose={closePanel}
          />
        )}
      </main>
    </div>
  )
}

export default App