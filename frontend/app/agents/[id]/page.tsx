import { client } from '@/lib/client';
import Link from 'next/link';

const AGENT_DETAIL_QUERY = `
  query($id: BigInt!) {
    agent(id: $id) {
      id
      address
      uri
      services {
        items {
          id
          metadataURI
          active
        }
      }
      validations {
        items {
          taskId
          isValid
          validator
          disputeId
        }
      }
    }
  }
`;

export default async function AgentDetail({ params }: { params: { id: string } }) {
    const { data } = await client.query(AGENT_DETAIL_QUERY, { id: params.id }).toPromise();
    const agent = data?.agent;

    if (!agent) {
        return <div className="p-8 text-center">Agent not found</div>;
    }

    const services = agent.services?.items || [];
    const validations = agent.validations?.items || [];

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← Back to Explorer</Link>

                <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Agent {agent.id}</h1>
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                            Active
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Address</h3>
                            <p className="font-mono bg-gray-100 p-3 rounded text-gray-700 break-all">{agent.address}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Metadata URI</h3>
                            <p className="text-gray-700 truncate"><a href={agent.uri} className="text-blue-600 hover:underline" target="_blank">{agent.uri}</a></p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Services Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Services ({services.length})</h2>
                        <div className="space-y-3">
                            {services.map((service: any) => (
                                <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{service.id}</h4>
                                            <p className="text-sm text-gray-500 truncate max-w-xs">{service.metadataURI}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {service.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Task History</h2>
                        <div className="space-y-3">
                            {validations.map((val: any) => (
                                <div key={val.taskId} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-mono text-sm text-gray-500">Task #{val.taskId}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${val.isValid ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                            {val.isValid ? 'Valid' : 'Invalid'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <p>Validator: {val.validator.slice(0, 10)}...</p>
                                        {val.disputeId && (
                                            <p className="text-orange-600 font-semibold mt-1">⚠️ Disputed (ID: {val.disputeId})</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {validations.length === 0 && (
                                <p className="text-gray-400 text-center py-4">No tasks performed yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
