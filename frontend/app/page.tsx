import { client } from '@/lib/client';
import Link from 'next/link';

const AGENTS_QUERY = `
  query {
    agents {
      id
      address
      uri
      services {
        id
      }
    }
  }
`;

export default async function Home() {
  const { data } = await client.query(AGENTS_QUERY, {}).toPromise();

  // Mock reputation for now (random 80-100)
  const getReputation = () => Math.floor(Math.random() * (100 - 80 + 1) + 80);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ERC-8004 Agent Explorer</h1>
          <p className="text-lg text-gray-600">Discover and verify autonomous AI agents on Ethereum</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.agents.map((agent: any) => (
            <Link href={`/agents/${agent.id}`} key={agent.id} className="block group">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    ID: {agent.id}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-bold text-gray-700">{getReputation()}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 truncate">
                  Agent {agent.id}
                </h3>
                <p className="text-sm text-gray-500 mb-4 font-mono bg-gray-50 p-2 rounded truncate">
                  {agent.address}
                </p>

                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🛠️</span>
                  {agent.services.length} Services Active
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!data || data.agents.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No agents found. Run the demo script to register some!</p>
          </div>
        )}
      </div>
    </main>
  );
}
