

import React, { useState } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../AppContext';
import { PaymentGateway } from '../../types'; // Import PaymentGateway type
import { connectPaymentGateway, disconnectPaymentGateway } from '../../services/paymentService'; // Import the new service functions

const SettingsView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [loadingGatewayId, setLoadingGatewayId] = useState<PaymentGateway['id'] | null>(null);
  const [connectionErrors, setConnectionErrors] = useState<Record<PaymentGateway['id'], string | null>>({
    stripe: null,
    paypal: null,
  });

  const handleCredentialChange = (id: PaymentGateway['id'], field: 'clientId' | 'clientSecret', value: string) => {
    const gateway = state.gateways.find(g => g.id === id);
    if (!gateway) return;

    dispatch({
      type: 'UPDATE_GATEWAY_CREDENTIALS',
      payload: {
        id,
        clientId: field === 'clientId' ? value : gateway.clientId,
        clientSecret: field === 'clientSecret' ? value : gateway.clientSecret,
      }
    });
    // Clear error for this gateway on input change
    setConnectionErrors(prev => ({ ...prev, [id]: null }));
  };

  const handleConnect = async (gateway: PaymentGateway) => {
    setLoadingGatewayId(gateway.id);
    setConnectionErrors(prev => ({ ...prev, [gateway.id]: null }));

    try {
      const response = await connectPaymentGateway(gateway.id, {
        clientId: gateway.clientId,
        clientSecret: gateway.clientSecret,
      });

      if (response.success) {
        dispatch({ type: 'SET_GATEWAY_CONNECTION_STATUS', payload: { id: gateway.id, isConnected: true } });
        dispatch({
          type: 'ADD_ACTIVITY',
          payload: { type: 'SYSTEM', description: `${gateway.name} was successfully connected.` }
        });
        console.log(response.message);
      } else {
        const errorMessage = response.error || `Failed to connect ${gateway.name}. Please try again.`;
        setConnectionErrors(prev => ({ ...prev, [gateway.id]: errorMessage }));
        dispatch({
          type: 'ADD_ACTIVITY',
          payload: { type: 'SYSTEM', description: `Failed to connect ${gateway.name}: ${errorMessage}` }
        });
      }

    } catch (error: any) {
      const errorMessage = error.message || `An unexpected error occurred while connecting ${gateway.name}.`;
      setConnectionErrors(prev => ({ ...prev, [gateway.id]: errorMessage }));
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: { type: 'SYSTEM', description: `Error connecting ${gateway.name}: ${errorMessage}` }
      });
      console.error(`Error connecting ${gateway.name}:`, error);
    } finally {
      setLoadingGatewayId(null);
    }
  };

  const handleDisconnect = async (gateway: PaymentGateway) => {
    setLoadingGatewayId(gateway.id);
    setConnectionErrors(prev => ({ ...prev, [gateway.id]: null }));

    try {
      const response = await disconnectPaymentGateway(gateway.id);

      if (response.success) {
        dispatch({ type: 'SET_GATEWAY_CONNECTION_STATUS', payload: { id: gateway.id, isConnected: false } });
        dispatch({
          type: 'UPDATE_GATEWAY_CREDENTIALS',
          payload: { id: gateway.id, clientId: '', clientSecret: '' }
        });
        dispatch({
          type: 'ADD_ACTIVITY',
          payload: { type: 'SYSTEM', description: `${gateway.name} was disconnected.` }
        });
        console.log(response.message);
      } else {
        const errorMessage = response.error || `Failed to disconnect ${gateway.name}. Please try again.`;
        setConnectionErrors(prev => ({ ...prev, [gateway.id]: errorMessage }));
        dispatch({
          type: 'ADD_ACTIVITY',
          payload: { type: 'SYSTEM', description: `Error disconnecting ${gateway.name}: ${errorMessage}` }
        });
      }

    } catch (error: any) {
      const errorMessage = error.message || `An unexpected error occurred while disconnecting ${gateway.name}.`;
      setConnectionErrors(prev => ({ ...prev, [gateway.id]: errorMessage }));
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: { type: 'SYSTEM', description: `Error disconnecting ${gateway.name}: ${errorMessage}` }
      });
      console.error(`Error disconnecting ${gateway.name}:`, error);
    } finally {
      setLoadingGatewayId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

      <Card>
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Payment Integrations</h2>
        <div className="space-y-4 pt-4">
          {state.gateways.map(gateway => (
            <div key={gateway.id} className="flex flex-col md:flex-row md:items-center justify-between bg-slate-700/50 p-4 rounded-lg">
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-lg font-medium text-white">{gateway.name}</h3>
                <p className="text-sm text-slate-400 mb-2">
                  Status: 
                  <span className={`font-semibold ${
                    gateway.isConnected ? 'text-green-400' : 
                    loadingGatewayId === gateway.id ? 'text-sky-400' : 'text-slate-500'
                  }`}>
                    {gateway.isConnected ? ' Connected' : (loadingGatewayId === gateway.id ? ' Connecting...' : ' Not Connected')}
                  </span>
                </p>
                
                <div className="space-y-2">
                    <div>
                        <label htmlFor={`${gateway.id}-clientId`} className="block text-xs font-medium text-slate-400">Client ID</label>
                        <input
                            id={`${gateway.id}-clientId`}
                            type="text"
                            value={gateway.clientId}
                            onChange={(e) => handleCredentialChange(gateway.id, 'clientId', e.target.value)}
                            placeholder={`Enter ${gateway.name} Client ID`}
                            disabled={gateway.isConnected || loadingGatewayId === gateway.id}
                            className="mt-1 w-full p-2 bg-slate-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor={`${gateway.id}-clientSecret`} className="block text-xs font-medium text-slate-400">Client Secret</label>
                        <input
                            id={`${gateway.id}-clientSecret`}
                            type="password" // Use password type for secret
                            value={gateway.clientSecret}
                            onChange={(e) => handleCredentialChange(gateway.id, 'clientSecret', e.target.value)}
                            placeholder={`Enter ${gateway.name} Client Secret`}
                            disabled={gateway.isConnected || loadingGatewayId === gateway.id}
                            className="mt-1 w-full p-2 bg-slate-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    {connectionErrors[gateway.id] && (
                        <p className="text-red-400 text-sm mt-2">{connectionErrors[gateway.id]}</p>
                    )}
                </div>
              </div>

              <div className="flex-shrink-0 mt-4 md:mt-0">
                {gateway.isConnected ? (
                    <button
                        onClick={() => handleDisconnect(gateway)}
                        disabled={loadingGatewayId === gateway.id}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                            loadingGatewayId === gateway.id
                            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                            : 'bg-red-500/80 hover:bg-red-500 text-white'
                        }`}
                    >
                        {loadingGatewayId === gateway.id ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                ) : (
                    <button
                        onClick={() => handleConnect(gateway)}
                        disabled={loadingGatewayId === gateway.id}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                            loadingGatewayId === gateway.id
                            ? 'bg-sky-600 text-white cursor-not-allowed'
                            : 'bg-sky-500/80 hover:bg-sky-500 text-white'
                        }`}
                    >
                        {loadingGatewayId === gateway.id ? 'Connecting...' : 'Connect'}
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-6 border-t border-slate-700 pt-4">
            Note: This frontend is now making API calls to a hypothetical backend for payment integration.
            **You MUST implement a secure backend server** to handle actual communication with Stripe/PayPal,
            manage API keys, and process payments. Direct frontend integration with payment gateway APIs using secret keys is not secure.
            For more details, refer to the comments in `services/paymentService.ts`.
        </p>
      </Card>
    </div>
  );
};

export default SettingsView;